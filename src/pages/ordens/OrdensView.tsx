
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrdemData } from "@/hooks/ordens/useOrdemData";
import { useOrdemOperations } from "@/hooks/ordens/useOrdemOperations";
import { OrdemServico } from "@/types";
import { OrdemHeader } from "@/components/ordens/view/OrdemHeader";
import { OrdemItens } from "@/components/ordens/view/OrdemItens";
import { OrdemDescricoes } from "@/components/ordens/view/OrdemDescricoes";
import { ClienteCard } from "@/components/ordens/view/ClienteCard";
import { DetalhesFinalizacao } from "@/components/ordens/view/DetalhesFinalizacao";
import { OrdemViewLoader } from "@/components/ordens/view/OrdemViewLoader";
import FinalizarOrdemModal from "@/components/ordens/FinalizarOrdemModal";

const OrdensView = () => {
  const { id } = useParams<{ id: string }>();
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);
  
  // Fetch ordem data using the custom hook
  const {
    ordem,
    itens,
    isLoading,
    error,
    refetchOrdem
  } = useOrdemData(id);

  // Use ordem operations hook
  const { finalizarOrdem, reabrirOrdem, isProcessing } = useOrdemOperations();

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
  const handleFinalizarOrdem = async (dados: {
    solucao: string;
    formaPagamento: string;
    integrarFinanceiro: boolean;
  }) => {
    try {
      await finalizarOrdem(ordem, dados);
      refetchOrdem();
      setFinalizarModalOpen(false);
    } catch (error) {
      console.error("Erro ao finalizar ordem:", error);
    }
  };

  // Handler for reabrir ordem
  const handleReabrirOrdem = async () => {
    try {
      await reabrirOrdem(ordem);
      refetchOrdem();
    } catch (error) {
      console.error("Erro ao reabrir ordem:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <OrdemHeader 
        ordem={ordem} 
        itens={itens} 
        openFinalizarModal={() => setFinalizarModalOpen(true)}
        onReabrirOrdem={handleReabrirOrdem}
        isProcessing={isProcessing}
      />

      {/* Conteúdo reorganizado para layout sequencial */}
      <ClienteCard cliente={ordem.cliente} />
      <OrdemDescricoes ordem={ordem} />
      <OrdemItens itens={ordem.itens || []} valorTotal={ordem.valorTotal} />
      {ordem.status === "concluida" && <DetalhesFinalizacao ordem={ordem} />}

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
