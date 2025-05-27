
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp
} from "lucide-react";
import { formatarData, formatarMoeda } from "@/lib/utils";

const PlanoAssinatura = () => {
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
      metodo: "Cartão de Crédito"
    },
    {
      id: "2", 
      data: "2024-10-25",
      valor: 89.90,
      status: "pago",
      metodo: "Cartão de Crédito"
    },
    {
      id: "3",
      data: "2024-09-25", 
      valor: 89.90,
      status: "pago",
      metodo: "PIX"
    }
  ]);

  const [planosDisponiveis] = useState([
    {
      nome: "Básico",
      preco: 29.90,
      periodo: "mensal",
      caracteristicas: [
        "Até 100 ordens/mês",
        "2 usuários",
        "Suporte por email",
        "Relatórios básicos"
      ],
      recomendado: false
    },
    {
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
      recomendado: true
    },
    {
      nome: "Enterprise",
      preco: 199.90,
      periodo: "mensal", 
      caracteristicas: [
        "Ordens ilimitadas",
        "Usuários ilimitados",
        "Backup em tempo real",
        "Suporte 24/7",
        "API personalizada"
      ],
      recomendado: false
    }
  ]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de Assinatura</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e histórico de pagamentos</p>
        </div>
      </div>

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
                  <div key={pagamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 p-2 bg-gray-100 rounded-full" />
                      <div>
                        <p className="font-medium">{formatarMoeda(pagamento.valor)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(pagamento.data)} - {pagamento.metodo}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(pagamento.status)}>
                      {pagamento.status === "pago" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planosDisponiveis.map((plano) => (
              <Card key={plano.nome} className={`relative ${plano.recomendado ? 'border-primary' : ''}`}>
                {plano.recomendado && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Plano Atual
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plano.nome}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">{formatarMoeda(plano.preco)}</span>
                    <span className="text-muted-foreground">/{plano.periodo}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plano.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plano.recomendado ? "default" : "outline"}
                    disabled={plano.recomendado}
                  >
                    {plano.recomendado ? "Plano Atual" : "Alterar Plano"}
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
                <Button variant="outline" size="sm">
                  Cancelar Renovação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanoAssinatura;
