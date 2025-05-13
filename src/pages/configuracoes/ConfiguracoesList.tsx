
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { configuracoesData } from "@/data/dados";
import { Configuracao } from "@/types";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const ConfiguracoesList = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>(configuracoesData);
  const { toast } = useToast();

  const handleInputChange = (id: string, valor: string) => {
    setConfiguracoes(configuracoes.map(config => {
      if (config.id === id) {
        return { ...config, valor };
      }
      return config;
    }));
  };

  const handleSalvar = () => {
    // Em uma aplicação real, aqui enviaria dados para API
    
    // Simular atualização no array local
    configuracoesData.splice(0, configuracoesData.length, ...configuracoes);
    
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso",
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <Button onClick={handleSalvar}>
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
              <span className="font-medium">Usuário de Teste:</span>
              <span>teste@sistema.com / 123456</span>
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
