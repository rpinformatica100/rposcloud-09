
import { supabase } from './client';
import type { Database } from './types';
import { Assistencia, OrdemServico, ClienteDB, Cliente, ItemOrdemServico } from '@/types';

// Type helpers for Supabase tables
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type TablesRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// Table-specific types
export type ClienteRow = TablesRow<'clientes'>;
export type ClienteInsert = TablesInsert<'clientes'>;
export type ClienteUpdate = TablesUpdate<'clientes'>;

export type ProdutoRow = TablesRow<'produtos'>;
export type ProdutoInsert = TablesInsert<'produtos'>;
export type ProdutoUpdate = TablesUpdate<'produtos'>;

export type OrdemRow = TablesRow<'ordens'>;
export type OrdemInsert = TablesInsert<'ordens'>;
export type OrdemUpdate = TablesUpdate<'ordens'>;

export type OrdemItemRow = TablesRow<'ordem_itens'>;
export type OrdemItemInsert = TablesInsert<'ordem_itens'>;
export type OrdemItemUpdate = TablesUpdate<'ordem_itens'>;

export type FinanceiroRow = TablesRow<'financeiro'>;
export type FinanceiroInsert = TablesInsert<'financeiro'>;
export type FinanceiroUpdate = TablesUpdate<'financeiro'>;

export type ConfiguracaoRow = TablesRow<'configuracoes'>;
export type ConfiguracaoInsert = TablesInsert<'configuracoes'>;
export type ConfiguracaoUpdate = TablesUpdate<'configuracoes'>;

// Helper functions to convert between database and app formats
export function mapDbOrdemToApp(dbOrdem: any): OrdemServico {
  const ordem: OrdemServico = {
    id: dbOrdem.id,
    numero: dbOrdem.numero,
    clienteId: dbOrdem.cliente_id,
    status: dbOrdem.status as 'aberta' | 'andamento' | 'concluida' | 'cancelada',
    dataAbertura: dbOrdem.data_abertura || '',
    dataPrevisao: dbOrdem.data_previsao,
    dataConclusao: dbOrdem.data_conclusao,
    descricao: dbOrdem.descricao || '',
    responsavel: dbOrdem.responsavel || '',
    prioridade: dbOrdem.prioridade as 'baixa' | 'media' | 'alta' | 'urgente',
    itens: [],
    valorTotal: dbOrdem.valor_total || 0,
    observacoes: dbOrdem.observacoes,
    assistenciaId: dbOrdem.assistencia_id,
    solucao: dbOrdem.solucao,
    formaPagamento: dbOrdem.forma_pagamento,
    integradoFinanceiro: dbOrdem.integrado_financeiro,
    movimentoFinanceiroId: dbOrdem.movimento_financeiro_id
  };

  // Map cliente if available
  if (dbOrdem.cliente) {
    ordem.cliente = mapDbClienteToApp(dbOrdem.cliente);
  }

  return ordem;
}

export function mapDbClienteToApp(dbCliente: ClienteDB | any): Cliente {
  return {
    id: dbCliente.id,
    nome: dbCliente.nome,
    tipo: (dbCliente.tipo === 'cliente' || dbCliente.tipo === 'fornecedor') 
      ? dbCliente.tipo as 'cliente' | 'fornecedor'
      : 'cliente',
    email: dbCliente.email || '',
    telefone: dbCliente.telefone || '',
    documento: dbCliente.documento || '',
    endereco: dbCliente.endereco || '',
    cidade: dbCliente.cidade || '',
    estado: dbCliente.estado || '',
    cep: dbCliente.cep || '',
    observacoes: dbCliente.observacoes,
    dataCadastro: dbCliente.data_cadastro || '',
    ativo: true // Adding missing ativo property with default value
  };
}

// Mock functions for assistencia until the table is created
export async function fetchAssistencias(): Promise<Assistencia[]> {
  // Por enquanto retornando dados mock, no futuro será integrado com o banco
  return [
    {
      id: "assist-1",
      nome: "Assistência Técnica A",
      email: "contato@assistenciaA.com",
      plano: "Premium",
      status: "Ativa",
      dataRegistro: "2025-01-15",
      telefone: "(11) 3333-4444",
      celular: "(11) 98765-4321",
      responsavel: "Técnico Responsável"
    },
    {
      id: "assist-id",
      nome: "Assistência Demo",
      email: "assistencia@exemplo.com",
      plano: "Premium",
      status: "Ativa",
      dataRegistro: "2025-05-01",
      telefone: "(11) 5555-5555",
      celular: "(11) 98888-8888",
      responsavel: "João Técnico"
    }
  ];
}

export async function fetchAssistencia(id: string): Promise<Assistencia | null> {
  const assistencias = await fetchAssistencias();
  return assistencias.find(a => a.id === id) || null;
}

// Data access helpers
export async function fetchClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data;
}

export async function fetchCliente(id: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function insertCliente(cliente: ClienteInsert) {
  // Verificar se o tipo é válido para o banco de dados
  if (cliente.tipo === 'pessoa_fisica' || cliente.tipo === 'pessoa_juridica') {
    // Converter para 'cliente' no banco de dados
    const clienteParaInserir = {
      ...cliente,
      tipo: 'cliente'
    };
    
    const { data, error } = await supabase
      .from('clientes')
      .insert(clienteParaInserir)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Se já for 'cliente' ou 'fornecedor', manter como está
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export async function updateCliente(id: string, cliente: ClienteUpdate) {
  // Verificar se o tipo é válido para o banco de dados
  if (cliente.tipo === 'pessoa_fisica' || cliente.tipo === 'pessoa_juridica') {
    // Converter para 'cliente' no banco de dados
    const clienteParaAtualizar = {
      ...cliente,
      tipo: 'cliente'
    };
    
    const { data, error } = await supabase
      .from('clientes')
      .update(clienteParaAtualizar)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Se já for 'cliente' ou 'fornecedor', manter como está
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export async function deleteCliente(id: string) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function fetchConfiguracoes() {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function updateConfiguracao(id: string, configuracao: ConfiguracaoUpdate) {
  const { data, error } = await supabase
    .from('configuracoes')
    .update(configuracao)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function upsertConfiguracoes(configuracoes: ConfiguracaoInsert[]) {
  const { data, error } = await supabase
    .from('configuracoes')
    .upsert(configuracoes, { 
      onConflict: 'chave',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) throw error;
  return data;
}
