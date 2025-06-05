
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
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

interface PlanGuardProps {
  children: React.ReactNode;
  requiredPlan?: 'paid' | 'active';
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
  const { profile, subscription, hasActiveSubscription } = useSupabaseAuth();
  const navigate = useNavigate();

  console.log('PlanGuard - profile:', profile);
  console.log('PlanGuard - subscription:', subscription);
  console.log('PlanGuard - hasActiveSubscription:', hasActiveSubscription);

  const getTrialDaysRemaining = () => {
    if (!profile?.data_vencimento_plano) return 0;
    const endDate = new Date(profile.data_vencimento_plano);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isTrialExpired = () => {
    return profile?.status_plano === 'trial' && getTrialDaysRemaining() <= 0;
  };

  const isInTrial = () => {
    return profile?.status_plano === 'trial' && getTrialDaysRemaining() > 0;
  };

  const getTrialProgressPercentage = () => {
    if (!isInTrial()) return 0;
    const remainingDays = getTrialDaysRemaining();
    return ((7 - remainingDays) / 7) * 100;
  };

  // Se o trial expirou, bloquear acesso
  if (isTrialExpired()) {
    console.log('PlanGuard - Trial expirado, bloqueando acesso');
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Período Gratuito Expirado
          </CardTitle>
          <CardDescription>
            Seu período de teste de 7 dias expirou. Assine um plano para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Assine um plano agora para reativar todas as funcionalidades e não perder seus dados.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/app/assinatura')} className="w-full">
            Ver Planos Disponíveis
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Verificar se precisa de plano pago quando requerido
  if (requiredPlan === 'paid' && !hasActiveSubscription) {
    console.log('PlanGuard - Plano pago requerido mas não há assinatura ativa');
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Plano Pago Necessário
          </CardTitle>
          <CardDescription>
            Esta funcionalidade requer um plano pago ativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status Atual:</span>
              <Badge variant="outline">
                {isInTrial() ? 'Trial Gratuito' : 'Sem Plano'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Necessário:</span>
              <Badge>Plano Pago</Badge>
            </div>
            <Button onClick={() => navigate('/app/assinatura')} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Assinar Agora
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
      {showTrialBanner && isInTrial() && getTrialDaysRemaining() <= 3 && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Período gratuito:</strong> {getTrialDaysRemaining()} dia(s) restante(s)
              <Progress 
                value={getTrialProgressPercentage()} 
                className="mt-2 h-2"
              />
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/app/assinatura')}
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
