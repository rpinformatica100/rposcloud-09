
// Funções de autenticação para o sistema de OS

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

// Simulação de usuário para teste
const usuarioTeste: Usuario = {
  id: "1",
  nome: "Usuário Teste",
  email: "teste@sistema.com",
  cargo: "Administrador",
};

// Adiciona funções para o gerenciamento de sessão
const SESSION_TOKEN_KEY = "os-auth-token";
const SESSION_USER_KEY = "os-usuario";
const SESSION_EXPIRY_KEY = "os-auth-expiry";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

// Verifica se o usuário está autenticado e se a sessão ainda é válida
export const isAutenticado = (): boolean => {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
  
  if (!token || !expiryStr) {
    return false;
  }
  
  const expiry = parseInt(expiryStr, 10);
  const now = Date.now();
  
  // Se a sessão expirou, limpe os dados
  if (now > expiry) {
    logout();
    return false;
  }
  
  // Renova a sessão a cada vez que a autenticação é verificada
  extendSession();
  return true;
};

// Estende o tempo de sessão
const extendSession = (): void => {
  const expiry = Date.now() + SESSION_DURATION;
  localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
};

// Login do usuário
export const login = (email: string, senha: string): Usuario | null => {
  // Em uma aplicação real, isso seria uma chamada à API
  if ((email === "teste@sistema.com" && senha === "123456") || 
      (email === "admin@sistema.com" && senha === "admin123")) {
    const token = "token-simulado-" + Date.now();
    const expiry = Date.now() + SESSION_DURATION;
    
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(usuarioTeste));
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
    
    return usuarioTeste;
  }
  return null;
};

// Registro de novo usuário
export const registrar = (nome: string, email: string, senha: string): Usuario | null => {
  // Em uma aplicação real, seria uma chamada à API
  const novoUsuario = { ...usuarioTeste, nome, email };
  const token = "token-simulado-" + Date.now();
  const expiry = Date.now() + SESSION_DURATION;
  
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(novoUsuario));
  localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
  
  return novoUsuario;
};

// Logout do usuário
export const logout = (): void => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
};

// Busca o usuário atual
export const getUsuarioAtual = (): Usuario | null => {
  if (!isAutenticado()) {
    return null;
  }
  
  const usuario = localStorage.getItem(SESSION_USER_KEY);
  if (usuario) {
    return JSON.parse(usuario) as Usuario;
  }
  return null;
};

// Verifica e renova a autenticação se necessário
export const checkAuth = (): boolean => {
  return isAutenticado();
};
