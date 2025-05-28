
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import PlanChoiceModal from './PlanChoiceModal';

export default function CTASection() {
  const [planChoiceModalOpen, setPlanChoiceModalOpen] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-blue-600 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Junte-se a centenas de assistências técnicas
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Pronto para transformar
              <br />
              sua assistência técnica?
            </h2>
            
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Comece hoje mesmo com nosso trial gratuito ou escolha um plano que se adapte ao seu negócio.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <Button 
              size="lg" 
              variant="secondary"
              className="group w-full sm:w-auto bg-white text-primary hover:bg-gray-100 font-semibold"
              onClick={() => setPlanChoiceModalOpen(true)}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-blue-100 pt-4">
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
