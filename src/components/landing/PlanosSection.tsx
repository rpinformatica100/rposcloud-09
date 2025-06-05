
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

export default function PlanosSection() {
  const { isAuthenticated } = useSupabaseAuth();
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

  const handleAuthSuccess = () => {
    setAuthModalAberto(false);
    toast.success("Login realizado com sucesso!");
    
    setTimeout(() => {
      setModalPagamentoAberto(true);
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
            <Badge variant="outline" className="border-primary text-primary animate-fade-in">Planos Comerciais</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
              Planos para fazer seu negócio crescer
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400 animate-fade-in mx-auto">
              Escolha o plano ideal para sua assistência técnica e tenha acesso a todos os recursos avançados.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
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
