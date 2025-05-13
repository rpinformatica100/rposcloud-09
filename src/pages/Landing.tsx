
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, registrar } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, senha);
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Ordens de Serviço",
        });
        navigate("/app");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validar campos
      if (!nome || !email || !senha) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos para se registrar",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const success = await registrar(nome, email, senha);
      if (success) {
        toast({
          title: "Registro realizado com sucesso",
          description: "Bem-vindo ao Sistema de Ordens de Serviço",
        });
        navigate("/app");
      } else {
        toast({
          title: "Erro ao registrar",
          description: "Não foi possível criar sua conta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro ao registrar",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-200">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800">Sistema OS</h1>
            <p className="mt-2 text-lg text-gray-600">
              Gestão completa de ordens de serviço
            </p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Entre com seu email e senha para acessar o sistema
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                      </div>
                      <Input 
                        id="password" 
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      Para teste, use: teste@sistema.com / 123456
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="bg-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Criar nova conta</CardTitle>
                  <CardDescription>
                    Preencha os dados para se registrar no sistema
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegistro}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input 
                        id="nome" 
                        type="text" 
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input 
                        id="email-register" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Senha</Label>
                      <Input 
                        id="password-register" 
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Registrando..." : "Registrar"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Landing;
