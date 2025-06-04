
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, RefreshCw, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ModalPagamento from "@/components/landing/ModalPagamento";

const planosDisponiveis = [
  {
    id: 1,
    nome: "Plano Mensal",
    periodo: "monthly",
    preco: 49.90,
    destacado: false,
    descricao: "Faturamento mensal - flexibilidade máxima",
    features: [
      "Acesso completo ao sistema",
      "Suporte técnico",
      "Atualizações incluídas",
      "Backup automático"
    ]
  },
  {
    id: 2,
    nome: "Plano Trimestral",
    periodo: "quarterly",
    preco: 129.90,
    destacado: true,
    descricao: "Faturamento trimestral - economia de 13%",
    features: [
      "Acesso completo ao sistema",
      "Suporte técnico prioritário",
      "Atualizações incluídas",
      "Backup automático",
      "13% de economia"
    ]
  },
  {
    id: 3,
    nome: "Plano Anual",
    periodo: "yearly",
    preco: 399.90,
    destacado: false,
    descricao: "Faturamento anual - máxima economia de 33%",
    features: [
      "Acesso completo ao sistema",
      "Suporte técnico VIP",
      "Atualizações incluídas",
      "Backup automático",
      "33% de economia",
      "Consultoria mensal"
    ]
  }
];

const PlanosPage = () => {
  const { profile, subscription, hasActiveSubscription, refreshSubscription, openCustomerPortal } = useSupabaseAuth();
  const [selectedPlano, setSelectedPlano] = useState<typeof planosDisponiveis[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Auto-refresh ao carregar a página
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

  const handleSelectPlano = (plano: typeof planosDisponiveis[0]) => {
    setSelectedPlano(plano);
    setIsModalOpen(true);
  };

  const getCurrentPlanType = () => {
    if (!subscription) return null;
    
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
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar Status
          </Button>
          
          {hasActiveSubscription && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManageSubscription}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Gerenciar Assinatura
            </Button>
          )}
        </div>
      </div>

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

      {/* Trial Information */}
      {!hasActiveSubscription && profile?.status_plano === 'trial' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700">Período de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-600">
              Você está no período de teste gratuito. Assine um plano para continuar usando o sistema sem limitações.
            </p>
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

      {/* Modal de Pagamento */}
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

export default PlanosPage;
