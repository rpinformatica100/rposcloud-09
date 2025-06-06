
import React, { useState } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PlanosSection from '@/components/landing/PlanosSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import StatsSection from '@/components/landing/StatsSection';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useSupabaseAuth();

  // Se já estiver autenticado, redirecionar para o app
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/app';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PlanosSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
