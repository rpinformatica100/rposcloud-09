
import { Button } from "@/components/ui/button";
import { OrdemServico, Cliente } from "@/types";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ActionDropdownMenu, Edit, Trash, Eye } from "@/components/ui/action-dropdown-menu";
import { useTableSort } from "@/hooks/useTableSort";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";

interface OrdensTableProps {
  ordens: OrdemServico[];
  clientes: Cliente[];
  onExcluir: (id: string) => void;
}

export function OrdensTable({ ordens, clientes, onExcluir }: OrdensTableProps) {
  const navigate = useNavigate();
  const { sortedData, sortConfig, requestSort } = useTableSort(ordens, { key: 'dataAbertura', direction: 'desc' });

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

  const getActions = (ordem: OrdemServico) => [
    {
      label: "Visualizar",
      icon: Eye,
      onClick: () => navigate(`/app/ordens/${ordem.id}`)
    },
    {
      label: "Editar", 
      icon: Edit,
      onClick: () => navigate(`/app/ordens/editar/${ordem.id}`)
    },
    {
      label: "Excluir",
      icon: Trash,
      onClick: () => onExcluir(ordem.id),
      variant: "destructive" as const,
      separator: true
    }
  ];

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-7 p-4 bg-muted/50 font-medium text-sm">
        <SortableTableHeader sortKey="numero" sortConfig={sortConfig} onSort={requestSort}>
          Número
        </SortableTableHeader>
        <div className="hidden md:block">
          <SortableTableHeader sortKey="cliente.nome" sortConfig={sortConfig} onSort={requestSort}>
            Cliente
          </SortableTableHeader>
        </div>
        <div className="hidden md:block">
          <SortableTableHeader sortKey="dataAbertura" sortConfig={sortConfig} onSort={requestSort}>
            Data
          </SortableTableHeader>
        </div>
        <div className="hidden md:block">
          <SortableTableHeader sortKey="valorTotal" sortConfig={sortConfig} onSort={requestSort}>
            Valor
          </SortableTableHeader>
        </div>
        <div className="text-center">
          <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={requestSort} className="flex justify-center">
            Status
          </SortableTableHeader>
        </div>
        <div className="hidden md:block">
          <SortableTableHeader sortKey="responsavel" sortConfig={sortConfig} onSort={requestSort}>
            Responsável
          </SortableTableHeader>
        </div>
        <div className="text-right">Ações</div>
      </div>

      {sortedData.map((ordem) => {
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
              <ActionDropdownMenu actions={getActions(ordem)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
