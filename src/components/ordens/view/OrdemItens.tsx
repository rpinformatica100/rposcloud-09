
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda } from "@/lib/utils";
import { ItemOrdemServico } from "@/types";
import { Package } from "lucide-react";

interface OrdemItensProps {
  itens: ItemOrdemServico[];
  valorTotal: number;
}

export function OrdemItens({ itens, valorTotal }: OrdemItensProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Package className="h-5 w-5 mr-2 text-primary" />
          Produtos e Serviços
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itens.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum item adicionado a esta ordem de serviço
          </p>
        ) : (
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">
                      {item.produto?.nome || "Produto não encontrado"}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.produto?.tipo === "produto" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {item.produto?.tipo === "produto" ? "Produto" : "Serviço"}
                    </span>
                  </div>
                  {item.observacao && (
                    <p className="text-xs text-muted-foreground mt-1">{item.observacao}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-sm">
                    {formatarMoeda(Number(item.valorTotal) || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantidade} x {formatarMoeda(Number(item.valorUnitario) || 0)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t mt-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Geral</p>
                <p className="text-lg font-bold text-primary">
                  {formatarMoeda(Number(valorTotal) || 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
