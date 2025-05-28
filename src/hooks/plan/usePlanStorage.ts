
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

    if (userPlanType && PLAN_CONFIGS[userPlanType]) {
      const remainingDays = calculateRemainingDays(userPlanEndDate);
      const status = determineStatus(userPlanEndDate, userPlanType);

      const defaultPlan: UserPlan = {
        id: planKey,
        userId: user.id,
        planType: userPlanType,
        status: status,
        startDate: userPlanStartDate || new Date().toISOString(),
        endDate: userPlanEndDate,
        trialStartDate: userPlanType === 'trial_plan' ? (userPlanStartDate || new Date().toISOString()) : undefined,
        trialEndDate: userPlanType === 'trial_plan' ? userPlanEndDate : undefined,
        isTrialUsed: userPlanType === 'trial_plan',
        remainingDays: remainingDays,
        features: PLAN_CONFIGS[userPlanType],
        isPaid: PLAN_METADATA[userPlanType]?.isPaid || false,
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

    console.warn(`Usuário ${user.id} tem tipo de plano inválido ('${user.plano}') no objeto do usuário. Não é possível criar plano padrão.`);
    return null;
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
