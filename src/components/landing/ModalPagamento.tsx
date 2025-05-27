
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ModalPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  plano: {
    id: number;
    nome: string;
    preco: number;
  };
  onCheckout: (checkout: any) => void;
}

export default function ModalPagamento({ isOpen, onClose, plano, onCheckout }: ModalPagamentoProps) {
  const [metodoPagamento, setMetodoPagamento] = useState<'stripe' | 'mercadopago'>('stripe');
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleCheckout = () => {
    const params = new URLSearchParams({
      planoId: plano.id.toString(),
      metodo: metodoPagamento,
      preco: plano.preco.toString(),
      plano: plano.nome,
      userId: user?.id || '',
      userEmail: user?.email || '',
      userName: profile?.nome || ''
    });
    
    navigate(`/checkout?${params.toString()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Escolha o método de pagamento
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <div>Plano selecionado: <strong>{plano.nome}</strong> - R$ {plano.preco.toFixed(2).replace('.', ',')}</div>
              {user && (
                <div className="text-sm text-gray-600">
                  Usuário: {profile?.nome || user.email}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={metodoPagamento} onValueChange={(value) => setMetodoPagamento(value as 'stripe' | 'mercadopago')}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center cursor-pointer flex-1">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                <div>
                  <div className="font-medium">Cartão de Crédito</div>
                  <div className="text-sm text-gray-500">Pagamento via Stripe</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="mercadopago" id="mercadopago" />
              <Label htmlFor="mercadopago" className="flex items-center cursor-pointer flex-1">
                <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-gray-500">Pagamento via Mercado Pago</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleCheckout} className="flex-1">
              Continuar para Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
