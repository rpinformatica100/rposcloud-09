
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ordensData, clientesData, produtosData, financeirosData } from "@/data/dados";
import { formatarMoeda } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FileText, Users, Package, CreditCard, Clipboard, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Status das ordens para o gráfico de pizza
  const statusOrdens = [
    { name: "Abertas", value: ordensData.filter(o => o.status === "aberta").length, fill: "hsl(var(--chart-1))" },
    { name: "Em andamento", value: ordensData.filter(o => o.status === "andamento").length, fill: "hsl(var(--chart-2))" },
    { name: "Concluídas", value: ordensData.filter(o => o.status === "concluida").length, fill: "hsl(var(--chart-3))" },
    { name: "Canceladas", value: ordensData.filter(o => o.status === "cancelada").length, fill: "hsl(var(--chart-4))" },
  ];
  
  // Dados para o gráfico de linha (financeiro por mês)
  const dataFinanceiro = [
    { mes: "Jan", receitas: 4500, despesas: 3000 },
    { mes: "Fev", receitas: 5500, despesas: 3500 },
    { mes: "Mar", receitas: 6000, despesas: 3800 },
    { mes: "Abr", receitas: 7000, despesas: 4000 },
    { mes: "Mai", receitas: 7500, despesas: 4200 },
    { mes: "Jun", receitas: 8000, despesas: 4500 },
  ];

  // Configuração dos charts
  const chartConfig = {
    receitas: {
      label: "Receitas",
    },
    despesas: {
      label: "Despesas",
    },
    abertas: {
      label: "Abertas",
    },
    andamento: {
      label: "Em andamento",
    },
    concluidas: {
      label: "Concluídas",
    },
    canceladas: {
      label: "Canceladas",
    },
  };

  // Total de receitas e despesas
  const totalReceitas = financeirosData
    .filter(f => f.tipo === "receita")
    .reduce((total, item) => total + item.valor, 0);
  
  const totalDespesas = financeirosData
    .filter(f => f.tipo === "despesa")
    .reduce((total, item) => total + item.valor, 0);
  
  // Últimas ordens
  const ultimasOrdens = [...ordensData]
    .sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a), {profile?.nome || "Usuário"}!
        </p>
      </div>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ordens de Serviço
              </p>
              <h3 className="text-2xl font-bold">{ordensData.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center p-6">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes
              </p>
              <h3 className="text-2xl font-bold">{clientesData.filter(c => c.tipo === "cliente").length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="flex items-center p-6">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Produtos/Serviços
              </p>
              <h3 className="text-2xl font-bold">{produtosData.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-50 p-3 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Saldo Atual
              </p>
              <h3 className="text-2xl font-bold text-green-600">{formatarMoeda(totalReceitas - totalDespesas)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de status de ordens */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Status das Ordens
            </CardTitle>
            <CardDescription>
              Distribuição das ordens por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusOrdens}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusOrdens.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de receitas e despesas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Receitas x Despesas
            </CardTitle>
            <CardDescription>
              Histórico financeiro dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataFinanceiro} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [formatarMoeda(Number(value)), ""]}
                    />} 
                  />
                  <Bar 
                    dataKey="receitas" 
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Receitas"
                  />
                  <Bar 
                    dataKey="despesas" 
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                    name="Despesas"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Últimas ordens */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Últimas Ordens de Serviço
            </CardTitle>
            <CardDescription>
              As ordens mais recentemente abertas
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => navigate('/app/ordens')}
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ultimasOrdens.length > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-3 md:grid-cols-5 p-4 bg-muted/30 font-medium text-sm border-b">
                  <div>Número</div>
                  <div>Cliente</div>
                  <div className="hidden md:block">Data</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Valor</div>
                </div>
                {ultimasOrdens.map((ordem) => (
                  <div 
                    key={ordem.id} 
                    className="grid grid-cols-3 md:grid-cols-5 p-4 border-b last:border-b-0 items-center hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/ordens/editar/${ordem.id}`)}
                  >
                    <div className="font-semibold text-primary">{ordem.numero}</div>
                    <div className="truncate">{ordem.cliente?.nome}</div>
                    <div className="hidden md:block text-muted-foreground text-sm">
                      {new Date(ordem.dataAbertura).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        ordem.status === "aberta" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                        ordem.status === "andamento" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                        ordem.status === "concluida" ? "bg-green-100 text-green-700 border border-green-200" :
                        "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {ordem.status === "aberta" ? "Aberta" :
                         ordem.status === "andamento" ? "Em andamento" :
                         ordem.status === "concluida" ? "Concluída" :
                         "Cancelada"}
                      </span>
                    </div>
                    <div className="text-right font-semibold">
                      {formatarMoeda(ordem.valorTotal)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clipboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhuma ordem de serviço cadastrada</p>
                <p className="text-sm">Comece criando sua primeira ordem de serviço</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
