
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrdemViewLoaderProps {
  isLoading: boolean;
  error?: Error | null;
}

export function OrdemViewLoader({ isLoading, error }: OrdemViewLoaderProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados da ordem...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar ordem</h2>
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar os dados da ordem de serviço.
        </p>
        <Button onClick={() => navigate("/app/ordens")}>Voltar para lista</Button>
      </div>
    );
  }

  return null;
}
