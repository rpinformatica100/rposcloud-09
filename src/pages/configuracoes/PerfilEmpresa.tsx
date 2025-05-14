
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes } from "@/integrations/supabase/helpers";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Upload, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PerfilEmpresa = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso",
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

  // Agrupar configurações específicas da empresa
  const configEmpresa = configuracoes.filter(
    config => config.chave.startsWith('empresa_') && config.chave !== 'empresa_logo'
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
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Logo da Empresa</CardTitle>
            <CardDescription>
              Carregue o logo da sua empresa para ser exibido nas ordens de serviço e outros documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo da empresa" className="max-w-full max-h-full object-contain" />
              ) : (
                <Image className="h-16 w-16 text-gray-400" />
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
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>
              Configure os dados da sua empresa para exibição em documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {configEmpresa.length > 0 ? (
              configEmpresa.map((config) => (
                <div key={config.id} className="space-y-2">
                  <Label htmlFor={config.chave}>{config.descricao}</Label>
                  {config.chave === 'empresa_observacoes' ? (
                    <Textarea 
                      id={config.chave} 
                      value={config.valor || ''} 
                      onChange={(e) => handleInputChange(config.id, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input 
                      id={config.chave} 
                      value={config.valor || ''} 
                      onChange={(e) => handleInputChange(config.id, e.target.value)}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="space-y-4">
                {/* Default company fields to create if none exist */}
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">Nenhuma informação da empresa encontrada.</p>
                  <Button 
                    onClick={() => {
                      const defaultFields = [
                        { id: crypto.randomUUID(), chave: 'empresa_nome', valor: '', descricao: 'Nome da Empresa' },
                        { id: crypto.randomUUID(), chave: 'empresa_cnpj', valor: '', descricao: 'CNPJ' },
                        { id: crypto.randomUUID(), chave: 'empresa_endereco', valor: '', descricao: 'Endereço' },
                        { id: crypto.randomUUID(), chave: 'empresa_cidade', valor: '', descricao: 'Cidade' },
                        { id: crypto.randomUUID(), chave: 'empresa_estado', valor: '', descricao: 'Estado' },
                        { id: crypto.randomUUID(), chave: 'empresa_telefone', valor: '', descricao: 'Telefone' },
                        { id: crypto.randomUUID(), chave: 'empresa_email', valor: '', descricao: 'Email' },
                        { id: crypto.randomUUID(), chave: 'empresa_site', valor: '', descricao: 'Site' },
                        { id: crypto.randomUUID(), chave: 'empresa_observacoes', valor: '', descricao: 'Observações' },
                      ];
                      setConfiguracoes([...configuracoes, ...defaultFields]);
                    }}
                  >
                    Criar Campos Padrão
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Estas informações serão exibidas nas ordens de serviço impressas.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PerfilEmpresa;
