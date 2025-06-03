
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financeirosData } from "@/data/dados";
import { MovimentoFinanceiro } from "@/types";
import { CreditCard, Plus, Search, Check, X, DollarSign } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActionDropdownMenu, Edit, Trash } from "@/components/ui/action-dropdown-menu";

const FinanceiroList = () => {
  const [movimentos, setMovimentos] = useState<MovimentoFinanceiro[]>(financeirosData);
  const [filtro, setFiltro] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este movimento?")) {
      setMovimentos(movimentos.filter(movimento => movimento.id !== id));
      toast({
        title: "Movimento excluído",
        description: "O movimento financeiro foi excluído com sucesso",
      });
    }
  };

  const handleStatusChange = (id: string, pago: boolean) => {
    setMovimentos(movimentos.map(movimento => {
      if (movimento.id === id) {
        return {
          ...movimento,
          pago,
          dataPagamento: pago ? new Date().toISOString() : undefined
        };
      }
      return movimento;
    }));
    
    toast({
      title: pago ? "Movimento marcado como pago" : "Movimento marcado como pendente",
      description: pago 
        ? "O movimento foi marcado como pago com sucesso" 
        : "O movimento foi marcado como pendente",
    });
  };

  const getActions = (movimento: MovimentoFinanceiro) => [
    {
      label: "Editar",
      icon: Edit,
      onClick: () => navigate(`/app/financeiro/${movimento.id}/editar`)
    },
    {
      label: "Excluir",
      icon: Trash,
      onClick: () => handleExcluir(movimento.id),
      variant: "destructive" as const,
      separator: true
    }
  ];

  // Filtrar movimentos conforme busca e filtros
  const movimentosFiltrados = movimentos.filter(movimento => {
    // Filtro por texto
    const matchesSearch = 
      movimento.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
      movimento.categoria.toLowerCase().includes(filtro.toLowerCase()) || 
      (movimento.metodoPagamento || "").toLowerCase().includes(filtro.toLowerCase());
    
    // Filtro por tipo (receita/despesa)
    const matchesTipo = tipoFiltro === "todos" || movimento.tipo === tipoFiltro;
    
    // Filtro por período
    let matchesPeriodo = true;
    const hoje = new Date();
    const dataMovimento = new Date(movimento.data);
    
    if (periodoFiltro === "hoje") {
      matchesPeriodo = dataMovimento.toDateString() === hoje.toDateString();
    } else if (periodoFiltro === "semana") {
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(hoje.getDate() - 7);
      matchesPeriodo = dataMovimento >= umaSemanaAtras;
    } else if (periodoFiltro === "mes") {
      matchesPeriodo = 
        dataMovimento.getMonth() === hoje.getMonth() && 
        dataMovimento.getFullYear() === hoje.getFullYear();
    }
    
    return matchesSearch && matchesTipo && matchesPeriodo;
  });

  // Calcular totais
  const totalReceitas = movimentosFiltrados
    .filter(m => m.tipo === "receita")
    .reduce((sum, m) => sum + m.valor, 0);
    
  const totalDespesas = movimentosFiltrados
    .filter(m => m.tipo === "despesa")
    .reduce((sum, m) => sum + m.valor, 0);
    
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <Button onClick={() => navigate("/app/financeiro/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Movimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">
                Receitas
              </p>
              <h3 className="text-2xl font-bold text-green-800">
                {formatarMoeda(totalReceitas)}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="flex items-center p-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700">
                Despesas
              </p>
              <h3 className="text-2xl font-bold text-red-800">
                {formatarMoeda(totalDespesas)}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className={saldo >= 0 ? "bg-blue-50" : "bg-amber-50"}>
          <CardContent className="flex items-center p-6">
            <div className={`${saldo >= 0 ? "bg-blue-100" : "bg-amber-100"} p-3 rounded-full mr-4`}>
              <DollarSign className={`h-6 w-6 ${saldo >= 0 ? "text-blue-600" : "text-amber-600"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Saldo
              </p>
              <h3 className={`text-2xl font-bold ${saldo >= 0 ? "text-blue-800" : "text-amber-800"}`}>
                {formatarMoeda(saldo)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <CardTitle>Movimentos Financeiros</CardTitle>
              <CardDescription>
                Gerencie as receitas e despesas
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select
                value={periodoFiltro}
                onValueChange={setPeriodoFiltro}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Últimos 7 dias</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                placeholder="Buscar movimento..." 
                className="w-full md:w-[300px]"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="todos" value={tipoFiltro} onValueChange={setTipoFiltro}>
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="receita">Receitas</TabsTrigger>
              <TabsTrigger value="despesa">Despesas</TabsTrigger>
            </TabsList>

            <TabsContent value={tipoFiltro}>
              {movimentosFiltrados.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-7 p-4 bg-muted/50 font-medium text-sm">
                    <div className="md:col-span-2">Descrição</div>
                    <div className="hidden md:block">Data</div>
                    <div className="hidden md:block">Categoria</div>
                    <div className="text-right">Valor</div>
                    <div className="text-center">Status</div>
                    <div className="text-center">Ações</div>
                  </div>

                  {movimentosFiltrados.map((movimento) => (
                    <div 
                      key={movimento.id} 
                      className="grid grid-cols-1 md:grid-cols-7 p-4 border-t items-center"
                    >
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            movimento.tipo === "receita" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          <span className="font-medium">{movimento.descricao}</span>
                        </div>
                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                          {new Date(movimento.data).toLocaleDateString('pt-BR')} • {movimento.categoria}
                        </div>
                      </div>
                      <div className="hidden md:block text-muted-foreground">
                        {new Date(movimento.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="hidden md:block text-muted-foreground">
                        {movimento.categoria}
                      </div>
                      <div className={`text-right font-medium ${
                        movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
                      }`}>
                        {movimento.tipo === "receita" ? "+" : "-"}{formatarMoeda(movimento.valor)}
                      </div>
                      <div className="flex justify-center">
                        {movimento.pago ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-green-600 hover:text-green-700"
                            onClick={() => handleStatusChange(movimento.id, false)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            <span className="hidden md:inline">Pago</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-amber-600 hover:text-amber-700"
                            onClick={() => handleStatusChange(movimento.id, true)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="hidden md:inline">Pendente</span>
                          </Button>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <ActionDropdownMenu actions={getActions(movimento)} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Nenhum movimento encontrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroList;
