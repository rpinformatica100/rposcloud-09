
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, FileArchive, BarChart2, Users, Package } from 'lucide-react'; // Using FileArchive as a placeholder for FilePdf
import { fetchAssistencias } from '@/integrations/supabase/helpers'; // Using mock fetch
import type { Assistencia } from '@/types';
import { formatDate } from '@/lib/formatters';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const AdminRelatoriosPage = () => {
  const [assistencias, setAssistencias] = useState<Assistencia[]>([]);
  const [filtroStatusAssistencia, setFiltroStatusAssistencia] = useState<string>("todos");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const data = await fetchAssistencias(); // Mock data
        setAssistencias(data);
      } catch (error) {
        console.error("Erro ao carregar assistências:", error);
        // Adicionar toast de erro aqui se necessário
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const assistenciasFiltradas = assistencias.filter(a => 
    filtroStatusAssistencia === "todos" || a.status.toLowerCase() === filtroStatusAssistencia
  );

  const getStatusAssistenciaBadge = (status: string) => {
    if (status.toLowerCase() === 'ativa') {
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Ativa</Badge>;
    }
    return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Inativa</Badge>;
  };

  const exportarAssistenciasPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Assistências Técnicas", 14, 16);

    const tableColumn = ["Nome", "Email", "Plano", "Status", "Data Registro"];
    const tableRows: any[][] = [];

    assistenciasFiltradas.forEach(assist => {
      const assistData = [
        assist.nome,
        assist.email,
        assist.plano,
        assist.status,
        formatDate(assist.dataRegistro)
      ];
      tableRows.push(assistData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('relatorio-assistencias.pdf');
  };
  
  const exportarAssistenciasCSV = () => {
    const headers = "Nome,Email,Plano,Status,DataRegistro\n";
    const rows = assistenciasFiltradas.map(a => 
      `${a.nome},${a.email},${a.plano},${a.status},${formatDate(a.dataRegistro)}`
    ).join("\n");
    const csv = headers + rows;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-assistencias.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Administrativos</h1>
      </div>

      {/* Relatório de Assistências Técnicas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Assistências Técnicas
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Select value={filtroStatusAssistencia} onValueChange={setFiltroStatusAssistencia}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportarAssistenciasCSV} variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button onClick={exportarAssistenciasPDF} variant="outline" size="sm">
              <FileArchive className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <BarChart2 size={48} className="mb-4 animate-pulse" />
              <p>Carregando dados das assistências...</p>
            </div>
          ) : assistenciasFiltradas.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistenciasFiltradas.map((assist) => (
                    <TableRow key={assist.id}>
                      <TableCell className="font-medium">{assist.nome}</TableCell>
                      <TableCell>{assist.email}</TableCell>
                      <TableCell>{assist.plano}</TableCell>
                      <TableCell>{getStatusAssistenciaBadge(assist.status)}</TableCell>
                      <TableCell>{formatDate(assist.dataRegistro)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Users size={48} className="mb-4" />
                <p className="text-xl">Nenhuma assistência encontrada.</p>
                <p>Verifique os filtros ou adicione novas assistências.</p>
              </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder para outros relatórios administrativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Relatório de Planos (Em Desenvolvimento)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart2 size={48} className="mb-4" />
            <p className="text-xl">Em breve: dados sobre assinaturas de planos.</p>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Outros Relatórios (Em Desenvolvimento)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart2 size={48} className="mb-4" />
            <p className="text-xl">Mais relatórios administrativos estarão disponíveis aqui.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRelatoriosPage;

