import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypingEffect } from '@/components/ui/typing-effect';
import { ArrowRight } from 'lucide-react';
const HeroSection = () => {
  const [typingComplete, setTypingComplete] = useState(false);
  return <section className="w-full py-12 md:py-20 lg:py-28 xl:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute w-2 h-2 bg-primary/20 rounded-full animate-bounce-subtle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }} />)}
      </div>

      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center relative z-10">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 transition-all duration-1000 ${typingComplete ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
            🚀 Nova versão disponível - Acesse agora!
          </div>
          
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            <TypingEffect text="Gerencie sua " speed={80} onComplete={() => setTypingComplete(true)} />
            {typingComplete && <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 animate-fade-in">
                <TypingEffect text="Assistência Técnica" speed={60} />
              </span>}
            <br />
            <span className={`${typingComplete ? 'animate-fade-in animation-delay-1000' : 'opacity-0'}`}>
              na nuvem
            </span>
          </h1>
          
          <p className={`mx-auto max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-xl/relaxed dark:text-gray-400 px-4 transition-all duration-1000 ${typingComplete ? 'animate-fade-in animation-delay-2000' : 'opacity-0 translate-y-4'}`}>
            Acesse de qualquer lugar com o RP OS Cloud. Simplifique processos, organize ordens de serviço e tenha controle financeiro completo em uma única plataforma moderna e intuitiva.
          </p>
        </div>
        
        <div className={`flex justify-center items-center w-full max-w-md mx-auto transition-all duration-1000 ${typingComplete ? 'animate-fade-in animation-delay-3000' : 'opacity-0 translate-y-8'}`}>
          <a href="#trial" className="w-full">
            <Button size="lg" className="group w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Teste Grátis por 7 Dias
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>

        {/* Trust indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-500 transition-all duration-1000 ${typingComplete ? 'animate-fade-in animation-delay-3500' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Teste grátis por 7 dias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Suporte 24/7</span>
          </div>
        </div>
        
        <div className={`w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-xl border overflow-hidden shadow-2xl mx-auto mt-8 transform transition-all duration-1000 hover:scale-105 hover:shadow-3xl bg-white/50 backdrop-blur-sm ${typingComplete ? 'animate-scale-in animation-delay-4000' : 'opacity-0 scale-95'}`}>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Dashboard da plataforma RP OS Cloud" className="w-full h-auto transform transition-transform duration-700 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;