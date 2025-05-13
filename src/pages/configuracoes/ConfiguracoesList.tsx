
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ConfiguracoesList = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch configurações
  const { data, isLoading, error } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: fetchConfiguracoes,
    onSuccess: (data) => {
      setConfiguracoes(data);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: upsertConfiguracoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
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
  const configEmpresa = configuracoes.filter(
    config => config.chave.startsWith('empresa_')
  );
  
  const configNumeracao = configuracoes.filter(
    config => config.chave.startsWith('numeracao_')
  );
  
  const configOutras = configuracoes.filter(
    config => !config.chave.startsWith('empresa_') && !config.chave.startsWith('numeracao_')
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
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Configurações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Configure as informações da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configEmpresa.map((config) => (
            <div key={config.id} className="space-y-2">
              <Label htmlFor={config.chave}>{config.descricao}</Label>
              <Input 
                id={config.chave} 
                value={config.valor} 
                onChange={(e) => handleInputChange(config.id, e.target.value)}
              />
            </div>
          ))}
          {configEmpresa.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Nenhuma configuração de empresa encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Configurações de Numeração */}
      <Card>
        <CardHeader>
          <CardTitle>Numeração de Documentos</CardTitle>
          <CardDescription>
            Configure formatos de numeração para ordens de serviço e outros documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configNumeracao.map((config) => (
            <div key={config.id} className="space-y-2">
              <Label htmlFor={config.chave}>{config.descricao}</Label>
              <Input 
                id={config.chave} 
                value={config.valor} 
                onChange={(e) => handleInputChange(config.id, e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use {"{ANO}"} para ano atual, {"{MES}"} para mês atual e {"{SEQUENCIAL}"} para número sequencial
              </p>
            </div>
          ))}
          {configNumeracao.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Nenhuma configuração de numeração encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Outras Configurações */}
      {configOutras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outras Configurações</CardTitle>
            <CardDescription>
              Configurações adicionais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {configOutras.map((config) => (
              <div key={config.id} className="space-y-2">
                <Label htmlFor={config.chave}>{config.descricao}</Label>
                <Input 
                  id={config.chave} 
                  value={config.valor} 
                  onChange={(e) => handleInputChange(config.id, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
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
};

export default ConfiguracoesList;
