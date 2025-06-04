
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
}

interface SupabaseAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  assistencia: Assistencia | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAssistencia: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (nome: string, email: string, password: string, tipo?: 'cliente' | 'assistencia') => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextProps>({
  user: null,
  session: null,
  profile: null,
  assistencia: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isAssistencia: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider = ({ children }: SupabaseAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assistencia, setAssistencia] = useState<Assistencia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setAssistencia(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
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

      console.log('Profile data:', profileData);
      
      // Validar e converter o tipo para o formato correto
      const tipoValido = profileData.tipo === 'cliente' || profileData.tipo === 'assistencia' 
        ? profileData.tipo as 'cliente' | 'assistencia'
        : 'assistencia'; // fallback padrão

      const profileFormatted: Profile = {
        id: profileData.id,
        nome: profileData.nome,
        email: profileData.email,
        tipo: tipoValido,
        empresa: profileData.empresa,
        plano_id: profileData.plano_id,
        status_plano: profileData.status_plano,
        data_vencimento_plano: profileData.data_vencimento_plano
      };

      setProfile(profileFormatted);

      // Se for assistência técnica, buscar dados da assistência
      if (tipoValido === 'assistencia') {
        const { data: assistenciaData, error: assistenciaError } = await supabase
          .from('assistencias')
          .select('*')
          .eq('email', profileData.email)
          .single();

        if (assistenciaError) {
          console.error('Error fetching assistencia:', assistenciaError);
        } else {
          console.log('Assistencia data:', assistenciaData);
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
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }

    return { error };
  };

  const signUp = async (nome: string, email: string, password: string, tipo: 'cliente' | 'assistencia' = 'assistencia') => {
    setLoading(true);
    
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
      setLoading(false);
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = profile?.email === 'admin@sistema.com';
  const isAssistencia = profile?.tipo === 'assistencia';

  return (
    <SupabaseAuthContext.Provider value={{
      user,
      session,
      profile,
      assistencia,
      loading,
      isAuthenticated,
      isAdmin,
      isAssistencia,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);
