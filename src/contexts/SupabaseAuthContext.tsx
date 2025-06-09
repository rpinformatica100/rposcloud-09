
import { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Assistencia } from '@/types';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'assistencia';
  empresa?: string;
  plano_id?: string;
  status_plano?: string;
  data_vencimento_plano?: string;
  stripe_customer_id?: string;
}

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  current_period_end: string;
  stripe_subscription_id: string;
}

interface SupabaseAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  assistencia: Assistencia | null;
  subscription: Subscription | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAssistencia: boolean;
  hasActiveSubscription: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (nome: string, email: string, password: string, tipo?: 'cliente' | 'assistencia') => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  createCheckout: (planType: string, priceId: string) => Promise<{ url?: string; error?: any }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: any }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextProps>({
  user: null,
  session: null,
  profile: null,
  assistencia: null,
  subscription: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isAssistencia: false,
  hasActiveSubscription: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refreshSubscription: async () => {},
  createCheckout: async () => ({}),
  openCustomerPortal: async () => ({}),
});

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider = ({ children }: SupabaseAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assistencia, setAssistencia] = useState<Assistencia | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de autenticação
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          // Buscar dados do usuário de forma assíncrona
          setTimeout(() => {
            if (mounted) {
              fetchUserData(session.user.id);
            }
          }, 100);
        } else {
          setProfile(null);
          setAssistencia(null);
          setSubscription(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const profileFormatted: Profile = {
        id: profileData.id,
        nome: profileData.nome,
        email: profileData.email,
        tipo: (profileData.tipo === 'cliente' || profileData.tipo === 'assistencia') 
          ? profileData.tipo as 'cliente' | 'assistencia'
          : 'assistencia',
        empresa: profileData.empresa,
        plano_id: profileData.plano_id,
        status_plano: profileData.status_plano,
        data_vencimento_plano: profileData.data_vencimento_plano,
        stripe_customer_id: profileData.stripe_customer_id
      };

      setProfile(profileFormatted);

      // Se for assistência técnica, buscar dados da assistência
      if (profileFormatted.tipo === 'assistencia') {
        const { data: assistenciaData, error: assistenciaError } = await supabase
          .from('assistencias')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!assistenciaError && assistenciaData) {
          setAssistencia({
            id: assistenciaData.id,
            nome: assistenciaData.nome,
            email: assistenciaData.email,
            plano: assistenciaData.plano || 'trial_plan',
            status: assistenciaData.status as 'Ativa' | 'Inativa' | 'Pendente' | 'Bloqueada',
            dataRegistro: assistenciaData.data_registro,
            telefone: assistenciaData.telefone || '',
            celular: assistenciaData.celular || '',
            responsavel: assistenciaData.responsavel || '',
            cadastroCompleto: assistenciaData.cadastro_completo || false,
            mensagemCadastroExibida: assistenciaData.mensagem_cadastro_exibida || false
          });
        }
      }

      // Buscar assinatura
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (nome: string, email: string, password: string, tipo: 'cliente' | 'assistencia' = 'assistencia') => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            tipo,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const createCheckout = async (planType: string, priceId: string) => {
    if (!session) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { planType, priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        return { error };
      }

      return { url: data.url };
    } catch (error) {
      console.error('Error in createCheckout:', error);
      return { error };
    }
  };

  const openCustomerPortal = async () => {
    if (!session) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error opening customer portal:', error);
        return { error };
      }

      return { url: data.url };
    } catch (error) {
      console.error('Error in openCustomerPortal:', error);
      return { error };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = profile?.email === 'admin@sistema.com';
  const isAssistencia = profile?.tipo === 'assistencia';
  const hasActiveSubscription = subscription?.status === 'active' && profile?.status_plano === 'active';

  return (
    <SupabaseAuthContext.Provider value={{
      user,
      session,
      profile,
      assistencia,
      subscription,
      loading,
      isAuthenticated,
      isAdmin,
      isAssistencia,
      hasActiveSubscription,
      signIn,
      signUp,
      signOut,
      refreshSubscription,
      createCheckout,
      openCustomerPortal,
    }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);
