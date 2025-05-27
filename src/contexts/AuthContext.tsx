
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
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Verificar usuário admin
      if (email === 'admin@sistema.com' && senha === 'admin123') {
        const adminUser: Usuario = {
          id: 'admin',
          nome: 'Administrador',
          email: 'admin@sistema.com',
          tipo: 'assistencia',
          data_cadastro: new Date().toISOString(),
          ultimo_acesso: new Date().toISOString(),
          plano: 'enterprise_plan',
          status_plano: 'ativo',
          data_vencimento_plano: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        setUsuario(adminUser);
        localStorage.setItem('usuario', JSON.stringify(adminUser));
        return true;
      }

      // Verificar usuários registrados
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]') as Usuario[];
      const user = allUsers.find(u => u.email === email && u.senha === senha);
      
      if (user) {
        const updatedUser = { ...user, ultimo_acesso: new Date().toISOString() };
        setUsuario(updatedUser);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
        
        // Atualizar na lista de usuários
        const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('all_users', JSON.stringify(updatedUsers));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, senha: string, tipo: 'cliente' | 'assistencia' = 'assistencia'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Verificar se já existe usuário com este email
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]') as Usuario[];
      if (allUsers.some(u => u.email === email)) {
        console.error('Email já cadastrado');
        return false;
      }
      
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

      // Salvar na lista de todos os usuários
      const updatedUsers = [...allUsers, novoUsuario];
      localStorage.setItem('all_users', JSON.stringify(updatedUsers));
      
      // Fazer login automático
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
      if (usuario && usuario.id === id) {
        const updatedUser = { ...usuario, ultimo_acesso: new Date().toISOString() };
        setUsuario(updatedUser);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error);
    }
  };

  const atualizarPerfilAssistencia = async (dados: Partial<Assistencia>): Promise<boolean> => {
    try {
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
