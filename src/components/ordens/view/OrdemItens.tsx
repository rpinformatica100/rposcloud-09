
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda } from "@/lib/utils";
import { ItemOrdemServico } from "@/types";
import { DollarSign, Package } from "lucide-react";

interface OrdemItensProps {
  itens: ItemOrdemServico[];
  valorTotal: number;
}

export function OrdemItens({ itens, valorTotal }: OrdemItensProps) {
  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center text-green-700">
          <DollarSign className="h-5 w-5 mr-2" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itens.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Nenhum item adicionado a esta ordem de serviço</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-green-100">
              <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <h4 className="font-medium text-sm text-gray-700">Produtos e Serviços</h4>
              </div>
              <div className="divide-y divide-gray-100">
                {itens.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm text-gray-900 truncate">
                            {item.produto?.nome || "Produto não encontrado"}
                          </h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                            item.produto?.tipo === "produto" 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {item.produto?.tipo === "produto" ? "Produto" : "Serviço"}
                          </span>
                        </div>
                        {item.observacao && (
                          <p className="text-xs text-gray-500 truncate">{item.observacao}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-sm text-gray-900">
                          {formatarMoeda(Number(item.valorTotal) || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantidade} × {formatarMoeda(Number(item.valorUnitario) || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total destacado */}
            <div className="bg-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-800">Total Geral</span>
                <span className="text-2xl font-bold text-green-900">
                  {formatarMoeda(Number(valorTotal) || 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
