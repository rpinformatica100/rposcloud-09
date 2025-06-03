
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrdemServico, MovimentoFinanceiro } from "@/types";
import { ordensData, financeirosData } from "@/data/dados";

export function useOrdemOperations() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const finalizarOrdem = async (ordem: OrdemServico, dados: {
    solucao: string;
    formaPagamento: string;
    integrarFinanceiro: boolean;
  }) => {
    setIsProcessing(true);
    
    try {
      // Simular delay da operação
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ordemAtualizada: OrdemServico = {
        ...ordem,
        status: "concluida",
        dataConclusao: new Date().toISOString(),
        solucao: dados.solucao,
        formaPagamento: dados.formaPagamento,
        integradoFinanceiro: dados.integrarFinanceiro
      };

      // Se integrar ao financeiro, criar movimento
      if (dados.integrarFinanceiro) {
        const novoMovimento: MovimentoFinanceiro = {
          id: `mov-${Date.now()}`,
          tipo: "receita",
          descricao: `Pagamento OS #${ordem.numero} - ${ordem.cliente?.nome || "Cliente"}`,
          valor: Number(ordem.valorTotal) || 0,
          data: new Date().toISOString().split('T')[0],
          pago: true,
          dataPagamento: new Date().toISOString().split('T')[0],
          categoria: "Serviços",
          metodoPagamento: dados.formaPagamento,
          ordemId: ordem.id,
          observacoes: `Pagamento referente à Ordem de Serviço #${ordem.numero}`
        };

        financeirosData.unshift(novoMovimento);
        ordemAtualizada.movimentoFinanceiroId = novoMovimento.id;
      }

      // Atualizar nos dados mockados
      const ordemIndex = ordensData.findIndex(o => o.id === ordem.id);
      if (ordemIndex !== -1) {
        ordensData[ordemIndex] = { ...ordensData[ordemIndex], ...ordemAtualizada };
      }

      toast({
        title: "Ordem finalizada com sucesso",
        description: dados.integrarFinanceiro 
          ? "A ordem foi finalizada e integrada ao financeiro." 
          : "A ordem foi finalizada.",
      });

      return ordemAtualizada;
    } finally {
      setIsProcessing(false);
    }
  };

  const reabrirOrdem = async (ordem: OrdemServico) => {
    setIsProcessing(true);
    
    try {
      // Simular delay da operação
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar e remover movimento financeiro
      const movimentoFinanceiro = financeirosData.find(
        mov => mov.ordemId === ordem.id || mov.id === ordem.movimentoFinanceiroId
      );

      if (movimentoFinanceiro) {
        const index = financeirosData.findIndex(mov => mov.id === movimentoFinanceiro.id);
        if (index !== -1) {
          financeirosData.splice(index, 1);
        }
      }

      // Criar ordem reaberta
      const ordemReaberta: OrdemServico = {
        ...ordem,
        status: "andamento",
        dataConclusao: undefined,
        solucao: undefined,
        formaPagamento: undefined,
        integradoFinanceiro: false,
        movimentoFinanceiroId: undefined
      };

      // Atualizar nos dados mockados
      const ordemIndex = ordensData.findIndex(o => o.id === ordem.id);
      if (ordemIndex !== -1) {
        ordensData[ordemIndex] = { ...ordensData[ordemIndex], ...ordemReaberta };
      }

      toast({
        title: "Ordem reaberta com sucesso",
        description: movimentoFinanceiro 
          ? "A ordem foi reaberta e o movimento financeiro foi removido."
          : "A ordem foi reaberta.",
      });

      return ordemReaberta;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    finalizarOrdem,
    reabrirOrdem,
    isProcessing
  };
}
