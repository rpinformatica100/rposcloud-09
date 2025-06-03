
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from '@/hooks/plan/usePlanCalculations';
import { usePlanStorage } from '@/hooks/plan/usePlanStorage';
import { StateManager } from '@/utils/stateManager';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface PlanContextType {
  // Estado atual
  userPlan: UserPlan | null;
  loading: boolean;
  
  // Ações de plano
  activateTrial: () => Promise<boolean>;
  upgradePlan: (planType: PlanType) => Promise<boolean>;
  cancelPlan: () => Promise<boolean>;
  
  // Checkout
  startCheckout: (planType: PlanType) => Promise<string | null>;
  handleCheckoutSuccess: (planType: PlanType) => Promise<void>;
  
  // Verificações
  isFeatureAllowed: (feature: string) => boolean;
  shouldShowUpgradePrompt: () => boolean;
  getTrialProgressPercentage: () => number;
  
  // Recovery e sync
  refreshPlanStatus: () => Promise<void>;
  recoverPendingCheckout: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { shouldShowUpgradePrompt, getTrialProgressPercentage, calculateRemainingDays } = usePlanCalculations();
  const { loadUserPlan, createDefaultPlan, savePlan } = usePlanStorage();
  const stateManager = StateManager.getInstance();

  // Carregar plano do usuário
  const loadUserPlanData = async () => {
    if (!isAuthenticated || !user) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    try {
      let plan = loadUserPlan(user);
      
      if (!plan) {
        plan = createDefaultPlan(user);
      }
      
      // Atualizar dias restantes
      if (plan) {
        const remainingDays = calculateRemainingDays(plan.endDate);
        plan = { ...plan, remainingDays };
      }
      
      setUserPlan(plan);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      setUserPlan(null);
    } finally {
      setLoading(false);
    }
  };

  // Ativar trial
  const activateTrial = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log(`Ativando trial para usuário ${user.email}`);

      const trialStartDate = new Date().toISOString();
      const trialEndDate = new Date(Date.now() + (PLAN_METADATA.trial_plan.trialDays || 7) * 24 * 60 * 60 * 1000).toISOString();
      
      const trialPlan: UserPlan = {
        id: `plan_${user.id}`,
        userId: user.id,
        planType: 'trial_plan',
        status: 'trial',
        startDate: trialStartDate,
        endDate: trialEndDate,
        trialStartDate,
        trialEndDate,
        isTrialUsed: true,
        remainingDays: PLAN_METADATA.trial_plan.trialDays || 7,
        features: PLAN_CONFIGS.trial_plan,
        isPaid: false,
        billing: { autoRenewal: false },
      };

      setUserPlan(trialPlan);
      savePlan(trialPlan);
      
      stateManager.saveUserState(user.id, {
        trial_activated: new Date().toISOString(),
        plan_data: trialPlan
      });
      
      console.log('Trial ativado com sucesso:', trialPlan);
      return true;
    } catch (error) {
      console.error('Erro ao ativar trial:', error);
      return false;
    }
  };

  // Fazer upgrade de plano
  const upgradePlan = async (newPlanType: PlanType): Promise<boolean> => {
    if (!user || !userPlan || !PLAN_METADATA[newPlanType]?.isPaid) {
      return false;
    }
    
    try {
      console.log(`Fazendo upgrade para ${newPlanType}`);
      
      const newStartDate = new Date().toISOString();
      const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const remainingDays = calculateRemainingDays(newEndDate);
      
      const updatedPlan: UserPlan = {
        ...userPlan,
        planType: newPlanType,
        status: 'active',
        startDate: newStartDate,
        endDate: newEndDate,
        remainingDays: remainingDays,
        features: PLAN_CONFIGS[newPlanType],
        isPaid: true,
        trialStartDate: undefined, 
        trialEndDate: undefined,
        isTrialUsed: userPlan.planType === 'trial_plan' ? true : userPlan.isTrialUsed,
        billing: {
          ...(userPlan.billing || {}),
          autoRenewal: true,
          nextBillingDate: newEndDate,
          lastPaymentDate: new Date().toISOString(),
        },
      };

      setUserPlan(updatedPlan);
      savePlan(updatedPlan);
      
      stateManager.saveUserState(user.id, {
        plan_upgraded: new Date().toISOString(),
        old_plan: userPlan.planType,
        new_plan: newPlanType,
        plan_data: updatedPlan
      });
      
      console.log('Upgrade realizado com sucesso:', updatedPlan);
      return true;
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      return false;
    }
  };

  // Cancelar plano
  const cancelPlan = async (): Promise<boolean> => {
    if (!user || !userPlan) return false;

    try {
      console.log('Cancelando plano');

      const updatedPlan: UserPlan = {
        ...userPlan,
        status: 'cancelled',
        billing: {
          ...(userPlan.billing || {}),
          autoRenewal: false,
        },
      };

      setUserPlan(updatedPlan);
      savePlan(updatedPlan);
      
      stateManager.saveUserState(user.id, {
        plan_cancelled: new Date().toISOString(),
        plan_data: updatedPlan
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao cancelar plano:', error);
      return false;
    }
  };

  // Iniciar checkout
  const startCheckout = async (planType: PlanType): Promise<string | null> => {
    if (!user || !PLAN_METADATA[planType]?.isPaid) return null;

    try {
      // Salvar intenção de checkout
      localStorage.setItem('checkout_intent', JSON.stringify({
        planType,
        userId: user.id,
        userEmail: user.email,
        timestamp: Date.now()
      }));

      const planData = PLAN_METADATA[planType];
      
      // Verificar se o plano tem price (type guard)
      if (!('price' in planData)) {
        console.error('Plano não tem price definido:', planType);
        return null;
      }

      const params = new URLSearchParams({
        planoId: planType,
        metodo: 'stripe',
        preco: planData.price.toString(),
        plano: planData.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.email
      });
      
      return `/checkout?${params.toString()}`;
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      return null;
    }
  };

  // Processar sucesso do checkout
  const handleCheckoutSuccess = async (planType: PlanType): Promise<void> => {
    try {
      console.log('Processando sucesso do checkout para:', planType);
      
      const success = await upgradePlan(planType);
      if (success) {
        localStorage.removeItem('checkout_intent');
        toast.success(`Plano ${PLAN_METADATA[planType].name} ativado com sucesso!`);
      } else {
        throw new Error('Falha ao ativar plano após checkout');
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao ativar plano. Entre em contato com o suporte.');
    }
  };

  // Verificar se funcionalidade é permitida
  const isFeatureAllowed = (feature: string): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    return userPlan.features.hasFullAccess;
  };

  // Verificar se deve mostrar prompt de upgrade
  const shouldShowUpgradePromptResult = (): boolean => {
    if (!userPlan) return false;
    return shouldShowUpgradePrompt(userPlan.planType, userPlan.remainingDays, userPlan.status);
  };

  // Obter porcentagem de progresso do trial
  const getTrialProgressPercentageResult = (): number => {
    if (!userPlan || userPlan.planType !== 'trial_plan') return 0;
    return getTrialProgressPercentage(userPlan.remainingDays);
  };

  // Refresh do status do plano
  const refreshPlanStatus = async (): Promise<void> => {
    await loadUserPlanData();
  };

  // Recuperar checkout pendente
  const recoverPendingCheckout = (): void => {
    const intent = localStorage.getItem('checkout_intent');
    if (intent) {
      try {
        const parsed = JSON.parse(intent);
        if (parsed.userId === user?.id && Date.now() - parsed.timestamp < 3600000) { // 1 hora
          console.log('Recuperando checkout pendente:', parsed);
          // Checkout foi interrompido, mostrar opção de continuar
          toast.info('Checkout interrompido detectado. Deseja continuar?', {
            action: {
              label: 'Continuar',
              onClick: async () => {
                const url = await startCheckout(parsed.planType);
                if (url) window.location.href = url;
              }
            }
          });
        }
      } catch (error) {
        console.error('Erro ao recuperar checkout:', error);
        localStorage.removeItem('checkout_intent');
      }
    }
  };

  // Efeitos
  useEffect(() => {
    loadUserPlanData();
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      recoverPendingCheckout();
    }
  }, [isAuthenticated, user]);

  const value: PlanContextType = {
    userPlan,
    loading,
    activateTrial,
    upgradePlan,
    cancelPlan,
    startCheckout,
    handleCheckoutSuccess,
    isFeatureAllowed,
    shouldShowUpgradePrompt: shouldShowUpgradePromptResult,
    getTrialProgressPercentage: getTrialProgressPercentageResult,
    refreshPlanStatus,
    recoverPendingCheckout,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan(): PlanContextType {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
