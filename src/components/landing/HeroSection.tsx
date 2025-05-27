
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 xl:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl animate-fade-in">
            Gerencie sua <span className="text-primary">Assistência Técnica</span> na nuvem
          </h1>
          <p className="mx-auto max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-xl/relaxed dark:text-gray-400 animate-fade-in px-4">
            Acesse de qualquer lugar com o RP OS Cloud. Simplifique processos, organize ordens de serviço e tenha controle financeiro em uma única plataforma.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in justify-center items-center w-full max-w-md mx-auto">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="story-link hover-scale w-full sm:min-w-[160px]">
              Comece Grátis
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="hover-scale w-full sm:min-w-[160px]">
              Saiba Mais
            </Button>
          </a>
        </div>
        
        <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-lg border overflow-hidden shadow-xl animate-scale-in mx-auto mt-8">
          <img 
            src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dashboard da plataforma RP OS Cloud"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
