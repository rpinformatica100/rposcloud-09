
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Lock, 
  Zap, 
  Clock,
  Shield
} from 'lucide-react';
import { usePlanStatus } from '@/hooks/usePlanStatus';
import { PlanType } from '@/types/plan';
import { useNavigate } from 'react-router-dom';

interface PlanGuardProps {
  children: React.ReactNode;
  requiredPlan?: PlanType;
  feature?: string;
  fallback?: 'alert' | 'modal' | 'redirect';
  showTrialBanner?: boolean;
}

export function PlanGuard({ 
  children, 
  requiredPlan, 
  feature, 
  fallback = 'alert',
  showTrialBanner = true 
}: PlanGuardProps) {
  const { userPlan, shouldShowUpgradePrompt, getTrialProgressPercentage } = usePlanStatus();
  const navigate = useNavigate();

  console.log('PlanGuard - userPlan:', userPlan);

  // Se não há plano, bloquear acesso
  if (!userPlan) {
    console.log('PlanGuard - Nenhum plano encontrado, bloqueando acesso');
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Acesso Restrito
          </CardTitle>
          <CardDescription>
            Você precisa de um plano ativo para acessar esta funcionalidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/assinatura')} className="w-full">
            Ver Planos Disponíveis
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Verificar se o plano está bloqueado
  if (userPlan.status === 'blocked') {
    console.log('PlanGuard - Plano bloqueado');
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Acesso Bloqueado
          </CardTitle>
          <CardDescription>
            Sua conta foi bloqueada. Entre em contato com o suporte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Entre em contato com o suporte para resolver esta situação.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/assinatura')} className="w-full">
            Entrar em Contato
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Para planos expirados, mostrar tela de renovação mas permitir visualização
  if (userPlan.status === 'expired') {
    console.log('PlanGuard - Plano expirado, mostrando opção de renovação');
    return (
      <div>
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Plano Expirado:</strong> Renove seu plano para continuar usando todas as funcionalidades.
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/assinatura')}
              className="ml-4"
            >
              Renovar Agora
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  // Verificar se precisa de um plano específico
  if (requiredPlan && userPlan.planType !== requiredPlan) {
    const planNames = {
      trial_plan: 'Trial Gratuito',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      yearly: 'Anual'
    };

    console.log(`PlanGuard - Plano atual ${userPlan.planType} não atende requisito ${requiredPlan}`);
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Upgrade Necessário
          </CardTitle>
          <CardDescription>
            Esta funcionalidade requer o plano {planNames[requiredPlan]}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Plano Atual:</span>
              <Badge variant="outline">{planNames[userPlan.planType]}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Plano Necessário:</span>
              <Badge>{planNames[requiredPlan]}</Badge>
            </div>
            <Button onClick={() => navigate('/assinatura')} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Fazer Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('PlanGuard - Acesso permitido, renderizando conteúdo');

  return (
    <div>
      {/* Banner de trial se estiver no período gratuito */}
      {showTrialBanner && userPlan.status === 'trial' && shouldShowUpgradePrompt() && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Período gratuito:</strong> {userPlan.remainingDays} dia(s) restante(s)
              <Progress 
                value={getTrialProgressPercentage()} 
                className="mt-2 h-2"
              />
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/assinatura')}
              className="ml-4"
            >
              Assinar Agora
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Renderizar conteúdo protegido */}
      {children}
    </div>
  );
}

export default PlanGuard;
