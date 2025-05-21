
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CadastroIncompleto = () => {
  const { assistencia, atualizarPerfilAssistencia } = useAuth();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    // Mostrar o alerta apenas se:
    // 1. Existe uma assistência logada
    // 2. O cadastro não está completo
    // 3. A mensagem não foi exibida antes (primeira vez ou quando redefine)
    if (
      assistencia && 
      assistencia.cadastroCompleto === false && 
      assistencia.mensagemCadastroExibida === false
    ) {
      setMostrarAlerta(true);
    } else {
      setMostrarAlerta(false);
    }
  }, [assistencia]);

  const fecharAlerta = async () => {
    setMostrarAlerta(false);
    
    // Marcar que a mensagem já foi exibida para não mostrar novamente
    if (assistencia) {
      await atualizarPerfilAssistencia({
        mensagemCadastroExibida: true
      });
    }
  };

  if (!mostrarAlerta) return null;

  return (
    <Alert className="bg-amber-50 border-amber-300 mb-4 relative">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 pr-8">
        <span className="font-semibold">Complete seu cadastro</span> para aproveitar todos os recursos.
        <div className="mt-2">
          <Button asChild variant="outline" size="sm" className="bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800">
            <Link to="/app/configuracoes">
              Completar agora
            </Link>
          </Button>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
        onClick={fecharAlerta}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </Button>
    </Alert>
  );
};

export default CadastroIncompleto;
