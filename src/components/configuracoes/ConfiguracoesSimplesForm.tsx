
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ConfiguracaoRow, ConfiguracaoInsert, ConfiguracaoUpdate } from "@/integrations/supabase/helpers";

// Configurações padrão do sistema
const configuracoesPadrao = [
  { chave: "empresa_nome", valor: "", descricao: "Nome da empresa", tipo: "text" },
  { chave: "empresa_email", valor: "", descricao: "Email da empresa", tipo: "email" },
  { chave: "empresa_telefone", valor: "", descricao: "Telefone da empresa", tipo: "text" },
  { chave: "empresa_endereco", valor: "", descricao: "Endereço da empresa", tipo: "text" },
  { chave: "empresa_cnpj", valor: "", descricao: "CNPJ da empresa", tipo: "text" },
  { chave: "sistema_tema", valor: "claro", descricao: "Tema do sistema", tipo: "text" },
  { chave: "sistema_notificacoes", valor: "true", descricao: "Ativar notificações", tipo: "boolean" },
  { chave: "ordem_numeracao_automatica", valor: "true", descricao: "Numeração automática de OS", tipo: "boolean" },
  { chave: "ordem_numero_inicial", valor: "1", descricao: "Número inicial para OS", tipo: "number" },
  { chave: "financeiro_moeda", valor: "BRL", descricao: "Moeda padrão", tipo: "text" },
];

const ConfiguracoesSimplesForm = () => {
  const [configuracoesLocais, setConfiguracoesLocais] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch configurações
  const { data: configuracoes, isLoading } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*');
      
      if (error) throw error;
      return data as ConfiguracaoRow[];
    }
  });

  // Mutation para salvar configurações
  const { mutateAsync: salvarConfiguracoes, isPending } = useMutation({
    mutationFn: async (configs: ConfiguracaoInsert[]) => {
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert(configs, { 
          onConflict: 'assistencia_id,chave',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Initialize local state with fetched data
  useEffect(() => {
    if (configuracoes) {
      const configsMap: { [key: string]: string } = {};
      configuracoes.forEach((config) => {
        configsMap[config.chave] = config.valor || '';
      });
      
      // Add default values for missing configs
      configuracoesPadrao.forEach((config) => {
        if (!(config.chave in configsMap)) {
          configsMap[config.chave] = config.valor;
        }
      });
      
      setConfiguracoesLocais(configsMap);
    }
  }, [configuracoes]);

  const handleInputChange = (chave: string, valor: string | boolean) => {
    setConfiguracoesLocais(prev => ({
      ...prev,
      [chave]: String(valor)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get current user's assistencia_id
      const { data: assistencia } = await supabase
        .from('assistencias')
        .select('id')
        .single();
      
      if (!assistencia) {
        throw new Error('Assistência não encontrada');
      }

      // Prepare configurations for upsert
      const configsToSave: ConfiguracaoInsert[] = configuracoesPadrao.map((config) => ({
        assistencia_id: assistencia.id,
        chave: config.chave,
        valor: configuracoesLocais[config.chave] || config.valor,
        descricao: config.descricao,
        tipo: config.tipo as "text" | "number" | "boolean" | "email" | "url"
      }));

      await salvarConfiguracoes(configsToSave);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure as principais opções do sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configurações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Informações básicas da sua empresa que aparecerão nos documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa_nome">Nome da Empresa</Label>
                <Input
                  id="empresa_nome"
                  value={configuracoesLocais["empresa_nome"] || ""}
                  onChange={(e) => handleInputChange("empresa_nome", e.target.value)}
                  placeholder="Nome da sua empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa_email">Email</Label>
                <Input
                  id="empresa_email"
                  type="email"
                  value={configuracoesLocais["empresa_email"] || ""}
                  onChange={(e) => handleInputChange("empresa_email", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa_telefone">Telefone</Label>
                <Input
                  id="empresa_telefone"
                  value={configuracoesLocais["empresa_telefone"] || ""}
                  onChange={(e) => handleInputChange("empresa_telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa_cnpj">CNPJ</Label>
                <Input
                  id="empresa_cnpj"
                  value={configuracoesLocais["empresa_cnpj"] || ""}
                  onChange={(e) => handleInputChange("empresa_cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa_endereco">Endereço</Label>
              <Textarea
                id="empresa_endereco"
                value={configuracoesLocais["empresa_endereco"] || ""}
                onChange={(e) => handleInputChange("empresa_endereco", e.target.value)}
                placeholder="Endereço completo da empresa"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
            <CardDescription>
              Configurações gerais do funcionamento do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações do sistema
                </p>
              </div>
              <Switch
                checked={configuracoesLocais["sistema_notificacoes"] === "true"}
                onCheckedChange={(checked) => handleInputChange("sistema_notificacoes", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Numeração Automática de OS</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar números automaticamente para novas ordens
                </p>
              </div>
              <Switch
                checked={configuracoesLocais["ordem_numeracao_automatica"] === "true"}
                onCheckedChange={(checked) => handleInputChange("ordem_numeracao_automatica", checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ordem_numero_inicial">Número Inicial para OS</Label>
                <Input
                  id="ordem_numero_inicial"
                  type="number"
                  value={configuracoesLocais["ordem_numero_inicial"] || "1"}
                  onChange={(e) => handleInputChange("ordem_numero_inicial", e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financeiro_moeda">Moeda Padrão</Label>
                <Input
                  id="financeiro_moeda"
                  value={configuracoesLocais["financeiro_moeda"] || "BRL"}
                  onChange={(e) => handleInputChange("financeiro_moeda", e.target.value)}
                  placeholder="BRL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracoesSimplesForm;
