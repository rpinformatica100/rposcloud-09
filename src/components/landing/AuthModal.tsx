
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, LogIn, User, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, registrar } = useAuth();

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Register form
  const [registerNome, setRegisterNome] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSenha, setRegisterSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'assistencia'>('cliente');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(loginEmail, loginSenha);
      if (success) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para seu painel..."
        });
        onSuccess();
        // Redirecionar para a área correta baseado no tipo de usuário
        if (loginEmail === "admin@sistema.com") {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      } else {
        toast.error("Credenciais inválidas", {
          description: "Verifique seu email e senha e tente novamente."
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login", {
        description: "Ocorreu um erro inesperado. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerSenha !== confirmSenha) {
      toast.error("As senhas não conferem", {
        description: "Verifique se ambas as senhas são idênticas."
      });
      return;
    }
    
    if (registerSenha.length < 6) {
      toast.error("Senha muito fraca", {
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await registrar(registerNome, registerEmail, registerSenha, tipoUsuario);
      if (success) {
        toast.success("Conta criada com sucesso!", {
          description: "Bem-vindo ao RP OS Cloud! Redirecionando..."
        });
        onSuccess();
        navigate("/app");
      } else {
        toast.error("Erro ao criar conta", {
          description: "Verifique os dados e tente novamente."
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao criar conta", {
        description: "Ocorreu um erro inesperado. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginSenha("");
    setRegisterNome("");
    setRegisterEmail("");
    setRegisterSenha("");
    setConfirmSenha("");
    setTipoUsuario('cliente');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Acesse sua conta
          </DialogTitle>
          <DialogDescription>
            Faça login ou crie uma conta para continuar
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Entrando..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup value={tipoUsuario} onValueChange={(value) => setTipoUsuario(value as 'cliente' | 'assistencia')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cliente" id="cliente" />
                    <Label htmlFor="cliente" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Cliente
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assistencia" id="assistencia" />
                    <Label htmlFor="assistencia" className="flex items-center cursor-pointer">
                      <Building className="w-4 h-4 mr-2" />
                      Assistência Técnica
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-nome">Nome {tipoUsuario === 'assistencia' ? 'da Empresa' : 'Completo'}</Label>
                <Input
                  id="register-nome"
                  type="text"
                  placeholder={tipoUsuario === 'assistencia' ? "Nome da sua assistência técnica" : "Seu nome completo"}
                  value={registerNome}
                  onChange={(e) => setRegisterNome(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={registerSenha}
                  onChange={(e) => setRegisterSenha(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Criando conta..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Conta
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
