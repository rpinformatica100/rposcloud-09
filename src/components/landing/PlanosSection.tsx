
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import ModalPagamento from './ModalPagamento';
import { PagamentoCheckout } from '@/types';
import { toast } from "sonner";

type PlanoType = {
  id: number;
  nome: string;
  periodo: "mensal" | "trimestral" | "anual";
  preco: number;
  destacado: boolean;
  descricao: string;
}

// Esta é uma função simulada que mais tarde será substituída por uma chamada real à API
const fetchPlanos = async (): Promise<PlanoType[]> => {
  // Simulando uma chamada à API
  return [
    { 
      id: 1, 
      nome: "Plano Mensal", 
      periodo: "mensal",
      preco: 49.90,
      destacado: false,
      descricao: "Acesso completo por 1 mês"
    },
    { 
      id: 2, 
      nome: "Plano Trimestral", 
      periodo: "trimestral",
      preco: 129.90,
      destacado: true,
      descricao: "Acesso completo por 3 meses, economia de 15%"
    },
    { 
      id: 3, 
      nome: "Plano Anual", 
      periodo: "anual",
      preco: 399.90,
      destacado: false,
      descricao: "Acesso completo por 12 meses, economia de 35%"
    }
  ];
};

export default function PlanosSection() {
  const { data: planos, isLoading, error } = useQuery({
    queryKey: ['planos-landing'],
    queryFn: fetchPlanos
  });

  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoType | null>(null);

  // Features comuns a todos os planos
  const features = [
    "Gestão completa de ordens de serviço",
    "Cadastro ilimitado de clientes",
    "Controle de estoque de peças e produtos",
    "Relatórios financeiros",
    "Suporte técnico prioritário"
  ];

  const handleAssinatura = (plano: PlanoType) => {
    setPlanoSelecionado(plano);
    setModalPagamentoAberto(true);
  };

  const handleCheckout = (checkout: PagamentoCheckout) => {
    // Simular redirecionamento para checkout
    if (checkout.metodoPagamento === 'stripe') {
      toast.info("Redirecionando para checkout Stripe...", {
        description: `Plano: ${checkout.planoNome} - R$ ${checkout.preco.toFixed(2)}`
      });
      // Aqui seria o redirecionamento real para Stripe
      console.log("Checkout Stripe:", checkout);
    } else {
      toast.info("Redirecionando para PIX Mercado Pago...", {
        description: `Plano: ${checkout.planoNome} - R$ ${checkout.preco.toFixed(2)}`
      });
      // Aqui seria o redirecionamento real para Mercado Pago
      console.log("Checkout Mercado Pago:", checkout);
    }
  };

  return (
    <section id="planos" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary text-primary animate-fade-in">Planos & Preços</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">Escolha o plano ideal para o seu negócio</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400 animate-fade-in mx-auto">
              Oferecemos soluções adaptadas a diversos tipos e tamanhos de assistências técnicas.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                      {plano.periodo === "mensal" ? " /mês" : 
                       plano.periodo === "trimestral" ? " /trimestre" : 
                       " /ano"}
                    </span>
                  </div>
                  <ul className="space-y-2 text-left">
                    {features.map((feature, index) => (
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
                    className="w-full story-link" 
                    size="lg"
                    onClick={() => handleAssinatura(plano)}
                  >
                    Assinar Agora
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {planoSelecionado && (
          <ModalPagamento
            isOpen={modalPagamentoAberto}
            onClose={() => setModalPagamentoAberto(false)}
            plano={planoSelecionado}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </section>
  );
}
