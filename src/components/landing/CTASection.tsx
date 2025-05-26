
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-primary text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-scale-in">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">Pronto para transformar sua assistência técnica?</h2>
            <p className="max-w-[600px] md:max-w-[700px] text-base md:text-xl/relaxed px-4">
              Comece agora mesmo e descubra como o TechOS pode melhorar a eficiência do seu negócio.
            </p>
          </div>
          <Link to="/register" className="animate-fade-in">
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100 hover-scale">
              Criar Minha Conta
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
