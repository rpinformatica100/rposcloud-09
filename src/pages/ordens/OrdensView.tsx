
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrdemData } from "@/hooks/ordens/useOrdemData";
import { OrdemServico } from "@/types";
import { OrdemHeader } from "@/components/ordens/view/OrdemHeader";
import { OrdemItens } from "@/components/ordens/view/OrdemItens";
import { ClienteCard } from "@/components/ordens/view/ClienteCard";
import { AcoesCard } from "@/components/ordens/view/AcoesCard";
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
    // Recarregar dados
    refetchOrdem();
  };

  return (
    <div className="container mx-auto py-6">
      <OrdemHeader 
        ordem={ordem} 
        itens={itens} 
        openFinalizarModal={() => setFinalizarModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          <OrdemItens itens={ordem.itens || []} valorTotal={ordem.valorTotal} />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          <ClienteCard cliente={ordem.cliente} />
          <AcoesCard ordem={ordem} itens={itens} />
        </div>
      </div>

      {/* Detalhes da finalização quando concluída */}
      <DetalhesFinalizacao ordem={ordem} />

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
