
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { Settings, Save, CheckCircle, FileText, CreditCard, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const ConfiguracoesSimplesForm = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Agrupar configurações por tipo úteis
  const configNumeracao = configuracoes.filter(
    config => config.chave.startsWith('numeracao_') && 
    (config.chave.includes('os') || config.chave.includes('recibo'))
  );
  
  const configBasicas = configuracoes.filter(
    config => config.chave === 'prazo_padrao_entrega' || 
              config.chave === 'financeiro_dias_vencimento' ||
              config.chave === 'financeiro_taxa_padrao'
  );

  // Estado para configurações simples
  const [printConfig, setPrintConfig] = useState({
    showLogo: true,
    compactMode: false,
    includePrices: true,
  });

  const handlePrintConfigChange = (field: string, value: boolean) => {
    setPrintConfig(prev => ({
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

      <Tabs defaultValue="basicas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="basicas" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>Básicas</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Documentos</span>
          </TabsTrigger>
          <TabsTrigger value="impressao" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Impressão</span>
          </TabsTrigger>
        </TabsList>

        {/* Configurações Básicas */}
        <TabsContent value="basicas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Básicas
              </CardTitle>
              <CardDescription>
                Ajuste as configurações operacionais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configBasicas.length > 0 ? (
                configBasicas.map((config) => (
                  <div key={config.id} className="space-y-2">
                    <Label htmlFor={config.chave}>{config.descricao}</Label>
                    <Input 
                      id={config.chave} 
                      value={config.valor || ''} 
                      onChange={(e) => handleInputChange(config.id, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma configuração básica encontrada.</p>
                </div>
              )}
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
                Configure formatos de numeração para ordens de serviço
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma configuração de numeração encontrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Impressão */}
        <TabsContent value="impressao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Impressão
              </CardTitle>
              <CardDescription>
                Configure como os documentos serão impressos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesSimplesForm;
