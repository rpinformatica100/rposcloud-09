
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrdemServico, ItemOrdemServico } from "@/types";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { Calendar, User, Edit, Printer, Download, Link2, Eye, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getOrderHtml } from "@/lib/orderPrintUtils";

interface OrdemHeaderProps {
  ordem: OrdemServico;
  itens: ItemOrdemServico[];
  openFinalizarModal: () => void;
}

export function OrdemHeader({ ordem, itens, openFinalizarModal }: OrdemHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleVoltar = () => {
    navigate('/app/ordens');
  };

  const handleVisualizarOS = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de visualização. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(getOrderHtml(ordem, itens, ordem.cliente, {}, false));
    printWindow.document.close();
  };

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(getOrderHtml(ordem, itens, ordem.cliente, {}, true));
    printWindow.document.close();
  };

  const handleBaixarPDF = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela para download. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(getOrderHtml(ordem, itens, ordem.cliente, {}, true, true));
    printWindow.document.close();
  };

  const handleCopiarLink = () => {
    const host = window.location.origin;
    const shareLink = `${host}/app/ordens/${ordem.id}`;
    
    navigator.clipboard.writeText(shareLink).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link da OS foi copiado para a área de transferência.",
      });
    }).catch(err => {
      console.error("Falha ao copiar o link: ", err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleVoltar}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

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
              <DropdownMenuItem onClick={handleVisualizarOS}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar OS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImprimir}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBaixarPDF}>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopiarLink}>
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
