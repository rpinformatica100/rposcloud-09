
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação e se é administrador
    if (!loading) {
      if (!isAuthenticated) {
        toast.error("Acesso restrito", {
          description: "Faça login para acessar esta página"
        });
        navigate("/login");
      } else if (!isAdmin) {
        toast.error("Acesso negado", {
          description: "Você não tem permissão para acessar o painel de administração"
        });
        navigate("/app");
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

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

  // Não renderiza nada se não estiver autenticado ou não for admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="bg-gray-900 text-white shadow-sm border-b px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Painel de Administração</h1>
                <p className="text-sm text-gray-300">Gerenciamento completo do sistema</p>
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

export default AdminLayout;
