
import { UserPlan, PlanType, PLAN_CONFIGS, PLAN_METADATA } from '@/types/plan';
import { usePlanCalculations } from './usePlanCalculations';
import { usePlanStorage } from './usePlanStorage';
import { StateManager } from '@/utils/stateManager';

export function usePlanOperations() {
  const { calculateRemainingDays } = usePlanCalculations();
  const { savePlan } = usePlanStorage();
  const stateManager = StateManager.getInstance();

  const activateTrial = (user: any, setUserPlan: (plan: UserPlan) => void) => {
    if (!user) return;

    console.log(`Ativando trial para usuário ${user.email}`);

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
        console.error("Erro ao analisar plano existente em activateTrial:", error);
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
    savePlan(trialPlan);
    
    // Salvar estado
    stateManager.saveUserState(user.id, {
      trial_activated: new Date().toISOString(),
      plan_data: trialPlan
    });
    
    console.log('Plano trial ativado/reativado e salvo para usuário:', user.id, trialPlan);
  };

  const upgradePlan = (user: any, userPlan: UserPlan | null, setUserPlan: (plan: UserPlan) => void, newPlanType: PlanType) => {
    if (!user || !userPlan || !PLAN_METADATA[newPlanType]?.isPaid) {
      console.error("Condições de upgrade não atendidas", { user, userPlan, newPlanType });
      return;
    }
    
    console.log(`Fazendo upgrade para ${newPlanType} para usuário ${user.email}`);
    
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
    savePlan(updatedPlan);
    
    // Atualizar usuário no localStorage
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => 
      u.id === user.id 
        ? { ...u, plano: newPlanType, status_plano: 'active', data_vencimento_plano: newEndDate }
        : u
    );
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    
    // Atualizar usuário atual
    const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (currentUser.id === user.id) {
      const updatedCurrentUser = { 
        ...currentUser, 
        plano: newPlanType, 
        status_plano: 'active', 
        data_vencimento_plano: newEndDate 
      };
      localStorage.setItem('usuario', JSON.stringify(updatedCurrentUser));
    }
    
    // Salvar estado
    stateManager.saveUserState(user.id, {
      plan_upgraded: new Date().toISOString(),
      old_plan: userPlan.planType,
      new_plan: newPlanType,
      plan_data: updatedPlan
    });
    
    console.log(`Usuário ${user.id} fez upgrade para ${newPlanType}`, updatedPlan);
  };

  const cancelPlan = (user: any, userPlan: UserPlan | null, setUserPlan: (plan: UserPlan) => void) => {
    if (!user || !userPlan) return;

    console.log(`Cancelando plano para usuário ${user.email}`);

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
    savePlan(updatedPlan);
    
    // Salvar estado
    stateManager.saveUserState(user.id, {
      plan_cancelled: new Date().toISOString(),
      plan_data: updatedPlan
    });
    
    console.log(`Plano cancelado para usuário ${user.id}`, updatedPlan);
  };

  return {
    activateTrial,
    upgradePlan,
    cancelPlan,
  };
}
