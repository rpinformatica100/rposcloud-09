
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  Zap, 
  CheckCircle,
  Gift,
  Crown
} from 'lucide-react';
import { usePlanStatus } from '@/hooks/usePlanStatus';
import { useNavigate } from 'react-router-dom';

interface PlanNotificationProps {
  showInHeader?: boolean;
  compact?: boolean;
}

export function PlanNotification({ showInHeader = false, compact = false }: PlanNotificationProps) {
  const { userPlan, shouldShowUpgradePrompt, getTrialProgressPercentage } = usePlanStatus();
  const navigate = useNavigate();

  if (!userPlan) return null;

  const planNames = {
    free_trial: 'Trial Gratuito',
    basic: 'Básico',
    professional: 'Profissional',
    enterprise: 'Enterprise'
  };

  const getAlertType = () => {
    if (userPlan.status === 'expired' || userPlan.status === 'blocked') return 'destructive';
    if (userPlan.status === 'trial' && userPlan.remainingDays <= 1) return 'destructive';
    if (userPlan.status === 'trial' && userPlan.remainingDays <= 3) return 'default';
    return 'default';
  };

  const getIcon = () => {
    if (userPlan.status === 'expired' || userPlan.status === 'blocked') return AlertTriangle;
    if (userPlan.status === 'trial') return Clock;
    if (userPlan.status === 'active') return CheckCircle;
    return Crown;
  };

  const Icon = getIcon();

  // Versão compacta para header
  if (compact || showInHeader) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={userPlan.status === 'expired' ? 'destructive' : 'default'}
          className="flex items-center gap-1"
        >
          <Icon className="h-3 w-3" />
          {planNames[userPlan.planType]}
          {userPlan.status === 'trial' && ` (${userPlan.remainingDays}d)`}
        </Badge>
        
        {shouldShowUpgradePrompt() && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/assinatura')}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        )}
      </div>
    );
  }

  // Não mostrar notificação se o plano está ativo e não é trial
  if (userPlan.status === 'active' && userPlan.planType !== 'free_trial') {
    return null;
  }

  return (
    <Alert className={`mb-4 ${getAlertType() === 'destructive' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {userPlan.status === 'expired' && (
              <div>
                <strong>Seu período gratuito expirou!</strong>
                <p className="text-sm mt-1">
                  Assine um plano para continuar usando todas as funcionalidades do RP OS Cloud.
                </p>
              </div>
            )}
            
            {userPlan.status === 'trial' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <strong>Período gratuito ativo</strong>
                  <Badge variant="outline">
                    {userPlan.remainingDays} dia(s) restante(s)
                  </Badge>
                </div>
                
                <Progress 
                  value={getTrialProgressPercentage()} 
                  className="mb-2 h-2"
                />
                
                <p className="text-sm">
                  Aproveite todos os recursos gratuitamente! 
                  {userPlan.remainingDays <= 3 && (
                    <span className="font-medium text-yellow-700">
                      {' '}Assine agora para não perder acesso aos seus dados.
                    </span>
                  )}
                </p>
              </div>
            )}
            
            {userPlan.status === 'cancelled' && (
              <div>
                <strong>Plano cancelado</strong>
                <p className="text-sm mt-1">
                  Seu plano será cancelado em {userPlan.remainingDays} dia(s). 
                  Reative para continuar usando o sistema.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {userPlan.status === 'trial' && (
              <Button 
                size="sm" 
                onClick={() => navigate('/assinatura')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Gift className="h-4 w-4 mr-1" />
                Ver Planos
              </Button>
            )}
            
            {(userPlan.status === 'expired' || userPlan.status === 'cancelled') && (
              <Button 
                size="sm" 
                onClick={() => navigate('/assinatura')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Reativar
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default PlanNotification;
