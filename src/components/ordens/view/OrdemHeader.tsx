
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrdemServico, ItemOrdemServico } from "@/types";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { Calendar, User, Edit, Printer, Download, Link2, Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PrintOrderButton from "@/components/ordens/PrintOrderButton";

interface OrdemHeaderProps {
  ordem: OrdemServico;
  itens: ItemOrdemServico[];
  openFinalizarModal: () => void;
}

export function OrdemHeader({ ordem, itens, openFinalizarModal }: OrdemHeaderProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta": return "bg-blue-100 text-blue-800";
      case "andamento": return "bg-yellow-100 text-yellow-800";
      case "concluida": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "baixa": return "bg-green-100 text-green-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "urgente": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditarOrdem = () => {
    navigate(`/app/ordens/editar/${ordem.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {ordem.numero}
          </h1>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(ordem.status)}>
              {ordem.status}
            </Badge>
            <Badge className={getPrioridadeColor(ordem.prioridade)}>
              Prioridade: {ordem.prioridade}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditarOrdem}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          {ordem.status !== "concluida" && (
            <Button 
              onClick={openFinalizarModal}
              size="sm"
            >
              Finalizar Ordem
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar OS
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link2 className="mr-2 h-4 w-4" />
                Copiar Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Abertura: {formatarData(ordem.dataAbertura)}</span>
        </div>
        
        {ordem.dataPrevisao && (
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Previsão: {formatarData(ordem.dataPrevisao)}</span>
          </div>
        )}
        
        {ordem.responsavel && (
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Responsável: {ordem.responsavel}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Valor Total: {formatarMoeda(ordem.valorTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
