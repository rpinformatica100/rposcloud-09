
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect após 10 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Pagamento Aprovado!</CardTitle>
          <CardDescription>
            Seu pagamento foi processado com sucesso. Você receberá um e-mail de confirmação em instantes.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              Sua assinatura já está ativa e você pode começar a usar todos os recursos da plataforma.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <p className="text-xs text-gray-500">
            Você será redirecionado automaticamente em 10 segundos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
