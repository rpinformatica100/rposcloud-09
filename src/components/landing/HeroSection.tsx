
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypingEffect } from '@/components/ui/typing-effect';

const HeroSection = () => {
  const [typingComplete, setTypingComplete] = useState(false);

  return (
    <section className="w-full py-12 md:py-20 lg:py-28 xl:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center relative z-10">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            <TypingEffect 
              text="Gerencie sua " 
              speed={80}
              onComplete={() => setTypingComplete(true)}
            />
            {typingComplete && (
              <span className="text-primary animate-fade-in">
                <TypingEffect 
                  text="Assistência Técnica"
                  speed={60}
                />
              </span>
            )}
            <br />
            <span className={`${typingComplete ? 'animate-fade-in animation-delay-1000' : 'opacity-0'}`}>
              na nuvem
            </span>
          </h1>
          <p className={`mx-auto max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-xl/relaxed dark:text-gray-400 px-4 transition-all duration-1000 ${typingComplete ? 'animate-fade-in animation-delay-2000' : 'opacity-0 translate-y-4'}`}>
            Acesse de qualquer lugar com o RP OS Cloud. Simplifique processos, organize ordens de serviço e tenha controle financeiro em uma única plataforma.
          </p>
        </div>
        
        <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full max-w-md mx-auto transition-all duration-1000 ${typingComplete ? 'animate-fade-in animation-delay-3000' : 'opacity-0 translate-y-8'}`}>
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="story-link hover-scale w-full sm:min-w-[160px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Comece Grátis
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="hover-scale w-full sm:min-w-[160px] border-2 hover:bg-primary/5 hover:border-primary/50 transform transition-all duration-300 hover:scale-105">
              Saiba Mais
            </Button>
          </a>
        </div>
        
        <div className={`w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-lg border overflow-hidden shadow-xl mx-auto mt-8 transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl ${typingComplete ? 'animate-scale-in animation-delay-4000' : 'opacity-0 scale-95'}`}>
          <img 
            src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dashboard da plataforma RP OS Cloud"
            className="w-full h-auto transform transition-transform duration-700 hover:scale-110"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
