
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Assistencia } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAssistencia: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string, tipoUsuario?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  profile: ProfileType | null;
  assistencia: Assistencia | null;
  atualizarPerfilAssistencia: (dados: Partial<Assistencia>) => Promise<boolean>;
}

interface ProfileType {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role?: string;
  tipo_usuario?: 'admin' | 'assistencia' | 'cliente';
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
  role: "admin",
  tipo_usuario: "admin"
};

// Exemplo de assistência técnica pré-definida para demonstração
const ASSISTENCIA_EMAIL = "assistencia@exemplo.com";
const ASSISTENCIA_PASSWORD = "assistencia123";
const ASSISTENCIA_PROFILE: ProfileType = {
  id: "assist-id",
  nome: "Assistência Demo",
  email: ASSISTENCIA_EMAIL,
  cargo: "Técnico",
  role: "user",
  tipo_usuario: "assistencia"
};

const ASSISTENCIA_DATA: Assistencia = {
  id: "assist-id",
  nome: "Assistência Demo",
  email: ASSISTENCIA_EMAIL,
  plano: "Premium",
  status: "Ativa",
  dataRegistro: "01/05/2025",
  telefone: "(11) 5555-5555",
  celular: "(11) 98888-8888",
  responsavel: "João Técnico",
  userId: "assist-id"
};

