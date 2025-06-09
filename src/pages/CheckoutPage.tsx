
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Smartphone, ArrowLeft, User, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { PLAN_METADATA, PlanType } from "@/types/plan";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, profile, isAuthenticated } = useSupabaseAuth();
  const { handleCheckoutSuccess } = usePlan();

  const planoId = searchParams.get('planoId') as PlanType;
  const metodoPagamento = searchParams.get('metodo');
  const preco = searchParams.get('preco');
  const planoNome = searchParams.get('plano');
  const userId = searchParams.get('userId');
  const userEmail = searchParams.get('userEmail');
  const userName = searchParams.get('userName');

  // Validar dados do checkout
  const isValidCheckout = planoId && metodoPagamento && preco && planoNome && PLAN_METADATA[planoId];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para continuar");
      navigate('/login');
      return;
    }

    if (!isValidCheckout) {
      toast.error("Dados do checkout inválidos");
      navigate('/app/planos');
      return;
    }
  }, [isAuthenticated, isValidCheckout, navigate]);

  const processarPagamento = async () => {
    if (!isValidCheckout || !user) return;

    setLoading(true);
    
    try {
      // Simular processamento do pagamento
      console.log("Processando pagamento para:", {
        usuario: {
          id: user.id,
          email: user.email,
          nome: profile?.nome
        },
        plano: {
          id: planoId,
          nome: planoNome,
          preco: preco
        },
        metodo: metodoPagamento
      });
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Processar sucesso do checkout
      await handleCheckoutSuccess(planoId);
      
      toast.success("Pagamento processado com sucesso!", {
        description: "Seu plano foi ativado. Redirecionando..."
      });
      
      // Redirecionar para app com confirmação
      setTimeout(() => {
        navigate('/app?checkout=success');
      }, 2000);
      
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error("Erro ao processar pagamento", {
        description: "Tente novamente ou entre em contato com o suporte."
      });
    } finally {
      setLoading(false);
    }
  };

  const voltarParaPlanos = () => {
    navigate('/app/planos');
  };

  const cancelarCheckout = () => {
    // Limpar intenção de checkout
    localStorage.removeItem('checkout_intent');
    toast.info("Checkout cancelado");
    navigate('/app/planos');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!isValidCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Erro no Checkout</CardTitle>
            <CardDescription>Dados inválidos detectados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/app/planos')} className="w-full">
              Voltar aos Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planData = PLAN_METADATA[planoId];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center mb-2">
            {metodoPagamento === 'stripe' ? (
              <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
            ) : (
              <Smartphone className="w-6 h-6 mr-2 text-green-600" />
            )}
            Checkout Seguro
          </CardTitle>
          <CardDescription>
            {metodoPagamento === 'stripe' ? 'Pagamento via Cartão de Crédito' : 'Pagamento via PIX'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Informações do usuário */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">Dados do Cliente</span>
            </div>
            <div className="text-sm text-blue-700">
              <div><strong>Nome:</strong> {profile?.nome || userName}</div>
              <div><strong>Email:</strong> {user?.email || userEmail}</div>
            </div>
          </div>

          {/* Informações do plano */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{planData.name}</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-2">{planData.description}</p>
            
            {/* Verificar se o plano tem price antes de renderizar */}
            {'price' in planData && (
              <>
                <p className="text-2xl font-bold text-primary">
                  R$ {planData.price.toFixed(2).replace('.', ',')}
                </p>
                {'savings' in planData && planData.savings && (
                  <p className="text-sm text-green-600 font-medium">
                    Economia de {planData.savings}%
                  </p>
                )}
              </>
            )}
          </div>

          {/* Resumo do que está incluído */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Incluído no plano:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Funcionalidades completas</li>
              <li>• Suporte técnico prioritário</li>
              <li>• Backup automático</li>
              <li>• Relatórios avançados</li>
            </ul>
          </div>

          {/* Segurança */}
          <div className="flex items-center justify-center text-sm text-gray-600 gap-2">
            <Shield className="w-4 h-4" />
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={processarPagamento} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {metodoPagamento === 'stripe' ? 'Pagar com Cartão' : 'Gerar PIX'}
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={voltarParaPlanos}
                className="flex-1"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelarCheckout}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
