
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senhas
    if (senha !== confirmarSenha) {
      toast.error("Erro de validação", {
        description: "As senhas não coincidem",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await registrar(nome, email, senha);
      if (success) {
        toast.success("Registro realizado com sucesso", {
          description: "Bem-vindo ao Sistema de Ordens de Serviço",
        });
        navigate("/app");
      } else {
        toast.error("Erro ao registrar", {
          description: "Não foi possível criar sua conta",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar", {
        description: "Ocorreu um erro ao processar sua solicitação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sistema OS</h1>
          <p className="text-gray-600 mt-1">Crie sua conta para gerenciar ordens de serviço</p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle>Registre-se</CardTitle>
            <CardDescription>
              Crie uma nova conta no sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome completo</Label>
                <Input 
                  id="nome" 
                  type="text" 
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  startContent={<User className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  startContent={<Mail className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="senha">Senha</Label>
                <Input 
                  id="senha" 
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  startContent={<Lock className="h-4 w-4" />}
                  endContent={
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility}
                      className="focus:outline-none"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      }
                    </button>
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <Input 
                  id="confirmarSenha" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  startContent={<Lock className="h-4 w-4" />}
                  endContent={
                    <button 
                      type="button" 
                      onClick={toggleConfirmPasswordVisibility}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      }
                    </button>
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrar
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline flex items-center justify-center mt-1">
                  <span>Faça login</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
