
import { useState } from 'react';
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

export default function Landing() {
  const [planChoiceModalOpen, setPlanChoiceModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Simplificada */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-md w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 flex-shrink-0">
              <Cloud size={14} className="md:w-4 md:h-4" />
            </div>
            <Link to="/" className="text-base md:text-lg font-semibold text-foreground">RP OS Cloud</Link>
          </div>
          
          {/* Desktop Navigation - Simplificado */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="font-medium transition-colors hover:text-primary">Recursos</a>
            <a href="#trial" className="font-medium transition-colors hover:text-primary">Teste Grátis</a>
            <a href="#planos" className="font-medium transition-colors hover:text-primary">Planos</a>
          </nav>
          
          {/* Desktop Action Button - Apenas Login */}
          <div className="hidden md:flex items-center">
            <Link to="/login">
              <Button variant="outline" size="sm">Acessar Sistema</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Stats Section */}
      <div id="stats">
        <StatsSection />
      </div>
      
      {/* Trial Section */}
      <div id="trial">
        <TrialSection />
      </div>
      
      {/* Planos Section */}
      <PlanosSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <LandingFooter />
      
      <PlanChoiceModal
        isOpen={planChoiceModalOpen}
        onClose={() => setPlanChoiceModalOpen(false)}
      />
    </div>
  );
}
