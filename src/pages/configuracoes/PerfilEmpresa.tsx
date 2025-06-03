
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfiguracaoRow, fetchConfiguracoes, upsertConfiguracoes, getCurrentUserAssistenciaId } from "@/integrations/supabase/helpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Upload, Image, Building, CheckCircle, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInputMask } from "@/hooks/use-input-mask";
import { useExternalServices } from "@/hooks/use-external-services";
import { toast } from "sonner";

const PerfilEmpresa = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoRow[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const queryClient = useQueryClient();
  
  // Hooks para máscaras e serviços externos
  const { cepMask, phoneMask, cnpjMask } = useInputMask();
  const { fetchCep, loadingCep } = useExternalServices();

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
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
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

  const createOrUpdateConfig = async (chave: string, valor: string, descricao: string) => {
    const existingConfig = configuracoes.find(c => c.chave === chave);
    
    if (existingConfig) {
      handleInputChange(existingConfig.id, valor);
    } else {
      const assistenciaId = await getCurrentUserAssistenciaId();
      if (!assistenciaId) {
        toast.error("Erro: assistência não encontrada");
        return;
      }

      const newConfig: ConfiguracaoRow = {
        id: crypto.randomUUID(),
        assistencia_id: assistenciaId,
        chave,
        valor,
        descricao,
        tipo: 'text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setConfiguracoes([...configuracoes, newConfig]);
    }
  };

  const handleSalvar = () => {
    updateMutation.mutate(configuracoes);
  };

  // Função para buscar CEP automaticamente - CORRIGIDA
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedEvent = cepMask(e);
    
    // Atualizar ou criar configuração de CEP
    const cepConfig = configuracoes.find(c => c.chave === 'empresa_cep');
    if (cepConfig) {
      handleInputChange(cepConfig.id, maskedEvent.target.value);
    } else {
      createOrUpdateConfig('empresa_cep', maskedEvent.target.value, 'CEP');
    }
    
    // Se o CEP está completo (8 dígitos), buscar automaticamente
    const cepDigits = maskedEvent.target.value.replace(/\D/g, '');
    if (cepDigits.length === 8) {
      const cepData = await fetchCep(maskedEvent.target.value);
      
      if (cepData) {
        // Atualizar automaticamente os campos de endereço
        if (cepData.logradouro) {
          createOrUpdateConfig('empresa_endereco', cepData.logradouro, 'Endereço');
        }
        if (cepData.localidade) {
          createOrUpdateConfig('empresa_cidade', cepData.localidade, 'Cidade');
        }
        if (cepData.uf) {
          createOrUpdateConfig('empresa_estado', cepData.uf, 'Estado');
        }
        
        toast.success("CEP encontrado! Endereço preenchido automaticamente");
      }
    }
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
        createOrUpdateConfig('empresa_logo', urlData.publicUrl, 'Logo da empresa');
        setLogoUrl(urlData.publicUrl);
        toast.success("Logo carregado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer upload do logo:", error);
      toast.error("Erro ao carregar logo");
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
          ) : updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
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
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
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
                {/* Nome da Empresa */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_nome">Nome da Empresa</Label>
                  <Input 
                    id="empresa_nome" 
                    value={infoBasica.find(c => c.chave === 'empresa_nome')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoBasica.find(c => c.chave === 'empresa_nome');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_nome', e.target.value, 'Nome da Empresa');
                      }
                    }}
                    placeholder="Digite o nome da empresa"
                  />
                </div>

                {/* CNPJ com máscara */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_cnpj">CNPJ</Label>
                  <Input 
                    id="empresa_cnpj" 
                    value={infoBasica.find(c => c.chave === 'empresa_cnpj')?.valor || ''} 
                    onChange={(e) => {
                      const maskedEvent = cnpjMask(e);
                      const config = infoBasica.find(c => c.chave === 'empresa_cnpj');
                      if (config) {
                        handleInputChange(config.id, maskedEvent.target.value);
                      } else {
                        createOrUpdateConfig('empresa_cnpj', maskedEvent.target.value, 'CNPJ');
                      }
                    }}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                {/* Telefone com máscara */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_telefone">Telefone</Label>
                  <Input 
                    id="empresa_telefone" 
                    value={infoBasica.find(c => c.chave === 'empresa_telefone')?.valor || ''} 
                    onChange={(e) => {
                      const maskedEvent = phoneMask(e);
                      const config = infoBasica.find(c => c.chave === 'empresa_telefone');
                      if (config) {
                        handleInputChange(config.id, maskedEvent.target.value);
                      } else {
                        createOrUpdateConfig('empresa_telefone', maskedEvent.target.value, 'Telefone');
                      }
                    }}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_email">Email</Label>
                  <Input 
                    id="empresa_email" 
                    type="email"
                    value={infoBasica.find(c => c.chave === 'empresa_email')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoBasica.find(c => c.chave === 'empresa_email');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_email', e.target.value, 'Email');
                      }
                    }}
                    placeholder="contato@empresa.com"
                  />
                </div>

                {/* Site */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_site">Site</Label>
                  <Input 
                    id="empresa_site" 
                    value={infoBasica.find(c => c.chave === 'empresa_site')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoBasica.find(c => c.chave === 'empresa_site');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_site', e.target.value, 'Site');
                      }
                    }}
                    placeholder="www.empresa.com"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4">
                {/* CEP com busca automática - CORRIGIDO */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_cep" className="flex items-center gap-2">
                    CEP 
                    {loadingCep && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Label>
                  <div className="relative">
                    <Input 
                      id="empresa_cep" 
                      value={infoEndereco.find(c => c.chave === 'empresa_cep')?.valor || ''} 
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      disabled={loadingCep}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {loadingCep ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Digite o CEP para preencher automaticamente o endereço
                  </p>
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_endereco">Endereço Completo</Label>
                  <Input 
                    id="empresa_endereco" 
                    value={infoEndereco.find(c => c.chave === 'empresa_endereco')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoEndereco.find(c => c.chave === 'empresa_endereco');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_endereco', e.target.value, 'Endereço');
                      }
                    }}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_cidade">Cidade</Label>
                  <Input 
                    id="empresa_cidade" 
                    value={infoEndereco.find(c => c.chave === 'empresa_cidade')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoEndereco.find(c => c.chave === 'empresa_cidade');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_cidade', e.target.value, 'Cidade');
                      }
                    }}
                    placeholder="Nome da cidade"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_estado">Estado</Label>
                  <Input 
                    id="empresa_estado" 
                    value={infoEndereco.find(c => c.chave === 'empresa_estado')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoEndereco.find(c => c.chave === 'empresa_estado');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_estado', e.target.value, 'Estado');
                      }
                    }}
                    placeholder="Sigla do estado (ex: SP)"
                    maxLength={2}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="adicional" className="space-y-4">
                {/* Slogan */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_slogan">Slogan</Label>
                  <Input 
                    id="empresa_slogan" 
                    value={infoAdicional.find(c => c.chave === 'empresa_slogan')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoAdicional.find(c => c.chave === 'empresa_slogan');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_slogan', e.target.value, 'Slogan');
                      }
                    }}
                    placeholder="Slogan da empresa"
                  />
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="empresa_observacoes">Observações</Label>
                  <Textarea 
                    id="empresa_observacoes" 
                    value={infoAdicional.find(c => c.chave === 'empresa_observacoes')?.valor || ''} 
                    onChange={(e) => {
                      const config = infoAdicional.find(c => c.chave === 'empresa_observacoes');
                      if (config) {
                        handleInputChange(config.id, e.target.value);
                      } else {
                        createOrUpdateConfig('empresa_observacoes', e.target.value, 'Observações');
                      }
                    }}
                    rows={4}
                    placeholder="Informações adicionais sobre a empresa"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Estas informações serão exibidas nas ordens de serviço impressas e podem ser editadas a qualquer momento.
              As máscaras de entrada ajudam a manter a formatação correta dos dados.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PerfilEmpresa;
