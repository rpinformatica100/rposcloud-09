
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssistenciasList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados simulados de assistências
  const assistencias = [
    { id: 1, nome: "TecnoHelp", email: "contato@tecnohelp.com", plano: "Premium", status: "Ativa", dataRegistro: "10/01/2025" },
    { id: 2, nome: "RapidFix", email: "contato@rapidfix.com", plano: "Básico", status: "Ativa", dataRegistro: "15/02/2025" },
    { id: 3, nome: "SOS Eletrônicos", email: "contato@soseletronicos.com", plano: "Empresarial", status: "Ativa", dataRegistro: "05/03/2025" },
    { id: 4, nome: "Conserta Tudo", email: "contato@consertatudo.com", plano: "Premium", status: "Inativa", dataRegistro: "20/01/2025" },
    { id: 5, nome: "Assist Tech", email: "contato@assisttech.com", plano: "Básico", status: "Ativa", dataRegistro: "12/04/2025" },
  ];
  
  const filteredAssistencias = assistencias.filter(
    (assistencia) =>
      assistencia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistencia.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assistências</h1>
          <p className="text-muted-foreground">Gerencie as assistências técnicas cadastradas.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Assistência
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Assistências</CardTitle>
          <div className="relative max-w-sm mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar assistências..." 
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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssistencias.map((assistencia) => (
                <TableRow key={assistencia.id}>
                  <TableCell className="font-medium">{assistencia.nome}</TableCell>
                  <TableCell>{assistencia.email}</TableCell>
                  <TableCell>{assistencia.plano}</TableCell>
                  <TableCell>
                    {assistencia.status === "Ativa" ? (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inativa
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{assistencia.dataRegistro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AssistenciasList;
