
import React, { useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PlanosSection from '@/components/landing/PlanosSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TrialSection from '@/components/landing/TrialSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import StatsSection from '@/components/landing/StatsSection';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import SupabaseAuthModal from '@/components/auth/SupabaseAuthModal';

const LandingPage = () => {
  const { isAuthenticated } = useSupabaseAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [selectedPlano, setSelectedPlano] = useState<any>(null);

  const openAuthModal = (tab: 'login' | 'register' = 'login', plano?: any) => {
    setAuthModalTab(tab);
    setSelectedPlano(plano);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Redirect to app after successful auth
    window.location.href = '/app';
  };

  // Se já estiver autenticado, redirecionar para o app
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/app';
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <HeroSection onOpenAuth={openAuthModal} />
        <StatsSection />
        <FeaturesSection />
        <PlanosSection onOpenAuth={openAuthModal} />
        <TestimonialsSection />
        <TrialSection onOpenAuth={openAuthModal} />
        <FAQSection />
        <CTASection onOpenAuth={openAuthModal} />
        <LandingFooter />
      </div>

      <SupabaseAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
        plano={selectedPlano}
      />
    </>
  );
};

export default LandingPage;
