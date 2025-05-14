
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Upload, Image, Building, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PerfilEmpresa = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
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
      
      // Find logo configuration
      const logoConfig = data.find(config => config.chave === 'empresa_logo');
      if (logoConfig?.valor) {
        setLogoUrl(logoConfig.valor);
      }
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
        description: "As configurações da empresa foram atualizadas com sucesso",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações da empresa",
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Create a storage bucket for logos if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('company_logos');
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('company_logos', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });
      }

      // Upload the file
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('company_logos')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('company_logos')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        // Find and update the logo configuration
        const logoConfig = configuracoes.find(config => config.chave === 'empresa_logo');
        if (logoConfig) {
          handleInputChange(logoConfig.id, urlData.publicUrl);
          setLogoUrl(urlData.publicUrl);
        } else {
          // If logo config doesn't exist, create a new one
          // Include the required fields for ConfiguracaoRow
          const newConfig: ConfiguracaoRow = {
            id: crypto.randomUUID(),
            chave: 'empresa_logo',
            valor: urlData.publicUrl,
            descricao: 'Logo da empresa',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setConfiguracoes([...configuracoes, newConfig]);
          setLogoUrl(urlData.publicUrl);
        }
        
        toast({
          title: "Logo carregado",
          description: "O logo foi carregado com sucesso",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer upload do logo:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer o upload do logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Agrupar configurações por categorias
  const infoBasica = configuracoes.filter(
    config => ['empresa_nome', 'empresa_cnpj', 'empresa_telefone', 'empresa_email', 'empresa_site'].includes(config.chave)
  );
  
  const infoEndereco = configuracoes.filter(
    config => ['empresa_endereco', 'empresa_cidade', 'empresa_estado', 'empresa_cep'].includes(config.chave)
  );
  
  const infoAdicional = configuracoes.filter(
    config => config.chave.startsWith('empresa_') && 
    !['empresa_logo', 'empresa_nome', 'empresa_cnpj', 'empresa_telefone', 'empresa_email', 'empresa_site',
      'empresa_endereco', 'empresa_cidade', 'empresa_estado', 'empresa_cep'].includes(config.chave)
  );
  
  if (isLoading) {
    return <div className="space-y-6"><h1 className="text-3xl font-bold tracking-tight">Carregando...</h1></div>;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Perfil da Empresa</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">Perfil da Empresa</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo da Empresa
            </CardTitle>
            <CardDescription>
              Carregue o logo da sua empresa para ser exibido nas ordens de serviço e outros documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
              {logoUrl ? (
                <div className="w-full h-full relative">
                  <AspectRatio ratio={1/1}>
                    <img src={logoUrl} alt="Logo da empresa" className="w-full h-full object-contain" />
                  </AspectRatio>
                </div>
              ) : (
                <div className="text-center">
                  <Image className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Nenhum logo carregado</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
                  <Upload size={16} />
                  <span>{uploading ? "Enviando..." : "Carregar Logo"}</span>
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
              </Label>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Formatos permitidos: JPG, PNG, GIF, WEBP.<br />
              Tamanho máximo: 2MB
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Configure os dados da sua empresa para exibição em documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="informacoes" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="informacoes">Informações Básicas</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="adicional">Informações Adicionais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="informacoes" className="space-y-4">
                {infoBasica.length > 0 ? (
                  infoBasica.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <Label htmlFor={config.chave}>{config.descricao}</Label>
                      <Input 
                        id={config.chave} 
                        value={config.valor || ''} 
                        onChange={(e) => handleInputChange(config.id, e.target.value)}
                        placeholder={`Digite ${config.descricao.toLowerCase()}`}
                      />
                    </div>
                  ))
                ) : renderDefaultFields("informacoes")}
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4">
                {infoEndereco.length > 0 ? (
                  infoEndereco.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <Label htmlFor={config.chave}>{config.descricao}</Label>
                      <Input 
                        id={config.chave} 
                        value={config.valor || ''} 
                        onChange={(e) => handleInputChange(config.id, e.target.value)}
                        placeholder={`Digite ${config.descricao.toLowerCase()}`}
                      />
                    </div>
                  ))
                ) : renderDefaultFields("endereco")}
              </TabsContent>
              
              <TabsContent value="adicional" className="space-y-4">
                {infoAdicional.length > 0 ? (
                  infoAdicional.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <Label htmlFor={config.chave}>{config.descricao}</Label>
                      {config.chave === 'empresa_observacoes' ? (
                        <Textarea 
                          id={config.chave} 
                          value={config.valor || ''} 
                          onChange={(e) => handleInputChange(config.id, e.target.value)}
                          rows={4}
                          placeholder="Digite as observações"
                        />
                      ) : (
                        <Input 
                          id={config.chave} 
                          value={config.valor || ''} 
                          onChange={(e) => handleInputChange(config.id, e.target.value)}
                          placeholder={`Digite ${config.descricao.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))
                ) : renderDefaultFields("adicional")}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Estas informações serão exibidas nas ordens de serviço impressas e podem ser editadas a qualquer momento.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  function renderDefaultFields(section: string) {
    // Create default fields based on section
    const currentDate = new Date().toISOString();
    let defaultFields: ConfiguracaoRow[] = [];
    
    if (section === "informacoes") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'empresa_nome', valor: '', descricao: 'Nome da Empresa', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_cnpj', valor: '', descricao: 'CNPJ', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_telefone', valor: '', descricao: 'Telefone', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_email', valor: '', descricao: 'Email', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_site', valor: '', descricao: 'Site', created_at: currentDate, updated_at: currentDate },
      ];
    } else if (section === "endereco") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'empresa_endereco', valor: '', descricao: 'Endereço', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_cidade', valor: '', descricao: 'Cidade', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_estado', valor: '', descricao: 'Estado', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_cep', valor: '', descricao: 'CEP', created_at: currentDate, updated_at: currentDate },
      ];
    } else if (section === "adicional") {
      defaultFields = [
        { id: crypto.randomUUID(), chave: 'empresa_observacoes', valor: '', descricao: 'Observações', created_at: currentDate, updated_at: currentDate },
        { id: crypto.randomUUID(), chave: 'empresa_slogan', valor: '', descricao: 'Slogan', created_at: currentDate, updated_at: currentDate },
      ];
    }
    
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">Nenhuma informação encontrada nesta seção.</p>
        <Button 
          onClick={() => setConfiguracoes([...configuracoes, ...defaultFields])}
          variant="outline"
        >
          Criar Campos Padrão
        </Button>
      </div>
    );
  }
};

export default PerfilEmpresa;
