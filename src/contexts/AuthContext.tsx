
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

// Usuário administrador pré-definido para demonstração
const ADMIN_EMAIL = "admin@sistema.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_PROFILE: ProfileType = {
  id: "admin-id",
  nome: "Administrador do Sistema",
  email: ADMIN_EMAIL,
  cargo: "Gerente",
  role: "admin"
};

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
      // Verificar se é o login do administrador pré-definido
      if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
        // Simular um login bem-sucedido para o administrador
        setUser({ id: ADMIN_PROFILE.id, email: ADMIN_EMAIL } as User);
        setProfile(ADMIN_PROFILE);
        setIsAuthenticated(true);
        setIsAdmin(true);
        
        // Salvar em localStorage para manter a sessão
        localStorage.setItem('admin-session', 'true');
        localStorage.setItem('admin-profile', JSON.stringify(ADMIN_PROFILE));
        
        return true;
      }
      
      // Login normal via Supabase para outros usuários
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
      // Se for o administrador pré-definido
      if (profile?.id === ADMIN_PROFILE.id) {
        localStorage.removeItem('admin-session');
        localStorage.removeItem('admin-profile');
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } else {
        // Logout normal via Supabase
        await supabase.auth.signOut();
      }
      
      setProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Ocorreu um erro ao fazer logout");
    }
  };

  // Verificar ao iniciar se há uma sessão de admin armazenada
  useEffect(() => {
    const adminSession = localStorage.getItem('admin-session');
    const adminProfile = localStorage.getItem('admin-profile');
    
    if (adminSession === 'true' && adminProfile) {
      try {
        const parsedProfile = JSON.parse(adminProfile);
        setUser({ id: parsedProfile.id, email: parsedProfile.email } as User);
        setProfile(parsedProfile);
        setIsAuthenticated(true);
        setIsAdmin(true);
        setLoading(false);
      } catch (e) {
        console.error('Erro ao carregar perfil admin:', e);
        localStorage.removeItem('admin-session');
        localStorage.removeItem('admin-profile');
      }
    }
  }, []);

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
