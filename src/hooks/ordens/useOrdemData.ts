
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ItemOrdemServico, OrdemServico } from "@/types";
import { useState, useEffect } from "react";
import { ordensData, clientesData } from "@/data/dados";
import { mapDbClienteToApp, mapDbOrdemToApp } from "@/integrations/supabase/helpers";

// Define types for database records
interface OrdemItemDB {
  id: string;
  ordem_id: string;
  produto_id: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacao?: string;
  produto?: {
    nome: string;
    tipo: string;
  };
}

export function useOrdemData(id?: string) {
  // Function to fetch ordem details
  const fetchOrdem = async () => {
    try {
      // Try to fetch from Supabase first
      if (!id) throw new Error("ID não informado");
      
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
      
      if (data) {
        // Convert the database object to app format
        return mapDbOrdemToApp(data);
      }
      
      // If no data from Supabase, fall back to mock data
      throw new Error("No data from Supabase");
    } catch (error) {
      console.log("Falling back to mock data");
      // Fall back to mock data
      const mockOrdem = ordensData.find(o => o.id === id);
      if (!mockOrdem) throw new Error("Ordem não encontrada");
      
      const mockCliente = clientesData.find(c => c.id === mockOrdem.clienteId);
      
      return {
        ...mockOrdem,
        cliente: mockCliente
      };
    }
  };

  // Function to fetch order items
  const fetchItens = async () => {
    try {
      // Try to fetch from Supabase first
      if (!id) throw new Error("ID não informado");
      
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
      
      if (data && data.length > 0) {
        // Map DB items to app format
        return data.map((item: OrdemItemDB) => ({
          id: item.id,
          produtoId: item.produto_id,
          quantidade: item.quantidade,
          valorUnitario: item.valor_unitario,
          valorTotal: item.valor_total,
          observacao: item.observacao,
          produto: item.produto ? {
            id: item.produto_id,
            nome: item.produto.nome,
            tipo: item.produto.tipo as 'produto' | 'servico',
            descricao: '',
            preco: item.valor_unitario,
            ativo: true
          } : undefined
        }));
      }
      
      // If no data from Supabase, fall back to mock data
      throw new Error("No items from Supabase");
    } catch (error) {
      console.log("Falling back to mock data for items");
      // Fall back to mock items data
      const mockOrdem = ordensData.find(o => o.id === id);
      if (!mockOrdem || !mockOrdem.itens) return [] as ItemOrdemServico[];
      
      return mockOrdem.itens;
    }
  };

  // Queries
  const { 
    data: ordem, 
    isLoading: isLoadingOrdem,
    error: ordemError,
    refetch: refetchOrdem
  } = useQuery({
    queryKey: ['ordem', id],
    queryFn: fetchOrdem,
    retry: 1,
    enabled: !!id
  });

  const {
    data: itens = [],
    isLoading: isLoadingItens,
    error: itensError
  } = useQuery({
    queryKey: ['ordem-itens', id],
    queryFn: fetchItens,
    retry: 1,
    enabled: !!id && !ordemError
  });

  // Combined loading and error states
  const isLoading = isLoadingOrdem || isLoadingItens;
  const error = ordemError || itensError;

  // Combine ordem and items
  useEffect(() => {
    if (ordem && itens.length > 0 && !ordem.itens?.length) {
      ordem.itens = itens;
    }
  }, [ordem, itens]);

  return {
    ordem,
    itens,
    isLoading,
    error,
    refetchOrdem
  };
}
