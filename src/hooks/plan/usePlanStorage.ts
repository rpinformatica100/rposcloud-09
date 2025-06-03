
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from './usePlanCalculations';
import { StateManager } from '@/utils/stateManager';

export function usePlanStorage() {
  const { calculateRemainingDays, determineStatus } = usePlanCalculations();
  const stateManager = StateManager.getInstance();

  const loadUserPlan = (user: any): UserPlan | null => {
    if (!user) return null;

    const planKey = `plan_${user.id}`;
    const savedPlanJson = localStorage.getItem(planKey);
    
    console.log(`Carregando plano para usuário ${user.email}:`, savedPlanJson);
    
    if (savedPlanJson) {
      try {
        const parsedPlan = JSON.parse(savedPlanJson) as UserPlan;
        
        const remainingDays = calculateRemainingDays(parsedPlan.endDate);
        const status = determineStatus(parsedPlan.endDate, parsedPlan.planType);
        
        const updatedPlan: UserPlan = {
          ...parsedPlan,
          remainingDays,
          status,
          isPaid: PLAN_METADATA[parsedPlan.planType as PlanType]?.isPaid || false,
          features: PLAN_CONFIGS[parsedPlan.planType as PlanType] || PLAN_CONFIGS.trial_plan,
        };
        
        console.log(`Plano carregado e atualizado:`, updatedPlan);
        
        // Salvar estado atualizado
        stateManager.saveUserState(user.id, {
          plan_loaded: new Date().toISOString(),
          plan_data: updatedPlan
        });
        
        return updatedPlan;
      } catch (error) {
        console.error("Erro ao analisar plano salvo do localStorage:", error);
        localStorage.removeItem(planKey);
        return null;
      }
    }

    return null;
  };

  const createDefaultPlan = (user: any): UserPlan | null => {
    if (!user) return null;

    const planKey = `plan_${user.id}`;
    const userPlanType = user.plano as PlanType;
    const userPlanEndDate = user.data_vencimento_plano;
    const userPlanStartDate = user.data_cadastro;

    console.log(`Criando plano padrão para usuário ${user.email}:`, {
      planType: userPlanType,
      endDate: userPlanEndDate,
      startDate: userPlanStartDate
    });

    // Mapeamento corrigido para usar apenas os tipos válidos de PlanType
    const planTypeMapping: Record<string, PlanType> = {
      'trial_plan': 'trial_plan',
      'basic': 'monthly',        // Mapear basic para monthly
      'professional': 'yearly',   // Mapear professional para yearly
      'enterprise': 'yearly',     // Mapear enterprise para yearly
      'monthly': 'monthly',
      'quarterly': 'quarterly',
      'yearly': 'yearly',
      'free_trial': 'trial_plan'
    };

    const mappedPlanType = planTypeMapping[userPlanType] || 'trial_plan';

    if (userPlanType && PLAN_CONFIGS[mappedPlanType]) {
      const remainingDays = calculateRemainingDays(userPlanEndDate);
      const status = determineStatus(userPlanEndDate, mappedPlanType);

      const defaultPlan: UserPlan = {
        id: planKey,
        userId: user.id,
        planType: mappedPlanType,
        status: status,
        startDate: userPlanStartDate || new Date().toISOString(),
        endDate: userPlanEndDate,
        trialStartDate: mappedPlanType === 'trial_plan' ? (userPlanStartDate || new Date().toISOString()) : undefined,
        trialEndDate: mappedPlanType === 'trial_plan' ? userPlanEndDate : undefined,
        isTrialUsed: mappedPlanType === 'trial_plan',
        remainingDays: remainingDays,
        features: PLAN_CONFIGS[mappedPlanType],
        isPaid: PLAN_METADATA[mappedPlanType]?.isPaid || false,
        billing: {
          autoRenewal: false,
        },
      };

      localStorage.setItem(planKey, JSON.stringify(defaultPlan));
      console.log('Plano padrão criado e salvo para usuário:', user.id, defaultPlan);
      
      // Salvar estado
      stateManager.saveUserState(user.id, {
        plan_created: new Date().toISOString(),
        plan_data: defaultPlan
      });
      
      return defaultPlan;
    }

    console.warn(`Usuário ${user.id} tem tipo de plano inválido ('${user.plano}') no objeto do usuário. Criando plano trial padrão.`);
    
    // Criar plano trial padrão como fallback
    const fallbackEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const fallbackPlan: UserPlan = {
      id: planKey,
      userId: user.id,
      planType: 'trial_plan',
      status: 'trial',
      startDate: new Date().toISOString(),
      endDate: fallbackEndDate,
      trialStartDate: new Date().toISOString(),
      trialEndDate: fallbackEndDate,
      isTrialUsed: false,
      remainingDays: 7,
      features: PLAN_CONFIGS.trial_plan,
      isPaid: false,
      billing: {
        autoRenewal: false,
      },
    };

    localStorage.setItem(planKey, JSON.stringify(fallbackPlan));
    console.log('Plano trial fallback criado para usuário:', user.id, fallbackPlan);
    
    return fallbackPlan;
  };

  const savePlan = (plan: UserPlan): void => {
    try {
      const planKey = `plan_${plan.userId}`;
      localStorage.setItem(planKey, JSON.stringify(plan));
      console.log('Plano salvo com sucesso:', plan);
      
      // Salvar estado
      stateManager.saveUserState(plan.userId, {
        plan_saved: new Date().toISOString(),
        plan_data: plan
      });
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
    }
  };

  return {
    loadUserPlan,
    createDefaultPlan,
    savePlan,
  };
}
