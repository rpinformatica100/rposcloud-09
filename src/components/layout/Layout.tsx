
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";

const Layout = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação a cada 5 minutos para garantir persistência
    const interval = setInterval(() => {
      // Verificamos apenas se o usuário está autenticado usando o estado já existente
      if (!isAuthenticated) {
        navigate("/login");
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Redireciona para login apenas quando terminamos de verificar a autenticação
    // e confirmamos que o usuário não está autenticado
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostra um loader enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada enquanto redireciona
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">RP OS Cloud</h1>
                <p className="text-sm text-gray-500">Sistema completo de gestão para assistências técnicas</p>
              </div>
            </div>
          </header>
          
          <main className="p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
