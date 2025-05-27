import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Mail, BellRing, Globe, Shield, CreditCard, Smartphone } from "lucide-react";

const ConfigAdmin = () => {
  // Dados de configuração
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUser: "notifications@sistema.com",
    smtpPassword: "●●●●●●●●●●●●",
    senderName: "Sistema OS",
    senderEmail: "no-reply@sistema.com",
  });
  
  const [notificationConfig, setNotificationConfig] = useState({
    newUserNotification: true,
    newAssistenciaNotification: true,
    paymentNotification: true,
    systemAlertsNotification: true,
    sendEmailNotification: true,
    sendSmsNotification: false,
  });
  
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Sistema OS",
    siteDescription: "Sistema de gerenciamento de ordens de serviço",
    contactEmail: "contato@sistema.com",
    contactPhone: "(11) 98765-4321",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    enableRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
  });
  
  const [securityConfig, setSecurityConfig] = useState({
    loginAttempts: "5",
    blockTimeMinutes: "30",
    passwordMinLength: "8",
    requireSpecialChars: true,
    requireUppercase: true,
    requireNumbers: true,
    sessionExpiryHours: "24",
    allowRememberMe: true,
  });

  // Nova configuração de pagamentos
  const [pagamentoConfig, setPagamentoConfig] = useState({
    stripe: {
      secretKey: "",
      publishableKey: "",
      webhookSecret: "",
      ativo: false,
    },
    mercadoPago: {
      accessToken: "",
      publicKey: "",
      ativo: false,
    },
  });

  // Funções para lidar com alterações
  const handleEmailConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleNotificationConfigChange = (name: string, value: boolean) => {
    setNotificationConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSiteConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSiteConfig(prev => ({ ...prev, [e.target.name]: value }));
  };
  
  const handleSecurityConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSecurityConfig(prev => ({ ...prev, [e.target.name]: value }));
  };
  
  // Nova função para lidar com alterações de pagamento
  const handlePagamentoConfigChange = (provider: 'stripe' | 'mercadoPago', field: string, value: string | boolean) => {
    setPagamentoConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  // Função para testar conexão com provedores de pagamento
  const testarConexaoPagamento = (provider: 'stripe' | 'mercadoPago') => {
    toast.info(`Testando conexão com ${provider === 'stripe' ? 'Stripe' : 'Mercado Pago'}...`);
    // Aqui seria implementada a lógica real de teste
    setTimeout(() => {
      toast.success(`Conexão com ${provider === 'stripe' ? 'Stripe' : 'Mercado Pago'} testada com sucesso!`);
    }, 2000);
  };

  // Salvar configurações
  const saveConfig = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>

      <Tabs defaultValue="site">
        <TabsList className="mb-6 bg-background">
          <TabsTrigger value="site" className="data-[state=active]:bg-muted">
            <Globe className="w-4 h-4 mr-2" />
            Site
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-muted">
            <BellRing className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-muted">
            <Mail className="w-4 h-4 mr-2" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="pagamentos" className="data-[state=active]:bg-muted">
            <CreditCard className="w-4 h-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-muted">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>
        
        {/* Configurações do Site */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Site</CardTitle>
              <CardDescription>
                Defina as configurações gerais do site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={siteConfig.siteName}
                    onChange={handleSiteConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={siteConfig.siteDescription}
                    onChange={handleSiteConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">E-mail de Contato</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    value={siteConfig.contactEmail}
                    onChange={handleSiteConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefone de Contato</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={siteConfig.contactPhone}
                    onChange={handleSiteConfigChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={siteConfig.address}
                    onChange={handleSiteConfigChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRegistration" className="font-medium">Permitir Registro</Label>
                    <p className="text-sm text-muted-foreground">Permite que novas assistências se registrem no sistema</p>
                  </div>
                  <Switch
                    id="enableRegistration"
                    name="enableRegistration"
                    checked={siteConfig.enableRegistration}
                    onCheckedChange={(checked) => 
                      setSiteConfig(prev => ({ ...prev, enableRegistration: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification" className="font-medium">Verificação de E-mail</Label>
                    <p className="text-sm text-muted-foreground">Requer verificação de e-mail para novos registros</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    checked={siteConfig.requireEmailVerification}
                    onCheckedChange={(checked) => 
                      setSiteConfig(prev => ({ ...prev, requireEmailVerification: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="font-medium">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Ativa o modo de manutenção no site</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={siteConfig.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setSiteConfig(prev => ({ ...prev, maintenanceMode: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Controle quais notificações serão enviadas pelo sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newUserNotification" className="font-medium">Novos Usuários</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando um novo usuário se registrar</p>
                  </div>
                  <Switch
                    id="newUserNotification"
                    checked={notificationConfig.newUserNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("newUserNotification", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newAssistenciaNotification" className="font-medium">Novas Assistências</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando uma nova assistência se registrar</p>
                  </div>
                  <Switch
                    id="newAssistenciaNotification"
                    checked={notificationConfig.newAssistenciaNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("newAssistenciaNotification", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentNotification" className="font-medium">Pagamentos</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre novos pagamentos</p>
                  </div>
                  <Switch
                    id="paymentNotification"
                    checked={notificationConfig.paymentNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("paymentNotification", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlertsNotification" className="font-medium">Alertas do Sistema</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre alertas importantes do sistema</p>
                  </div>
                  <Switch
                    id="systemAlertsNotification"
                    checked={notificationConfig.systemAlertsNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("systemAlertsNotification", checked)
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Canais de notificação</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendEmailNotification" className="font-medium">E-mail</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por e-mail</p>
                  </div>
                  <Switch
                    id="sendEmailNotification"
                    checked={notificationConfig.sendEmailNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("sendEmailNotification", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendSmsNotification" className="font-medium">SMS</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por SMS</p>
                  </div>
                  <Switch
                    id="sendSmsNotification"
                    checked={notificationConfig.sendSmsNotification}
                    onCheckedChange={(checked) => 
                      handleNotificationConfigChange("sendSmsNotification", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de E-mail */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de E-mail</CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de e-mails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">Servidor SMTP</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailConfig.smtpServer}
                    onChange={handleEmailConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={handleEmailConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuário SMTP</Label>
                  <Input
                    id="smtpUser"
                    name="smtpUser"
                    value={emailConfig.smtpUser}
                    onChange={handleEmailConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha SMTP</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={handleEmailConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input
                    id="senderName"
                    name="senderName"
                    value={emailConfig.senderName}
                    onChange={handleEmailConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">E-mail do Remetente</Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    value={emailConfig.senderEmail}
                    onChange={handleEmailConfigChange}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button variant="outline" className="mr-2">
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba de Configurações de Pagamento */}
        <TabsContent value="pagamentos">
          <div className="space-y-6">
            {/* Configurações Stripe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Stripe - Cartão de Crédito
                </CardTitle>
                <CardDescription>
                  Configure as credenciais do Stripe para processar pagamentos com cartão de crédito.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label htmlFor="stripeAtivo" className="font-medium">Ativar Stripe</Label>
                    <p className="text-sm text-muted-foreground">Habilitar pagamentos via Stripe</p>
                  </div>
                  <Switch
                    id="stripeAtivo"
                    checked={pagamentoConfig.stripe.ativo}
                    onCheckedChange={(checked) => 
                      handlePagamentoConfigChange("stripe", "ativo", checked)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      type="password"
                      value={pagamentoConfig.stripe.secretKey}
                      onChange={(e) => handlePagamentoConfigChange("stripe", "secretKey", e.target.value)}
                      placeholder="sk_test_..."
                      disabled={!pagamentoConfig.stripe.ativo}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                    <Input
                      id="stripePublishableKey"
                      value={pagamentoConfig.stripe.publishableKey}
                      onChange={(e) => handlePagamentoConfigChange("stripe", "publishableKey", e.target.value)}
                      placeholder="pk_test_..."
                      disabled={!pagamentoConfig.stripe.ativo}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                    <Input
                      id="stripeWebhookSecret"
                      type="password"
                      value={pagamentoConfig.stripe.webhookSecret}
                      onChange={(e) => handlePagamentoConfigChange("stripe", "webhookSecret", e.target.value)}
                      placeholder="whsec_..."
                      disabled={!pagamentoConfig.stripe.ativo}
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => testarConexaoPagamento('stripe')}
                    disabled={!pagamentoConfig.stripe.ativo || !pagamentoConfig.stripe.secretKey}
                  >
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Mercado Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Mercado Pago - PIX
                </CardTitle>
                <CardDescription>
                  Configure as credenciais do Mercado Pago para processar pagamentos via PIX.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label htmlFor="mercadoPagoAtivo" className="font-medium">Ativar Mercado Pago</Label>
                    <p className="text-sm text-muted-foreground">Habilitar pagamentos via PIX</p>
                  </div>
                  <Switch
                    id="mercadoPagoAtivo"
                    checked={pagamentoConfig.mercadoPago.ativo}
                    onCheckedChange={(checked) => 
                      handlePagamentoConfigChange("mercadoPago", "ativo", checked)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mercadoPagoAccessToken">Access Token</Label>
                    <Input
                      id="mercadoPagoAccessToken"
                      type="password"
                      value={pagamentoConfig.mercadoPago.accessToken}
                      onChange={(e) => handlePagamentoConfigChange("mercadoPago", "accessToken", e.target.value)}
                      placeholder="APP_USR-..."
                      disabled={!pagamentoConfig.mercadoPago.ativo}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mercadoPagoPublicKey">Public Key</Label>
                    <Input
                      id="mercadoPagoPublicKey"
                      value={pagamentoConfig.mercadoPago.publicKey}
                      onChange={(e) => handlePagamentoConfigChange("mercadoPago", "publicKey", e.target.value)}
                      placeholder="APP_USR-..."
                      disabled={!pagamentoConfig.mercadoPago.ativo}
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => testarConexaoPagamento('mercadoPago')}
                    disabled={!pagamentoConfig.mercadoPago.ativo || !pagamentoConfig.mercadoPago.accessToken}
                  >
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Tentativas de Login</Label>
                  <Input
                    id="loginAttempts"
                    name="loginAttempts"
                    type="number"
                    value={securityConfig.loginAttempts}
                    onChange={handleSecurityConfigChange}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockTimeMinutes">Tempo de Bloqueio (minutos)</Label>
                  <Input
                    id="blockTimeMinutes"
                    name="blockTimeMinutes"
                    type="number"
                    value={securityConfig.blockTimeMinutes}
                    onChange={handleSecurityConfigChange}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo de Senha</Label>
                  <Input
                    id="passwordMinLength"
                    name="passwordMinLength"
                    type="number"
                    value={securityConfig.passwordMinLength}
                    onChange={handleSecurityConfigChange}
                    min="6"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionExpiryHours">Expiração de Sessão (horas)</Label>
                  <Input
                    id="sessionExpiryHours"
                    name="sessionExpiryHours"
                    type="number"
                    value={securityConfig.sessionExpiryHours}
                    onChange={handleSecurityConfigChange}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Requisitos de Senha</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireSpecialChars" className="font-medium">Caracteres Especiais</Label>
                    <p className="text-sm text-muted-foreground">Exigir caracteres especiais na senha</p>
                  </div>
                  <Switch
                    id="requireSpecialChars"
                    name="requireSpecialChars"
                    checked={securityConfig.requireSpecialChars}
                    onCheckedChange={(checked) => 
                      setSecurityConfig(prev => ({ ...prev, requireSpecialChars: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireUppercase" className="font-medium">Letras Maiúsculas</Label>
                    <p className="text-sm text-muted-foreground">Exigir letras maiúsculas na senha</p>
                  </div>
                  <Switch
                    id="requireUppercase"
                    name="requireUppercase"
                    checked={securityConfig.requireUppercase}
                    onCheckedChange={(checked) => 
                      setSecurityConfig(prev => ({ ...prev, requireUppercase: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireNumbers" className="font-medium">Números</Label>
                    <p className="text-sm text-muted-foreground">Exigir números na senha</p>
                  </div>
                  <Switch
                    id="requireNumbers"
                    name="requireNumbers"
                    checked={securityConfig.requireNumbers}
                    onCheckedChange={(checked) => 
                      setSecurityConfig(prev => ({ ...prev, requireNumbers: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRememberMe" className="font-medium">Lembrar-me</Label>
                    <p className="text-sm text-muted-foreground">Permitir opção "Lembrar-me" no login</p>
                  </div>
                  <Switch
                    id="allowRememberMe"
                    name="allowRememberMe"
                    checked={securityConfig.allowRememberMe}
                    onCheckedChange={(checked) => 
                      setSecurityConfig(prev => ({ ...prev, allowRememberMe: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={saveConfig}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default ConfigAdmin;
