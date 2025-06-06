
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, DollarSign, AlertTriangle } from "lucide-react";
import { TesteCadastro } from '@/components/debug/TesteCadastro';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Dashboard = () => {
  const { profile, assistencia } = useSupabaseAuth();

  console.log('Dashboard - Profile:', profile);
  console.log('Dashboard - Assistência:', assistencia);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está um resumo do seu negócio.
        </p>
      </div>

      {/* Informações de Debug */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">Informações de Debug</CardTitle>
          <CardDescription>
            Dados do usuário logado para verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Profile ID:</strong> {profile?.id || 'Não encontrado'}</p>
            <p><strong>Profile Nome:</strong> {profile?.nome || 'Não encontrado'}</p>
            <p><strong>Profile Email:</strong> {profile?.email || 'Não encontrado'}</p>
            <p><strong>Profile Tipo:</strong> {profile?.tipo || 'Não encontrado'}</p>
            <p><strong>Assistência ID:</strong> {assistencia?.id || 'Não encontrado'}</p>
            <p><strong>Assistência Nome:</strong> {assistencia?.nome || 'Não encontrado'}</p>
            <p><strong>Cadastro Completo:</strong> {assistencia?.cadastroCompleto ? 'Sim' : 'Não'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Componente de Teste */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Teste de Cadastro</CardTitle>
          <CardDescription>
            Use este componente para testar se o cadastro está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TesteCadastro />
        </CardContent>
      </Card>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ordens Abertas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+45</div>
            <p className="text-xs text-muted-foreground">
              +10% desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450</div>
            <p className="text-xs text-muted-foreground">
              +15% desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendências
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 ordens atrasadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico ou lista de atividades recentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <Activity className="mr-2 h-4 w-4 text-blue-600" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nova ordem de serviço criada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    OS #1234 - Cliente João Silva
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">2h atrás</div>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-600" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Cliente cadastrado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maria Santos - (11) 99999-9999
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">5h atrás</div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-yellow-600" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pagamento recebido
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 350,00 - OS #1230
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">1d atrás</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resumo Semanal</CardTitle>
            <CardDescription>
              Suas métricas desta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ordens Concluídas</span>
                <span className="text-sm text-muted-foreground">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Conclusão</span>
                <span className="text-sm text-muted-foreground">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Novos Clientes</span>
                <span className="text-sm text-muted-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receita</span>
                <span className="text-sm text-muted-foreground">R$ 2.840</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
