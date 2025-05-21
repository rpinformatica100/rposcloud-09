
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

const ConfigAdmin = () => {
  // Estados para as configurações
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Sistema OS",
    siteDescription: "Sistema de Ordens de Serviço",
    adminEmail: "admin@sistemados.com",
  });
  
  const [plansEnabled, setPlansEnabled] = useState({
    basic: true,
    premium: true,
    enterprise: true
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@sistemados.com",
    emailTemplate: "Olá {nome},\n\nSua assinatura do plano {plano} foi processada com sucesso.\n\nObrigado por escolher o Sistema OS!\n\nAtenciosamente,\nEquipe Sistema OS"
  });

  // Handlers
  const handleSiteConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteConfig({
      ...siteConfig,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailConfig({
      ...emailConfig,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveConfig = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>

      <div className="grid gap-6">
        {/* Configurações do Site */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Configure as informações básicas do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Input 
                id="siteDescription" 
                name="siteDescription" 
                value={siteConfig.siteDescription} 
                onChange={handleSiteConfigChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input 
                id="adminEmail" 
                name="adminEmail" 
                type="email" 
                value={siteConfig.adminEmail} 
                onChange={handleSiteConfigChange} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
          </CardFooter>
        </Card>

        {/* Configurações de Planos */}
        <Card>
          <CardHeader>
            <CardTitle>Planos e Assinaturas</CardTitle>
            <CardDescription>
              Configure a disponibilidade dos planos de assinatura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="basicPlan">Plano Básico</Label>
                <p className="text-sm text-muted-foreground">R$ 49,90/mês ou R$ 479,00/ano</p>
              </div>
              <Switch 
                id="basicPlan" 
                checked={plansEnabled.basic} 
                onCheckedChange={(checked) => setPlansEnabled({...plansEnabled, basic: checked})} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="premiumPlan">Plano Profissional</Label>
                <p className="text-sm text-muted-foreground">R$ 99,90/mês ou R$ 959,00/ano</p>
              </div>
              <Switch 
                id="premiumPlan" 
                checked={plansEnabled.premium} 
                onCheckedChange={(checked) => setPlansEnabled({...plansEnabled, premium: checked})} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enterprisePlan">Plano Empresarial</Label>
                <p className="text-sm text-muted-foreground">R$ 199,90/mês ou R$ 1.919,00/ano</p>
              </div>
              <Switch 
                id="enterprisePlan" 
                checked={plansEnabled.enterprise} 
                onCheckedChange={(checked) => setPlansEnabled({...plansEnabled, enterprise: checked})} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
          </CardFooter>
        </Card>

        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Email</CardTitle>
            <CardDescription>
              Configure as notificações de email do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="smtpUsername">Usuário SMTP</Label>
              <Input 
                id="smtpUsername" 
                name="smtpUsername" 
                value={emailConfig.smtpUsername} 
                onChange={handleEmailConfigChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Senha SMTP</Label>
              <Input 
                id="smtpPassword" 
                name="smtpPassword" 
                type="password" 
                placeholder="••••••••" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Template de Email de Boas-vindas</Label>
              <Textarea 
                id="emailTemplate" 
                name="emailTemplate" 
                rows={6} 
                value={emailConfig.emailTemplate}
                onChange={handleEmailConfigChange}
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {"{nome}"}, {"{plano}"}, {"{data}"}, {"{valor}"}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ConfigAdmin;
