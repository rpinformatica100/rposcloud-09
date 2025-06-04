
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSubscription, profile, subscription } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Sessão de pagamento não encontrada");
        navigate('/app/planos');
        return;
      }

      try {
        // Aguardar um pouco para o webhook processar
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar status da assinatura
        await refreshSubscription();
        
        setVerified(true);
        toast.success("Pagamento confirmado com sucesso!");
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error("Erro ao verificar pagamento");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshSubscription, navigate]);

  const handleContinue = () => {
    navigate('/app');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <h2 className="text-xl font-semibold">Verificando pagamento...</h2>
            <p className="text-gray-600 text-center">
              Aguarde enquanto confirmamos seu pagamento
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Pagamento Confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Obrigado por assinar o RP OS Cloud!
            </p>
            <p className="text-sm text-gray-500">
              Sua assinatura foi ativada com sucesso.
            </p>
          </div>

          {verified && subscription && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Detalhes da Assinatura</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano:</span>
                  <span className="font-medium">{subscription.plan_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Ativo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Próximo pagamento:</span>
                  <span className="font-medium">
                    {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar o Sistema
            </Button>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/app/planos')}
              >
                Gerenciar Assinatura
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Você receberá um email de confirmação em breve.</p>
            <p>Session ID: {sessionId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
