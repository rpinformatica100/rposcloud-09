
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdemServico, ItemOrdemServico } from "@/types";
import { ArrowLeft, Check, Edit, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/formatters";
import PrintOrderButton from "@/components/ordens/PrintOrderButton";

interface OrdemHeaderProps {
  ordem: OrdemServico;
  itens: ItemOrdemServico[];
  openFinalizarModal: () => void;
}

export function OrdemHeader({ ordem, itens, openFinalizarModal }: OrdemHeaderProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Aberta</Badge>;
      case 'andamento':
      case 'em_andamento':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Em andamento</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluída</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Baixa</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Média</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Alta</Badge>;
      default:
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Button onClick={() => navigate("/ordens")} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Ordens
        </Button>
        <div className="flex flex-wrap gap-2">
          <PrintOrderButton ordem={ordem} itens={itens} cliente={ordem.cliente} />
          
          {ordem && ordem.status !== 'concluida' && ordem.status !== 'cancelada' && (
            <>
              <Button onClick={() => navigate(`/ordens/editar/${ordem.id}`)} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              
              <Button 
                onClick={openFinalizarModal}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                Finalizar OS
              </Button>
            </>
          )}
          
          {ordem && (ordem.status === 'concluida' || ordem.status === 'cancelada') && (
            <Button onClick={() => navigate(`/ordens/editar/${ordem.id}`)} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Visualizar Detalhes
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl text-primary">
                OS #{ordem.numero}
              </CardTitle>
              <div className="flex items-center text-muted-foreground mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Abertura: {formatDate(ordem.dataAbertura || '')}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(ordem.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Prioridade:</span>
                {getPrioridadeBadge(ordem.prioridade)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {ordem.dataPrevisao && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Previsão:</span>
                  <p className="font-medium">{formatDate(ordem.dataPrevisao)}</p>
                </div>
              </div>
            )}
            {ordem.dataConclusao && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Conclusão:</span>
                  <p className="font-medium">{formatDate(ordem.dataConclusao)}</p>
                </div>
              </div>
            )}
            {ordem.responsavel && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Responsável:</span>
                  <p className="font-medium">{ordem.responsavel}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
