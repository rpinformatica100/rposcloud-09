
import { supabase } from './client';
import type { Database } from './types';
import { Assistencia, OrdemServico, Cliente, ItemOrdemServico } from '@/types';

// Type helpers for Supabase tables
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type TablesRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// Table-specific types
export type ProfileRow = TablesRow<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export type AssistenciaRow = TablesRow<'assistencias'>;
export type AssistenciaInsert = TablesInsert<'assistencias'>;
export type AssistenciaUpdate = TablesUpdate<'assistencias'>;

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
    valorTotal: Number(dbOrdem.valor_total) || 0,
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

export function mapDbClienteToApp(dbCliente: ClienteRow | any): Cliente {
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
    ativo: dbCliente.ativo !== false
  };
}

// Current user helpers
export async function getCurrentUserAssistenciaId(): Promise<string | null> {
  const { data: assistencia } = await supabase
    .from('assistencias')
    .select('id')
    .single();
  
  return assistencia?.id || null;
}

// Mock functions for assistencia until integrated
export async function fetchAssistencias(): Promise<Assistencia[]> {
  const { data, error } = await supabase
    .from('assistencias')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Error fetching assistencias:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    nome: row.nome,
    email: row.email,
    plano: row.plano || "Premium",
    status: (row.status || "Ativa") as "Ativa" | "Inativa" | "Pendente" | "Bloqueada",
    dataRegistro: row.data_registro.split('T')[0],
    telefone: row.telefone || "",
    celular: row.celular || "",
    responsavel: row.responsavel || ""
  }));
}

export async function fetchAssistencia(id: string): Promise<Assistencia | null> {
  const { data, error } = await supabase
    .from('assistencias')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching assistencia:', error);
    return null;
  }

  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    plano: data.plano || "Premium",
    status: (data.status || "Ativa") as "Ativa" | "Inativa" | "Pendente" | "Bloqueada",
    dataRegistro: data.data_registro.split('T')[0],
    telefone: data.telefone || "",
    celular: data.celular || "",
    responsavel: data.responsavel || ""
  };
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
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCliente(id: string, cliente: ClienteUpdate) {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
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
      onConflict: 'assistencia_id,chave',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) throw error;
  return data;
}
