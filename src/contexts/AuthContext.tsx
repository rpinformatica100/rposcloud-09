
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { login as authLogin, logout as authLogout, registrar as authRegistrar, getUsuarioAtual, isAutenticado } from "../lib/auth";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado ao carregar a página
    if (isAutenticado()) {
      const usuarioAtual = getUsuarioAtual();
      setUsuario(usuarioAtual);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const usuarioLogado = authLogin(email, senha);
      if (usuarioLogado) {
        setUsuario(usuarioLogado);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    try {
      const novoUsuario = authRegistrar(nome, email, senha);
      if (novoUsuario) {
        setUsuario(novoUsuario);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setUsuario(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, login, registrar, logout }}>
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
