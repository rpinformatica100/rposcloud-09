import { createContext, useContext, useState } from 'react';

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

interface AuthContextProps {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string, tipo?: 'cliente' | 'assistencia') => Promise<boolean>;
  logout: () => void;
  atualizarUltimoAcesso: (id: string) => void;
}

const AuthContext = createContext<AuthContextProps>({
  usuario: null,
  loading: true,
  login: async () => false,
  registrar: async () => false,
  logout: () => {},
  atualizarUltimoAcesso: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
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
        plano: 'trial_plan', // Corrigido: usar trial_plan ao invés de free_trial
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

  const atualizarUltimoAcesso = async (id: string) => {
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

  return (
    <AuthContext.Provider value={{ usuario, loading, login, registrar, logout, atualizarUltimoAcesso }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
