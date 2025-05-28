
import { PlanStatus, PlanType, PLAN_METADATA } from '@/types/plan';

export function usePlanCalculations() {
  const calculateRemainingDays = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const determineStatus = (planEndDate: string, planType: PlanType): PlanStatus => {
    const remainingDays = calculateRemainingDays(planEndDate);
    if (remainingDays <= 0) {
      return 'expired';
    }
    if (planType === 'trial_plan') {
      return 'trial';
    }
    return 'active';
  };

  const shouldShowUpgradePrompt = (planType: PlanType, remainingDays: number, status: PlanStatus): boolean => {
    return (
      planType === 'trial_plan' && remainingDays <= 3
    ) || status === 'expired';
  };

  const getTrialProgressPercentage = (remainingDays: number): number => {
    if (!PLAN_METADATA.trial_plan.trialDays) return 0;
    const totalTrialDays = PLAN_METADATA.trial_plan.trialDays;
    const actualRemainingDays = Math.min(remainingDays, totalTrialDays);
    const elapsed = totalTrialDays - actualRemainingDays;
    return Math.min(100, Math.max(0, (elapsed / totalTrialDays) * 100));
  };

  return {
    calculateRemainingDays,
    determineStatus,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
  };
}
