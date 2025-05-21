
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import { OrdemServico } from "@/types";
import { DollarSign } from "lucide-react";

interface DetalhesFinalizacaoProps {
  ordem: OrdemServico;
}

export function DetalhesFinalizacao({ ordem }: DetalhesFinalizacaoProps) {
  if (ordem.status !== 'concluida') return null;
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle>Detalhes da Finalização</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Solução Aplicada</h3>
            <p className="text-muted-foreground mt-1 whitespace-pre-line">
              {ordem.solucao || "Não informada"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="font-medium">Data de Conclusão:</span>{" "}
              {formatDate(ordem.dataConclusao || '')}
            </div>
            {ordem.formaPagamento && (
              <div>
                <span className="font-medium">Forma de Pagamento:</span>{" "}
                {ordem.formaPagamento.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
          </div>
          
          {ordem.integradoFinanceiro && (
            <div className="flex items-center text-green-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>Pagamento registrado no módulo financeiro</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
