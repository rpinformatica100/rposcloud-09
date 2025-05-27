
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Cloud } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, senha);
      if (success) {
        toast.success("Login realizado com sucesso", {
          description: "Bem-vindo ao RP OS Cloud",
        });
        
        // Verifica se é admin para redirecionar para o painel administrativo
        if (isAdmin || email === "admin@sistema.com") {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      } else {
        toast.error("Erro ao fazer login", {
          description: "Verifique suas credenciais e tente novamente",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login", {
        description: "Ocorreu um erro ao processar sua solicitação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center mb-2">
            <div className="bg-primary text-white rounded-md w-10 h-10 flex items-center justify-center mr-2">
              <Cloud size={20} />
            </div>
            <h1 className="text-3xl font-bold text-primary">RP OS Cloud</h1>
          </Link>
          <p className="text-gray-600 mt-1">Entre para gerenciar suas ordens de serviço</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-right">
                <a href="#" className="text-primary hover:underline">Esqueceu sua senha?</a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Entrar</span>
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Registre-se
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Dica:</strong> Acesse com o email <span className="font-mono">admin@sistema.com</span> e 
            senha <span className="font-mono">admin123</span> para entrar no painel administrativo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
