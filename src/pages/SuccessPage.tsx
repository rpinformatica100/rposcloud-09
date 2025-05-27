
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ArrowRight, Sparkles } from "lucide-react";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/app');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md text-center relative z-10 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-scale-in shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Pagamento Aprovado!
              </span>
              <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-green-700">
              Bem-vindo ao RP OS Cloud!
            </CardTitle>
            
            <CardDescription className="text-base">
              Seu pagamento foi processado com sucesso. Agora você pode começar a usar todos os recursos da plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-green-700">
                Sua assinatura está ativa!
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Você receberá um e-mail de confirmação em instantes com todos os detalhes da sua conta.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/app')}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Acessar Minha Conta
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">
              Redirecionamento automático em:
            </p>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-primary mr-2">{countdown}</div>
              <span className="text-sm text-gray-600">segundos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
