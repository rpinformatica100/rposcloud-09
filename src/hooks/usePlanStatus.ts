
import { useState, useEffect } from 'react';
import { UserPlan, PlanType } from '@/types/plan';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanCalculations } from './plan/usePlanCalculations';
import { usePlanOperations } from './plan/usePlanOperations';
import { usePlanFeatures } from './plan/usePlanFeatures';
import { usePlanStorage } from './plan/usePlanStorage';

export function usePlanStatus() {
  const { user, isAuthenticated } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const { shouldShowUpgradePrompt, getTrialProgressPercentage } = usePlanCalculations();
  const { activateTrial, upgradePlan, cancelPlan } = usePlanOperations();
  const { isFeatureAllowed, getUsageLimit } = usePlanFeatures(userPlan);
  const { loadUserPlan, createDefaultPlan } = usePlanStorage();

  useEffect(() => {
    setLoading(true);
    if (!isAuthenticated || !user) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    let plan = loadUserPlan(user);
    
    if (!plan) {
      plan = createDefaultPlan(user);
    }
    
    setUserPlan(plan);
    setLoading(false);
  }, [user, isAuthenticated]);

  const handleActivateTrial = () => {
    activateTrial(user, setUserPlan);
  };

  const handleUpgradePlan = (newPlanType: PlanType) => {
    upgradePlan(user, userPlan, setUserPlan, newPlanType);
  };

  const handleCancelPlan = () => {
    cancelPlan(user, userPlan, setUserPlan);
  };

  const shouldShowUpgradePromptResult = (): boolean => {
    if (!userPlan) return false;
    return shouldShowUpgradePrompt(userPlan.planType, userPlan.remainingDays, userPlan.status);
  };

  const getTrialProgressPercentageResult = (): number => {
    if (!userPlan || userPlan.planType !== 'trial_plan') return 0;
    return getTrialProgressPercentage(userPlan.remainingDays);
  };

  return {
    userPlan,
    loading,
    activateTrial: handleActivateTrial,
    upgradePlan: handleUpgradePlan,
    cancelPlan: handleCancelPlan,
    isFeatureAllowed,
    getUsageLimit,
    shouldShowUpgradePrompt: shouldShowUpgradePromptResult,
    getTrialProgressPercentage: getTrialProgressPercentageResult,
  };
}
