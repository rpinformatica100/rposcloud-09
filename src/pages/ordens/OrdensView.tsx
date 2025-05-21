
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Edit, AlertTriangle, Loader2, Check, DollarSign } from "lucide-react";
import PrintOrderButton from "@/components/ordens/PrintOrderButton";
import FinalizarOrdemModal from "@/components/ordens/FinalizarOrdemModal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ordensData, clientesData } from "@/data/dados"; // Import mock data
import { OrdemServico } from "@/types";

const OrdensView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);

  // First try to fetch from Supabase, fallback to mock data if that fails
  const fetchOrdem = async () => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('ordens')
        .select(`
          *,
          cliente:cliente_id (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.log("Supabase error:", error);
        throw error;
      }
      
      if (data) return data;
      
      // If no data from Supabase, fall back to mock data
      throw new Error("No data from Supabase");
    } catch (error) {
      console.log("Falling back to mock data");
      // Fall back to mock data
      const mockOrdem = ordensData.find(o => o.id === id);
      if (!mockOrdem) throw new Error("Ordem não encontrada");
      
      const mockCliente = clientesData.find(c => c.id === mockOrdem.clienteId);
      
      // Convert to the format expected by the component
      return {
        id: mockOrdem.id,
        numero: mockOrdem.numero,
        cliente_id: mockOrdem.clienteId,
        data_abertura: mockOrdem.dataAbertura,
        data_previsao: mockOrdem.dataPrevisao,
        data_conclusao: mockOrdem.dataConclusao,
        status: mockOrdem.status,
        prioridade: mockOrdem.prioridade,
        descricao: mockOrdem.descricao,
        observacoes: mockOrdem.observacoes,
        valor_total: mockOrdem.valorTotal,
        responsavel: mockOrdem.responsavel,
        solucao: mockOrdem.solucao,
        forma_pagamento: mockOrdem.formaPagamento,
        integrado_financeiro: mockOrdem.integradoFinanceiro,
        movimento_financeiro_id: mockOrdem.movimentoFinanceiroId,
        cliente: mockCliente
      };
    }
  };

  const fetchItens = async () => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('ordem_itens')
        .select(`
          *,
          produto:produto_id (
            nome,
            tipo
          )
        `)
        .eq('ordem_id', id);

      if (error) {
        console.log("Supabase error:", error);
        throw error;
      }
      
      if (data && data.length > 0) return data;
      
      // If no data from Supabase, fall back to mock data
      throw new Error("No items from Supabase");
    } catch (error) {
      console.log("Falling back to mock data for items");
      // Fall back to mock items data
      const mockOrdem = ordensData.find(o => o.id === id);
      if (!mockOrdem || !mockOrdem.itens) return [];
      
      // Convert to the format expected by the component
      return mockOrdem.itens.map(item => ({
        id: item.id,
        ordem_id: mockOrdem.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        valor_unitario: item.valorUnitario,
        valor_total: item.valorTotal,
        observacao: item.observacao,
        produto: {
          nome: `Produto/Serviço ${item.id}`, // Placeholder name
          tipo: "produto" // Default type
        }
      }));
    }
  };

  // Consulta para buscar dados da ordem
  const { 
    data: ordem, 
    isLoading: isLoadingOrdem,
    error: ordemError,
    refetch: refetchOrdem
  } = useQuery({
    queryKey: ['ordem', id],
    queryFn: fetchOrdem,
    retry: 1, // Limit retries to avoid excessive error logs
    enabled: !!id
  });

  // Consulta para buscar itens da ordem
  const {
    data: itens = [],
    isLoading: isLoadingItens,
    error: itensError
  } = useQuery({
    queryKey: ['ordem-itens', id],
    queryFn: fetchItens,
    retry: 1, // Limit retries to avoid excessive error logs
    enabled: !!id && !ordemError // Only run if ordem fetch succeeds
  });

  if (isLoadingOrdem || isLoadingItens) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados da ordem...</span>
      </div>
    );
  }

  if (ordemError || !ordem) {
    console.error("Error loading order:", ordemError);
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar ordem</h2>
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar os dados da ordem de serviço.
        </p>
        <Button onClick={() => navigate("/ordens")}>Voltar para lista</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Aberta</Badge>;
      case 'andamento':
      case 'em_andamento':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Em andamento</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluída</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Baixa</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Média</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Alta</Badge>;
      default:
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  const handleFinalizarOrdem = (ordemAtualizada: OrdemServico) => {
    // Atualizar os dados da ordem nos dados mockados
    const index = ordensData.findIndex(o => o.id === id);
    if (index !== -1) {
      ordensData[index] = {
        ...ordensData[index],
        status: ordemAtualizada.status,
        dataConclusao: ordemAtualizada.dataConclusao,
        solucao: ordemAtualizada.solucao,
        formaPagamento: ordemAtualizada.formaPagamento,
        integradoFinanceiro: ordemAtualizada.integradoFinanceiro,
        movimentoFinanceiroId: ordemAtualizada.movimentoFinanceiroId
      };
    }
    
    // Recarregar dados
    refetchOrdem();
  };

  // Map the database format to our OrdemServico type for the FinalizarOrdemModal
  const mapToOrdemServico = (): OrdemServico => {
    return {
      id: ordem.id,
      numero: ordem.numero,
      clienteId: ordem.cliente_id,
      status: ordem.status as 'aberta' | 'andamento' | 'concluida' | 'cancelada',
      dataAbertura: ordem.data_abertura,
      dataPrevisao: ordem.data_previsao,
      dataConclusao: ordem.data_conclusao,
      descricao: ordem.descricao,
      responsavel: ordem.responsavel,
      prioridade: ordem.prioridade as 'baixa' | 'media' | 'alta' | 'urgente',
      itens: [],
      valorTotal: ordem.valor_total || 0,
      observacoes: ordem.observacoes,
      solucao: ordem.solucao,
      formaPagamento: ordem.forma_pagamento,
      integradoFinanceiro: ordem.integrado_financeiro,
      movimentoFinanceiroId: ordem.movimento_financeiro_id,
      cliente: ordem.cliente
    };
  };

  const ordemFormatada = mapToOrdemServico();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/ordens")} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <PrintOrderButton ordem={ordemFormatada} itens={itens} cliente={ordem.cliente} />
          
          <Button onClick={() => navigate(`/ordens/editar/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          {ordem && ordem.status !== 'concluida' && ordem.status !== 'cancelada' && (
            <Button 
              onClick={() => setFinalizarModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Finalizar OS
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cabeçalho da OS */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    Ordem de Serviço #{ordem.numero}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {formatDate(ordem.data_abertura || '')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    Status: {getStatusBadge(ordem.status)}
                  </div>
                  <div>
                    Prioridade: {getPrioridadeBadge(ordem.prioridade)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Descrição</h3>
                  <p className="text-muted-foreground mt-1">
                    {ordem.descricao || "Sem descrição"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Data de Abertura:</span>{" "}
                    {formatDate(ordem.data_abertura || '')}
                  </div>
                  {ordem.data_previsao && (
                    <div>
                      <span className="font-medium">Previsão de Conclusão:</span>{" "}
                      {formatDate(ordem.data_previsao)}
                    </div>
                  )}
                  {ordem.data_conclusao && (
                    <div>
                      <span className="font-medium">Data de Conclusão:</span>{" "}
                      {formatDate(ordem.data_conclusao)}
                    </div>
                  )}
                  {ordem.responsavel && (
                    <div>
                      <span className="font-medium">Responsável:</span>{" "}
                      {ordem.responsavel}
                    </div>
                  )}
                </div>

                {ordem.observacoes && (
                  <div>
                    <h3 className="font-medium">Observações</h3>
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">
                      {ordem.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Itens da OS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Itens</CardTitle>
            </CardHeader>
            <CardContent>
              {itens.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum item adicionado a esta ordem de serviço
                </p>
              ) : (
                <div className="space-y-4">
                  {itens.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {item.produto?.nome || "Produto não encontrado"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.produto?.tipo === "produto" ? "Produto" : "Serviço"}
                          </p>
                          {item.observacao && (
                            <p className="text-sm mt-1">{item.observacao}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.valor_total)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantidade} x {formatCurrency(item.valor_unitario)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4 border-t">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(ordem.valor_total || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Dados do cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {ordem.cliente ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{ordem.cliente.nome}</h3>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    {ordem.cliente.documento && (
                      <div>
                        <span className="font-medium">
                          Documento:
                        </span>{" "}
                        {ordem.cliente.documento}
                      </div>
                    )}
                    {ordem.cliente.email && (
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {ordem.cliente.email}
                      </div>
                    )}
                    {ordem.cliente.telefone && (
                      <div>
                        <span className="font-medium">Telefone:</span>{" "}
                        {ordem.cliente.telefone}
                      </div>
                    )}
                  </div>

                  {(ordem.cliente.endereco ||
                    ordem.cliente.cidade ||
                    ordem.cliente.estado) && (
                    <>
                      <Separator />
                      <div className="space-y-1 text-sm">
                        {ordem.cliente.endereco && (
                          <div>{ordem.cliente.endereco}</div>
                        )}
                        <div>
                          {[
                            ordem.cliente.cidade,
                            ordem.cliente.estado,
                            ordem.cliente.cep,
                          ]
                            .filter(Boolean)
                            .join(" - ")}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/clientes/editar/${ordem.cliente.id}`)}
                    >
                      Ver detalhes do cliente
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum cliente vinculado
                </p>
              )}
            </CardContent>
          </Card>

          {/* Ações rápidas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate(`/ordens/editar/${id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Ordem de Serviço
                </Button>
                <PrintOrderButton ordem={ordemFormatada} itens={itens} cliente={ordem.cliente} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Adicionar seção de solução quando a ordem estiver concluída */}
      {ordem && ordem.status === 'concluida' && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Detalhes da Finalização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Solução Aplicada</h3>
                <p className="text-muted-foreground mt-1 whitespace-pre-line">
                  {ordem.solucao || "Não informada"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="font-medium">Data de Conclusão:</span>{" "}
                  {formatDate(ordem.data_conclusao || '')}
                </div>
                {ordem.forma_pagamento && (
                  <div>
                    <span className="font-medium">Forma de Pagamento:</span>{" "}
                    {ordem.forma_pagamento.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                )}
              </div>
              
              {ordem.integrado_financeiro && (
                <div className="flex items-center text-green-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Pagamento registrado no módulo financeiro</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de finalização */}
      {ordem && (
        <FinalizarOrdemModal 
          ordem={ordemFormatada} 
          isOpen={finalizarModalOpen} 
          onClose={() => setFinalizarModalOpen(false)}
          onSave={handleFinalizarOrdem}
        />
      )}
    </div>
  );
};

export default OrdensView;

