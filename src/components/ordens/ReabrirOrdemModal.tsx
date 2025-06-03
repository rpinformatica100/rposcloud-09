
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, RotateCcw, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrdemServico, MovimentoFinanceiro } from "@/types";
import { formatarMoeda } from "@/lib/utils";
import { financeirosData } from "@/data/dados";

interface ReabrirOrdemModalProps {
  ordem: OrdemServico;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ordem: OrdemServico) => void;
}

const ReabrirOrdemModal = ({ ordem, isOpen, onClose, onSave }: ReabrirOrdemModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se existe movimento financeiro relacionado
  const movimentoFinanceiro = financeirosData.find(
    mov => mov.ordemId === ordem.id || mov.id === ordem.movimentoFinanceiroId
  );

  const handleReabrir = () => {
    setIsSubmitting(true);

    // Simulando um atraso para mostrar o spinner
    setTimeout(() => {
      // Remover movimento financeiro se existir
      if (movimentoFinanceiro) {
        const index = financeirosData.findIndex(mov => mov.id === movimentoFinanceiro.id);
        if (index !== -1) {
          financeirosData.splice(index, 1);
        }
      }

      // Criar ordem atualizada com status reaberto
      const ordemReaberta: OrdemServico = {
        ...ordem,
        status: "andamento", // Voltar para andamento
        dataConclusao: undefined, // Remover data de conclusão
        solucao: undefined, // Limpar solução
        formaPagamento: undefined, // Limpar forma de pagamento
        integradoFinanceiro: false, // Marcar como não integrado
        movimentoFinanceiroId: undefined // Remover referência ao movimento
      };

      onSave(ordemReaberta);
      setIsSubmitting(false);
      onClose();

      toast({
        title: "Ordem reaberta com sucesso",
        description: movimentoFinanceiro 
          ? "A ordem foi reaberta e o movimento financeiro foi removido."
          : "A ordem foi reaberta.",
      });
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Reabrir Ordem de Serviço #{ordem.numero}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-orange-800">
                  Atenção: Esta ação irá reverter a finalização da ordem
                </p>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>• O status será alterado para "Em andamento"</p>
                  <p>• A data de conclusão será removida</p>
                  <p>• A solução aplicada será limpa</p>
                  {movimentoFinanceiro && (
                    <p>• O movimento financeiro de {formatarMoeda(movimentoFinanceiro.valor)} será removido</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium">Status atual: Concluída</p>
            <p className="text-muted-foreground">Novo status: Em andamento</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={handleReabrir} 
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reabrindo...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reabrir Ordem
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReabrirOrdemModal;
