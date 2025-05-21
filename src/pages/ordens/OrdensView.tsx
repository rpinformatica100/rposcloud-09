
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrdemData } from "@/hooks/ordens/useOrdemData";
import { OrdemServico } from "@/types";
import { OrdemHeader } from "@/components/ordens/view/OrdemHeader";
import { OrdemItens } from "@/components/ordens/view/OrdemItens";
import { ClienteCard } from "@/components/ordens/view/ClienteCard";
import { DetalhesFinalizacao } from "@/components/ordens/view/DetalhesFinalizacao";
import { OrdemViewLoader } from "@/components/ordens/view/OrdemViewLoader";
import FinalizarOrdemModal from "@/components/ordens/FinalizarOrdemModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const OrdensView = () => {
  const { id } = useParams<{ id: string }>();
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);
  const { toast } = useToast();
  const { checkAuth } = useAuth();
  
  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
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
    <div className="container mx-auto py-6">
      <OrdemHeader 
        ordem={ordem} 
        itens={itens} 
        openFinalizarModal={() => setFinalizarModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Coluna lateral com informações do cliente (agora menor) */}
        <div>
          <ClienteCard cliente={ordem.cliente} />
        </div>
        
        {/* Coluna principal com itens da ordem (agora maior, ocupando mais espaço) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <OrdemItens itens={ordem.itens || []} valorTotal={ordem.valorTotal} />
          </Card>
          
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
