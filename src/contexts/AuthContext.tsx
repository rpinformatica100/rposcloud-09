
import { createContext, useContext, useState, useEffect } from 'react';
import { Assistencia } from '@/types';
import { testUsers, initializeTestUsers } from '@/data/testUsers';
import { StateManager } from '@/utils/stateManager';

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
  const stateManager = StateManager.getInstance();

  useEffect(() => {
    // Inicializar usuários de teste na primeira carga
    initializeTestUsers();
    
    // Validar integridade dos dados
    const validation = stateManager.validateDataIntegrity();
    if (!validation.isValid) {
      console.warn('Problemas de integridade detectados:', validation.errors);
    }

    // Tentar carregar usuário do localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Usuário carregado do localStorage:', parsedUser);
        setUsuario(parsedUser);
        
        // Salvar estado do usuário
        stateManager.saveUserState(parsedUser.id, {
          login_time: new Date().toISOString(),
          user_data: parsedUser
        });
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    console.log('Tentativa de login:', { email, senha });
    
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
          plano: 'enterprise',
          status_plano: 'active',
          data_vencimento_plano: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setUsuario(adminUser);
        localStorage.setItem('usuario', JSON.stringify(adminUser));
        stateManager.saveUserState(adminUser.id, {
          login_time: new Date().toISOString(),
          user_data: adminUser
        });
        
        console.log('Login admin realizado com sucesso');
        return true;
      }

      // Verificar usuários registrados
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]') as Usuario[];
      console.log('Usuários disponíveis:', allUsers.map(u => ({ email: u.email, senha: u.senha })));
      
      const user = allUsers.find(u => u.email === email && u.senha === senha);
      console.log('Usuário encontrado:', user);
      
      if (user) {
        const updatedUser = { 
          ...user, 
          ultimo_acesso: new Date().toISOString() 
        };
        
        setUsuario(updatedUser);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
        
        // Atualizar na lista de usuários
        const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('all_users', JSON.stringify(updatedUsers));
        
        // Salvar estado do usuário
        stateManager.saveUserState(updatedUser.id, {
          login_time: new Date().toISOString(),
          user_data: updatedUser
        });
        
        console.log('Login realizado com sucesso para:', email);
        return true;
      }

      console.log('Credenciais inválidas para:', email);
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
      console.log('Tentativa de registro:', { nome, email, tipo });
      
      // Verificar se já existe usuário com este email
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]') as Usuario[];
      if (allUsers.some(u => u.email === email)) {
        console.error('Email já cadastrado:', email);
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
      
      // Salvar estado do usuário
      stateManager.saveUserState(novoUsuario.id, {
        registration_time: new Date().toISOString(),
        user_data: novoUsuario
      });
      
      console.log('Registro realizado com sucesso:', novoUsuario);
      return true;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (usuario) {
      console.log('Logout realizado para:', usuario.email);
      stateManager.saveUserState(usuario.id, {
        logout_time: new Date().toISOString(),
        user_data: usuario
      });
    }
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const atualizarUltimoAcesso = (id: string) => {
    try {
      if (usuario && usuario.id === id) {
        const updatedUser = { ...usuario, ultimo_acesso: new Date().toISOString() };
        setUsuario(updatedUser);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
        
        stateManager.saveUserState(id, {
          last_access_update: new Date().toISOString(),
          user_data: updatedUser
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error);
    }
  };

  const atualizarPerfilAssistencia = async (dados: Partial<Assistencia>): Promise<boolean> => {
    try {
      console.log('Atualizando perfil da assistência:', dados);
      if (usuario) {
        stateManager.saveUserState(usuario.id, {
          profile_update: new Date().toISOString(),
          profile_data: dados
        });
      }
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
