
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PlanChoiceModal from './PlanChoiceModal';

const HeroSection = () => {
  const [planChoiceModalOpen, setPlanChoiceModalOpen] = useState(false);

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background elements with consistent styling */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="container max-w-7xl px-4 md:px-6 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content - Better centered and spaced */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              🚀 Nova versão disponível - Acesse agora!
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Gerencie sua{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Assistência Técnica
              </span>
              <br />
              na nuvem
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl lg:text-2xl dark:text-gray-400 leading-relaxed max-w-2xl lg:max-w-none">
              Acesse de qualquer lugar com o RP OS Cloud. Simplifique processos, organize ordens de serviço e tenha controle financeiro completo em uma única plataforma moderna e intuitiva.
            </p>

            <div className="flex justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg px-8 py-4 h-auto"
                onClick={() => setPlanChoiceModalOpen(true)}
              >
                Começar Agora - Teste ou Assine
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Trust indicators - Better spacing */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 md:gap-8 text-base text-gray-500 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Teste grátis por 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Sem cartão de crédito</span>
              </div>
            </div>
          </div>

          {/* Image - Better proportions and centering */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xl rounded-xl border overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl bg-white/50 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Dashboard da plataforma RP OS Cloud" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlanChoiceModal
        isOpen={planChoiceModalOpen}
        onClose={() => setPlanChoiceModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
