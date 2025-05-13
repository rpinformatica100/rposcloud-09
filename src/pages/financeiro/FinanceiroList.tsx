
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { financeirosData, ordensData } from "@/data/dados";
import { MovimentoFinanceiro } from "@/types";
import { CreditCard, Plus, Search, Check, X, Calendar, DollarSign } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { gerarId } from "@/lib/utils";

const FinanceiroList = () => {
  const [movimentos, setMovimentos] = useState<MovimentoFinanceiro[]>(financeirosData);
  const [filtro, setFiltro] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [dialogAberto, setDialogAberto] = useState(false);
  const { toast } = useToast();
  
  // Estado para novo movimento financeiro
  const [novoMovimento, setNovoMovimento] = useState<MovimentoFinanceiro>({
    id: "",
    tipo: "receita",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    pago: true,
    dataPagamento: new Date().toISOString().split('T')[0],
    categoria: "Geral",
    metodoPagamento: "Dinheiro"
  });

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

  // Manipular formulário de novo movimento
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoMovimento(prev => ({ 
      ...prev, 
      [name]: name === "valor" ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNovoMovimento(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (value: "receita" | "despesa") => {
    setNovoMovimento(prev => ({ ...prev, tipo: value }));
  };

  const handlePagoChange = (checked: boolean) => {
    setNovoMovimento(prev => ({ 
      ...prev, 
      pago: checked,
      dataPagamento: checked ? new Date().toISOString().split('T')[0] : undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoMovimento.descricao) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha a descrição do movimento",
        variant: "destructive",
      });
      return;
    }

    if (novoMovimento.valor <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const movimentoCompleto: MovimentoFinanceiro = {
      ...novoMovimento,
      id: gerarId(),
    };
    
    // Adicionar ao array de movimentos
    setMovimentos(prev => [movimentoCompleto, ...prev]);
    
    toast({
      title: "Movimento registrado",
      description: "O movimento financeiro foi registrado com sucesso",
    });
    
    // Resetar formulário e fechar diálogo
    setNovoMovimento({
      id: "",
      tipo: "receita",
      descricao: "",
      valor: 0,
      data: new Date().toISOString().split('T')[0],
      pago: true,
      dataPagamento: new Date().toISOString().split('T')[0],
      categoria: "Geral",
      metodoPagamento: "Dinheiro"
    });
    setDialogAberto(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Movimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Movimento Financeiro</DialogTitle>
              <DialogDescription>
                Registre um novo movimento financeiro no sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Movimento</Label>
                  <RadioGroup 
                    value={novoMovimento.tipo} 
                    onValueChange={(value) => handleTipoChange(value as "receita" | "despesa")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="receita" id="receita" />
                      <Label htmlFor="receita" className="text-green-600">Receita</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="despesa" id="despesa" />
                      <Label htmlFor="despesa" className="text-red-600">Despesa</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input 
                    id="descricao" 
                    name="descricao" 
                    value={novoMovimento.descricao} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor *</Label>
                    <Input 
                      id="valor" 
                      name="valor" 
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={novoMovimento.valor || ""} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input 
                      id="data" 
                      name="data" 
                      type="date"
                      value={novoMovimento.data} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={novoMovimento.categoria} 
                    onValueChange={(value) => handleSelectChange("categoria", value)}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Produtos">Produtos</SelectItem>
                      <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                      <SelectItem value="Impostos">Impostos</SelectItem>
                      <SelectItem value="Funcionários">Funcionários</SelectItem>
                      <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pago">Status de Pagamento</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="pago" 
                        checked={novoMovimento.pago}
                        onCheckedChange={handlePagoChange}
                      />
                      <Label htmlFor="pago">
                        {novoMovimento.pago ? "Pago" : "Pendente"}
                      </Label>
                    </div>
                  </div>
                </div>
                
                {novoMovimento.pago && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataPagamento">Data de Pagamento</Label>
                      <Input 
                        id="dataPagamento" 
                        name="dataPagamento" 
                        type="date"
                        value={novoMovimento.dataPagamento} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                      <Select 
                        value={novoMovimento.metodoPagamento || ""} 
                        onValueChange={(value) => handleSelectChange("metodoPagamento", value)}
                      >
                        <SelectTrigger id="metodoPagamento">
                          <SelectValue placeholder="Selecione um método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogAberto(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                startContent={<Search className="h-4 w-4 text-muted-foreground" />}
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
                  <div className="grid grid-cols-1 md:grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                    <div className="md:col-span-2">Descrição</div>
                    <div className="hidden md:block">Data</div>
                    <div className="hidden md:block">Categoria</div>
                    <div className="text-right">Valor</div>
                    <div className="text-center">Status</div>
                  </div>

                  {movimentosFiltrados.map((movimento) => (
                    <div 
                      key={movimento.id} 
                      className="grid grid-cols-1 md:grid-cols-6 p-4 border-t items-center"
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
