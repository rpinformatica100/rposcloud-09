import { createContext, useContext, useState, useEffect } from 'react';
import { Assistencia } from '@/types';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  tipo: 'cliente' | 'assistencia';
  empresa?: string;
  data_cadastro: string;
  ultimo_acesso: string;
  plano: string;
  status_plano: string;
  data_vencimento_plano: string;
}

interface Profile {
  nome: string;
  email: string;
  tipo: 'cliente' | 'assistencia';
  empresa?: string;
}

interface AuthContextProps {
  usuario: Usuario | null;
  user: Usuario | null;
  profile: Profile | null;
  assistencia: Assistencia | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAssistencia: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string, tipo?: 'cliente' | 'assistencia') => Promise<boolean>;
  logout: () => void;
  atualizarUltimoAcesso: (id: string) => void;
  atualizarPerfilAssistencia: (dados: Partial<Assistencia>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps>({
  usuario: null,
  user: null,
  profile: null,
  assistencia: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isAssistencia: false,
  login: async () => false,
  registrar: async () => false,
  logout: () => {},
  atualizarUltimoAcesso: () => {},
  atualizarPerfilAssistencia: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        const user = JSON.parse(storedUser) as Usuario;
        if (user.email === email && user.senha === senha) {
          setUsuario(user);
          localStorage.setItem('usuario', JSON.stringify(user));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, senha: string, tipo: 'cliente' | 'assistencia' = 'cliente'): Promise<boolean> => {
    try {
      setLoading(true);
      
      const novoUsuario: Usuario = {
        id: `user_${Date.now()}`,
        nome,
        email,
        senha,
        tipo,
        empresa: tipo === 'assistencia' ? nome : undefined,
        data_cadastro: new Date().toISOString(),
        ultimo_acesso: new Date().toISOString(),
        plano: 'trial_plan',
        status_plano: 'trial',
        data_vencimento_plano: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      setUsuario(novoUsuario);
      localStorage.setItem('usuario', JSON.stringify(novoUsuario));
      return true;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const atualizarUltimoAcesso = (id: string) => {
    try {
      const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        const user = JSON.parse(storedUser) as Usuario;
        if (user.id === id) {
          const updatedUser = { ...user, ultimo_acesso: new Date().toISOString() };
          setUsuario(updatedUser);
          localStorage.setItem('usuario', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error);
    }
  };

  const atualizarPerfilAssistencia = async (dados: Partial<Assistencia>): Promise<boolean> => {
    try {
      // Mock implementation - em um ambiente real seria uma API call
      console.log('Atualizando perfil da assistência:', dados);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil da assistência:', error);
      return false;
    }
  };

  // Derived values
  const isAuthenticated = !!usuario;
  const isAdmin = usuario?.email === 'admin@sistema.com';
  const isAssistencia = usuario?.tipo === 'assistencia';

  const profile: Profile | null = usuario ? {
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    empresa: usuario.empresa
  } : null;

  const assistencia: Assistencia | null = isAssistencia ? {
    id: usuario?.id || '',
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    plano: usuario?.plano || 'trial_plan',
    status: 'Ativa',
    dataRegistro: usuario?.data_cadastro || new Date().toISOString(),
    cadastroCompleto: false,
    mensagemCadastroExibida: false
  } : null;

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      user: usuario,
      profile,
      assistencia,
      loading, 
      isAuthenticated,
      isAdmin,
      isAssistencia,
      login, 
      registrar, 
      logout, 
      atualizarUltimoAcesso,
      atualizarPerfilAssistencia
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
