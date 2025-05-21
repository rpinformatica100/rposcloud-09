
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { Settings, Save, AlertCircle, CheckCircle, FileText, Percent, CreditCard, Globe, Shield, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const ConfiguracoesList = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAssistencia } = useAuth();
  const navigate = useNavigate();

  // Se for uma assistência, redirecionar para a página de configurações de assistência
  if (isAssistencia) {
    return <Navigate to="/app/configuracoes/assistencia" replace />;
  }

  // Fetch configurações
  const { data, isLoading, error } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: fetchConfiguracoes
  });

  // React to data changes
  React.useEffect(() => {
    if (data) {
      setConfiguracoes(data);
    }
  }, [data]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: upsertConfiguracoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (id: string, valor: string) => {
    setConfiguracoes(configuracoes.map(config => {
      if (config.id === id) {
        return { ...config, valor };
      }
      return config;
    }));
  };

  const handleSalvar = () => {
    updateMutation.mutate(configuracoes);
  };

  // Estado para configurações de impressão
  const [printConfig, setPrintConfig] = useState({
    showLogo: true,
    showFooter: true,
    showHeader: true,
    compactMode: false,
    includePrices: true,
  });

  // Estado para configurações de notificação
  const [notificationConfig, setNotificationConfig] = useState({
    emailNotification: true,
    smsNotification: false,
    newOrderNotification: true,
    paymentNotification: true,
    customerNotification: false,
  });

  // Agrupar configurações por tipo (com base na chave)
  const configNumeracao = configuracoes.filter(
    config => config.chave.startsWith('numeracao_')
  );
  
  const configFinanceiras = configuracoes.filter(
    config => config.chave.startsWith('financeiro_')
  );
  
  const configOutras = configuracoes.filter(
    config => !config.chave.startsWith('empresa_') && 
              !config.chave.startsWith('numeracao_') &&
              !config.chave.startsWith('financeiro_')
  );

  // Lidar com mudanças nas configurações de impressão
  const handlePrintConfigChange = (field: string, value: boolean) => {
    setPrintConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Lidar com mudanças nas configurações de notificação
  const handleNotificationConfigChange = (field: string, value: boolean) => {
    setNotificationConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Carregando configurações...</h1>
      </div>
    );
  }

  if (error) {
    console.error("Erro ao carregar configurações:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <p>Erro ao carregar configurações. Por favor, tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <Button 
          onClick={handleSalvar}
          disabled={updateMutation.isPending}
          className="relative"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <Alert className="bg-amber-50 border-amber-300">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Para configurar os dados da sua empresa, acesse a página <a href="/app/configuracoes/perfil" className="font-medium underline">Perfil da Empresa</a>.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="geral" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Documentos</span>
          </TabsTrigger>
          <TabsTrigger value="financeiras" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span>Financeiras</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Ajuste as configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {configOutras.length > 0 ? (
                  configOutras.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <Label htmlFor={config.chave}>{config.descricao}</Label>
                      <Input 
                        id={config.chave} 
                        value={config.valor || ''} 
                        onChange={(e) => handleInputChange(config.id, e.target.value)}
                      />
                    </div>
                  ))
                ) : renderDefaultFields("outras")}
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Configurações de Impressão</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showLogo" className="font-medium">Exibir Logo</Label>
                      <p className="text-sm text-muted-foreground">Mostrar o logotipo nos documentos impressos</p>
                    </div>
                    <Switch
                      id="showLogo"
                      checked={printConfig.showLogo}
                      onCheckedChange={(checked) => handlePrintConfigChange("showLogo", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactMode" className="font-medium">Modo Compacto</Label>
                      <p className="text-sm text-muted-foreground">Usar layout compacto para economizar papel</p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={printConfig.compactMode}
                      onCheckedChange={(checked) => handlePrintConfigChange("compactMode", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="includePrices" className="font-medium">Incluir Preços</Label>
                      <p className="text-sm text-muted-foreground">Exibir informações de preços nos documentos</p>
                    </div>
                    <Switch
                      id="includePrices"
                      checked={printConfig.includePrices}
                      onCheckedChange={(checked) => handlePrintConfigChange("includePrices", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Numeração de Documentos */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Numeração de Documentos
              </CardTitle>
              <CardDescription>
                Configure formatos de numeração para ordens de serviço e outros documentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configNumeracao.length > 0 ? (
                configNumeracao.map((config) => (
                  <div key={config.id} className="space-y-2">
                    <Label htmlFor={config.chave}>{config.descricao}</Label>
                    <Input 
                      id={config.chave} 
                      value={config.valor || ''} 
                      onChange={(e) => handleInputChange(config.id, e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{ANO}"} para ano atual, {"{MES}"} para mês atual e {"{SEQUENCIAL}"} para número sequencial
                    </p>
                  </div>
                ))
              ) : renderDefaultFields("numeracao")}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configurações Financeiras */}
        <TabsContent value="financeiras">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Configurações Financeiras
              </CardTitle>
              <CardDescription>
                Configure opções para pagamentos, impostos e outras configurações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configFinanceiras.length > 0 ? (
                configFinanceiras.map((config) => (
                  <div key={config.id} className="space-y-2">
                    <Label htmlFor={config.chave}>{config.descricao}</Label>
                    <Input 
                      id={config.chave} 
                      value={config.valor || ''} 
                      onChange={(e) => handleInputChange(config.id, e.target.value)}
                    />
                  </div>
                ))
              ) : renderDefaultFields("financeiras")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotification" className="font-medium">Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por e-mail</p>
                  </div>
                  <Switch
                    id="emailNotification"
                    checked={notificationConfig.emailNotification}
                    onCheckedChange={(checked) => handleNotificationConfigChange("emailNotification", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotification" className="font-medium">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                  </div>
                  <Switch
                    id="smsNotification"
                    checked={notificationConfig.smsNotification}
                    onCheckedChange={(checked) => handleNotificationConfigChange("smsNotification", checked)}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium">Tipos de Notificações</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrderNotification" className="font-medium">Novas Ordens</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando uma nova ordem for criada</p>
                  </div>
                  <Switch
                    id="newOrderNotification"
                    checked={notificationConfig.newOrderNotification}
                    onCheckedChange={(checked) => handleNotificationConfigChange("newOrderNotification", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentNotification" className="font-medium">Pagamentos</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre pagamentos recebidos</p>
                  </div>
                  <Switch
                    id="paymentNotification"
                    checked={notificationConfig.paymentNotification}
                    onCheckedChange={(checked) => handleNotificationConfigChange("paymentNotification", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerNotification" className="font-medium">Clientes</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre novos clientes cadastrados</p>
                  </div>
                  <Switch
                    id="customerNotification"
                    checked={notificationConfig.customerNotification}
                    onCheckedChange={(checked) => handleNotificationConfigChange("customerNotification", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sobre o Sistema
          </CardTitle>
          <CardDescription>
            Informações sobre o sistema de ordens de serviço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b">
              <span className="font-medium">Versão do Sistema:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b">
              <span className="font-medium">Desenvolvido por:</span>
              <span>Sistema OS</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b">
              <span className="font-medium">Suporte:</span>
              <span>suporte@sistema-os.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function renderDefaultFields(section: string) {
    // Create default fields based on section
    const currentDate = new Date().toISOString();
    let defaultFields: ConfiguracaoRow[] = [];
    
    if (section === "numeracao") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'numeracao_os', valor: 'OS-{ANO}{MES}-{SEQUENCIAL}', descricao: 'Formato de Numeração para Ordens de Serviço', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'numeracao_recibo', valor: 'REC-{ANO}{MES}-{SEQUENCIAL}', descricao: 'Formato de Numeração para Recibos', created_at: currentDate, updated_at: currentDate },
      ];
    } else if (section === "financeiras") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'financeiro_taxa_padrao', valor: '0', descricao: 'Taxa Padrão de Juros (%)', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'financeiro_multa_atraso', valor: '0', descricao: 'Multa por Atraso (%)', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'financeiro_dias_vencimento', valor: '30', descricao: 'Dias Padrão para Vencimento', created_at: currentDate, updated_at: currentDate },
      ];
    } else if (section === "outras") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'prazo_padrao_entrega', valor: '7', descricao: 'Prazo Padrão para Entrega (dias)', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'modo_impressao_padrao', valor: 'completo', descricao: 'Modo de Impressão Padrão', created_at: currentDate, updated_at: currentDate },
      ];
    }
    
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">Nenhuma configuração encontrada nesta seção.</p>
        <Button 
          onClick={() => setConfiguracoes([...configuracoes, ...defaultFields])}
          variant="outline"
        >
          Criar Configurações Padrão
        </Button>
      </div>
    );
  }
};

export default ConfiguracoesList;
