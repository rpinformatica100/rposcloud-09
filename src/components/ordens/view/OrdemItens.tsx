
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { ItemOrdemServico } from "@/types";

interface OrdemItensProps {
  itens: ItemOrdemServico[];
  valorTotal: number;
}

export function OrdemItens({ itens, valorTotal }: OrdemItensProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Itens</CardTitle>
      </CardHeader>
      <CardContent>
        {itens.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum item adicionado a esta ordem de serviço
          </p>
        ) : (
          <div className="space-y-4">
            {itens.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {item.produto?.nome || "Produto não encontrado"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.produto?.tipo === "produto" ? "Produto" : "Serviço"}
                    </p>
                    {item.observacao && (
                      <p className="text-sm mt-1">{item.observacao}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.valorTotal)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantidade} x {formatCurrency(item.valorUnitario)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(valorTotal || 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
