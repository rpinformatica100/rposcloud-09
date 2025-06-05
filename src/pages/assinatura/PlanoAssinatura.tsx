
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Star,
  Users,
  Database,
  Shield,
  TrendingUp,
  ExternalLink,
  Crown,
  Check
} from "lucide-react";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import ModalPagamento from "@/components/landing/ModalPagamento";
import { planosDisponiveis } from "@/data/planos";
import type { PlanoData } from "@/data/planos";

const PlanoAssinatura = () => {
  const { profile, subscription, hasActiveSubscription, refreshSubscription, openCustomerPortal } = useSupabaseAuth();
  const [selectedPlano, setSelectedPlano] = useState<PlanoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Dados simulados de histórico
  const [historicoPagamentos] = useState([
    {
      id: "1",
      data: "2024-11-25",
      valor: 49.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Mensal"
    },
    {
      id: "2", 
      data: "2024-10-25",
      valor: 49.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Mensal"
    }
  ]);

  useEffect(() => {
    handleRefreshSubscription();
  }, []);

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await refreshSubscription();
      toast.success("Status da assinatura atualizado");
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      toast.error("Erro ao atualizar status");
    } finally {
      setRefreshing(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { url, error } = await openCustomerPortal();
      
      if (error) {
        toast.error("Erro ao abrir portal de gerenciamento");
        console.error('Portal error:', error);
        return;
      }

      if (url) {
        window.open(url, '_blank');
        toast.success("Abrindo portal de gerenciamento...");
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlano = (plano: PlanoData) => {
    setSelectedPlano(plano);
    setIsModalOpen(true);
  };

  const getCurrentPlanType = () => {
    if (!subscription) {
      return profile?.status_plano === 'trial' ? 'Trial Gratuito' : 'Nenhum plano';
    }
    
    const planMap: { [key: string]: string } = {
      'monthly': 'Mensal',
      'quarterly': 'Trimestral', 
      'yearly': 'Anual'
    };
    
    return planMap[subscription.plan_type] || subscription.plan_type;
  };

  const isCurrentPlan = (planoPeriodo: string) => {
    return subscription?.plan_type === planoPeriodo;
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos e Assinatura</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e escolha o melhor plano para sua assistência técnica.</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshSubscription}
            disabled={refreshing}
          >
            <TrendingUp className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar Status
          </Button>
          
          {hasActiveSubscription && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManageSubscription}
              disabled={loading}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Gerenciar Assinatura
            </Button>
          )}
        </div>
      </div>

      {/* Alertas de Trial */}
      {isTrialExpired() && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Seu período gratuito expirou!</strong> Assine um plano para continuar usando todas as funcionalidades do RP OS Cloud.
          </AlertDescription>
        </Alert>
      )}

      {isInTrial() && getTrialDaysRemaining() <= 3 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Seu período gratuito termina em {getTrialDaysRemaining()} dias. 
            {getTrialDaysRemaining() <= 1 ? ' Assine agora para não perder seus dados!' : ' Assine um plano para continuar.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Status da Assinatura Atual */}
      {hasActiveSubscription && subscription && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Crown className="h-5 w-5" />
              Assinatura Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-600">Plano Atual</p>
                <p className="font-semibold text-green-800">{getCurrentPlanType()}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Status</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {subscription.status === 'active' ? 'Ativo' : subscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-green-600">Próximo Pagamento</p>
                <p className="font-semibold text-green-800">
                  {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status do Trial */}
      {isInTrial() && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" />
              Período de Teste Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-600">Dias restantes:</span>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {getTrialDaysRemaining()} dia(s)
                </Badge>
              </div>
              <Progress 
                value={((7 - getTrialDaysRemaining()) / 7) * 100} 
                className="h-2"
              />
              <p className="text-sm text-blue-600">
                Aproveite todos os recursos gratuitamente durante o período de teste!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planos Disponíveis */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Planos Disponíveis</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {planosDisponiveis.map((plano) => (
            <Card 
              key={plano.id} 
              className={`relative ${plano.destacado ? 'border-2 border-primary' : ''} ${
                isCurrentPlan(plano.periodo) ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plano.destacado && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-md">
                  Recomendado
                </div>
              )}
              
              {isCurrentPlan(plano.periodo) && (
                <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-br-md">
                  Plano Atual
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plano.nome}
                  {isCurrentPlan(plano.periodo) && <Crown className="h-5 w-5 text-green-500" />}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-primary">
                    R$ {plano.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-muted-foreground">
                    {plano.periodo === "monthly" ? " /mês" : 
                     plano.periodo === "quarterly" ? " /trimestre" : 
                     " /ano"}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{plano.descricao}</p>
                
                <ul className="space-y-2">
                  {plano.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan(plano.periodo) ? "secondary" : plano.destacado ? "default" : "outline"}
                  onClick={() => handleSelectPlano(plano)}
                  disabled={isCurrentPlan(plano.periodo)}
                >
                  {isCurrentPlan(plano.periodo) ? "Plano Atual" : "Assinar Plano"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="uso" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="uso">Uso Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="uso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uso dos Recursos</CardTitle>
              <CardDescription>
                Acompanhe o uso dos recursos do seu plano atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Ordens de Serviço</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isInTrial() ? '25 / 50' : '25 / ∞'}
                  </span>
                </div>
                <Progress 
                  value={isInTrial() ? 50 : 10}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Usuários</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    1 / {isInTrial() ? '1' : '5'}
                  </span>
                </div>
                <Progress 
                  value={isInTrial() ? 100 : 20}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Armazenamento</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    0.3GB / {isInTrial() ? '1GB' : '10GB'}
                  </span>
                </div>
                <Progress 
                  value={isInTrial() ? 30 : 3}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                {!hasActiveSubscription 
                  ? 'Você ainda não possui histórico de pagamentos. Assine um plano para começar.' 
                  : 'Veja todos os seus pagamentos anteriores'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasActiveSubscription ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pagamento ainda</h3>
                  <p className="text-gray-500 mb-4">Assine um plano para começar seu histórico de pagamentos.</p>
                  <Button onClick={() => handleSelectPlano(planosDisponiveis[1])}>
                    Ver Planos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {historicoPagamentos.map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CreditCard className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{formatarMoeda(pagamento.valor)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatarData(pagamento.data)} - {pagamento.metodo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pagamento.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700">
                          Pago
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedPlano && (
        <ModalPagamento
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plano={selectedPlano}
        />
      )}
    </div>
  );
};

export default PlanoAssinatura;
