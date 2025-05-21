
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

const AdminRelatoriosPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Administrativos</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Visão Geral da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart2 size={48} className="mb-4" />
            <p className="text-xl">Relatórios Administrativos em Desenvolvimento.</p>
            <p>Em breve, você terá acesso a dados sobre o uso da plataforma, assinaturas e mais.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRelatoriosPage;
