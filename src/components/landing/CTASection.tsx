
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import PlanChoiceModal from './PlanChoiceModal';

export default function CTASection() {
  const [planChoiceModalOpen, setPlanChoiceModalOpen] = useState(false);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary to-blue-600 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-7xl px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Junte-se a centenas de assistências técnicas
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Pronto para transformar
              <br />
              sua assistência técnica?
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Comece hoje mesmo com nosso trial gratuito ou escolha um plano que se adapte ao seu negócio.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="group w-full sm:w-auto bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-4 h-auto"
              onClick={() => setPlanChoiceModalOpen(true)}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-base text-blue-100 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Trial gratuito de 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Cancele quando quiser</span>
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
}
