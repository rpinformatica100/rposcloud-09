
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Settings, Shield, Database, Clock, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ConfiguracoesSistema = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const queryClient = useQueryClient();

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
      toast.success("Configurações do sistema salvas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações do sistema");
    }
  });

  const createOrUpdateConfig = (chave: string, valor: string, descricao: string) => {
    const existingConfig = configuracoes.find(c => c.chave === chave);
    
    if (existingConfig) {
      const updatedConfigs = configuracoes.map(config => 
        config.id === existingConfig.id ? { ...config, valor } : config
      );
      setConfiguracoes(updatedConfigs);
    } else {
      const newConfig: ConfiguracaoRow = {
        id: crypto.randomUUID(),
        chave,
        valor,
        descricao,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setConfiguracoes([...configuracoes, newConfig]);
    }
  };

  const getConfigValue = (chave: string, defaultValue: string = "") => {
    return configuracoes.find(c => c.chave === chave)?.valor || defaultValue;
  };

  const handleSalvar = () => {
    updateMutation.mutate(configuracoes);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground">Gerencie as configurações avançadas do sistema</p>
        </div>
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
          ) : updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure as preferências gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select 
                    value={getConfigValue('sistema_timezone', 'America/Sao_Paulo')}
                    onValueChange={(value) => createOrUpdateConfig('sistema_timezone', value, 'Fuso Horário do Sistema')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                      <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moeda">Moeda Padrão</Label>
                  <Select 
                    value={getConfigValue('sistema_moeda', 'BRL')}
                    onValueChange={(value) => createOrUpdateConfig('sistema_moeda', value, 'Moeda Padrão')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificacoes">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações do sistema
                  </p>
                </div>
                <Switch 
                  id="notificacoes"
                  checked={getConfigValue('sistema_notificacoes') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('sistema_notificacoes', checked.toString(), 'Notificações Push')
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="modo_manutencao">Modo Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar modo de manutenção do sistema
                  </p>
                </div>
                <Switch 
                  id="modo_manutencao"
                  checked={getConfigValue('sistema_manutencao') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('sistema_manutencao', checked.toString(), 'Modo Manutenção')
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações de Backup
              </CardTitle>
              <CardDescription>
                Configure o sistema de backup automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backup_automatico">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Realizar backup automático dos dados
                  </p>
                </div>
                <Switch 
                  id="backup_automatico"
                  checked={getConfigValue('backup_automatico') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('backup_automatico', checked.toString(), 'Backup Automático')
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_frequencia">Frequência do Backup</Label>
                <Select 
                  value={getConfigValue('backup_frequencia', 'diario')}
                  onValueChange={(value) => createOrUpdateConfig('backup_frequencia', value, 'Frequência do Backup')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_retencao">Retenção de Backups (dias)</Label>
                <Input 
                  id="backup_retencao"
                  type="number"
                  value={getConfigValue('backup_retencao', '30')}
                  onChange={(e) => createOrUpdateConfig('backup_retencao', e.target.value, 'Retenção de Backups')}
                  placeholder="30"
                  min="1"
                  max="365"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessao_timeout">Timeout da Sessão (minutos)</Label>
                <Input 
                  id="sessao_timeout"
                  type="number"
                  value={getConfigValue('seguranca_timeout', '30')}
                  onChange={(e) => createOrUpdateConfig('seguranca_timeout', e.target.value, 'Timeout da Sessão')}
                  placeholder="30"
                  min="5"
                  max="480"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="duas_etapas">Autenticação de Duas Etapas</Label>
                  <p className="text-sm text-muted-foreground">
                    Forçar 2FA para todos os usuários
                  </p>
                </div>
                <Switch 
                  id="duas_etapas"
                  checked={getConfigValue('seguranca_2fa') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('seguranca_2fa', checked.toString(), 'Autenticação de Duas Etapas')
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="log_auditoria">Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar todas as ações dos usuários
                  </p>
                </div>
                <Switch 
                  id="log_auditoria"
                  checked={getConfigValue('seguranca_auditoria') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('seguranca_auditoria', checked.toString(), 'Log de Auditoria')
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tentativas_login">Máximo de Tentativas de Login</Label>
                <Input 
                  id="tentativas_login"
                  type="number"
                  value={getConfigValue('seguranca_tentativas', '5')}
                  onChange={(e) => createOrUpdateConfig('seguranca_tentativas', e.target.value, 'Máximo de Tentativas de Login')}
                  placeholder="5"
                  min="3"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manutencao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Configurações de Manutenção
              </CardTitle>
              <CardDescription>
                Configure as opções de manutenção e limpeza do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="limpeza_automatica">Limpeza Automática de Logs</Label>
                  <p className="text-sm text-muted-foreground">
                    Remover automaticamente logs antigos
                  </p>
                </div>
                <Switch 
                  id="limpeza_automatica"
                  checked={getConfigValue('manutencao_limpeza') === 'true'}
                  onCheckedChange={(checked) => 
                    createOrUpdateConfig('manutencao_limpeza', checked.toString(), 'Limpeza Automática de Logs')
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logs_retencao">Retenção de Logs (dias)</Label>
                <Input 
                  id="logs_retencao"
                  type="number"
                  value={getConfigValue('manutencao_logs_retencao', '90')}
                  onChange={(e) => createOrUpdateConfig('manutencao_logs_retencao', e.target.value, 'Retenção de Logs')}
                  placeholder="90"
                  min="7"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manutencao_horario">Horário da Manutenção</Label>
                <Input 
                  id="manutencao_horario"
                  type="time"
                  value={getConfigValue('manutencao_horario', '02:00')}
                  onChange={(e) => createOrUpdateConfig('manutencao_horario', e.target.value, 'Horário da Manutenção')}
                />
              </div>

              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Atenção</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Algumas configurações de manutenção podem afetar a performance do sistema. 
                      Consulte a documentação antes de fazer alterações.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesSistema;
