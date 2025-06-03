
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PlanosSection from '@/components/landing/PlanosSection';
import TrialSection from '@/components/landing/TrialSection';
import MobileNav from '@/components/landing/MobileNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import PlanChoiceModal from '@/components/landing/PlanChoiceModal';
import { Cloud } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function Landing() {
  const [planChoiceModalOpen, setPlanChoiceModalOpen] = useState(false);

  // SEO optimization
  useSEO({
    title: 'Sistema de Gestão para Assistências Técnicas',
    description: 'Sistema completo na nuvem para gerenciamento de assistências técnicas. Gerencie ordens de serviço, clientes, produtos e financeiro em um só lugar. Teste grátis por 7 dias.',
    keywords: 'sistema assistência técnica, gestão ordens serviço, software assistência, sistema os, crm assistência técnica',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "RP OS Cloud",
      "description": "Sistema completo na nuvem para gerenciamento de assistências técnicas",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
        "description": "Trial gratuito de 7 dias"
      },
      "provider": {
        "@type": "Organization",
        "name": "RP OS Cloud"
      }
    }
  });

  // Preload critical pages
  useEffect(() => {
    const preloadPages = ['/login', '/app'];
    preloadPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Consistent spacing */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
              <Cloud size={16} />
            </div>
            <Link to="/" className="text-xl font-semibold text-foreground">RP OS Cloud</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-base">
            <a href="#features" className="font-medium transition-colors hover:text-primary">Recursos</a>
            <a href="#trial" className="font-medium transition-colors hover:text-primary">Teste Grátis</a>
            <a href="#planos" className="font-medium transition-colors hover:text-primary">Planos</a>
          </nav>
          
          {/* Desktop Action Button */}
          <div className="hidden md:flex items-center">
            <Link to="/login">
              <Button variant="outline" size="sm">Acessar Sistema</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>
      
      {/* Content sections with consistent spacing */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <div id="features" className="py-16 md:py-20 lg:py-24">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <FeaturesSection />
          </div>
        </div>
        
        {/* Stats Section */}
        <div id="stats" className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <StatsSection />
          </div>
        </div>
        
        {/* Trial Section */}
        <div id="trial" className="py-16 md:py-20 lg:py-24">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <TrialSection />
          </div>
        </div>
        
        {/* Planos Section */}
        <div id="planos" className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <PlanosSection />
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 md:py-20 lg:py-24">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <TestimonialsSection />
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <FAQSection />
          </div>
        </div>
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <LandingFooter />
      
      <PlanChoiceModal
        isOpen={planChoiceModalOpen}
        onClose={() => setPlanChoiceModalOpen(false)}
      />
    </div>
  );
}
