
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Clock } from 'lucide-react';
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
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="border-blue-500 text-blue-600 animate-fade-in">
              <Gift className="w-3 h-3 mr-1" />
              Teste Grátis
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
              Experimente gratuitamente por 7 dias
            </h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed dark:text-gray-300 animate-fade-in mx-auto">
              Teste todas as funcionalidades do RP OS Cloud sem compromisso. Sem cartão de crédito necessário.
            </p>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-blue-200 shadow-lg">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg font-medium">
              <Clock className="w-3 h-3 inline mr-1" />
              7 Dias Grátis
            </div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-blue-600">Trial Gratuito</CardTitle>
              <CardDescription>
                Acesso completo por 7 dias, sem limitações
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">R$ 0</span>
                <span className="text-gray-500"> por 7 dias</span>
              </div>
              
              <ul className="space-y-3">
                {trialFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  🎉 Sem cartão de crédito necessário
                </p>
                <p className="text-xs text-blue-600">
                  Cancele a qualquer momento durante o período de teste
                </p>
              </div>
              
              <Button 
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                size="lg"
              >
                <Gift className="w-4 h-4 mr-2" />
                Começar Teste Grátis
              </Button>
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
