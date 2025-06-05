
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, User, Loader2, LogIn } from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";
import AuthModal from "@/components/landing/AuthModal";

interface ModalPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  plano: {
    id: number;
    nome: string;
    preco: number;
    periodo: string;
  };
  onCheckout?: (checkout: any) => void;
}

// Price IDs reais do Stripe
const STRIPE_PRICE_IDS = {
  monthly: "prod_SR9okYqkK5C7LK",
  quarterly: "prod_SR9p499ZF8Zykx", 
  yearly: "prod_SR9qAjs2itWOej"
};

export default function ModalPagamento({ isOpen, onClose, plano, onCheckout }: ModalPagamentoProps) {
  const [metodoPagamento, setMetodoPagamento] = useState<'stripe' | 'mercadopago'>('stripe');
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, createCheckout, isAuthenticated } = useSupabaseAuth();

  const getPlanType = () => {
    if (plano.nome.toLowerCase().includes('anual')) return 'yearly';
    if (plano.nome.toLowerCase().includes('trimestral')) return 'quarterly';
    return 'monthly';
  };

  const handleStripeCheckout = async () => {
    if (!user || !isAuthenticated) {
      // Salvar plano no localStorage e abrir modal de autenticação
      localStorage.setItem('plano-pendente', JSON.stringify(plano));
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    
    try {
      const planType = getPlanType();
      const priceId = STRIPE_PRICE_IDS[planType as keyof typeof STRIPE_PRICE_IDS];
      
      if (!priceId) {
        toast.error("Plano não configurado. Entre em contato com o suporte.");
        setLoading(false);
        return;
      }

      const { url, error } = await createCheckout(planType, priceId);
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error("Erro ao criar checkout. Tente novamente.");
        setLoading(false);
        return;
      }

      if (url) {
        // Abrir Stripe Checkout em nova aba
        window.open(url, '_blank');
        onClose();
        toast.success("Redirecionando para o pagamento...");
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleMercadoPagoCheckout = () => {
    if (!user || !isAuthenticated) {
      localStorage.setItem('plano-pendente', JSON.stringify(plano));
      setAuthModalOpen(true);
      return;
    }
    
    toast.info("Mercado Pago será implementado em breve");
    // TODO: Implementar Mercado Pago
  };

  const handleCheckout = () => {
    if (metodoPagamento === 'stripe') {
      handleStripeCheckout();
    } else {
      handleMercadoPagoCheckout();
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    toast.success("Login realizado com sucesso!");
    
    // Após login, iniciar checkout automaticamente
    setTimeout(() => {
      handleCheckout();
    }, 500);
  };

  const handleLoginClick = () => {
    localStorage.setItem('plano-pendente', JSON.stringify(plano));
    setAuthModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {isAuthenticated ? "Escolha o método de pagamento" : "Login necessário"}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <div>Plano selecionado: <strong>{plano.nome}</strong> - R$ {plano.preco.toFixed(2).replace('.', ',')}</div>
                {user && (
                  <div className="text-sm text-gray-600">
                    Usuário: {profile?.nome || user.email}
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="text-sm text-blue-600">
                    Faça login ou crie uma conta para continuar com a assinatura
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isAuthenticated ? (
              // Mostrar botão de login quando não autenticado
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <LogIn className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Login Necessário</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">
                    Para assinar este plano, você precisa fazer login ou criar uma conta.
                  </p>
                  <Button onClick={handleLoginClick} className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Fazer Login / Criar Conta
                  </Button>
                </div>
              </div>
            ) : (
              // Mostrar opções de pagamento quando autenticado
              <RadioGroup value={metodoPagamento} onValueChange={(value) => setMetodoPagamento(value as 'stripe' | 'mercadopago')}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">Cartão de Crédito</div>
                      <div className="text-sm text-gray-500">Pagamento via Stripe (Recomendado)</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                  <RadioGroupItem value="mercadopago" id="mercadopago" disabled />
                  <Label htmlFor="mercadopago" className="flex items-center cursor-pointer flex-1">
                    <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                    <div>
                      <div className="font-medium">PIX</div>
                      <div className="text-sm text-gray-500">Em breve via Mercado Pago</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                Cancelar
              </Button>
              
              {isAuthenticated && (
                <Button onClick={handleCheckout} className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Continuar para Pagamento'
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="register"
        plano={plano}
      />
    </>
  );
}
