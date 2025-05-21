
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileText, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PagamentosList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados simulados de pagamentos
  const pagamentos = [
    { 
      id: "PAG-001", 
      assistencia: "TecnoHelp", 
      plano: "Premium", 
      valor: 99.90, 
      data: "15/05/2025", 
      status: "Aprovado", 
      metodo: "Cartão de Crédito" 
    },
    { 
      id: "PAG-002", 
      assistencia: "RapidFix", 
      plano: "Básico", 
      valor: 49.90, 
      data: "12/05/2025", 
      status: "Aprovado", 
      metodo: "PIX" 
    },
    { 
      id: "PAG-003", 
      assistencia: "SOS Eletrônicos", 
      plano: "Empresarial", 
      valor: 199.90, 
      data: "10/05/2025", 
      status: "Aprovado", 
      metodo: "Boleto" 
    },
    { 
      id: "PAG-004", 
      assistencia: "Conserta Tudo", 
      plano: "Premium", 
      valor: 99.90, 
      data: "08/05/2025", 
      status: "Recusado", 
      metodo: "Cartão de Crédito" 
    },
    { 
      id: "PAG-005", 
      assistencia: "TecnoHelp", 
      plano: "Premium (Anual)", 
      valor: 959.00, 
      data: "01/04/2025", 
      status: "Aprovado", 
      metodo: "Cartão de Crédito" 
    },
  ];

  const filteredPagamentos = pagamentos.filter(
    (pagamento) =>
      pagamento.assistencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total de pagamentos aprovados
  const totalAprovado = pagamentos
    .filter(p => p.status === "Aprovado")
    .reduce((total, p) => total + p.valor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-muted-foreground">Acompanhe todos os pagamentos realizados no sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalAprovado.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagamentos.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((pagamentos.filter(p => p.status === "Aprovado").length / pagamentos.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <div className="relative max-w-sm mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar pagamentos..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Assistência</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell className="font-medium">{pagamento.id}</TableCell>
                  <TableCell>{pagamento.assistencia}</TableCell>
                  <TableCell>{pagamento.plano}</TableCell>
                  <TableCell>R$ {pagamento.valor.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{pagamento.data}</TableCell>
                  <TableCell>{pagamento.metodo}</TableCell>
                  <TableCell>
                    {pagamento.status === "Aprovado" ? (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprovado
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3 mr-1" />
                        Recusado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Ver comprovante">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PagamentosList;
