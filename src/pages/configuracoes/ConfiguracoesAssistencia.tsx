
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Save, 
  Upload, 
  Building, 
  CheckCircle, 
  Phone, 
  MapPin, 
  User, 
  Settings, 
  Image,
  Info 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useSupabaseHelpers } from "@/hooks/useSupabaseHelpers";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const ConfiguracoesAssistencia = () => {
  const { assistencia, profile } = useSupabaseAuth();
  const { updateUserAssistencia } = useSupabaseHelpers();
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast: uiToast } = useToast();

  // Atualizar o logo URL quando o assistencia for carregado
  useEffect(() => {
    if (assistencia?.logo) {
      setLogoUrl(assistencia.logo);
    }
  }, [assistencia]);

  // Função para atualizar perfil da assistência
  const atualizarPerfilAssistencia = async (dados: any) => {
    try {
      const { data, error } = await updateUserAssistencia(dados);
      if (error) {
        console.error('Erro ao atualizar assistência:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao atualizar assistência:', error);
      return false;
    }
  };

  // Função para verificar se o cadastro está completo
  const verificarCadastroCompleto = (dados: any) => {
    const camposObrigatorios = [
      'nome',
      'email',
      'telefone',
      'cnpj',
      'endereco',
      'cidade',
      'estado',
      'cep',
      'responsavel'
    ];

    return camposObrigatorios.every(campo => !!dados[campo]);
  };

  // Função para manipular o envio do formulário
  const handleSubmit = async (secao: string, dados: any) => {
    try {
      // Criar um objeto com apenas os campos da seção atual
      let dadosAtualizados: any = {};
      
      Object.keys(dados).forEach(key => {
        dadosAtualizados[key] = dados[key];
      });
      
      // Verificar se o cadastro está completo após esta atualização
      const dadosCompletos = { ...assistencia, ...dadosAtualizados };
      const cadastroCompleto = verificarCadastroCompleto(dadosCompletos);
      
      // Adicionar o status de cadastro completo aos dados atualizados
      dadosAtualizados.cadastroCompleto = cadastroCompleto;
      
      // Atualizar o perfil
      const sucesso = await atualizarPerfilAssistencia(dadosAtualizados);
      
      if (sucesso) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        toast.success(`Configurações de ${secao} atualizadas com sucesso`);
      } else {
        toast.error(`Erro ao atualizar ${secao}. Tente novamente.`);
      }
    } catch (error) {
      console.error(`Erro ao salvar configurações de ${secao}:`, error);
      toast.error(`Erro ao atualizar ${secao}. Tente novamente.`);
    }
  };

  // Manipulador para upload de logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Simulação de upload (em uma implementação real, usaria Supabase ou outro serviço)
      // Este é um placeholder para a funcionalidade de upload
      setTimeout(async () => {
        // Em um ambiente real, aqui você faria o upload real e obteria a URL
        const logoUrl = URL.createObjectURL(file);
        setLogoUrl(logoUrl);
        
        // Atualizar no perfil da assistência
        await atualizarPerfilAssistencia({ logo: logoUrl });
        
        toast.success("Logo atualizado com sucesso");
        setUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao fazer upload do logo:", error);
      toast.error("Não foi possível enviar o logo. Tente novamente.");
      setUploading(false);
    }
  };

  if (!assistencia) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <p>Carregando informações da assistência técnica...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações da Assistência</h1>
      </div>

      {!assistencia.cadastroCompleto && (
        <Alert className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Complete seu cadastro para aproveitar todas as funcionalidades do sistema.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="perfil" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="contato" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>Contato</span>
          </TabsTrigger>
          <TabsTrigger value="endereco" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Endereço</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            <span>Visual</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Perfil */}
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Informações principais da sua assistência técnica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-semibold">Plano Atual</h3>
                  <p className="text-sm text-muted-foreground">
                    {assistencia.plano || "Plano Básico"}
                  </p>
                </div>
                <Badge variant="secondary">{assistencia.status || "Ativa"}</Badge>
              </div>
              
              <Separator />
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const dados = {
                  nome: formData.get('nome') as string,
                  cnpj: formData.get('cnpj') as string,
                  responsavel: formData.get('responsavel') as string,
                  descricao: formData.get('descricao') as string,
                };
                handleSubmit('perfil', dados);
              }} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="font-medium">Nome da Assistência</Label>
                    <Input 
                      id="nome" 
                      name="nome" 
                      placeholder="Nome da empresa"
                      defaultValue={assistencia.nome || ""} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="font-medium">CNPJ</Label>
                    <Input 
                      id="cnpj" 
                      name="cnpj" 
                      placeholder="00.000.000/0001-00"
                      defaultValue={assistencia.cnpj || ""} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="font-medium">Nome do Responsável</Label>
                  <Input 
                    id="responsavel" 
                    name="responsavel" 
                    placeholder="Nome completo do responsável"
                    defaultValue={assistencia.responsavel || ""} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="font-medium">Descrição</Label>
                  <Textarea 
                    id="descricao" 
                    name="descricao" 
                    placeholder="Breve descrição sobre sua assistência técnica"
                    defaultValue={assistencia.descricao || ""} 
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Contato */}
        <TabsContent value="contato">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
              <CardDescription>
                Dados de contato da sua assistência técnica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const dados = {
                  email: formData.get('email') as string,
                  telefone: formData.get('telefone') as string,
                  celular: formData.get('celular') as string,
                  website: formData.get('website') as string,
                };
                handleSubmit('contato', dados);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      placeholder="contato@exemplo.com" 
                      defaultValue={assistencia.email || ""} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="font-medium">Telefone</Label>
                    <Input 
                      id="telefone" 
                      name="telefone" 
                      placeholder="(00) 0000-0000"
                      defaultValue={assistencia.telefone || ""} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="celular" className="font-medium">Celular</Label>
                    <Input 
                      id="celular" 
                      name="celular" 
                      placeholder="(00) 00000-0000"
                      defaultValue={assistencia.celular || ""} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="font-medium">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      placeholder="www.seusite.com.br"
                      defaultValue={assistencia.website || ""} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Endereço */}
        <TabsContent value="endereco">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
              <CardDescription>
                Endereço físico da sua assistência técnica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const dados = {
                  endereco: formData.get('endereco') as string,
                  cidade: formData.get('cidade') as string,
                  estado: formData.get('estado') as string,
                  cep: formData.get('cep') as string,
                };
                handleSubmit('endereco', dados);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco" className="font-medium">Endereço</Label>
                  <Input 
                    id="endereco" 
                    name="endereco" 
                    placeholder="Rua, número, complemento"
                    defaultValue={assistencia.endereco || ""} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="font-medium">Cidade</Label>
                    <Input 
                      id="cidade" 
                      name="cidade" 
                      placeholder="Sua cidade"
                      defaultValue={assistencia.cidade || ""} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="font-medium">Estado</Label>
                    <Input 
                      id="estado" 
                      name="estado" 
                      placeholder="UF"
                      defaultValue={assistencia.estado || ""} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep" className="font-medium">CEP</Label>
                  <Input 
                    id="cep" 
                    name="cep" 
                    placeholder="00000-000"
                    defaultValue={assistencia.cep || ""} 
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Configurações Visuais */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
              <CardDescription>
                Personalize a aparência da sua assistência técnica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
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
                
                <div className="flex items-center justify-center text-center">
                  <Alert className="max-w-md">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      O logo será exibido em seus relatórios, ordens de serviço e documentos impressos.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesAssistencia;
