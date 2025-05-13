
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

// Verifica se o usuário está autenticado
export const isAutenticado = (): boolean => {
  return localStorage.getItem("os-auth-token") !== null;
};

// Login do usuário
export const login = (email: string, senha: string): Usuario | null => {
  // Em uma aplicação real, isso seria uma chamada à API
  if (email === "teste@sistema.com" && senha === "123456") {
    const token = "token-simulado-" + Date.now();
    localStorage.setItem("os-auth-token", token);
    localStorage.setItem("os-usuario", JSON.stringify(usuarioTeste));
    return usuarioTeste;
  }
  return null;
};

// Registro de novo usuário
export const registrar = (nome: string, email: string, senha: string): Usuario | null => {
  // Em uma aplicação real, seria uma chamada à API
  const novoUsuario = { ...usuarioTeste, nome, email };
  const token = "token-simulado-" + Date.now();
  localStorage.setItem("os-auth-token", token);
  localStorage.setItem("os-usuario", JSON.stringify(novoUsuario));
  return novoUsuario;
};

// Logout do usuário
export const logout = (): void => {
  localStorage.removeItem("os-auth-token");
  localStorage.removeItem("os-usuario");
};

// Busca o usuário atual
export const getUsuarioAtual = (): Usuario | null => {
  const usuario = localStorage.getItem("os-usuario");
  if (usuario) {
    return JSON.parse(usuario) as Usuario;
  }
  return null;
};
