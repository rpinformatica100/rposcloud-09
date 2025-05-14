
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-3xl w-full px-4 py-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          Sistema de Ordens de Serviço
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gerencie suas ordens de serviço, clientes, produtos e finanças em um único lugar.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {!isAuthenticated ? (
            <>
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="min-w-[160px]"
              >
                Entrar
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/register")}
                className="min-w-[160px]"
              >
                Criar Conta
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              onClick={() => navigate("/app")}
              className="min-w-[160px]"
            >
              Acessar Sistema
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Ordens de Serviço</h3>
            <p className="text-muted-foreground">
              Crie e gerencie suas ordens de serviço de forma simples e eficiente.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Gestão de Clientes</h3>
            <p className="text-muted-foreground">
              Mantenha um cadastro completo de seus clientes e histórico de serviços.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Controle Financeiro</h3>
            <p className="text-muted-foreground">
              Acompanhe receitas e despesas relacionadas aos serviços prestados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
