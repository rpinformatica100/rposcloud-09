
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import CadastroIncompleto from '@/components/CadastroIncompleto';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { SidebarProvider } from "@/components/ui/sidebar";

const AssistenciaLayout = () => {
  const { isAssistencia } = useSupabaseAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex-1 space-y-3 p-4 pt-4 md:p-6">
          {/* Mostrar alerta de cadastro incompleto apenas para assistências */}
          {isAssistencia && <CadastroIncompleto />}
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AssistenciaLayout;
