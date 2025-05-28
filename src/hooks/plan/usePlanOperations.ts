
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from './usePlanCalculations';

export function usePlanOperations() {
  const { calculateRemainingDays } = usePlanCalculations();

  const activateTrial = (user: any, setUserPlan: (plan: UserPlan) => void) => {
    if (!user) return;

    const planKey = `plan_${user.id}`;
    const existingPlanJson = localStorage.getItem(planKey);
    if (existingPlanJson) {
      try {
        const parsed = JSON.parse(existingPlanJson) as UserPlan;
        if (parsed.isTrialUsed && parsed.planType === 'trial_plan') {
          console.log('Trial já foi utilizado e ainda é o plano atual.');
          setUserPlan(parsed);
          return;
        }
      } catch (error) {
        console.error("Error parsing existing plan in activateTrial:", error);
        localStorage.removeItem(planKey);
      }
    }

    const trialStartDate = new Date().toISOString();
    const trialEndDate = new Date(Date.now() + (PLAN_METADATA.trial_plan.trialDays || 7) * 24 * 60 * 60 * 1000).toISOString();
    
    const trialPlan: UserPlan = {
      id: planKey,
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
      billing: {
        autoRenewal: false,
      },
    };

    setUserPlan(trialPlan);
    localStorage.setItem(planKey, JSON.stringify(trialPlan));
    console.log('Trial plan activated/re-activated and saved for user:', user.id, trialPlan);
  };

  const upgradePlan = (user: any, userPlan: UserPlan | null, setUserPlan: (plan: UserPlan) => void, newPlanType: PlanType) => {
    if (!user || !userPlan || !PLAN_METADATA[newPlanType]?.isPaid) {
      console.error("Upgrade conditions not met", { user, userPlan, newPlanType });
      return;
    }
    
    const planKey = `plan_${user.id}`;
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
    localStorage.setItem(planKey, JSON.stringify(updatedPlan));
    console.log(`User ${user.id} upgraded to ${newPlanType}`, updatedPlan);
  };

  const cancelPlan = (user: any, userPlan: UserPlan | null, setUserPlan: (plan: UserPlan) => void) => {
    if (!user || !userPlan) return;

    const planKey = `plan_${user.id}`;
    const updatedPlan: UserPlan = {
      ...userPlan,
      status: 'cancelled',
      billing: {
        ...(userPlan.billing || {}),
        autoRenewal: false,
      },
    };

    setUserPlan(updatedPlan);
    localStorage.setItem(planKey, JSON.stringify(updatedPlan));
    console.log(`Plan cancelled for user ${user.id}`, updatedPlan);
  };

  return {
    activateTrial,
    upgradePlan,
    cancelPlan,
  };
}
