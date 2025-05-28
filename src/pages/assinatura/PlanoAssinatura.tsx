
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Star,
  Users,
  Database,
  Shield,
  TrendingUp,
  Edit,
  MapPin,
  Save,
  ExternalLink
} from "lucide-react";
import { formatarData, formatarMoeda } from "@/lib/utils";
import { toast } from "sonner";
import { usePlanStatus } from "@/hooks/usePlanStatus";
import { PlanType, PaymentMethod, Address } from "@/types/plan";

const PlanoAssinatura = () => {
  const { userPlan, cancelPlan, getTrialProgressPercentage } = usePlanStatus();
  
  // Estados para modais e interações
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Estados para formulários
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit_card',
    last4: '1234',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil'
  });

  // Dados simulados de histórico
  const [historicoPagamentos] = useState([
    {
      id: "1",
      data: "2024-11-25",
      valor: 89.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Profissional"
    },
    {
      id: "2", 
      data: "2024-10-25",
      valor: 89.90,
      status: "pago",
      metodo: "Cartão de Crédito",
      descricao: "Mensalidade Plano Profissional"
    }
  ]);

  if (!userPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Carregando informações do plano</h3>
          <p className="text-gray-500">Aguarde enquanto carregamos seus dados...</p>
        </div>
      </div>
    );
  }

  const planNames = {
    trial_plan: 'Trial Gratuito',
    basic: 'Básico',
    professional: 'Profissional',
    enterprise: 'Enterprise'
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "trial": return "bg-blue-100 text-blue-700";
      case "active": return "bg-green-100 text-green-700";
      case "expired": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "trial": return <Clock className="h-4 w-4" />;
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      case "cancelled": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleCancelarRenovacao = () => {
    setCancelModalOpen(true);
  };

  const confirmarCancelamento = () => {
    cancelPlan();
    toast.success("Renovação automática cancelada", {
      description: "Seu plano permanecerá ativo até o vencimento."
    });
    setCancelModalOpen(false);
  };

  const handleUpdatePaymentMethod = () => {
    toast.success("Método de pagamento atualizado!", {
      description: "Suas informações de cobrança foram salvas."
    });
    setPaymentModalOpen(false);
  };

  const handleUpdateAddress = () => {
    toast.success("Endereço de cobrança atualizado!", {
      description: "Suas informações de endereço foram salvas."
    });
    setAddressModalOpen(false);
  };

  // Função para obter limites de uso
  const getMaxOrders = () => {
    return userPlan.planType === 'trial_plan' ? 50 : 999;
  };

  const getMaxUsers = () => {
    return userPlan.planType === 'trial_plan' ? 1 : 5;
  };

  const getMaxStorage = () => {
    return userPlan.planType === 'trial_plan' ? 1 : 10;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de Assinatura</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e histórico de pagamentos</p>
        </div>
        <div className="flex gap-2">
          {userPlan.status !== 'trial' && (
            <Button variant="outline" onClick={handleCancelarRenovacao}>
              Cancelar Renovação
            </Button>
          )}
          <Link to="/app/planos">
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Outros Planos
            </Button>
          </Link>
        </div>
      </div>

      {/* Alertas importantes */}
      {userPlan.status === 'trial' && userPlan.remainingDays <= 3 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Seu período gratuito termina em {userPlan.remainingDays} dias. 
            {userPlan.remainingDays <= 1 ? ' Assine agora para não perder seus dados!' : ' Assine um plano para continuar.'}
          </AlertDescription>
        </Alert>
      )}

      {userPlan.status === 'expired' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Seu período gratuito expirou!</strong> Assine um plano para reativar todas as funcionalidades.
          </AlertDescription>
        </Alert>
      )}

      {/* Status atual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planNames[userPlan.planType]}</div>
            {userPlan.planType !== 'trial_plan' && (
              <p className="text-xs text-muted-foreground">
                {formatarMoeda(89.90)}/mês
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(userPlan.status)}>
                {getStatusIcon(userPlan.status)}
                <span className="ml-1 capitalize">
                  {userPlan.status === 'trial' ? 'Trial' : 
                   userPlan.status === 'active' ? 'Ativo' : 
                   userPlan.status === 'expired' ? 'Expirado' : 'Cancelado'}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userPlan.status === 'trial' ? 'Trial Termina Em' : 'Próximo Vencimento'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarData(userPlan.endDate)}</div>
            <p className="text-xs text-muted-foreground">
              {userPlan.remainingDays} dias restantes
            </p>
            {userPlan.status === 'trial' && (
              <Progress 
                value={getTrialProgressPercentage()} 
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userPlan.status === 'trial' ? 'Assine Agora' : 'Próximo Pagamento'}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {userPlan.status === 'trial' ? (
              <div>
                <div className="text-2xl font-bold text-green-600">Grátis</div>
                <p className="text-xs text-muted-foreground mb-2">
                  Período de avaliação
                </p>
                <Link to="/app/planos">
                  <Button size="sm">
                    Escolher Plano
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold">{formatarMoeda(89.90)}</div>
                <p className="text-xs text-muted-foreground">
                  Será cobrado em {formatarData(userPlan.endDate)}
                </p>
                <Button size="sm" className="mt-2" onClick={() => setPaymentModalOpen(true)}>
                  Atualizar Pagamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="uso" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="uso">Uso Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
        </TabsList>

        <TabsContent value="uso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uso dos Recursos</CardTitle>
              <CardDescription>
                Acompanhe o uso dos recursos do seu plano atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Ordens de Serviço</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    25 / {getMaxOrders() === 999 ? '∞' : getMaxOrders()}
                  </span>
                </div>
                <Progress 
                  value={getMaxOrders() === 999 ? 10 : (25 / getMaxOrders()) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Usuários</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    1 / {getMaxUsers() === -1 ? '∞' : getMaxUsers()}
                  </span>
                </div>
                <Progress 
                  value={getMaxUsers() === -1 ? 5 : (1 / getMaxUsers()) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Armazenamento</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    0.3GB / {getMaxStorage()}GB
                  </span>
                </div>
                <Progress 
                  value={(0.3 / getMaxStorage()) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                {userPlan.status === 'trial' 
                  ? 'Você ainda não possui histórico de pagamentos. Assine um plano para começar.' 
                  : 'Veja todos os seus pagamentos anteriores'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userPlan.status === 'trial' ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pagamento ainda</h3>
                  <p className="text-gray-500 mb-4">Assine um plano para começar seu histórico de pagamentos.</p>
                  <Link to="/app/planos">
                    <Button>
                      Ver Planos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {historicoPagamentos.map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CreditCard className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{formatarMoeda(pagamento.valor)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatarData(pagamento.data)} - {pagamento.metodo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pagamento.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700">
                          Pago
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Informações de Faturamento
              </CardTitle>
              <CardDescription>
                Gerencie suas informações de cobrança e pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Método de Pagamento</h4>
                    <Button variant="outline" size="sm" onClick={() => setPaymentModalOpen(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Alterar
                    </Button>
                  </div>
                  
                  {userPlan.status === 'trial' ? (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-600">Nenhum método configurado</p>
                        <p className="text-sm text-gray-500">Configure quando assinar um plano</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">**** **** **** {paymentMethod.last4}</p>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethod.brand} - Exp. {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Endereço de Cobrança</h4>
                    <Button variant="outline" size="sm" onClick={() => setAddressModalOpen(true)}>
                      <MapPin className="h-4 w-4 mr-1" />
                      Alterar
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-sm">
                    <p>{billingAddress.street}, {billingAddress.number}</p>
                    {billingAddress.complement && <p>{billingAddress.complement}</p>}
                    <p>{billingAddress.neighborhood} - {billingAddress.city}, {billingAddress.state}</p>
                    <p>{billingAddress.zipCode}</p>
                  </div>
                </div>
              </div>

              {userPlan.status !== 'trial' && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-800">Renovação Automática</h4>
                    <p className="text-sm text-blue-600">
                      {userPlan.billing?.autoRenewal 
                        ? 'Sua assinatura será renovada automaticamente'
                        : 'Renovação automática desabilitada'
                      }
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCancelarRenovacao}>
                    {userPlan.billing?.autoRenewal ? 'Cancelar Renovação' : 'Reativar Renovação'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Cancelamento */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Renovação Automática</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja cancelar a renovação automática?</p>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Seu plano permanecerá ativo até {formatarData(userPlan.endDate)}, 
                mas não será renovado automaticamente.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Manter Renovação
            </Button>
            <Button variant="destructive" onClick={confirmarCancelamento}>
              Cancelar Renovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Método de Pagamento */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Método de Pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input 
                id="cardNumber" 
                placeholder="**** **** **** 1234"
                value={`**** **** **** ${paymentMethod.last4}`}
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Mês</Label>
                <Input 
                  id="expiryMonth" 
                  value={paymentMethod.expiryMonth}
                  onChange={(e) => setPaymentMethod({...paymentMethod, expiryMonth: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Ano</Label>
                <Input 
                  id="expiryYear" 
                  value={paymentMethod.expiryYear}
                  onChange={(e) => setPaymentMethod({...paymentMethod, expiryYear: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePaymentMethod}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Endereço */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar Endereço de Cobrança</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input 
                  id="street" 
                  value={billingAddress.street}
                  onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input 
                  id="number" 
                  value={billingAddress.number}
                  onChange={(e) => setBillingAddress({...billingAddress, number: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input 
                id="complement" 
                value={billingAddress.complement}
                onChange={(e) => setBillingAddress({...billingAddress, complement: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input 
                id="neighborhood" 
                value={billingAddress.neighborhood}
                onChange={(e) => setBillingAddress({...billingAddress, neighborhood: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city" 
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state" 
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input 
                id="zipCode" 
                value={billingAddress.zipCode}
                onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateAddress}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanoAssinatura;
