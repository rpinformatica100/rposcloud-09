
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { financeirosData } from "@/data/dados";
import { ArrowLeft, Edit, CreditCard, Calendar, DollarSign, Tag, User } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";

const FinanceiroView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const movimento = financeirosData.find(m => m.id === id);

  if (!movimento) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/app/financeiro")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">
            Movimento não encontrado
          </h1>
        </div>
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">O movimento financeiro solicitado não foi encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/app/financeiro")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalhes do Movimento
          </h1>
        </div>
        <Button onClick={() => navigate(`/app/financeiro/editar/${movimento.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  movimento.tipo === "receita" ? "bg-green-100" : "bg-red-100"
                }`}>
                  <CreditCard className={`h-6 w-6 ${
                    movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div>
                  <CardTitle className="text-xl">{movimento.descricao}</CardTitle>
                  <CardDescription className="capitalize">
                    {movimento.tipo}
                  </CardDescription>
                </div>
              </div>
              <Badge className={movimento.pago ? "bg-green-500" : "bg-amber-500"}>
                {movimento.pago ? "Pago" : "Pendente"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <DollarSign className={`h-5 w-5 ${
                  movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
                }`} />
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className={`font-bold text-lg ${
                    movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
                  }`}>
                    {movimento.tipo === "receita" ? "+" : "-"}{formatarMoeda(movimento.valor)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {new Date(movimento.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{movimento.categoria}</p>
                </div>
              </div>

              {movimento.metodoPagamento && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                    <p className="font-medium">{movimento.metodoPagamento}</p>
                  </div>
                </div>
              )}
            </div>

            {movimento.observacoes && (
              <div className="space-y-2">
                <h3 className="font-semibold">Observações</h3>
                <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
                  {movimento.observacoes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className={movimento.pago ? "bg-green-500" : "bg-amber-500"}>
                {movimento.pago ? "Pago" : "Pendente"}
              </Badge>
            </div>

            {movimento.pago && movimento.dataPagamento && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data do Pagamento:</span>
                <span className="text-sm font-medium">
                  {new Date(movimento.dataPagamento).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <span className={`text-sm font-medium capitalize ${
                movimento.tipo === "receita" ? "text-green-600" : "text-red-600"
              }`}>
                {movimento.tipo}
              </span>
            </div>

            {movimento.cliente && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Vinculado a cliente</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceiroView;
