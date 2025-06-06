
import React, { useEffect, useMemo, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import CadastroIncompleto from "@/components/CadastroIncompleto";
import PlanNotification from "@/components/plan/PlanNotification";

const SupabaseLayout = React.memo(() => {
  const { isAuthenticated, loading, isAssistencia } = useSupabaseAuth();
  const navigate = useNavigate();

  // Memoize auth status to prevent unnecessary re-renders
  const authStatus = useMemo(() => ({ 
    isAuthenticated, 
    loading 
  }), [isAuthenticated, loading]);

  // Memoize navigation callback
  const handleUnauthenticated = useCallback(() => {
    navigate("/supabase-login");
  }, [navigate]);

  // Single effect for auth handling
  useEffect(() => {
    if (!authStatus.loading && !authStatus.isAuthenticated) {
      handleUnauthenticated();
    }
  }, [authStatus.isAuthenticated, authStatus.loading, handleUnauthenticated]);

  // Show loading state
  if (authStatus.loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!authStatus.isAuthenticated) {
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
                <h1 className="text-xl font-semibold text-gray-800">RP OS Cloud (Supabase)</h1>
                <p className="text-sm text-gray-500">Sistema completo de gestão para assistências técnicas</p>
              </div>
              <PlanNotification showInHeader={true} compact={true} />
            </div>
          </header>
          
          <main className="p-4 sm:p-6 md:p-8">
            {/* Mostrar alerta de cadastro incompleto apenas para assistências */}
            {isAssistencia && <CadastroIncompleto />}
            <PlanNotification />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
});

SupabaseLayout.displayName = 'SupabaseLayout';

export default SupabaseLayout;
