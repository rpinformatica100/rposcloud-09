
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from '@/hooks/plan/usePlanCalculations';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { toast } from 'sonner';

interface PlanContextType {
  userPlan: UserPlan | null;
  loading: boolean;
  activateTrial: () => Promise<boolean>;
  upgradePlan: (planType: PlanType) => Promise<boolean>;
  cancelPlan: () => Promise<boolean>;
  startCheckout: (planType: PlanType) => Promise<string | null>;
  handleCheckoutSuccess: (planType: PlanType) => Promise<void>;
  isFeatureAllowed: (feature: string) => boolean;
  shouldShowUpgradePrompt: () => boolean;
  getTrialProgressPercentage: () => number;
  refreshPlanStatus: () => Promise<void>;
  recoverPendingCheckout: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const { user, isAuthenticated, profile, subscription } = useSupabaseAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { shouldShowUpgradePrompt, getTrialProgressPercentage, calculateRemainingDays } = usePlanCalculations();

  // Carregar plano do usuário baseado no Supabase
  const loadUserPlanData = async () => {
    if (!isAuthenticated || !user || !profile) {
      setUserPlan(null);
      return;
    }

    try {
      const planType = (profile.plano_id || 'trial_plan') as PlanType;
      const status = profile.status_plano || 'trial';
      
      let endDate = profile.data_vencimento_plano || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const remainingDays = calculateRemainingDays(endDate);
      
      const plan: UserPlan = {
        id: `plan_${user.id}`,
        userId: user.id,
        planType,
        status: status as any,
        startDate: new Date().toISOString(),
        endDate,
        trialStartDate: status === 'trial' ? new Date().toISOString() : undefined,
        trialEndDate: status === 'trial' ? endDate : undefined,
        isTrialUsed: status !== 'trial',
        remainingDays,
        features: PLAN_CONFIGS[planType] || PLAN_CONFIGS.trial_plan,
        isPaid: subscription?.status === 'active',
        billing: {
          autoRenewal: subscription?.status === 'active',
          nextBillingDate: subscription?.current_period_end,
          lastPaymentDate: new Date().toISOString(),
        },
      };
      
      setUserPlan(plan);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      setUserPlan(null);
    }
  };

  // Ativar trial
  const activateTrial = async (): Promise<boolean> => {
    if (!user || !profile) return false;

    try {
      console.log(`Ativando trial para usuário ${user.email}`);
      await loadUserPlanData();
      console.log('Trial ativado com sucesso');
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
      await loadUserPlanData();
      console.log('Upgrade realizado com sucesso');
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
      await loadUserPlanData();
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
      localStorage.setItem('checkout_intent', JSON.stringify({
        planType,
        userId: user.id,
        userEmail: user.email,
        timestamp: Date.now()
      }));

      const planData = PLAN_METADATA[planType];
      
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
        if (parsed.userId === user?.id && Date.now() - parsed.timestamp < 3600000) {
          console.log('Recuperando checkout pendente:', parsed);
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
    if (isAuthenticated && user && profile) {
      loadUserPlanData();
    }
  }, [isAuthenticated, user, profile]);

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
