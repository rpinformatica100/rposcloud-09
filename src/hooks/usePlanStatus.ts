import { useState, useEffect } from 'react';
import { UserPlan, PlanStatus, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { useAuth } from '@/contexts/AuthContext';

export function usePlanStatus() {
  const { user, isAuthenticated } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

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
    // Assuming user.status_plano from AuthContext could also be used, but planType is safer from UserPlan
    if (planType === 'trial_plan') {
      return 'trial';
    }
    return 'active'; // Default for paid plans that are not expired
  };

  useEffect(() => {
    setLoading(true); // Start loading whenever user or isAuthenticated changes
    if (!isAuthenticated || !user) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    const planKey = `plan_${user.id}`;
    const savedPlanJson = localStorage.getItem(planKey);
    
    if (savedPlanJson) {
      try {
        const parsedPlan = JSON.parse(savedPlanJson) as UserPlan; // Assume it's UserPlan structure
        
        // Recalculate dynamic fields
        const remainingDays = calculateRemainingDays(parsedPlan.endDate);
        const status = determineStatus(parsedPlan.endDate, parsedPlan.planType);
        
        const updatedPlan: UserPlan = {
          ...parsedPlan,
          remainingDays,
          status,
          isPaid: PLAN_METADATA[parsedPlan.planType as PlanType]?.isPaid || false,
          features: PLAN_CONFIGS[parsedPlan.planType as PlanType] || PLAN_CONFIGS.trial_plan,
        };
        
        setUserPlan(updatedPlan);
        // Optionally, re-save to localStorage if status or remainingDays changed significantly
        // localStorage.setItem(planKey, JSON.stringify(updatedPlan));

      } catch (error) {
        console.error("Error parsing saved plan from localStorage:", error);
        localStorage.removeItem(planKey); // Clear corrupted data
        // Fall through to create a default trial plan if parsing fails
        // This will be handled by the 'else' block logic implicitly if we reach here after removing item
      }
    } else {
      // No plan found in localStorage for this user, or it was corrupted and removed.
      // Create a default trial plan based on user's registration info.
      // User object from AuthContext has `plano`, `data_vencimento_plano`, `data_cadastro`.
      
      const userPlanType = user.plano as PlanType; // e.g., 'trial_plan'
      const userPlanEndDate = user.data_vencimento_plano; // ISO string
      const userPlanStartDate = user.data_cadastro; // ISO string, or default to now if not available

      if (userPlanType && PLAN_CONFIGS[userPlanType]) {
        const remainingDays = calculateRemainingDays(userPlanEndDate);
        const status = determineStatus(userPlanEndDate, userPlanType);

        const defaultTrialPlan: UserPlan = {
          id: planKey, // Use planKey as ID
          userId: user.id,
          planType: userPlanType,
          status: status,
          startDate: userPlanStartDate || new Date().toISOString(),
          endDate: userPlanEndDate,
          trialStartDate: userPlanType === 'trial_plan' ? (userPlanStartDate || new Date().toISOString()) : undefined,
          trialEndDate: userPlanType === 'trial_plan' ? userPlanEndDate : undefined,
          isTrialUsed: userPlanType === 'trial_plan', // Assumes registration means trial is used
          remainingDays: remainingDays,
          features: PLAN_CONFIGS[userPlanType],
          isPaid: PLAN_METADATA[userPlanType]?.isPaid || false,
          billing: {
            autoRenewal: false, // Default for trial
          },
        };
        setUserPlan(defaultTrialPlan);
        localStorage.setItem(planKey, JSON.stringify(defaultTrialPlan));
        console.log('Default trial plan created and saved for user:', user.id, defaultTrialPlan);
      } else {
        console.warn(`User ${user.id} has no valid plan type ('${user.plano}') in their user object. Cannot create default plan.`);
        setUserPlan(null); // Ensure userPlan is null if no valid plan can be derived
      }
    }
    
    setLoading(false);
  }, [user, isAuthenticated]);

  const activateTrial = () => {
    if (!user) return;

    const planKey = `plan_${user.id}`;
    const existingPlanJson = localStorage.getItem(planKey);
    if (existingPlanJson) {
      try {
        const parsed = JSON.parse(existingPlanJson) as UserPlan;
        if (parsed.isTrialUsed && parsed.planType === 'trial_plan') {
          console.log('Trial já foi utilizado e ainda é o plano atual.');
          // Potentially refresh this plan if needed, or just return
          setUserPlan(parsed); // Ensure it's set
          return;
        }
      } catch (error) {
        console.error("Error parsing existing plan in activateTrial:", error);
        // Potentially clear corrupted data and proceed to create a new trial
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

  const upgradePlan = (newPlanType: PlanType) => {
    if (!user || !userPlan || !PLAN_METADATA[newPlanType]?.isPaid) {
      console.error("Upgrade conditions not met", { user, userPlan, newPlanType });
      return;
    }
    
    const planKey = `plan_${user.id}`;
    // Calculate new end date, e.g., 30 days from now
    const newStartDate = new Date().toISOString();
    const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const remainingDays = calculateRemainingDays(newEndDate);
    
    const updatedPlan: UserPlan = {
      ...userPlan,
      planType: newPlanType,
      status: 'active', // Upgrading to a paid plan makes it active
      startDate: newStartDate, // Reset start date for the new plan period
      endDate: newEndDate,
      remainingDays: remainingDays,
      features: PLAN_CONFIGS[newPlanType],
      isPaid: true,
      // Reset trial specific fields if they exist from a previous trial plan
      trialStartDate: undefined, 
      trialEndDate: undefined,
      isTrialUsed: userPlan.planType === 'trial_plan' ? true : userPlan.isTrialUsed, // Preserve if it was a trial before
      billing: {
        ...(userPlan.billing || {}), // Preserve existing billing info if any
        autoRenewal: true, // Typically, paid plans have auto-renewal
        nextBillingDate: newEndDate,
        lastPaymentDate: new Date().toISOString(), // Assume payment is made now
      },
    };

    setUserPlan(updatedPlan);
    localStorage.setItem(planKey, JSON.stringify(updatedPlan));
    console.log(`User ${user.id} upgraded to ${newPlanType}`, updatedPlan);
  };

  const cancelPlan = () => {
    if (!user || !userPlan) return;

    const planKey = `plan_${user.id}`;
    const updatedPlan: UserPlan = {
      ...userPlan,
      status: 'cancelled', // Mark as cancelled
      billing: {
        ...(userPlan.billing || {}),
        autoRenewal: false, // Turn off auto-renewal
      },
    };

    setUserPlan(updatedPlan);
    localStorage.setItem(planKey, JSON.stringify(updatedPlan));
    console.log(`Plan cancelled for user ${user.id}`, updatedPlan);
  };

  const isFeatureAllowed = (feature: keyof PlanFeatures): boolean => {
    if (!userPlan || userPlan.status === 'expired' || userPlan.status === 'blocked') {
      return false;
    }
    // Check if the feature exists and is true (for boolean features)
    // For numeric limits, this check might need to be different (e.g., if usage < limit)
    // Assuming here it's about simple true/false access
    return !!userPlan.features[feature]; 
  };

  const getUsageLimit = (feature: keyof PlanFeatures): number => {
    if (!userPlan || typeof userPlan.features[feature] !== 'number') return 0;
    return userPlan.features[feature] as number;
  };

  const shouldShowUpgradePrompt = (): boolean => {
    if (!userPlan) return false; // Should not happen if logic above is correct
    return (
      userPlan.planType === 'trial_plan' && userPlan.remainingDays <= 3
    ) || userPlan.status === 'expired';
  };

  const getTrialProgressPercentage = (): number => {
    if (!userPlan || userPlan.planType !== 'trial_plan' || !PLAN_METADATA.trial_plan.trialDays) return 0;
    const totalTrialDays = PLAN_METADATA.trial_plan.trialDays;
    // Ensure remainingDays does not exceed totalTrialDays (e.g. if plan was reset)
    const actualRemainingDays = Math.min(userPlan.remainingDays, totalTrialDays);
    const elapsed = totalTrialDays - actualRemainingDays;
    return Math.min(100, Math.max(0, (elapsed / totalTrialDays) * 100));
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
    // Expose determineStatus and calculateRemainingDays if they might be useful outside
    // but typically they are internal helpers.
  };
}
