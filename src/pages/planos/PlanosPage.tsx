
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  CheckCircle, 
  Star,
  Zap,
  ArrowUp,
  Shield,
  HeadphonesIcon,
  BarChart3,
  Users,
  Database,
  Clock
} from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { toast } from "sonner";
import { usePlanStatus } from "@/hooks/usePlanStatus";
import { PlanType, PLAN_METADATA } from "@/types/plan";

const PlanosPage = () => {
  const { userPlan, upgradePlan } = usePlanStatus();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [planoParaUpgrade, setPlanoParaUpgrade] = useState<any>(null);

  const planosDisponiveis = [
    {
      id: 1,
      nome: "Mensal",
      planType: "monthly" as PlanType,
      preco: 49.90,
      periodo: "mês",
      descricao: "Faturamento mensal",
      caracteristicas: [
        { icon: Database, text: "Funcionalidades completas" },
        { icon: Users, text: "Usuários ilimitados" },
        { icon: Shield, text: "Backup automático" },
        { icon: HeadphonesIcon, text: "Suporte técnico" },
        { icon: BarChart3, text: "Relatórios avançados" }
      ],
      recomendado: false,
      cor: "blue"
    },
    {
      id: 2,
      nome: "Trimestral", 
      planType: "quarterly" as PlanType,
      preco: 129.90,
      periodo: "trimestre",
      descricao: "Faturamento trimestral - economia de 13%",
      caracteristicas: [
        { icon: Database, text: "Funcionalidades completas" },
        { icon: Users, text: "Usuários ilimitados" },
        { icon: Shield, text: "Backup automático" },
        { icon: HeadphonesIcon, text: "Suporte técnico" },
        { icon: BarChart3, text: "Relatórios avançados" },
        { icon: Zap, text: "Economia de 13%" }
      ],
      recomendado: true,
      cor: "primary"
    },
    {
      id: 3,
      nome: "Anual",
      planType: "yearly" as PlanType,
      preco: 399.90,
      periodo: "ano",
      descricao: "Faturamento anual - economia de 33%",
      caracteristicas: [
        { icon: Database, text: "Funcionalidades completas" },
        { icon: Users, text: "Usuários ilimitados" },
        { icon: Shield, text: "Backup automático" },
        { icon: HeadphonesIcon, text: "Suporte técnico" },
        { icon: BarChart3, text: "Relatórios avançados" },
        { icon: Zap, text: "Máxima economia - 33%" }
      ],
      recomendado: false,
      cor: "purple"
    }
  ];

  const planNames = {
    trial_plan: 'Trial Gratuito',
    monthly: 'Plano Mensal',
    quarterly: 'Plano Trimestral',
    yearly: 'Plano Anual'
  };

  const handleEscolherPlano = (plano: any) => {
    if (userPlan?.planType === plano.planType) {
      toast.info("Este já é seu plano atual");
      return;
    }
    setPlanoParaUpgrade(plano);
    setUpgradeModalOpen(true);
  };

  const confirmarUpgrade = () => {
    if (planoParaUpgrade) {
      upgradePlan(planoParaUpgrade.planType);
      toast.success(`Upgrade para ${planoParaUpgrade.nome} realizado!`, {
        description: "Seu plano foi atualizado com sucesso."
      });
      setUpgradeModalOpen(false);
      setPlanoParaUpgrade(null);
    }
  };

  const getCorBorda = (cor: string) => {
    switch(cor) {
      case "primary": return "border-primary ring-2 ring-primary/20";
      case "purple": return "border-purple-500 ring-2 ring-purple-500/20";
      default: return "border-blue-500 ring-2 ring-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolha seu Plano</h1>
          <p className="text-muted-foreground">Selecione o período de faturamento ideal para sua assistência técnica</p>
        </div>
        {userPlan && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Plano atual:</p>
            <p className="font-semibold">{planNames[userPlan.planType] || planNames.trial_plan}</p>
            {userPlan.planType === 'trial_plan' && userPlan.remainingDays !== undefined && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{userPlan.remainingDays} dias restantes</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trial Info */}
      {userPlan?.planType === 'trial_plan' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              Período Gratuito Ativo
            </CardTitle>
            <CardDescription>
              Você tem acesso completo a todas as funcionalidades por {userPlan.remainingDays || 7} dias restantes.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planosDisponiveis.map((plano) => (
          <Card 
            key={plano.nome} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              plano.recomendado ? getCorBorda(plano.cor) : ''
            } ${userPlan?.planType === plano.planType ? 'border-green-500 ring-2 ring-green-500/20' : ''}`}
          >
            {plano.recomendado && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            {userPlan?.planType === plano.planType && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Plano Atual
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                {plano.nome}
              </CardTitle>
              <CardDescription className="text-sm">
                {plano.descricao}
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{formatarMoeda(plano.preco)}</span>
                <span className="text-muted-foreground">/{plano.periodo}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plano.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <caracteristica.icon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{caracteristica.text}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full mt-6" 
                variant={userPlan?.planType === plano.planType ? "outline" : plano.recomendado ? "default" : "outline"}
                disabled={userPlan?.planType === plano.planType}
                onClick={() => handleEscolherPlano(plano)}
              >
                {userPlan?.planType === plano.planType ? (
                  "Plano Atual"
                ) : (userPlan?.planType === 'trial_plan' || !userPlan) ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Assinar Agora
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Alterar Plano
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funcionalidades Incluídas */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Todas as funcionalidades incluídas em qualquer plano</CardTitle>
          <CardDescription className="text-center">
            A diferença entre os planos é apenas o período de faturamento e a economia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Database className="h-8 w-8 mx-auto text-green-500" />
              <h3 className="font-semibold">Sistema Completo</h3>
              <p className="text-sm text-muted-foreground">
                Ordens de serviço, clientes, produtos e relatórios
              </p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 mx-auto text-blue-500" />
              <h3 className="font-semibold">Backup Automático</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados sempre protegidos e seguros
              </p>
            </div>
            <div className="space-y-2">
              <HeadphonesIcon className="h-8 w-8 mx-auto text-purple-500" />
              <h3 className="font-semibold">Suporte Técnico</h3>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está aqui para ajudar você
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmação */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {(userPlan?.planType === 'trial_plan' || !userPlan) ? 'Assinar Plano' : 'Alterar Plano'}
            </DialogTitle>
          </DialogHeader>
          {planoParaUpgrade && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {(userPlan?.planType === 'trial_plan' || !userPlan) ? 'Assinar:' : 'Alterar para:'} {planoParaUpgrade.nome}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: {formatarMoeda(planoParaUpgrade.preco)}/{planoParaUpgrade.periodo}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {(userPlan?.planType === 'trial_plan' || !userPlan)
                  ? 'Seu período gratuito será convertido em uma assinatura paga.'
                  : 'A alteração será aplicada imediatamente no próximo ciclo de faturamento.'
                }
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarUpgrade}>
              {(userPlan?.planType === 'trial_plan' || !userPlan) ? 'Assinar' : 'Confirmar Alteração'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanosPage;
