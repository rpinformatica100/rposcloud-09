
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ordensData, clientesData } from "@/data/dados";
import { OrdemServico } from "@/types";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrdensListHeader } from "@/components/ordens/list/OrdensListHeader";
import { OrdensTable } from "@/components/ordens/list/OrdensTable";

const OrdensList = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordensData);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
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

  return (
    <div className="space-y-6">
      <OrdensListHeader 
        filtro={filtro}
        statusFiltro={statusFiltro}
        onFiltroChange={setFiltro}
        onStatusFiltroChange={setStatusFiltro}
      />

      <Card>
        <CardContent className="p-0">
          {ordensFiltradas.length > 0 ? (
            <OrdensTable 
              ordens={ordensFiltradas}
              clientes={clientesData}
              onExcluir={handleExcluir}
            />
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
