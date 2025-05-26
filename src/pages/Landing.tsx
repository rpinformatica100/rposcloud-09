
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PlanosSection from '@/components/landing/PlanosSection';
import MobileNav from '@/components/landing/MobileNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Otimizada para Mobile */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-md w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <Link to="/" className="text-base md:text-lg font-semibold text-foreground">TechOS</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="font-medium transition-colors hover:text-primary">Recursos</a>
            <a href="#planos" className="font-medium transition-colors hover:text-primary">Planos</a>
            <a href="#testimonials" className="font-medium transition-colors hover:text-primary">Depoimentos</a>
            <a href="#faq" className="font-medium transition-colors hover:text-primary">Perguntas</a>
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrar</Button>
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
    </div>
  );
}
