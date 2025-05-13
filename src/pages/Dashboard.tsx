
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ordensData, clientesData, produtosData, financeirosData } from "@/data/dados";
import { formatarMoeda } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Users, Package, CreditCard, Clipboard, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  // Status das ordens para o gráfico de pizza
  const statusOrdens = [
    { name: "Abertas", value: ordensData.filter(o => o.status === "aberta").length, color: "#3b82f6" },
    { name: "Em andamento", value: ordensData.filter(o => o.status === "andamento").length, color: "#f59e0b" },
    { name: "Concluídas", value: ordensData.filter(o => o.status === "concluida").length, color: "#10b981" },
    { name: "Canceladas", value: ordensData.filter(o => o.status === "cancelada").length, color: "#ef4444" },
  ];
  
  // Dados para o gráfico de linha (financeiro por mês)
  const dataFinanceiro = [
    { name: "Jan", receitas: 4500, despesas: 3000 },
    { name: "Fev", receitas: 5500, despesas: 3500 },
    { name: "Mar", receitas: 6000, despesas: 3800 },
    { name: "Abr", receitas: 7000, despesas: 4000 },
    { name: "Mai", receitas: 7500, despesas: 4200 },
    { name: "Jun", receitas: 8000, despesas: 4500 },
  ];

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Bem-vindo(a), {usuario?.nome || "Usuário"}
        </div>
      </div>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
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
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
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
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
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
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Saldo Atual
              </p>
              <h3 className="text-2xl font-bold">{formatarMoeda(totalReceitas - totalDespesas)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de status de ordens */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status das Ordens</CardTitle>
            <CardDescription>
              Distribuição das ordens por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusOrdens}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusOrdens.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de receitas e despesas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receitas x Despesas</CardTitle>
            <CardDescription>
              Histórico financeiro dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataFinanceiro}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatarMoeda(Number(value))}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Receitas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="#ef4444" 
                    name="Despesas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Últimas ordens */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimas Ordens de Serviço</CardTitle>
            <CardDescription>
              As ordens mais recentemente abertas
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => navigate('/app/ordens')}
          >
            Ver todas
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ultimasOrdens.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-3 md:grid-cols-5 p-3 bg-muted/50 font-medium text-sm">
                  <div>Número</div>
                  <div>Cliente</div>
                  <div className="hidden md:block">Data</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Valor</div>
                </div>
                {ultimasOrdens.map((ordem) => (
                  <div 
                    key={ordem.id} 
                    className="grid grid-cols-3 md:grid-cols-5 p-3 border-t items-center hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/app/ordens/editar/${ordem.id}`)}
                  >
                    <div className="font-medium">{ordem.numero}</div>
                    <div className="truncate">{ordem.cliente?.nome}</div>
                    <div className="hidden md:block text-muted-foreground">
                      {new Date(ordem.dataAbertura).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ordem.status === "aberta" ? "bg-blue-100 text-blue-700" :
                        ordem.status === "andamento" ? "bg-amber-100 text-amber-700" :
                        ordem.status === "concluida" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {ordem.status === "aberta" ? "Aberta" :
                         ordem.status === "andamento" ? "Em andamento" :
                         ordem.status === "concluida" ? "Concluída" :
                         "Cancelada"}
                      </span>
                    </div>
                    <div className="text-right font-medium">
                      {formatarMoeda(ordem.valorTotal)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clipboard className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Nenhuma ordem de serviço cadastrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
