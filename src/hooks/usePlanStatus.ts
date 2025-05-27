
import { useState, useEffect } from 'react';
import { UserPlan, PlanStatus, PlanType, PLAN_CONFIGS } from '@/types/plan';
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

    // Simular busca do plano do usuário
    // Em produção, isso viria do banco de dados
    const mockUserPlan = createMockUserPlan(user.id);
    setUserPlan(mockUserPlan);
    setLoading(false);
  }, [user, isAuthenticated]);

  const createMockUserPlan = (userId: string): UserPlan => {
    // Verificar se é um usuário existente com plano ativo
    const savedPlan = localStorage.getItem(`plan_${userId}`);
    
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      const remainingDays = calculateRemainingDays(parsedPlan.endDate);
      const status = determineStatus(parsedPlan, remainingDays);
      
      return {
        ...parsedPlan,
        remainingDays,
        status,
      };
    }

    // Novo usuário - criar trial de 7 dias
    const trialStartDate = new Date().toISOString();
    const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const newPlan: UserPlan = {
      id: `plan_${userId}`,
      userId,
      planType: 'free_trial',
      status: 'trial',
      startDate: trialStartDate,
      endDate: trialEndDate,
      trialStartDate,
      trialEndDate,
      isTrialUsed: true,
      remainingDays: 7,
      features: PLAN_CONFIGS.free_trial,
      billing: {
        autoRenewal: false,
      },
    };

    // Salvar no localStorage (em produção seria no banco)
    localStorage.setItem(`plan_${userId}`, JSON.stringify(newPlan));
    return newPlan;
  };

  const calculateRemainingDays = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const determineStatus = (plan: any, remainingDays: number): PlanStatus => {
    if (remainingDays <= 0) {
      return plan.planType === 'free_trial' ? 'expired' : 'expired';
    }
    if (plan.planType === 'free_trial') {
      return 'trial';
    }
    return 'active';
  };

  const upgradePlan = (newPlanType: PlanType) => {
    if (!userPlan) return;

    const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const updatedPlan: UserPlan = {
      ...userPlan,
      planType: newPlanType,
      status: 'active',
      endDate: newEndDate,
      remainingDays: 30,
      features: PLAN_CONFIGS[newPlanType],
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

  const isFeatureAllowed = (feature: keyof PlanFeatures): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    return userPlan.features[feature] as boolean;
  };

  const getUsageLimit = (feature: keyof PlanFeatures): number => {
    if (!userPlan) return 0;
    return userPlan.features[feature] as number;
  };

  const shouldShowUpgradePrompt = (): boolean => {
    if (!userPlan) return false;
    return (
      userPlan.status === 'trial' && userPlan.remainingDays <= 3
    ) || userPlan.status === 'expired';
  };

  const getTrialProgressPercentage = (): number => {
    if (!userPlan || userPlan.planType !== 'free_trial') return 0;
    const totalDays = 7;
    const elapsed = totalDays - userPlan.remainingDays;
    return Math.min(100, (elapsed / totalDays) * 100);
  };

  return {
    userPlan,
    loading,
    upgradePlan,
    cancelPlan,
    isFeatureAllowed,
    getUsageLimit,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
  };
}
