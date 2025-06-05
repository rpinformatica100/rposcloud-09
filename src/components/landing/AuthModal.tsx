
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn, User, Gift, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTab?: 'login' | 'register';
  plano?: any;
  trialContext?: boolean;
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = 'login', plano, trialContext = false }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useSupabaseAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [registerNome, setRegisterNome] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSenha, setRegisterSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(loginEmail, loginSenha);
      if (!error) {
        const message = trialContext 
          ? "Login realizado! Ativando seu trial gratuito..."
          : "Login realizado com sucesso!";
        
        toast.success(message, {
          description: "Bem-vindo de volta!"
        });
        onSuccess();
      } else {
        toast.error("Erro ao fazer login", {
          description: "Verifique seu email e senha e tente novamente."
        });
      }
    } catch (error) {
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
      const { error } = await signUp(registerNome, registerEmail, registerSenha, 'assistencia');
      if (!error) {
        const message = trialContext 
          ? "Conta criada! Ativando seu trial gratuito de 7 dias..."
          : plano 
            ? "Conta criada! Redirecionando para pagamento..."
            : "Conta criada com sucesso!";
        
        toast.success(message, {
          description: "Bem-vindo ao RP OS Cloud!"
        });
        onSuccess();
      } else {
        toast.error("Erro ao criar conta", {
          description: "Email pode já estar em uso. Tente outro email."
        });
      }
    } catch (error) {
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
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const getTitle = () => {
    if (trialContext) return 'Criar conta para trial gratuito';
    if (plano) return 'Acesse sua conta para continuar';
    return 'Acesse sua conta';
  };

  const getDescription = () => {
    if (trialContext) return 'Crie uma conta para ativar seu trial gratuito de 7 dias';
    if (plano) return `Faça login ou crie uma conta para assinar o ${plano.nome}`;
    return 'Faça login ou crie uma conta para continuar';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {trialContext ? <Gift className="w-5 h-5 text-blue-500" /> : <User className="w-5 h-5" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
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
              {(plano || trialContext) && (
                <div className={`p-3 rounded-lg border ${trialContext ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                  <p className={`text-sm font-medium ${trialContext ? 'text-blue-700' : 'text-green-700'}`}>
                    {trialContext 
                      ? 'Criando conta para Trial Gratuito de 7 dias'
                      : `Criando conta para assinar o ${plano.nome}`
                    }
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="register-nome">Nome da Empresa</Label>
                <Input
                  id="register-nome"
                  type="text"
                  placeholder="Nome da sua assistência técnica"
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {trialContext 
                      ? 'Criar Conta e Ativar Trial'
                      : plano 
                        ? `Criar Conta e Assinar ${plano.nome}` 
                        : 'Criar Conta'
                    }
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
