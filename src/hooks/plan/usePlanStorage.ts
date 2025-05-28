
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from './usePlanCalculations';

export function usePlanStorage() {
  const { calculateRemainingDays, determineStatus } = usePlanCalculations();

  const loadUserPlan = (user: any): UserPlan | null => {
    if (!user) return null;

    const planKey = `plan_${user.id}`;
    const savedPlanJson = localStorage.getItem(planKey);
    
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
        
        return updatedPlan;
      } catch (error) {
        console.error("Error parsing saved plan from localStorage:", error);
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
      console.log('Default plan created and saved for user:', user.id, defaultPlan);
      return defaultPlan;
    }

    console.warn(`User ${user.id} has no valid plan type ('${user.plano}') in their user object. Cannot create default plan.`);
    return null;
  };

  return {
    loadUserPlan,
    createDefaultPlan,
  };
}
