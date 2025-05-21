import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { Settings, Save, AlertCircle, CheckCircle, FileText, Percent, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ConfiguracoesList = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAssistencia } = useAuth();

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
  useEffect(() => {
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

      <Tabs defaultValue="numeracao" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="numeracao" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Numeração</span>
          </TabsTrigger>
          <TabsTrigger value="financeiras" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span>Financeiras</span>
          </TabsTrigger>
          <TabsTrigger value="outras" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Outras</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="numeracao">
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
        
        <TabsContent value="outras">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Outras Configurações
              </CardTitle>
              <CardDescription>
                Configurações adicionais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sistema OS - Todos os direitos reservados
          </p>
        </CardFooter>
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
