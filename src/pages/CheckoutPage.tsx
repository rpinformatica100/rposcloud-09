
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Smartphone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const planoId = searchParams.get('planoId');
  const metodoPagamento = searchParams.get('metodo');
  const preco = searchParams.get('preco');
  const planoNome = searchParams.get('plano');

  useEffect(() => {
    if (!planoId || !metodoPagamento || !preco || !planoNome) {
      toast.error("Dados do checkout inválidos");
      navigate('/');
    }
  }, [planoId, metodoPagamento, preco, planoNome, navigate]);

  const processarPagamento = () => {
    setLoading(true);
    
    // Simular processamento do pagamento
    setTimeout(() => {
      setLoading(false);
      toast.success("Pagamento processado com sucesso!", {
        description: "Você será redirecionado em instantes..."
      });
      
      setTimeout(() => {
        navigate('/success');
      }, 2000);
    }, 3000);
  };

  const voltarParaPlanos = () => {
    navigate('/#planos');
  };

  if (!planoId || !metodoPagamento || !preco || !planoNome) {
    return null;
  }

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
            Checkout
          </CardTitle>
          <CardDescription>
            {metodoPagamento === 'stripe' ? 'Pagamento via Cartão de Crédito' : 'Pagamento via PIX'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">{planoNome}</h3>
            <p className="text-2xl font-bold text-primary">
              R$ {Number(preco).toFixed(2).replace('.', ',')}
            </p>
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
            
            <Button 
              variant="outline" 
              onClick={voltarParaPlanos}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Planos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
