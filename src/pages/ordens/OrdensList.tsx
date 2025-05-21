
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ordensData, clientesData } from "@/data/dados";
import { OrdemServico } from "@/types";
import { FileText, Plus, Search, Edit, Trash, Eye } from "lucide-react";
import { formatarMoeda, formatarData } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const OrdensList = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordensData);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
      setOrdens(ordens.filter(ordem => ordem.id !== id));
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem foi excluída com sucesso",
      });
    }
  };

  // Filtrar ordens conforme busca e filtro de status
  const ordensFiltradas = ordens.filter(ordem => {
    const cliente = clientesData.find(c => c.id === ordem.clienteId)?.nome || "";
    
    // Filtro por texto
    const matchesSearch = 
      ordem.numero.toLowerCase().includes(filtro.toLowerCase()) || 
      cliente.toLowerCase().includes(filtro.toLowerCase()) || 
      ordem.descricao.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtro por status
    if (statusFiltro === "todos") return matchesSearch;
    return matchesSearch && ordem.status === statusFiltro;
  });

  // Mapear status para texto em português
  const statusText = (status: string) => {
    switch(status) {
      case "aberta": return "Aberta";
      case "andamento": return "Em Andamento";
      case "concluida": return "Concluída";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };

  // Mapear classes de cores para status
  const statusClass = (status: string) => {
    switch(status) {
      case "aberta": return "bg-blue-100 text-blue-700";
      case "andamento": return "bg-amber-100 text-amber-700";
      case "concluida": return "bg-green-100 text-green-700";
      case "cancelada": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <Button onClick={() => navigate('/ordens/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <CardTitle>Lista de Ordens</CardTitle>
              <CardDescription>
                Gerencie as ordens de serviço
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select
                value={statusFiltro}
                onValueChange={setStatusFiltro}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="aberta">Abertas</SelectItem>
                  <SelectItem value="andamento">Em andamento</SelectItem>
                  <SelectItem value="concluida">Concluídas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar ordem..." 
                  className="pl-9"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {ordensFiltradas.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                <div>Número</div>
                <div className="hidden md:block">Cliente</div>
                <div className="hidden md:block">Data</div>
                <div className="hidden md:block">Valor</div>
                <div className="text-center">Status</div>
                <div className="text-right">Ações</div>
              </div>

              {ordensFiltradas.map((ordem) => {
                const cliente = clientesData.find(c => c.id === ordem.clienteId);
                return (
                  <div 
                    key={ordem.id} 
                    className="grid grid-cols-1 md:grid-cols-6 p-4 border-t items-center hover:bg-muted/30"
                  >
                    <div>
                      <div className="font-medium">{ordem.numero}</div>
                      <div className="md:hidden text-sm text-muted-foreground">
                        {cliente?.nome}
                      </div>
                    </div>
                    <div className="hidden md:block truncate max-w-[200px]">
                      {cliente?.nome}
                    </div>
                    <div className="hidden md:block text-muted-foreground">
                      {formatarData(ordem.dataAbertura)}
                    </div>
                    <div className="hidden md:block font-medium">
                      {formatarMoeda(ordem.valorTotal)}
                    </div>
                    <div className="text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusClass(ordem.status)}`}>
                        {statusText(ordem.status)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/ordens/visualizar/${ordem.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/ordens/editar/${ordem.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleExcluir(ordem.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Nenhuma ordem de serviço encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdensList;
