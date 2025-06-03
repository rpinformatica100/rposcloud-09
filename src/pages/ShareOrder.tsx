
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { OrdemServico, ItemOrdemServico } from "@/types";
import { ordensData } from "@/data/dados";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { Calendar, User, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ShareOrder = () => {
  const { id } = useParams<{ id: string }>();
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Buscar a ordem nos dados mockados
      const ordemEncontrada = ordensData.find(o => o.id === id);
      setOrdem(ordemEncontrada || null);
    }
    setLoading(false);
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ordem de serviço...</p>
        </div>
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Ordem não encontrada</h1>
          <p className="text-gray-600">
            A ordem de serviço solicitada não foi encontrada ou não está mais disponível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {ordem.numero}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getStatusColor(ordem.status)}>
                {ordem.status}
              </Badge>
              <Badge className={getPrioridadeColor(ordem.prioridade)}>
                Prioridade: {ordem.prioridade}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações da Ordem</h3>
              <div className="space-y-2 text-sm">
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
            </div>

            {ordem.cliente && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{ordem.cliente.nome}</p>
                  <p>{ordem.cliente.email}</p>
                  <p>{ordem.cliente.telefone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600">{ordem.descricao}</p>
          </div>

          {ordem.itens && ordem.itens.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Itens da Ordem</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-200 px-4 py-2 text-center">Qtd</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Valor Unit.</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordem.itens.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-200 px-4 py-2">
                          {item.produto?.nome || 'Item não encontrado'}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          {item.quantidade}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {formatarMoeda(item.valorUnitario)}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {formatarMoeda(item.valorTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Valor Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatarMoeda(ordem.valorTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareOrder;
