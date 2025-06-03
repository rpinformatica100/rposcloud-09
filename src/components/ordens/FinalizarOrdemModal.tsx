
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrdemServico } from "@/types";
import { formatarMoeda } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface FinalizarOrdemModalProps {
  ordem: OrdemServico;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: {
    solucao: string;
    formaPagamento: string;
    integrarFinanceiro: boolean;
  }) => Promise<void>;
}

const FinalizarOrdemModal = ({ ordem, isOpen, onClose, onSave }: FinalizarOrdemModalProps) => {
  const { toast } = useToast();
  const [solucao, setSolucao] = useState(ordem.solucao || "");
  const [formaPagamento, setFormaPagamento] = useState(ordem.formaPagamento || "dinheiro");
  const [integrarFinanceiro, setIntegrarFinanceiro] = useState(!ordem.integradoFinanceiro);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!solucao.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a solução aplicada",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        solucao,
        formaPagamento,
        integrarFinanceiro
      });
      onClose();
    } catch (error) {
      console.error("Erro ao finalizar ordem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Ordem de Serviço #{ordem.numero}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="solucao" className="font-medium">
              Solução aplicada <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solucao"
              value={solucao}
              onChange={(e) => setSolucao(e.target.value)}
              placeholder="Descreva a solução aplicada para resolver o problema"
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="formaPagamento" className="font-medium">
              Forma de pagamento
            </Label>
            <Select 
              value={formaPagamento} 
              onValueChange={setFormaPagamento}
            >
              <SelectTrigger id="formaPagamento">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="a_prazo">A Prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-3">
            <Switch
              id="integrarFinanceiro"
              checked={integrarFinanceiro}
              onCheckedChange={setIntegrarFinanceiro}
            />
            <Label htmlFor="integrarFinanceiro" className="cursor-pointer">
              Integrar ao financeiro (criar movimento de receita)
            </Label>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium">Valor total da ordem: {formatarMoeda(Number(ordem.valorTotal) || 0)}</p>
            {integrarFinanceiro && (
              <p className="text-green-600 mt-1">
                Uma receita será gerada automaticamente no módulo financeiro
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Finalizar Ordem
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinalizarOrdemModal;
