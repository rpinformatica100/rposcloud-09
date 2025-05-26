
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdemServico } from "@/types";
import { FileText } from "lucide-react";

interface OrdemDescricoesProps {
  ordem: OrdemServico;
}

export function OrdemDescricoes({ ordem }: OrdemDescricoesProps) {
  if (!ordem.descricao && !ordem.observacoes) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Descrições e Observações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ordem.descricao && (
          <div>
            <h4 className="font-medium text-sm mb-2">Descrição do Problema</h4>
            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
              {ordem.descricao}
            </p>
          </div>
        )}

        {ordem.observacoes && (
          <div>
            <h4 className="font-medium text-sm mb-2">Observações Gerais</h4>
            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md whitespace-pre-line">
              {ordem.observacoes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
