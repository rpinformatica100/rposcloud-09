
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, CreditCard, Activity } from "lucide-react";

const AdminDashboard = () => {
  // Dados simulados para o dashboard
  const dashboardData = {
    totalAssistencias: 24,
    totalPlanos: 3,
    totalPagamentos: 68,
    receita: 12450.75
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do sistema e estatísticas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assistências Cadastradas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalAssistencias}</div>
            <p className="text-xs text-muted-foreground">Empresas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalPlanos}</div>
            <p className="text-xs text-muted-foreground">Planos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalPagamentos}</div>
            <p className="text-xs text-muted-foreground">Transações processadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboardData.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Faturamento acumulado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Últimas Assistências</CardTitle>
            <CardDescription>Empresas cadastradas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Nome</div>
                <div>Plano</div>
                <div>Status</div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">TecnoHelp</div>
                <div>Premium</div>
                <div><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Ativo</span></div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">RapidFix</div>
                <div>Básico</div>
                <div><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Ativo</span></div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">SOS Eletrônicos</div>
                <div>Empresarial</div>
                <div><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Ativo</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Últimos Pagamentos</CardTitle>
            <CardDescription>Transações recentes no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Assistência</div>
                <div>Valor</div>
                <div>Data</div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">TecnoHelp</div>
                <div>R$ 99,90</div>
                <div className="text-sm">15/05/2025</div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">RapidFix</div>
                <div>R$ 49,90</div>
                <div className="text-sm">12/05/2025</div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium">SOS Eletrônicos</div>
                <div>R$ 199,90</div>
                <div className="text-sm">10/05/2025</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
