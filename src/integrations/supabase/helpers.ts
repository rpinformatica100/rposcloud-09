
import { supabase } from './client';
import type { Database } from './types';

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
      onConflict: 'chave',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) throw error;
  return data;
}
