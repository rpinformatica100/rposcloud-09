
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Cloud } from "lucide-react";
import { toast } from "sonner";

const SupabaseRegister = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha !== confirmSenha) {
      toast.error("As senhas não conferem");
      return;
    }
    
    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(nome, email, senha, 'assistencia');
      if (!error) {
        toast.success("Conta criada com sucesso!", {
          description: "Verifique seu email para confirmar a conta.",
        });
        navigate("/supabase-login");
      } else {
        toast.error("Erro ao criar conta", {
          description: error.message || "Verifique os dados e tente novamente",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao criar conta", {
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
          <p className="text-gray-600 mt-1">Crie sua conta para acessar o sistema</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta - Supabase</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se registrar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input 
                  id="nome" 
                  type="text" 
                  placeholder="Nome da sua assistência técnica"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
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
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Criar Conta</span>
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/supabase-login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseRegister;
