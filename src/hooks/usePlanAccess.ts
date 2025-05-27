
import { usePlanStatus } from './usePlanStatus';
import { PlanType, PlanFeatures } from '@/types/plan';

export function usePlanAccess() {
  const { userPlan } = usePlanStatus();

  const hasAccessToFeature = (feature: keyof PlanFeatures): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    return userPlan.features[feature] as boolean;
  };

  const canAccessPaidFeatures = (): boolean => {
    if (!userPlan) return false;
    return userPlan.isPaid && (userPlan.status === 'active' || userPlan.status === 'trial');
  };

  const isTrialUser = (): boolean => {
    return userPlan?.planType === 'trial_plan' && userPlan?.status === 'trial';
  };

  const isPaidUser = (): boolean => {
    return userPlan?.isPaid === true && userPlan?.status === 'active';
  };

  const needsUpgrade = (): boolean => {
    if (!userPlan) return true;
    return userPlan.planType === 'trial_plan' || userPlan.status === 'expired';
  };

  const getUsageLimit = (feature: keyof PlanFeatures): number => {
    if (!userPlan) return 0;
    return userPlan.features[feature] as number;
  };

  const getRemainingTrialDays = (): number => {
    if (!userPlan || userPlan.planType !== 'trial_plan') return 0;
    return userPlan.remainingDays;
  };

  return {
    userPlan,
    hasAccessToFeature,
    canAccessPaidFeatures,
    isTrialUser,
    isPaidUser,
    needsUpgrade,
    getUsageLimit,
    getRemainingTrialDays,
  };
}
