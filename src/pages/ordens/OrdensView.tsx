
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrdemData } from "@/hooks/ordens/useOrdemData";
import { OrdemServico } from "@/types";
import { OrdemHeader } from "@/components/ordens/view/OrdemHeader";
import { OrdemItens } from "@/components/ordens/view/OrdemItens";
import { OrdemDescricoes } from "@/components/ordens/view/OrdemDescricoes";
import { ClienteCard } from "@/components/ordens/view/ClienteCard";
import { DetalhesFinalizacao } from "@/components/ordens/view/DetalhesFinalizacao";
import { OrdemViewLoader } from "@/components/ordens/view/OrdemViewLoader";
import FinalizarOrdemModal from "@/components/ordens/FinalizarOrdemModal";
import { useToast } from "@/hooks/use-toast";
import { ordensData } from "@/data/dados";

const OrdensView = () => {
  const { id } = useParams<{ id: string }>();
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch ordem data using the custom hook
  const {
    ordem,
    itens,
    isLoading,
    error,
    refetchOrdem
  } = useOrdemData(id);

  // Show loading or error state
  if (isLoading || error || !ordem) {
    return (
      <OrdemViewLoader 
        isLoading={isLoading} 
        error={error instanceof Error ? error : null} 
      />
    );
  }

  // Handler for finalizar ordem
  const handleFinalizarOrdem = (ordemAtualizada: OrdemServico) => {
    // Atualiza a ordem nos dados mockados
    if (id) {
      const ordemIndex = ordensData.findIndex(o => o.id === id);
      if (ordemIndex !== -1) {
        ordensData[ordemIndex] = {
          ...ordensData[ordemIndex],
          ...ordemAtualizada
        };
      }
    }
    
    // Mostra toast de confirmação
    if (ordemAtualizada.status === "concluida") {
      toast({
        title: "Ordem finalizada com sucesso",
        description: ordemAtualizada.integradoFinanceiro 
          ? "A ordem foi finalizada e integrada ao financeiro." 
          : "A ordem foi finalizada.",
      });
    }
    
    // Recarregar dados
    refetchOrdem();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <OrdemHeader 
        ordem={ordem} 
        itens={itens} 
        openFinalizarModal={() => setFinalizarModalOpen(true)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Coluna lateral com informações do cliente - 1 coluna */}
        <div className="xl:col-span-1">
          <ClienteCard cliente={ordem.cliente} />
        </div>
        
        {/* Coluna principal com conteúdo - 3 colunas */}
        <div className="xl:col-span-3 space-y-6">
          {/* Produtos e Serviços */}
          <OrdemItens itens={ordem.itens || []} valorTotal={ordem.valorTotal} />
          
          {/* Descrições e Observações */}
          <OrdemDescricoes ordem={ordem} />
          
          {/* Detalhes da finalização quando concluída */}
          <DetalhesFinalizacao ordem={ordem} />
        </div>
      </div>

      {/* Modal de finalização */}
      <FinalizarOrdemModal 
        ordem={ordem} 
        isOpen={finalizarModalOpen} 
        onClose={() => setFinalizarModalOpen(false)}
        onSave={handleFinalizarOrdem}
      />
    </div>
  );
};

export default OrdensView;
