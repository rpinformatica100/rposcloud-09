
import { useNavigate } from 'react-router-dom';
import { usePlan } from '@/contexts/PlanContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { PlanType, PLAN_METADATA } from '@/types/plan';
import { toast } from 'sonner';

export function usePlanManager() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSupabaseAuth();
  const {
    userPlan,
    loading,
    activateTrial,
    upgradePlan,
    startCheckout,
    handleCheckoutSuccess,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
    isFeatureAllowed,
    refreshPlanStatus
  } = usePlan();

  // Ativar trial com redirecionamento
  const handleTrialActivation = async (): Promise<void> => {
    if (!isAuthenticated) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'activate_trial',
        timestamp: Date.now()
      }));
      navigate('/supabase-login?redirect=trial');
      return;
    }

    try {
      const success = await activateTrial();
      if (success) {
        toast.success('Trial de 7 dias ativado com sucesso!');
        navigate('/app');
      } else {
        toast.error('Erro ao ativar trial. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao ativar trial:', error);
      toast.error('Erro inesperado ao ativar trial.');
    }
  };

  // Processo de upgrade/assinatura
  const handlePlanSelection = async (planType: PlanType): Promise<void> => {
    if (!isAuthenticated) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'select_plan',
        planType,
        timestamp: Date.now()
      }));
      navigate('/supabase-login?redirect=plans');
      return;
    }

    if (userPlan?.planType === planType) {
      toast.info('Este já é seu plano atual');
      return;
    }

    try {
      const checkoutUrl = await startCheckout(planType);
      if (checkoutUrl) {
        navigate(checkoutUrl);
      } else {
        toast.error('Erro ao iniciar checkout. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao selecionar plano:', error);
      toast.error('Erro inesperado ao processar plano.');
    }
  };

  // Processar ações pendentes após login
  const processPendingActions = async (): Promise<void> => {
    const pendingAction = localStorage.getItem('pending_action');
    if (!pendingAction) return;

    try {
      const action = JSON.parse(pendingAction);
      
      if (Date.now() - action.timestamp > 3600000) {
        localStorage.removeItem('pending_action');
        return;
      }

      localStorage.removeItem('pending_action');

      switch (action.type) {
        case 'activate_trial':
          await handleTrialActivation();
          break;
        case 'select_plan':
          await handlePlanSelection(action.planType);
          break;
        default:
          console.log('Ação pendente não reconhecida:', action);
      }
    } catch (error) {
      console.error('Erro ao processar ação pendente:', error);
      localStorage.removeItem('pending_action');
    }
  };

  // Verificar acesso a funcionalidade
  const checkFeatureAccess = (feature: string): boolean => {
    const hasAccess = isFeatureAllowed(feature);
    
    if (!hasAccess && shouldShowUpgradePrompt()) {
      toast.info('Esta funcionalidade requer um plano pago', {
        action: {
          label: 'Ver Planos',
          onClick: () => navigate('/app/planos')
        }
      });
    }
    
    return hasAccess;
  };

  // Obter status do plano de forma legível
  const getPlanStatus = () => {
    if (!userPlan) return { name: 'Nenhum plano', status: 'inactive' };
    
    const planMeta = PLAN_METADATA[userPlan.planType];
    return {
      name: planMeta?.name || 'Plano desconhecido',
      status: userPlan.status,
      remainingDays: userPlan.remainingDays,
      isPaid: userPlan.isPaid
    };
  };

  // Verificar se precisa de upgrade
  const needsUpgrade = (): boolean => {
    if (!userPlan) return true;
    return userPlan.planType === 'trial_plan' || userPlan.status === 'expired';
  };

  return {
    // Estado
    userPlan,
    loading,
    
    // Ações principais
    handleTrialActivation,
    handlePlanSelection,
    processPendingActions,
    
    // Verificações
    checkFeatureAccess,
    shouldShowUpgradePrompt,
    getTrialProgressPercentage,
    needsUpgrade,
    getPlanStatus,
    
    // Utilitários
    refreshPlanStatus,
    handleCheckoutSuccess
  };
}
