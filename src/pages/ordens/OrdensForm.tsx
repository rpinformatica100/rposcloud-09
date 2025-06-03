import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ordensData, clientesData, produtosData } from "@/data/dados";
import { OrdemServico, Cliente, Produto, ItemOrdemServico } from "@/types";
import { gerarId, formatarMoeda } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useOrdemTempStorage } from "@/hooks/useOrdemTempStorage";
import { ChevronLeft, Save, Plus, Trash, Tag, Calendar, Clock, User, FileText, AlertTriangle, UserPlus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ClienteFormModal from "@/components/ordens/ClienteFormModal";

const OrdensForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveOrdemTemp, loadOrdemTemp, clearOrdemTemp, hasOrdemTemp } = useOrdemTempStorage();
  const isEdicao = !!id;
  
  const ordemVazia: OrdemServico = {
    id: "",
    numero: `OS-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
    clienteId: "",
    status: "aberta",
    dataAbertura: new Date().toISOString(),
    dataPrevisao: "",
    dataConclusao: "",
    descricao: "",
    responsavel: "",
    prioridade: "media",
    itens: [],
    valorTotal: 0,
    observacoes: "",
  };

  const [ordem, setOrdem] = useState<OrdemServico>(ordemVazia);
  const [clientes, setClientes] = useState<Cliente[]>(clientesData);
  const [produtos, setProdutos] = useState<Produto[]>(produtosData);
  const [activeTab, setActiveTab] = useState("informacoes");
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Estado para controlar novo item sendo adicionado
  const [novoItem, setNovoItem] = useState<{
    produtoId: string;
    quantidade: number;
    valorUnitario: number;
    observacao: string;
  }>({
    produtoId: "",
    quantidade: 1,
    valorUnitario: 0,
    observacao: "",
  });

  // Carregar rascunho ao iniciar (apenas para nova ordem)
  useEffect(() => {
    if (!isEdicao && hasOrdemTemp()) {
      const tempData = loadOrdemTemp();
      if (tempData) {
        setOrdem(prev => ({ ...prev, ...tempData.formData }));
        if (tempData.activeTab) {
          setActiveTab(tempData.activeTab);
        }
        toast({
          title: "Rascunho restaurado",
          description: "Seus dados foram restaurados automaticamente",
        });
      }
    }
  }, [isEdicao, hasOrdemTemp, loadOrdemTemp]);

  // Auto-save melhorado - apenas quando há dados significativos e menos frequente
  useEffect(() => {
    if (!isEdicao && autoSaveEnabled) {
      // Só salvar se houver dados significativos
      const hasSignificantData = ordem.clienteId || 
                                 ordem.descricao.length > 10 || 
                                 ordem.itens.length > 0 ||
                                 ordem.responsavel ||
                                 ordem.observacoes;
      
      if (hasSignificantData) {
        const timeoutId = setTimeout(() => {
          saveOrdemTemp(ordem, activeTab);
        }, 10000); // Aumentar para 10 segundos para reduzir salvamento frenético

        return () => clearTimeout(timeoutId);
      }
    }
  }, [ordem.clienteId, ordem.descricao, ordem.itens.length, ordem.responsavel, ordem.observacoes, activeTab, isEdicao, autoSaveEnabled, saveOrdemTemp]);

  useEffect(() => {
    if (isEdicao) {
      const ordemEncontrada = ordensData.find(o => o.id === id);
      if (ordemEncontrada) {
        // Enriquecer a ordem com itens completos
        const itensCompletos = ordemEncontrada.itens.map(item => {
          return {
            ...item,
            produto: produtosData.find(p => p.id === item.produtoId)
          };
        });
        
        setOrdem({
          ...ordemEncontrada,
          itens: itensCompletos
        });
      } else {
        navigate("/app/ordens");
        toast({
          title: "Ordem não encontrada",
          description: "A ordem de serviço solicitada não foi encontrada",
          variant: "destructive",
        });
      }
    }
  }, [id, isEdicao, navigate]);

  // Efeito para calcular valor total sempre que os itens mudarem
  useEffect(() => {
    if (ordem.itens.length > 0) {
      const total = ordem.itens.reduce((sum, item) => sum + item.valorTotal, 0);
      setOrdem(prev => ({ ...prev, valorTotal: total }));
    } else {
      setOrdem(prev => ({ ...prev, valorTotal: 0 }));
    }
  }, [ordem.itens]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrdem(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setOrdem(prev => ({ ...prev, [name]: value }));
    
    // Se selecionar produto no novo item, atualizar o preço unitário
    if (name === "produtoId" && novoItem) {
      const produto = produtos.find(p => p.id === value);
      if (produto) {
        setNovoItem(prev => ({
          ...prev,
          valorUnitario: produto.preco
        }));
      }
    }
  };

  const handleClienteAdicionado = (novoCliente: Cliente) => {
    // Atualizar lista local de clientes
    setClientes(prev => [...prev, novoCliente]);
    
    // Selecionar automaticamente o cliente recém-criado
    setOrdem(prev => ({ ...prev, clienteId: novoCliente.id }));
    
    toast({
      title: "Cliente adicionado e selecionado",
      description: `${novoCliente.nome} foi adicionado e selecionado para esta ordem`,
    });
  };

  const handleNovoItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoItem(prev => ({ 
      ...prev, 
      [name]: name === "quantidade" ? parseInt(value) || 1 : value 
    }));
    
    // Recalcular valor total se quantidade mudar
    if (name === "quantidade" && novoItem.produtoId) {
      const valorTotal = (parseInt(value) || 1) * novoItem.valorUnitario;
      setNovoItem(prev => ({
        ...prev,
        valorTotal
      }));
    }
  };

  const handleNovoItemSelectChange = (value: string) => {
    setNovoItem(prev => ({ ...prev, produtoId: value }));
    
    // Atualizar o preço com base no produto selecionado
    const produto = produtos.find(p => p.id === value);
    if (produto) {
      const valorUnitario = produto.preco;
      const valorTotal = novoItem.quantidade * valorUnitario;
      setNovoItem(prev => ({
        ...prev,
        valorUnitario,
        valorTotal
      }));
    }
  };

  const adicionarItem = () => {
    if (!novoItem.produtoId) {
      toast({
        title: "Erro ao adicionar item",
        description: "Selecione um produto ou serviço",
        variant: "destructive",
      });
      return;
    }

    if (novoItem.quantidade <= 0) {
      toast({
        title: "Erro ao adicionar item",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const produto = produtos.find(p => p.id === novoItem.produtoId);
    if (!produto) return;

    const valorTotal = novoItem.quantidade * novoItem.valorUnitario;
    
    const novoItemCompleto: ItemOrdemServico = {
      id: gerarId(),
      produtoId: novoItem.produtoId,
      produto,
      quantidade: novoItem.quantidade,
      valorUnitario: novoItem.valorUnitario,
      valorTotal,
      observacao: novoItem.observacao
    };

    setOrdem(prev => ({
      ...prev,
      itens: [...prev.itens, novoItemCompleto]
    }));

    // Limpar o formulário de novo item
    setNovoItem({
      produtoId: "",
      quantidade: 1,
      valorUnitario: 0,
      observacao: ""
    });

    toast({
      title: "Item adicionado",
      description: `${produto.nome} foi adicionado à ordem`,
    });
  };

  const removerItem = (itemId: string) => {
    setOrdem(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== itemId)
    }));

    toast({
      title: "Item removido",
      description: "Item removido da ordem",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ordem.clienteId) {
      toast({
        title: "Erro ao salvar",
        description: "Selecione um cliente",
        variant: "destructive",
      });
      return;
    }

    if (ordem.itens.length === 0) {
      toast({
        title: "Erro ao salvar",
        description: "Adicione pelo menos um item à ordem",
        variant: "destructive",
      });
      return;
    }
    
    // Em uma aplicação real, aqui enviaria dados para API
    
    if (!isEdicao) {
      // Adicionar nova ordem
      const novaOrdem = {
        ...ordem,
        id: gerarId(),
      };
      
      ordensData.push(novaOrdem);
      
      // Limpar rascunho após salvar
      clearOrdemTemp();
      
      toast({
        title: "Ordem criada",
        description: "A ordem de serviço foi criada com sucesso",
      });
    } else {
      // Atualizar ordem existente
      const index = ordensData.findIndex(o => o.id === id);
      if (index !== -1) {
        ordensData[index] = {
          ...ordem,
          itens: ordem.itens.map(item => ({
            id: item.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal,
            observacao: item.observacao
          }))
        };
      }
      
      toast({
        title: "Ordem atualizada",
        description: "A ordem de serviço foi atualizada",
      });
    }
    
    navigate("/app/ordens");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/app/ordens")}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdicao ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
          </h1>
        </div>
        {!isEdicao && hasOrdemTemp() && (
          <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md">
            💾 Rascunho salvo automaticamente
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs 
          defaultValue="informacoes" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="itens">Produtos e Serviços</TabsTrigger>
            <TabsTrigger value="revisao">Resumo</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 border-t-0 rounded-tl-none">
            <CardContent className="pt-6">
              {/* Informações básicas */}
              <TabsContent value="informacoes" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Número da OS
                      </Label>
                      <Input 
                        id="numero" 
                        name="numero" 
                        value={ordem.numero} 
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clienteId" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Cliente <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select 
                          value={ordem.clienteId} 
                          onValueChange={(value) => handleSelectChange("clienteId", value)}
                        >
                          <SelectTrigger id="clienteId">
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientes.filter(c => c.tipo === "cliente").map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setShowClienteModal(true)}
                          title="Adicionar novo cliente"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                        Status
                      </Label>
                      <Select 
                        value={ordem.status} 
                        onValueChange={(value) => handleSelectChange("status", value as any)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberta">Aberta</SelectItem>
                          <SelectItem value="andamento">Em andamento</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prioridade" className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                        Prioridade
                      </Label>
                      <Select 
                        value={ordem.prioridade} 
                        onValueChange={(value) => handleSelectChange("prioridade", value as any)}
                      >
                        <SelectTrigger id="prioridade">
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavel" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Responsável
                      </Label>
                      <Input 
                        id="responsavel" 
                        name="responsavel" 
                        value={ordem.responsavel} 
                        onChange={handleInputChange}
                        placeholder="Nome do responsável técnico"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataPrevisao" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        Previsão de Entrega
                      </Label>
                      <Input 
                        id="dataPrevisao" 
                        name="dataPrevisao" 
                        type="date"
                        value={ordem.dataPrevisao ? ordem.dataPrevisao.split('T')[0] : ''} 
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Descrição do Problema <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Textarea 
                        id="descricao" 
                        name="descricao" 
                        value={ordem.descricao} 
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Descreva o problema relatado pelo cliente"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="observacoes" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Observações
                      </Label>
                      <Textarea 
                        id="observacoes" 
                        name="observacoes" 
                        value={ordem.observacoes || ""} 
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Observações adicionais (opcional)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/app/ordens")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setActiveTab("itens")}
                    >
                      Ir para Produtos e Serviços
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {isEdicao ? "Salvar Alterações" : "Salvar Ordem"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Produtos e Serviços */}
              <TabsContent value="itens" className="mt-0">
                <div className="space-y-6">
                  {/* Formulário para adicionar item */}
                  <div className="border rounded-md p-4 bg-muted/30">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto ou Serviço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="produtoId">Item</Label>
                        <Select 
                          value={novoItem.produtoId} 
                          onValueChange={handleNovoItemSelectChange}
                        >
                          <SelectTrigger id="produtoId">
                            <SelectValue placeholder="Selecione um produto/serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header-1" disabled>Selecione um item</SelectItem>
                            <SelectItem value="header-2" disabled>-- Produtos --</SelectItem>
                            {produtos.filter(p => p.ativo && p.tipo === "produto").map((produto) => (
                              <SelectItem key={produto.id} value={produto.id}>
                                {produto.nome}
                              </SelectItem>
                            ))}
                            <SelectItem value="header-3" disabled>-- Serviços --</SelectItem>
                            {produtos.filter(p => p.ativo && p.tipo === "servico").map((produto) => (
                              <SelectItem key={produto.id} value={produto.id}>
                                {produto.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantidade">Quantidade</Label>
                        <Input 
                          id="quantidade" 
                          name="quantidade" 
                          type="number"
                          min="1"
                          value={novoItem.quantidade} 
                          onChange={handleNovoItemChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="valorUnitario">Valor Unitário</Label>
                        <Input 
                          id="valorUnitario" 
                          name="valorUnitario"
                          type="number"
                          step="0.01"
                          min="0"
                          value={novoItem.valorUnitario}
                          onChange={handleNovoItemChange}
                          startContent="R$"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="observacao">Observação do Item</Label>
                        <Input 
                          id="observacao" 
                          name="observacao"
                          value={novoItem.observacao}
                          onChange={handleNovoItemChange}
                          placeholder="Observações sobre este item (opcional)"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Button 
                          type="button"
                          className="w-full"
                          onClick={adicionarItem}
                          disabled={!novoItem.produtoId}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Item
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lista de itens adicionados */}
                  <div>
                    <h3 className="font-medium mb-3">Itens Adicionados</h3>
                    {ordem.itens.length > 0 ? (
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 p-3 bg-muted/50 font-medium text-sm">
                            <div className="col-span-5">Item</div>
                            <div className="col-span-2 text-center">Qtd</div>
                            <div className="col-span-2 text-right">Valor Un.</div>
                            <div className="col-span-2 text-right">Total</div>
                            <div className="col-span-1"></div>
                          </div>

                          {ordem.itens.map((item) => (
                            <div 
                              key={item.id} 
                              className="grid grid-cols-12 p-3 border-t items-center"
                            >
                              <div className="col-span-5">
                                <div className="font-medium">{item.produto?.nome}</div>
                                {item.observacao && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {item.observacao}
                                  </div>
                                )}
                              </div>
                              <div className="col-span-2 text-center">
                                {item.quantidade}
                              </div>
                              <div className="col-span-2 text-right">
                                {formatarMoeda(item.valorUnitario)}
                              </div>
                              <div className="col-span-2 text-right font-medium">
                                {formatarMoeda(item.valorTotal)}
                              </div>
                              <div className="col-span-1 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() => removerItem(item.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <div className="grid grid-cols-12 p-3 border-t bg-muted/30 font-medium">
                            <div className="col-span-9 text-right">
                              Valor Total:
                            </div>
                            <div className="col-span-2 text-right text-lg">
                              {formatarMoeda(ordem.valorTotal)}
                            </div>
                            <div className="col-span-1"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">
                          Nenhum item adicionado ainda. Adicione pelo menos um item.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <div>
                      <Button type="button" variant="outline" onClick={() => setActiveTab("informacoes")}>
                        Voltar para Informações
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        type="button"
                        onClick={() => setActiveTab("revisao")}
                      >
                        Ir para Revisão
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {isEdicao ? "Salvar Alterações" : "Salvar Ordem"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Revisão */}
              <TabsContent value="revisao" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Informações Gerais</h3>
                      <div className="rounded-md border p-4 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Número da OS</p>
                          <p className="font-medium">{ordem.numero}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Cliente</p>
                          <p className="font-medium">
                            {clientes.find(c => c.id === ordem.clienteId)?.nome}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium capitalize">{ordem.status}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Prioridade</p>
                          <p className="font-medium capitalize">{ordem.prioridade}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Responsável</p>
                          <p className="font-medium">{ordem.responsavel || "Não definido"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Previsão de Entrega</p>
                          <p className="font-medium">
                            {ordem.dataPrevisao 
                              ? new Date(ordem.dataPrevisao).toLocaleDateString() 
                              : "Não definida"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Descrição do Problema</h3>
                      <div className="rounded-md border p-4">
                        <p>{ordem.descricao || "Nenhuma descrição fornecida"}</p>
                      </div>
                      
                      {ordem.observacoes && (
                        <>
                          <h3 className="font-medium text-lg">Observações</h3>
                          <div className="rounded-md border p-4">
                            <p>{ordem.observacoes}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Itens da Ordem de Serviço</h3>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-3 bg-muted/50 font-medium text-sm">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-2 text-center">Qtd</div>
                        <div className="col-span-2 text-right">Valor Un.</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>

                      {ordem.itens.map((item) => (
                        <div 
                          key={item.id} 
                          className="grid grid-cols-12 p-3 border-t items-center"
                        >
                          <div className="col-span-6">
                            <div className="font-medium">{item.produto?.nome}</div>
                            {item.observacao && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.observacao}
                              </div>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            {item.quantidade}
                          </div>
                          <div className="col-span-2 text-right">
                            {formatarMoeda(item.valorUnitario)}
                          </div>
                          <div className="col-span-2 text-right font-medium">
                            {formatarMoeda(item.valorTotal)}
                          </div>
                        </div>
                      ))}
                      
                      <div className="grid grid-cols-12 p-3 border-t bg-muted/30 font-medium">
                        <div className="col-span-10 text-right">
                          Valor Total:
                        </div>
                        <div className="col-span-2 text-right text-lg">
                          {formatarMoeda(ordem.valorTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <div>
                      <Button type="button" variant="outline" onClick={() => setActiveTab("itens")}>
                        Voltar para Itens
                      </Button>
                    </div>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {isEdicao ? "Atualizar Ordem" : "Finalizar Ordem"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </form>

      {/* Modal para adicionar cliente */}
      <ClienteFormModal 
        open={showClienteModal}
        onOpenChange={setShowClienteModal}
        onClienteAdicionado={handleClienteAdicionado}
      />
    </div>
  );
};

export default OrdensForm;
