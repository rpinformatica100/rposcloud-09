import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  FileText, 
  Download, 
  DollarSign, 
  CreditCard 
} from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { clientesData, ordensData, financeirosData, produtosData } from "@/data/dados";
import { OrdemServico, Cliente, MovimentoFinanceiro } from "@/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Bar,
  BarChart
} from "recharts";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const CORES = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

interface CategoriaFinanceira {
  receitas: number;
  despesas: number;
}

interface EvolucaoFinanceira {
  receitas: number;
  despesas: number;
  saldo: number;
}

const RelatoriosPage = () => {
  const [activeTab, setActiveTab] = useState("ordens");
  const [tipoRelatorioOrdens, setTipoRelatorioOrdens] = useState("status");
  const [tipoRelatorioFinanceiro, setTipoRelatorioFinanceiro] = useState("categorias");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPeriodoFinanceiro, setFiltroPeriodoFinanceiro] = useState("mes");
  const [filtroTipoFinanceiro, setFiltroTipoFinanceiro] = useState("todos");
  const [busca, setBusca] = useState("");

  // Filtrar ordens por período
  const filtrarOrdensPorPeriodo = (ordens: OrdemServico[]) => {
    if (!dateRange?.from) return ordens;
    
    return ordens.filter(ordem => {
      const dataOrdem = new Date(ordem.dataAbertura);
      const from = dateRange.from as Date;
      const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : from;
      
      return dataOrdem >= from && dataOrdem <= to;
    });
  };

  // Filtrar por status
  const filtrarOrdensPorStatus = (ordens: OrdemServico[]) => {
    if (filtroStatus === "todos") return ordens;
    return ordens.filter(ordem => ordem.status === filtroStatus);
  };

  // Filtrar por busca
  const filtrarOrdensPorBusca = (ordens: OrdemServico[]) => {
    if (!busca.trim()) return ordens;
    
    const termoBusca = busca.toLowerCase();
    return ordens.filter(ordem => {
      const cliente = clientesData.find(c => c.id === ordem.clienteId);
      return (
        ordem.numero.toLowerCase().includes(termoBusca) ||
        ordem.descricao.toLowerCase().includes(termoBusca) ||
        ordem.responsavel.toLowerCase().includes(termoBusca) ||
        (cliente && cliente.nome.toLowerCase().includes(termoBusca))
      );
    });
  };

  // Aplicar todos os filtros de ordens
  const ordensFiltered = filtrarOrdensPorBusca(
    filtrarOrdensPorStatus(
      filtrarOrdensPorPeriodo(ordensData)
    )
  );

  // Dados para gráficos de ordens
  const dadosGraficosOrdens = {
    status: [
      { name: "Abertas", value: ordensFiltered.filter(o => o.status === "aberta").length },
      { name: "Em Andamento", value: ordensFiltered.filter(o => o.status === "andamento").length },
      { name: "Concluídas", value: ordensFiltered.filter(o => o.status === "concluida").length },
      { name: "Canceladas", value: ordensFiltered.filter(o => o.status === "cancelada").length }
    ],
    prioridade: [
      { name: "Baixa", value: ordensFiltered.filter(o => o.prioridade === "baixa").length },
      { name: "Média", value: ordensFiltered.filter(o => o.prioridade === "media").length },
      { name: "Alta", value: ordensFiltered.filter(o => o.prioridade === "alta").length },
      { name: "Urgente", value: ordensFiltered.filter(o => o.prioridade === "urgente").length }
    ],
    faturamento: (() => {
      // Agrupar por mês
      const agrupado = ordensFiltered
        .filter(o => o.status === "concluida")
        .reduce((acc, ordem) => {
          const mes = new Date(ordem.dataAbertura).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
          if (!acc[mes]) acc[mes] = 0;
          acc[mes] += ordem.valorTotal;
          return acc;
        }, {});
        
      // Converter para array
      return Object.entries(agrupado).map(([name, value]) => ({ name, value }));
    })()
  };

  // Filtrar movimentos financeiros
  const filtrarFinanceiro = () => {
    let movimentos = [...financeirosData];
    
    // Filtrar por tipo
    if (filtroTipoFinanceiro !== "todos") {
      movimentos = movimentos.filter(m => m.tipo === filtroTipoFinanceiro);
    }
    
    // Filtrar por período
    const hoje = new Date();
    if (filtroPeriodoFinanceiro === "mes") {
      movimentos = movimentos.filter(m => {
        const data = new Date(m.data);
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
      });
    } else if (filtroPeriodoFinanceiro === "trimestre") {
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(hoje.getMonth() - 3);
      movimentos = movimentos.filter(m => new Date(m.data) >= tresMesesAtras);
    } else if (filtroPeriodoFinanceiro === "ano") {
      movimentos = movimentos.filter(m => {
        const data = new Date(m.data);
        return data.getFullYear() === hoje.getFullYear();
      });
    }
    
    // Filtrar por busca
    if (busca.trim()) {
      const termoBusca = busca.toLowerCase();
      movimentos = movimentos.filter(m => {
        return (
          m.descricao.toLowerCase().includes(termoBusca) ||
          m.categoria.toLowerCase().includes(termoBusca) ||
          (m.metodoPagamento && m.metodoPagamento.toLowerCase().includes(termoBusca))
        );
      });
    }
    
    return movimentos;
  };
  
  const movimentosFiltered = filtrarFinanceiro();
  
  // Dados para gráficos financeiros
  const dadosGraficosFinanceiro = {
    categorias: (() => {
      const agrupado = movimentosFiltered.reduce((acc: Record<string, CategoriaFinanceira>, mov) => {
        if (!acc[mov.categoria]) {
          acc[mov.categoria] = { receitas: 0, despesas: 0 };
        }
        if (mov.tipo === "receita") {
          acc[mov.categoria].receitas += mov.valor;
        } else {
          acc[mov.categoria].despesas += mov.valor;
        }
        return acc;
      }, {});
      
      return Object.entries(agrupado).map(([name, { receitas, despesas }]) => ({
        name,
        receitas,
        despesas
      }));
    })(),
    
    evolucao: (() => {
      // Agrupar por mês
      const agrupado = movimentosFiltered.reduce((acc: Record<string, EvolucaoFinanceira>, mov) => {
        const mes = new Date(mov.data).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
        if (!acc[mes]) {
          acc[mes] = { receitas: 0, despesas: 0, saldo: 0 };
        }
        if (mov.tipo === "receita") {
          acc[mes].receitas += mov.valor;
        } else {
          acc[mes].despesas += mov.valor;
        }
        acc[mes].saldo = acc[mes].receitas - acc[mes].despesas;
        return acc;
      }, {});
      
      // Ordenar e converter para array
      return Object.entries(agrupado)
        .sort((a, b) => {
          const dataA = new Date(a[0].split(' ')[0] + ' ' + a[0].split(' ')[1]);
          const dataB = new Date(b[0].split(' ')[0] + ' ' + b[0].split(' ')[1]);
          return dataA.getTime() - dataB.getTime();
        })
        .map(([name, { receitas, despesas, saldo }]) => ({
          name,
          receitas,
          despesas,
          saldo
        }));
    })()
  };

  // Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Aberta</Badge>;
      case 'andamento':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Em andamento</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluída</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Exportar para CSV
  const exportarCSV = (dados: any[], nomeArquivo: string) => {
    // Converter objeto para CSV
    const headers = Object.keys(dados[0] || {}).join(',');
    const rows = dados.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    // Criar blob e link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Exportar dados de ordens para CSV
  const exportarOrdensCSV = () => {
    const dados = ordensFiltered.map(ordem => {
      const cliente = clientesData.find(c => c.id === ordem.clienteId);
      return {
        numero: ordem.numero,
        cliente: cliente?.nome || '',
        status: ordem.status,
        prioridade: ordem.prioridade,
        dataAbertura: ordem.dataAbertura,
        dataConclusao: ordem.dataConclusao || '',
        valorTotal: ordem.valorTotal,
        responsavel: ordem.responsavel
      };
    });
    
    exportarCSV(dados, 'relatorio-ordens');
  };
  
  // Exportar dados financeiros para CSV
  const exportarFinanceiroCSV = () => {
    const dados = movimentosFiltered.map(mov => ({
      data: mov.data,
      tipo: mov.tipo,
      descricao: mov.descricao,
      categoria: mov.categoria,
      valor: mov.valor,
      pago: mov.pago ? 'Sim' : 'Não',
      metodoPagamento: mov.metodoPagamento || ''
    }));
    
    exportarCSV(dados, 'relatorio-financeiro');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangePicker 
            value={dateRange}
            onChange={setDateRange}
          />
          
          <Input 
            placeholder="Buscar..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:w-[250px]"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="ordens">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        {/* Relatório de Ordens */}
        <TabsContent value="ordens" className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="filtroStatus">Status:</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger id="filtroStatus" className="w-[160px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aberta">Abertas</SelectItem>
                  <SelectItem value="andamento">Em andamento</SelectItem>
                  <SelectItem value="concluida">Concluídas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="tipoRelatorioOrdens">Visualização:</Label>
              <Select value={tipoRelatorioOrdens} onValueChange={setTipoRelatorioOrdens}>
                <SelectTrigger id="tipoRelatorioOrdens" className="w-[200px]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Por Status</SelectItem>
                  <SelectItem value="prioridade">Por Prioridade</SelectItem>
                  <SelectItem value="faturamento">Faturamento por Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={exportarOrdensCSV} variant="outline" size="sm" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {tipoRelatorioOrdens === "status" && "Ordens por Status"}
                  {tipoRelatorioOrdens === "prioridade" && "Ordens por Prioridade"}
                  {tipoRelatorioOrdens === "faturamento" && "Faturamento por Período"}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {tipoRelatorioOrdens === "faturamento" ? (
                    <BarChart
                      data={dadosGraficosOrdens.faturamento}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis 
                        tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} 
                      />
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, "Valor"]} 
                      />
                      <Bar dataKey="value" fill="#3b82f6" name="Faturamento" />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={tipoRelatorioOrdens === "status" ? dadosGraficosOrdens.status : dadosGraficosOrdens.prioridade}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(tipoRelatorioOrdens === "status" ? dadosGraficosOrdens.status : dadosGraficosOrdens.prioridade).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [value, "Quantidade"]} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Ordens</p>
                    <p className="text-2xl font-bold">{ordensFiltered.length}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Concluídas</p>
                      <p className="text-xl font-semibold text-green-600">
                        {ordensFiltered.filter(o => o.status === "concluida").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Em Andamento</p>
                      <p className="text-xl font-semibold text-yellow-600">
                        {ordensFiltered.filter(o => o.status === "andamento").length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Abertas</p>
                      <p className="text-xl font-semibold text-blue-600">
                        {ordensFiltered.filter(o => o.status === "aberta").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Canceladas</p>
                      <p className="text-xl font-semibold text-red-600">
                        {ordensFiltered.filter(o => o.status === "cancelada").length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Faturamento Total</p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatarMoeda(
                        ordensFiltered
                          .filter(o => o.status === "concluida")
                          .reduce((acc, ordem) => acc + ordem.valorTotal, 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Listagem de Ordens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordensFiltered.length > 0 ? (
                      ordensFiltered.map((ordem) => {
                        const cliente = clientesData.find(c => c.id === ordem.clienteId);
                        return (
                          <TableRow key={ordem.id}>
                            <TableCell className="font-medium">{ordem.numero}</TableCell>
                            <TableCell>{cliente?.nome || 'Cliente não encontrado'}</TableCell>
                            <TableCell>{formatDate(ordem.dataAbertura)}</TableCell>
                            <TableCell>{getStatusBadge(ordem.status)}</TableCell>
                            <TableCell>{ordem.responsavel}</TableCell>
                            <TableCell className="text-right">{formatarMoeda(ordem.valorTotal)}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma ordem encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Relatório Financeiro */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="filtroTipoFinanceiro">Tipo:</Label>
              <Select value={filtroTipoFinanceiro} onValueChange={setFiltroTipoFinanceiro}>
                <SelectTrigger id="filtroTipoFinanceiro" className="w-[160px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="filtroPeriodoFinanceiro">Período:</Label>
              <Select value={filtroPeriodoFinanceiro} onValueChange={setFiltroPeriodoFinanceiro}>
                <SelectTrigger id="filtroPeriodoFinanceiro" className="w-[160px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Este ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="tipoRelatorioFinanceiro">Visualização:</Label>
              <Select value={tipoRelatorioFinanceiro} onValueChange={setTipoRelatorioFinanceiro}>
                <SelectTrigger id="tipoRelatorioFinanceiro" className="w-[200px]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categorias">Por Categorias</SelectItem>
                  <SelectItem value="evolucao">Evolução no Tempo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={exportarFinanceiroCSV} variant="outline" size="sm" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {tipoRelatorioFinanceiro === "categorias" ? "Financeiro por Categorias" : "Evolução Financeira"}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {tipoRelatorioFinanceiro === "categorias" ? (
                    <BarChart
                      data={dadosGraficosFinanceiro.categorias}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, ""]} />
                      <Legend />
                      <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                      <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                    </BarChart>
                  ) : (
                    <LineChart
                      data={dadosGraficosFinanceiro.evolucao}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="receitas" stroke="#10b981" name="Receitas" />
                      <Line type="monotone" dataKey="despesas" stroke="#ef4444" name="Despesas" />
                      <Line type="monotone" dataKey="saldo" stroke="#3b82f6" name="Saldo" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Receitas</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatarMoeda(
                          movimentosFiltered
                            .filter(m => m.tipo === "receita")
                            .reduce((acc, mov) => acc + mov.valor, 0)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Despesas</p>
                      <p className="text-xl font-semibold text-red-600">
                        {formatarMoeda(
                          movimentosFiltered
                            .filter(m => m.tipo === "despesa")
                            .reduce((acc, mov) => acc + mov.valor, 0)
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className={`text-2xl font-bold ${
                      movimentosFiltered.filter(m => m.tipo === "receita").reduce((acc, mov) => acc + mov.valor, 0) -
                      movimentosFiltered.filter(m => m.tipo === "despesa").reduce((acc, mov) => acc + mov.valor, 0) >= 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}>
                      {formatarMoeda(
                        movimentosFiltered.filter(m => m.tipo === "receita").reduce((acc, mov) => acc + mov.valor, 0) -
                        movimentosFiltered.filter(m => m.tipo === "despesa").reduce((acc, mov) => acc + mov.valor, 0)
                      )}
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Pendentes de Pagamento</p>
                    <p className="text-xl font-semibold text-yellow-600">
                      {formatarMoeda(
                        movimentosFiltered
                          .filter(m => !m.pago)
                          .reduce((acc, mov) => acc + mov.valor, 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Movimentos Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentosFiltered.length > 0 ? (
                      movimentosFiltered.map((movimento) => (
                        <TableRow key={movimento.id}>
                          <TableCell>{formatDate(movimento.data)}</TableCell>
                          <TableCell>{movimento.descricao}</TableCell>
                          <TableCell>{movimento.categoria}</TableCell>
                          <TableCell>
                            {movimento.pago ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Pago
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${
                            movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
                          }`}>
                            {movimento.tipo === "receita" ? "+" : "-"}{formatarMoeda(movimento.valor)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Nenhum movimento encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
