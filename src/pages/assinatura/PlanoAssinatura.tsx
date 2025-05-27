
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  ArrowUp,
  ArrowDown,
  Gift,
  Zap
} from "lucide-react";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { toast } from "sonner";

const PlanoAssinatura = () => {
  // Estados para modais e interações
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [planoParaUpgrade, setPlanoParaUpgrade] = useState<any>(null);

  // Dados simulados - em um cenário real, viriam de uma API
  const [planoAtual] = useState({
    nome: "Plano Profissional",
    preco: 89.90,
    periodo: "mensal",
    status: "ativo",
    proximoVencimento: "2024-12-25",
    diasRestantes: 15,
    caracteristicas: [
      "Até 1000 ordens de serviço/mês",
      "5 usuários inclusos",
      "Backup automático",
      "Suporte prioritário",
      "Relatórios avançados"
    ],
    uso: {
      ordens: { usado: 245, limite: 1000 },
      usuarios: { usado: 3, limite: 5 },
      armazenamento: { usado: 2.5, limite: 10 } // GB
    }
  });

  const [historicoPagamentos] = useState([
    {
      id: "1",
      data: "2024-11-25",
      valor: 89.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Profissional"
    },
    {
      id: "2", 
      data: "2024-10-25",
      valor: 89.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Profissional"
    },
    {
      id: "3",
      data: "2024-09-25", 
      valor: 89.90,
      status: "pago",
      metodo: "PIX",
      descricao: "Mensalidade Plano Profissional"
    }
  ]);

  const [planosDisponiveis] = useState([
    {
      id: 1,
      nome: "Básico",
      preco: 29.90,
      periodo: "mensal",
      caracteristicas: [
        "Até 100 ordens/mês",
        "2 usuários",
        "Suporte por email",
        "Relatórios básicos",
        "Backup semanal"
      ],
      recomendado: false,
      tipo: "downgrade"
    },
    {
      id: 2,
      nome: "Profissional", 
      preco: 89.90,
      periodo: "mensal",
      caracteristicas: [
        "Até 1000 ordens/mês",
        "5 usuários",
        "Backup automático",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      recomendado: false,
      tipo: "atual"
    },
    {
      id: 3,
      nome: "Enterprise",
      preco: 199.90,
      periodo: "mensal", 
      caracteristicas: [
        "Ordens ilimitadas",
        "Usuários ilimitados",
        "Backup em tempo real",
        "Suporte 24/7",
        "API personalizada",
        "Relatórios customizados"
      ],
      recomendado: true,
      tipo: "upgrade"
    }
  ]);

  // Cálculos de economia
  const calcularEconomia = (planoOrigem: any, planoDestino: any) => {
    const economiaAnual = (planoOrigem.preco - planoDestino.preco) * 12;
    return economiaAnual;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "ativo": return "bg-green-100 text-green-700";
      case "vencido": return "bg-red-100 text-red-700";
      case "cancelado": return "bg-gray-100 text-gray-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "ativo": return <CheckCircle className="h-4 w-4" />;
      case "vencido": return <AlertTriangle className="h-4 w-4" />;
      case "cancelado": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleUpgradePlano = (plano: any) => {
    setPlanoParaUpgrade(plano);
    setUpgradeModalOpen(true);
  };

  const confirmarUpgrade = () => {
    if (planoParaUpgrade) {
      toast.success(`Upgrade para ${planoParaUpgrade.nome} solicitado!`, {
        description: "Você será redirecionado para o pagamento."
      });
      setUpgradeModalOpen(false);
      setPlanoParaUpgrade(null);
    }
  };

  const handleCancelarRenovacao = () => {
    setCancelModalOpen(true);
  };

  const confirmarCancelamento = () => {
    toast.success("Renovação automática cancelada", {
      description: "Seu plano permanecerá ativo até o vencimento."
    });
    setCancelModalOpen(false);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de Assinatura</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e histórico de pagamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancelarRenovacao}>
            Cancelar Renovação
          </Button>
          <Button>
            <Gift className="h-4 w-4 mr-2" />
            Aplicar Cupom
          </Button>
        </div>
      </div>

      {/* Alertas importantes */}
      {planoAtual.diasRestantes <= 7 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Seu plano vence em {planoAtual.diasRestantes} dias. Renove para continuar usando todos os recursos.
          </AlertDescription>
        </Alert>
      )}

      {/* Status atual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planoAtual.nome}</div>
            <p className="text-xs text-muted-foreground">
              {formatarMoeda(planoAtual.preco)}/{planoAtual.periodo}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(planoAtual.status)}>
                {getStatusIcon(planoAtual.status)}
                <span className="ml-1 capitalize">{planoAtual.status}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarData(planoAtual.proximoVencimento)}</div>
            <p className="text-xs text-muted-foreground">
              {planoAtual.diasRestantes} dias restantes
            </p>
            <Progress 
              value={(planoAtual.diasRestantes / 30) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(planoAtual.preco)}</div>
            <p className="text-xs text-muted-foreground">
              Será cobrado em {formatarData(planoAtual.proximoVencimento)}
            </p>
            <Button size="sm" className="mt-2">
              Atualizar Pagamento
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="uso" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="uso">Uso Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="planos">Outros Planos</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
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
                    {planoAtual.uso.ordens.usado} / {planoAtual.uso.ordens.limite}
                  </span>
                </div>
                <Progress 
                  value={(planoAtual.uso.ordens.usado / planoAtual.uso.ordens.limite) * 100}
                  className="h-2"
                />
                {(planoAtual.uso.ordens.usado / planoAtual.uso.ordens.limite) * 100 > 80 && (
                  <p className="text-xs text-yellow-600">
                    Você está próximo do limite mensal. Considere fazer upgrade.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Usuários</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {planoAtual.uso.usuarios.usado} / {planoAtual.uso.usuarios.limite}
                  </span>
                </div>
                <Progress 
                  value={(planoAtual.uso.usuarios.usado / planoAtual.uso.usuarios.limite) * 100}
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
                    {planoAtual.uso.armazenamento.usado}GB / {planoAtual.uso.armazenamento.limite}GB
                  </span>
                </div>
                <Progress 
                  value={(planoAtual.uso.armazenamento.usado / planoAtual.uso.armazenamento.limite) * 100}
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
                Veja todos os seus pagamentos anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <Badge className={getStatusColor(pagamento.status)}>
                        {pagamento.status === "pago" ? "Pago" : "Pendente"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="ml-2">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planosDisponiveis.map((plano) => (
              <Card key={plano.nome} className={`relative transition-all duration-200 hover:shadow-lg ${plano.recomendado ? 'border-primary ring-2 ring-primary/20' : ''} ${plano.tipo === 'atual' ? 'border-green-500' : ''}`}>
                {plano.recomendado && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Recomendado
                    </Badge>
                  </div>
                )}
                {plano.tipo === 'atual' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Plano Atual
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    {plano.nome}
                    {plano.tipo === 'upgrade' && <ArrowUp className="h-4 w-4 text-green-500" />}
                    {plano.tipo === 'downgrade' && <ArrowDown className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">{formatarMoeda(plano.preco)}</span>
                    <span className="text-muted-foreground">/{plano.periodo}</span>
                  </CardDescription>
                  {plano.tipo === 'upgrade' && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700">
                        <Zap className="h-3 w-3 inline mr-1" />
                        Recursos premium inclusos
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plano.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                  
                  {plano.tipo === 'upgrade' && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 font-medium">
                        Economia anual: {formatarMoeda(Math.abs(calcularEconomia(planoAtual, plano)))}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={plano.tipo === 'atual' ? "outline" : plano.recomendado ? "default" : "outline"}
                    disabled={plano.tipo === 'atual'}
                    onClick={() => plano.tipo !== 'atual' && handleUpgradePlano(plano)}
                  >
                    {plano.tipo === 'atual' ? "Plano Atual" : 
                     plano.tipo === 'upgrade' ? "Fazer Upgrade" : 
                     "Fazer Downgrade"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faturamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Informações de Faturamento
              </CardTitle>
              <CardDescription>
                Gerencie suas informações de cobrança e pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Método de Pagamento</h4>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">**** **** **** 1234</p>
                      <p className="text-sm text-muted-foreground">Visa - Exp. 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar Método
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Endereço de Cobrança</h4>
                  <div className="p-3 border rounded-lg text-sm">
                    <p>Rua das Flores, 123</p>
                    <p>Centro - São Paulo, SP</p>
                    <p>01234-567</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar Endereço
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Renovação Automática</h4>
                  <p className="text-sm text-blue-600">
                    Sua assinatura será renovada automaticamente
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCancelarRenovacao}>
                  Cancelar Renovação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Upgrade */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Upgrade de Plano</DialogTitle>
          </DialogHeader>
          {planoParaUpgrade && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Upgrade para: {planoParaUpgrade.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Novo valor: {formatarMoeda(planoParaUpgrade.preco)}/mês
                </p>
                <p className="text-sm text-muted-foreground">
                  Diferença: +{formatarMoeda(planoParaUpgrade.preco - planoAtual.preco)}/mês
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                O upgrade será aplicado imediatamente e você será cobrado proporcionalmente pelo período restante.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarUpgrade}>
              Confirmar Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Cancelamento */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Renovação Automática</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja cancelar a renovação automática?</p>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Seu plano permanecerá ativo até {formatarData(planoAtual.proximoVencimento)}, 
                mas não será renovado automaticamente.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Manter Renovação
            </Button>
            <Button variant="destructive" onClick={confirmarCancelamento}>
              Cancelar Renovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanoAssinatura;
