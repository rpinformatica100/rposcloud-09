
import ConfiguracoesSimplesForm from "@/components/configuracoes/ConfiguracoesSimplesForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ConfiguracoesList = () => {
  const { isAssistencia } = useAuth();

  // Se for uma assistência, redirecionar para a página de configurações de assistência
  if (isAssistencia) {
    return <Navigate to="/app/configuracoes/assistencia" replace />;
  }

  return <ConfiguracoesSimplesForm />;
};

export default ConfiguracoesList;