// Lista de assistências mock para desenvolvimento
const MOCK_ASSISTENCIAS: Record<string, Assistencia> = {
  "assist-id": ASSISTENCIA_DATA,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [assistencia, setAssistencia] = useState<Assistencia | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAssistencia, setIsAssistencia] = useState<boolean>(false);
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

  // Função para buscar dados da assistência técnica (usando mock data)
  const fetchAssistenciaData = async (userId: string) => {
    // Primeiro verificar se é uma assistência mock
    if (MOCK_ASSISTENCIAS[userId]) {
      return MOCK_ASSISTENCIAS[userId];
    }
    
    // Caso contrário, deve-se implementar a busca real quando a tabela existir
    console.log('Buscando assistência para userId:', userId);
    
    // Retornando null por enquanto, até que a tabela assistencias seja criada
    return null;
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
            
            // Verificar se o usuário é uma assistência técnica
            setIsAssistencia(userProfile?.tipo_usuario === 'assistencia');
            
            // Se for uma assistência técnica, buscar dados adicionais
            if (userProfile?.tipo_usuario === 'assistencia') {
              const assistenciaData = await fetchAssistenciaData(newSession.user.id);
              setAssistencia(assistenciaData);
            } else {
              setAssistencia(null);
            }
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsAssistencia(false);
          setAssistencia(null);
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
          
          // Verificar se o usuário é uma assistência técnica
          setIsAssistencia(userProfile?.tipo_usuario === 'assistencia');
          
          // Se for uma assistência técnica, buscar dados adicionais
          if (userProfile?.tipo_usuario === 'assistencia') {
            fetchAssistenciaData(currentSession.user.id).then(assistenciaData => {
              setAssistencia(assistenciaData);
            });
          }
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
        setIsAssistencia(false);
        
        // Salvar em localStorage para manter a sessão
        localStorage.setItem('admin-session', 'true');
        localStorage.setItem('admin-profile', JSON.stringify(ADMIN_PROFILE));
        
        return true;
      }
      
      // Verificar se é o login da assistência técnica pré-definida
      if (email === ASSISTENCIA_EMAIL && senha === ASSISTENCIA_PASSWORD) {
        // Simular um login bem-sucedido para a assistência
        setUser({ id: ASSISTENCIA_PROFILE.id, email: ASSISTENCIA_EMAIL } as User);
        setProfile(ASSISTENCIA_PROFILE);
        setAssistencia(ASSISTENCIA_DATA);
        setIsAuthenticated(true);
        setIsAdmin(false);
        setIsAssistencia(true);
        
        // Salvar em localStorage para manter a sessão
        localStorage.setItem('assistencia-session', 'true');
        localStorage.setItem('assistencia-profile', JSON.stringify(ASSISTENCIA_PROFILE));
        localStorage.setItem('assistencia-data', JSON.stringify(ASSISTENCIA_DATA));
        
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
        setIsAssistencia(userProfile?.tipo_usuario === 'assistencia');
        
        // Se for uma assistência técnica, buscar dados adicionais
        if (userProfile?.tipo_usuario === 'assistencia') {
          const assistenciaData = await fetchAssistenciaData(data.user.id);
          setAssistencia(assistenciaData);
        } else {
          setAssistencia(null);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro ao processar o login");
      return false;
    }
  };

  const registrar = async (nome: string, email: string, senha: string, tipoUsuario: string = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nome,
            role: 'user', // Definir papel como 'user' por padrão
            tipo_usuario: tipoUsuario, // Pode ser 'user', 'assistencia', etc.
          },
        },
      });

      if (error) {
        console.error("Erro ao registrar:", error.message);
        toast.error("Erro ao registrar: " + error.message);
        return false;
      }
      
      // Se for registro de uma assistência técnica, salvar em MOCK_ASSISTENCIAS
      // No futuro, quando a tabela existir, isso seria inserido no banco
      if (tipoUsuario === 'assistencia' && data?.user) {
        const novaAssistencia: Assistencia = {
          id: data.user.id,
          nome: nome,
          email: email,
          status: "Ativa",
          plano: "Básico", // Plano padrão
          dataRegistro: new Date().toISOString().split('T')[0],
          userId: data.user.id
        };
        
        // Salvar em mock local
        MOCK_ASSISTENCIAS[data.user.id] = novaAssistencia;
        console.log("Assistência registrada em mock:", novaAssistencia);
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
      }
      // Se for a assistência técnica pré-definida
      else if (profile?.id === ASSISTENCIA_PROFILE.id) {
        localStorage.removeItem('assistencia-session');
        localStorage.removeItem('assistencia-profile');
        localStorage.removeItem('assistencia-data');
        setUser(null);
        setProfile(null);
        setAssistencia(null);
        setIsAuthenticated(false);
        setIsAssistencia(false);
      }
      else {
        // Logout normal via Supabase
        await supabase.auth.signOut();
      }
      
      setProfile(null);
      setIsAdmin(false);
      setIsAssistencia(false);
      setAssistencia(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Ocorreu um erro ao fazer logout");
    }
  };
  
  // Função para atualizar os dados da assistência técnica
  const atualizarPerfilAssistencia = async (dados: Partial<Assistencia>) => {
    try {
      if (!user || !isAssistencia || !assistencia) {
        toast.error("Não autorizado");
        return false;
      }
      
      // Se for a assistência técnica pré-definida (demo)
      if (profile?.id === ASSISTENCIA_PROFILE.id) {
        const dadosAtualizados = { ...assistencia, ...dados };
        setAssistencia(dadosAtualizados);
        MOCK_ASSISTENCIAS[profile.id] = dadosAtualizados;
        localStorage.setItem('assistencia-data', JSON.stringify(dadosAtualizados));
        toast.success("Dados atualizados com sucesso");
        return true;
      }
      
      // Para assistências reais, atualizar no MOCK_ASSISTENCIAS
      // No futuro, quando a tabela existir, isso seria atualizado no banco
      if (MOCK_ASSISTENCIAS[user.id]) {
        const dadosAtualizados = { ...MOCK_ASSISTENCIAS[user.id], ...dados };
        MOCK_ASSISTENCIAS[user.id] = dadosAtualizados;
        setAssistencia(dadosAtualizados);
        toast.success("Dados atualizados com sucesso");
        return true;
      }
      
      console.log("Tentativa de atualizar dados para um usuário desconhecido:", user.id);
      toast.error("Usuário não encontrado");
      return false;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Ocorreu um erro ao atualizar o perfil");
      return false;
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
    
    // Verificar se há uma sessão de assistência armazenada
    const assistenciaSession = localStorage.getItem('assistencia-session');
    const assistenciaProfile = localStorage.getItem('assistencia-profile');
    const assistenciaData = localStorage.getItem('assistencia-data');
    
    if (assistenciaSession === 'true' && assistenciaProfile && assistenciaData) {
      try {
        const parsedProfile = JSON.parse(assistenciaProfile);
        const parsedData = JSON.parse(assistenciaData);
        setUser({ id: parsedProfile.id, email: parsedProfile.email } as User);
        setProfile(parsedProfile);
        setAssistencia(parsedData);
        setIsAuthenticated(true);
        setIsAssistencia(true);
        setLoading(false);
      } catch (e) {
        console.error('Erro ao carregar perfil de assistência:', e);
        localStorage.removeItem('assistencia-session');
        localStorage.removeItem('assistencia-profile');
        localStorage.removeItem('assistencia-data');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated,
      isAdmin,
      isAssistencia,
      login, 
      registrar, 
      logout, 
      loading,
      profile,
      assistencia,
      atualizarPerfilAssistencia
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
