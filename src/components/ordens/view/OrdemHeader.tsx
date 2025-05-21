
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdemServico, ItemOrdemServico } from "@/types";
import { ArrowLeft, Check, Edit } from "lucide-react";
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
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/ordens")} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          {/* @ts-ignore - Temporarily ignoring type error until PrintOrderButton is updated */}
          <PrintOrderButton ordem={ordem} itens={itens} cliente={ordem.cliente} />
          
          <Button onClick={() => navigate(`/ordens/editar/${ordem.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          {ordem && ordem.status !== 'concluida' && ordem.status !== 'cancelada' && (
            <Button 
              onClick={openFinalizarModal}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Finalizar OS
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Ordem de Serviço #{ordem.numero}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {formatDate(ordem.dataAbertura || '')}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                Status: {getStatusBadge(ordem.status)}
              </div>
              <div>
                Prioridade: {getPrioridadeBadge(ordem.prioridade)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Descrição</h3>
              <p className="text-muted-foreground mt-1">
                {ordem.descricao || "Sem descrição"}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="font-medium">Data de Abertura:</span>{" "}
                {formatDate(ordem.dataAbertura || '')}
              </div>
              {ordem.dataPrevisao && (
                <div>
                  <span className="font-medium">Previsão de Conclusão:</span>{" "}
                  {formatDate(ordem.dataPrevisao)}
                </div>
              )}
              {ordem.dataConclusao && (
                <div>
                  <span className="font-medium">Data de Conclusão:</span>{" "}
                  {formatDate(ordem.dataConclusao)}
                </div>
              )}
              {ordem.responsavel && (
                <div>
                  <span className="font-medium">Responsável:</span>{" "}
                  {ordem.responsavel}
                </div>
              )}
            </div>

            {ordem.observacoes && (
              <div>
                <h3 className="font-medium">Observações</h3>
                <p className="text-muted-foreground mt-1 whitespace-pre-line">
                  {ordem.observacoes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
