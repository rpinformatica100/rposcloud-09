
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanStatus } from '@/hooks/usePlanStatus';
import AuthModal from '@/components/auth/AuthModal';

export default function TrialSection() {
  const { isAuthenticated } = useAuth();
  const { userPlan, activateTrial } = usePlanStatus();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const trialFeatures = [
    "Gestão completa de ordens de serviço",
    "Cadastro de até 50 clientes",
    "Controle básico de estoque",
    "Relatórios essenciais",
    "Suporte via email"
  ];

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    // Se já tem um plano ativo, redirecionar para o dashboard
    if (userPlan && userPlan.status !== 'expired') {
      navigate('/app');
      return;
    }

    // Ativar trial e redirecionar
    activateTrial();
    navigate('/app');
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    // Ativar trial após autenticação
    setTimeout(() => {
      activateTrial();
      navigate('/app');
    }, 1000);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <div className="space-y-4">
            <Badge variant="outline" className="border-blue-500 text-blue-600 px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Teste Grátis por 7 Dias
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Experimente
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Gratuitamente</span>
            </h2>
            <p className="max-w-2xl text-gray-600 md:text-xl leading-relaxed dark:text-gray-300 mx-auto">
              Teste todas as funcionalidades do RP OS Cloud sem compromisso. 
              <br className="hidden md:block" />
              <strong>Sem cartão de crédito necessário.</strong>
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-bl-xl font-bold shadow-lg">
              <Clock className="w-4 h-4 inline mr-2" />
              7 Dias Grátis
            </div>
            
            <CardHeader className="text-center pb-6 pt-8 relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trial Gratuito
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Acesso completo por 7 dias, todas as funcionalidades liberadas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 px-8 pb-8 relative">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    R$ 0
                  </span>
                  <div className="text-left">
                    <div className="text-sm text-gray-500">por</div>
                    <div className="text-sm font-semibold text-gray-700">7 dias</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Depois apenas R$ 49,90/mês</p>
              </div>
              
              <ul className="space-y-4">
                {trialFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center border border-blue-100">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-sm font-semibold text-blue-700 mb-1">
                  Sem cartão de crédito necessário
                </p>
                <p className="text-xs text-blue-600">
                  Cancele a qualquer momento durante o período de teste
                </p>
              </div>
              
              <Button 
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Gift className="w-5 h-5 mr-2" />
                Começar Teste Grátis Agora
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Ao clicar em "Começar Teste Grátis", você concorda com nossos termos de uso
              </p>
            </CardContent>
          </Card>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          defaultTab="register"
        />
      </div>
    </section>
  );
}
