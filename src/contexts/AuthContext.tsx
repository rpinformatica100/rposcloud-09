
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  profile: ProfileType | null;
}

interface ProfileType {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as ProfileType;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession?.user);

        // Se o usuário estiver logado, busca o perfil
        if (newSession?.user) {
          // Usando setTimeout para evitar deadlock com Supabase
          setTimeout(async () => {
            const userProfile = await fetchProfile(newSession.user.id);
            setProfile(userProfile);
            
            // Verificar se o usuário é administrador com base no papel (role)
            setIsAdmin(userProfile?.role === 'admin');
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    // Verifica se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);

      // Se o usuário estiver logado, busca o perfil
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(userProfile => {
          setProfile(userProfile);
          
          // Verificar se o usuário é administrador com base no papel (role)
          setIsAdmin(userProfile?.role === 'admin');
        });
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error("Erro ao fazer login:", error.message);
        toast.error("Erro ao fazer login: " + error.message);
        return false;
      }

      if (data?.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        setIsAdmin(userProfile?.role === 'admin');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro ao processar o login");
      return false;
    }
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nome,
            role: 'user', // Definir papel como 'user' por padrão
          },
        },
      });

      if (error) {
        console.error("Erro ao registrar:", error.message);
        toast.error("Erro ao registrar: " + error.message);
        return false;
      }

      return !!data?.user;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Ocorreu um erro ao processar o registro");
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Ocorreu um erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated,
      isAdmin,
      login, 
      registrar, 
      logout, 
      loading,
      profile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
