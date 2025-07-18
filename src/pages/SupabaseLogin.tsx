
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Cloud } from "lucide-react";
import { toast } from "sonner";

const SupabaseLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      const { error } = await signIn(email, senha);
      
      if (!error) {
        toast.success("Login realizado com sucesso", {
          description: "Bem-vindo ao RP OS Cloud",
        });
        
        // Redirecionamento baseado no email
        if (email === "admin@sistema.com") {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      } else {
        console.error('Erro de login:', error);
        toast.error("Erro ao fazer login", {
          description: error.message || "Verifique suas credenciais e tente novamente",
        });
      }
    } catch (error) {
      console.error('Exceção durante login:', error);
      toast.error("Erro ao fazer login", {
        description: "Ocorreu um erro ao processar sua solicitação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setSenha(testPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-md mx-auto">
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
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <Label className="text-sm font-medium text-gray-700">Usuários de Teste:</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestLogin('admin@sistema.com', 'admin123')}
                    className="text-xs"
                  >
                    Admin (admin@sistema.com / admin123)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestLogin('assistencia@techsolutions.com', 'assistencia123')}
                    className="text-xs"
                  >
                    Assistência (assistencia@techsolutions.com / assistencia123)
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Clique em um botão para preencher os campos automaticamente
                </p>
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
                <Link to="/supabase-register" className="text-primary hover:underline font-medium">
                  Criar conta
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseLogin;
