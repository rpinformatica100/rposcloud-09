
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CadastroIncompleto from '@/components/CadastroIncompleto';
import { useAuth } from '@/contexts/AuthContext';

const AssistenciaLayout = () => {
  const { isAssistencia } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {/* Mostrar alerta de cadastro incompleto apenas para assistências */}
        {isAssistencia && <CadastroIncompleto />}
        <Outlet />
      </div>
    </div>
  );
};

export default AssistenciaLayout;
