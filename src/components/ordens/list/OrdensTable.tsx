
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrdemServico, Cliente } from "@/types";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrdensTableProps {
  ordens: OrdemServico[];
  clientes: Cliente[];
  onExcluir: (id: string) => void;
}

export function OrdensTable({ ordens, clientes, onExcluir }: OrdensTableProps) {
  const navigate = useNavigate();

  const getCliente = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "aberta": return "Aberta";
      case "andamento": return "Em Andamento";
      case "concluida": return "Concluída";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case "aberta": return "bg-blue-100 text-blue-700";
      case "andamento": return "bg-amber-100 text-amber-700";
      case "concluida": return "bg-green-100 text-green-700";
      case "cancelada": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleRowClick = (ordemId: string) => {
    navigate(`/app/ordens/${ordemId}`);
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-7 p-4 bg-muted/50 font-medium text-sm">
        <div>Número</div>
        <div className="hidden md:block">Cliente</div>
        <div className="hidden md:block">Data</div>
        <div className="hidden md:block">Valor</div>
        <div className="text-center">Status</div>
        <div className="hidden md:block">Responsável</div>
        <div className="text-right">Ações</div>
      </div>

      {ordens.map((ordem) => {
        const cliente = getCliente(ordem.clienteId);
        return (
          <div 
            key={ordem.id} 
            className="grid grid-cols-1 md:grid-cols-7 p-4 border-t items-center hover:bg-muted/30 cursor-pointer"
            onClick={() => handleRowClick(ordem.id)}
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
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(ordem.status)}`}>
                {getStatusText(ordem.status)}
              </span>
            </div>
            
            <div className="hidden md:block text-muted-foreground truncate max-w-[150px]">
              {ordem.responsavel || "-"}
            </div>
            
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem onClick={() => navigate(`/app/ordens/${ordem.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/app/ordens/editar/${ordem.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onExcluir(ordem.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
