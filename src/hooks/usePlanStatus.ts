
import { usePlan } from '@/contexts/PlanContext';

// Hook de compatibilidade para manter a API existente
export function usePlanStatus() {
  const {
    userPlan,
    loading,
    activateTrial,
    upgradePlan,
    cancelPlan,
    isFeatureAllowed,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
    refreshPlanStatus
  } = usePlan();

  // Wrapper para getUsageLimit (funcionalidade simplificada)
  const getUsageLimit = (feature: string): number => {
    if (!userPlan) return 0;
    
    switch (feature) {
      case 'orders':
        return userPlan.planType === 'trial_plan' ? 50 : -1; // -1 = ilimitado
      case 'users':
        return userPlan.planType === 'trial_plan' ? 1 : 5;
      case 'storage':
        return userPlan.planType === 'trial_plan' ? 1 : 10; // GB
      default:
        return 0;
    }
  };

  return {
    userPlan,
    loading,
    activateTrial,
    upgradePlan,
    cancelPlan,
    isFeatureAllowed,
    getUsageLimit,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
    refreshPlanStatus
  };
}
