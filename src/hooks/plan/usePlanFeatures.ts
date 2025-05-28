
import { UserPlan } from '@/types/plan';

export function usePlanFeatures(userPlan: UserPlan | null) {
  // Funcionalidades simplificadas - apenas verifica se tem acesso completo
  const hasFullAccess = (): boolean => {
    if (!userPlan) return false;
    
    // Se o plano expirou ou está bloqueado, não tem acesso
    if (userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    
    // Trial e planos pagos têm acesso completo às funcionalidades
    return userPlan.features.hasFullAccess;
  };

  const isTrialExpired = (): boolean => {
    if (!userPlan || userPlan.planType !== 'trial_plan') return false;
    return userPlan.status === 'expired';
  };

  const canUseFeature = (featureName?: string): boolean => {
    return hasFullAccess();
  };

  const isFeatureAllowed = (feature: string): boolean => {
    return hasFullAccess();
  };

  const getUsageLimit = (feature: string): number => {
    if (!userPlan) return 0;
    
    // Retornar limites baseados no tipo de plano
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
    hasFullAccess,
    isTrialExpired,
    canUseFeature,
    isFeatureAllowed,
    getUsageLimit,
  };
}
