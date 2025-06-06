
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import ModalPagamento from './ModalPagamento';
import AuthModal from '@/components/landing/AuthModal';
import { toast } from "sonner";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { planosDisponiveis, trialFeatures } from '@/data/planos';
import type { PlanoData } from '@/data/planos';
import { Check, Gift, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanManager } from '@/hooks/usePlanManager';

export default function PlanosSection() {
  const { isAuthenticated } = useAuth();
  const { userPlan, handleTrialActivation } = usePlanManager();
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [authModalAberto, setAuthModalAberto] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoData | null>(null);

  // Simular query para manter compatibilidade
  const { data: planos, isLoading, error } = useQuery({
    queryKey: ['planos-pagos'],
    queryFn: () => Promise.resolve(planosDisponiveis)
  });

  const handleAssinaturaPaga = (plano: PlanoData) => {
    setPlanoSelecionado(plano);
    
    if (!isAuthenticated) {
      localStorage.setItem('plano-pendente', JSON.stringify(plano));
      setAuthModalAberto(true);
    } else {
      setModalPagamentoAberto(true);
    }
  };

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      setAuthModalAberto(true);
      return;
    }

    // Se já tem um plano ativo, redirecionar para o dashboard
    if (userPlan && userPlan.status !== 'expired') {
      window.location.href = '/app';
      return;
    }

    // Ativar trial
    handleTrialActivation();
  };

  const handleAuthSuccess = () => {
    setAuthModalAberto(false);
    toast.success("Login realizado com sucesso!");
    
    setTimeout(() => {
      if (planoSelecionado) {
        setModalPagamentoAberto(true);
      } else {
        handleTrialActivation();
      }
    }, 500);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const planoPendente = localStorage.getItem('plano-pendente');
      if (planoPendente) {
        try {
          const plano = JSON.parse(planoPendente);
          setPlanoSelecionado(plano);
          localStorage.removeItem('plano-pendente');
          
          setTimeout(() => {
            setModalPagamentoAberto(true);
          }, 300);
        } catch (error) {
          console.error('Erro ao recuperar plano pendente:', error);
          localStorage.removeItem('plano-pendente');
        }
      }
    }
  }, [isAuthenticated]);

  return (
    <section id="planos" className="py-12 md:py-16 bg-white dark:bg-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary text-primary animate-fade-in">Planos & Teste Grátis</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
              Escolha o plano ideal para sua assistência técnica
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400 animate-fade-in mx-auto">
              Comece com nosso teste grátis de 7 dias ou escolha um dos planos comerciais para fazer seu negócio crescer.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500">
            Erro ao carregar os planos. Por favor, tente novamente.
          </div>
        )}

        {planos && planos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Plano Trial - Primeiro Card */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover-scale border-2 border-blue-500">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-bl-lg font-medium animate-fade-in">
                <Clock className="w-4 h-4 inline mr-1" />
                7 Dias Grátis
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Teste Grátis
                </CardTitle>
                <CardDescription>Experimente todas as funcionalidades</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center space-y-4">
                <div className="mb-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    R$ 0
                  </span>
                  <span className="text-gray-500 text-sm block">por 7 dias</span>
                </div>
                
                <ul className="space-y-2 text-left text-sm">
                  {trialFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                  size="lg"
                  onClick={handleStartTrial}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {isAuthenticated ? "Ativar Teste" : "Começar Grátis"}
                </Button>
              </CardFooter>
            </Card>

            {/* Planos Pagos */}
            {planos.map((plano) => (
              <Card key={plano.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover-scale ${plano.destacado ? "border-2 border-primary" : ""}`}>
                {plano.destacado && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg font-medium animate-fade-in">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                  <CardDescription>{plano.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                    <span className="text-gray-500">
                      {plano.periodo === "monthly" ? " /mês" : 
                       plano.periodo === "quarterly" ? " /trimestre" : 
                       " /ano"}
                    </span>
                  </div>
                  
                  <ul className="space-y-2 text-left">
                    {plano.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleAssinaturaPaga(plano)}
                  >
                    {isAuthenticated ? "Assinar Agora" : "Fazer Login e Assinar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <AuthModal
          isOpen={authModalAberto}
          onClose={() => setAuthModalAberto(false)}
          onSuccess={handleAuthSuccess}
          defaultTab="register"
          plano={planoSelecionado || undefined}
        />

        {planoSelecionado && (
          <ModalPagamento
            isOpen={modalPagamentoAberto}
            onClose={() => setModalPagamentoAberto(false)}
            plano={planoSelecionado}
          />
        )}
      </div>
    </section>
  );
}
