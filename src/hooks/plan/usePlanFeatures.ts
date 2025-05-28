
import { UserPlan, PlanFeatures } from '@/types/plan';

export function usePlanFeatures(userPlan: UserPlan | null) {
  const isFeatureAllowed = (feature: keyof PlanFeatures): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    return !!userPlan.features[feature]; 
  };

  const getUsageLimit = (feature: keyof PlanFeatures): number => {
    if (!userPlan || typeof userPlan.features[feature] !== 'number') return 0;
    return userPlan.features[feature] as number;
  };

  return {
    isFeatureAllowed,
    getUsageLimit,
  };
}
