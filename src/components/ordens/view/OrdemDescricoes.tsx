
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdemServico } from "@/types";
import { FileText, Wrench } from "lucide-react";

interface OrdemDescricoesProps {
  ordem: OrdemServico;
}

export function OrdemDescricoes({ ordem }: OrdemDescricoesProps) {
  const hasDescriptiveContent = ordem.descricao || ordem.observacoes || ordem.solucao;
  
  if (!hasDescriptiveContent) return null;
  
  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center text-blue-700">
          <FileText className="h-5 w-5 mr-2" />
          Informações Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ordem.descricao && (
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-sm mb-3 text-red-600 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Problema Relatado
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {ordem.descricao}
            </p>
          </div>
        )}

        {ordem.solucao && (
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h4 className="font-semibold text-sm mb-3 text-green-600 flex items-center">
              <Wrench className="h-4 w-4 mr-1" />
              Solução Aplicada
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {ordem.solucao}
            </p>
          </div>
        )}

        {ordem.observacoes && (
          <div className="bg-white p-4 rounded-lg border border-amber-100">
            <h4 className="font-semibold text-sm mb-3 text-amber-600 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Observações Gerais
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {ordem.observacoes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
