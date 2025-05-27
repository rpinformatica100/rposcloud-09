
import { useState, useEffect } from 'react';
import { UserPlan, PlanStatus, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { useAuth } from '@/contexts/AuthContext';

export function usePlanStatus() {
  const { user, isAuthenticated } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    // Buscar plano do usuário
    const savedPlan = localStorage.getItem(`plan_${user.id}`);
    
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      const remainingDays = calculateRemainingDays(parsedPlan.endDate);
      const status = determineStatus(parsedPlan, remainingDays);
      
      const updatedPlan = {
        ...parsedPlan,
        remainingDays,
        status,
        isPaid: PLAN_METADATA[parsedPlan.planType as PlanType]?.isPaid || false,
      };
      
      setUserPlan(updatedPlan);
    }
    
    setLoading(false);
  }, [user, isAuthenticated]);

  const calculateRemainingDays = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const determineStatus = (plan: any, remainingDays: number): PlanStatus => {
    if (remainingDays <= 0) {
      return 'expired';
    }
    if (plan.planType === 'trial_plan') {
      return 'trial';
    }
    return 'active';
  };

  const activateTrial = () => {
    if (!user) return;

    // Verificar se já usou o trial
    const existingPlan = localStorage.getItem(`plan_${user.id}`);
    if (existingPlan) {
      const parsed = JSON.parse(existingPlan);
      if (parsed.isTrialUsed) {
        console.log('Trial já foi utilizado');
        return;
      }
    }

    const trialStartDate = new Date().toISOString();
    const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const trialPlan: UserPlan = {
      id: `plan_${user.id}`,
      userId: user.id,
      planType: 'trial_plan',
      status: 'trial',
      startDate: trialStartDate,
      endDate: trialEndDate,
      trialStartDate,
      trialEndDate,
      isTrialUsed: true,
      remainingDays: 7,
      features: PLAN_CONFIGS.trial_plan,
      isPaid: false,
      billing: {
        autoRenewal: false,
      },
    };

    setUserPlan(trialPlan);
    localStorage.setItem(`plan_${user.id}`, JSON.stringify(trialPlan));
  };

  const upgradePlan = (newPlanType: PlanType) => {
    if (!userPlan || !PLAN_METADATA[newPlanType]?.isPaid) return;

    const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const updatedPlan: UserPlan = {
      ...userPlan,
      planType: newPlanType,
      status: 'active',
      endDate: newEndDate,
      remainingDays: 30,
      features: PLAN_CONFIGS[newPlanType],
      isPaid: true,
      billing: {
        ...userPlan.billing,
        autoRenewal: true,
        nextBillingDate: newEndDate,
        lastPaymentDate: new Date().toISOString(),
      },
    };

    setUserPlan(updatedPlan);
    localStorage.setItem(`plan_${userPlan.userId}`, JSON.stringify(updatedPlan));
  };

  const cancelPlan = () => {
    if (!userPlan) return;

    const updatedPlan: UserPlan = {
      ...userPlan,
      status: 'cancelled',
      billing: {
        ...userPlan.billing,
        autoRenewal: false,
      },
    };

    setUserPlan(updatedPlan);
    localStorage.setItem(`plan_${userPlan.userId}`, JSON.stringify(updatedPlan));
  };

  const isFeatureAllowed = (feature: keyof typeof PLAN_CONFIGS.trial_plan): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    return userPlan.features[feature] as boolean;
  };

  const getUsageLimit = (feature: keyof typeof PLAN_CONFIGS.trial_plan): number => {
    if (!userPlan) return 0;
    return userPlan.features[feature] as number;
  };

  const shouldShowUpgradePrompt = (): boolean => {
    if (!userPlan) return false;
    return (
      userPlan.planType === 'trial_plan' && userPlan.remainingDays <= 3
    ) || userPlan.status === 'expired';
  };

  const getTrialProgressPercentage = (): number => {
    if (!userPlan || userPlan.planType !== 'trial_plan') return 0;
    const totalDays = 7;
    const elapsed = totalDays - userPlan.remainingDays;
    return Math.min(100, (elapsed / totalDays) * 100);
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
  };
}
