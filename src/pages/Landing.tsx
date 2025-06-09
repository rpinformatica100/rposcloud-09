
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { isAuthenticated, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  // Se já estiver autenticado, redirecionar para o app
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('User is authenticated, redirecting to app');
      navigate('/app');
    }
  }, [isAuthenticated, loading, navigate]);

  // Não renderizar nada enquanto está carregando para evitar flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se já estiver autenticado, não mostrar a landing
  if (isAuthenticated) {
    return null;
  }

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
