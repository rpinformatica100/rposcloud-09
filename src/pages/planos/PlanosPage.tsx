
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
  Users,
  Database,
  Shield,
  HeadphonesIcon,
  BarChart3,
  Code
} from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { toast } from "sonner";
import { usePlanStatus } from "@/hooks/usePlanStatus";
import { PlanType } from "@/types/plan";

const PlanosPage = () => {
  const { userPlan, upgradePlan } = usePlanStatus();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [planoParaUpgrade, setPlanoParaUpgrade] = useState<any>(null);

  const planosDisponiveis = [
    {
      id: 1,
      nome: "Básico",
      planType: "basic" as PlanType,
      preco: 29.90,
      periodo: "mensal",
      descricao: "Ideal para assistências pequenas",
      caracteristicas: [
        { icon: Database, text: "Até 100 ordens/mês" },
        { icon: Users, text: "2 usuários" },
        { icon: Shield, text: "5GB de armazenamento" },
        { icon: HeadphonesIcon, text: "Suporte por email" },
        { icon: BarChart3, text: "Relatórios básicos" }
      ],
      recomendado: false,
      cor: "blue"
    },
    {
      id: 2,
      nome: "Profissional", 
      planType: "professional" as PlanType,
      preco: 89.90,
      periodo: "mensal",
      descricao: "Para assistências em crescimento",
      caracteristicas: [
        { icon: Database, text: "Até 1000 ordens/mês" },
        { icon: Users, text: "5 usuários" },
        { icon: Shield, text: "10GB de armazenamento" },
        { icon: HeadphonesIcon, text: "Suporte prioritário" },
        { icon: BarChart3, text: "Relatórios avançados" },
        { icon: Zap, text: "Backup automático" }
      ],
      recomendado: true,
      cor: "primary"
    },
    {
      id: 3,
      nome: "Enterprise",
      planType: "enterprise" as PlanType,
      preco: 199.90,
      periodo: "mensal",
      descricao: "Para grandes assistências técnicas",
      caracteristicas: [
        { icon: Database, text: "Ordens ilimitadas" },
        { icon: Users, text: "Usuários ilimitados" },
        { icon: Shield, text: "100GB de armazenamento" },
        { icon: HeadphonesIcon, text: "Suporte 24/7" },
        { icon: Code, text: "API personalizada" },
        { icon: BarChart3, text: "Relatórios customizados" },
        { icon: Zap, text: "Backup em tempo real" }
      ],
      recomendado: false,
      cor: "purple"
    }
  ];

  const planNames = {
    trial_plan: 'Trial Gratuito',
    basic: 'Básico',
    professional: 'Profissional',
    enterprise: 'Enterprise'
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
          <p className="text-muted-foreground">Selecione o plano ideal para sua assistência técnica</p>
        </div>
        {userPlan && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Plano atual:</p>
            <p className="font-semibold">{planNames[userPlan.planType]}</p>
          </div>
        )}
      </div>

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
                {userPlan?.planType !== plano.planType && userPlan?.planType !== 'trial_plan' && (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                )}
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
                ) : userPlan?.planType === 'trial_plan' ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Assinar Agora
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Fazer Upgrade
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção de benefícios */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Todos os planos incluem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="h-8 w-8 mx-auto text-green-500" />
              <h3 className="font-semibold">Segurança Garantida</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados protegidos com criptografia de ponta
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 mx-auto text-blue-500" />
              <h3 className="font-semibold">Atualizações Automáticas</h3>
              <p className="text-sm text-muted-foreground">
                Sempre na versão mais recente do sistema
              </p>
            </div>
            <div className="space-y-2">
              <HeadphonesIcon className="h-8 w-8 mx-auto text-purple-500" />
              <h3 className="font-semibold">Suporte Especializado</h3>
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
              {userPlan?.planType === 'trial_plan' ? 'Assinar Plano' : 'Confirmar Upgrade'}
            </DialogTitle>
          </DialogHeader>
          {planoParaUpgrade && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {userPlan?.planType === 'trial_plan' ? 'Assinar:' : 'Upgrade para:'} {planoParaUpgrade.nome}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: {formatarMoeda(planoParaUpgrade.preco)}/mês
                </p>
                {userPlan?.planType !== 'trial_plan' && (
                  <p className="text-sm text-muted-foreground">
                    Diferença: +{formatarMoeda(planoParaUpgrade.preco - (userPlan?.planType === 'basic' ? 29.90 : 89.90))}/mês
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {userPlan?.planType === 'trial_plan' 
                  ? 'Seu período gratuito será convertido em uma assinatura paga.'
                  : 'O upgrade será aplicado imediatamente e você será cobrado proporcionalmente pelo período restante.'
                }
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarUpgrade}>
              {userPlan?.planType === 'trial_plan' ? 'Assinar' : 'Confirmar Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanosPage;
