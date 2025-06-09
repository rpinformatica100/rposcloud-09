
import ConfiguracoesSimplesForm from "@/components/configuracoes/ConfiguracoesSimplesForm";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";

const ConfiguracoesList = () => {
  const { assistencia } = useSupabaseAuth();

  // Se for uma assistência, redirecionar para a página de configurações de assistência
  if (assistencia) {
    return <Navigate to="/app/configuracoes/assistencia" replace />;
  }

  return <ConfiguracoesSimplesForm />;
};

export default ConfiguracoesList;
