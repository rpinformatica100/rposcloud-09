
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCliente, updateCliente, insertCliente } from "@/integrations/supabase/helpers";
import { ClienteInsert, ClienteUpdate } from "@/integrations/supabase/helpers";
import { ArrowLeft, Save, Search, Loader2, User, Building2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useExternalServices } from "@/hooks/use-external-services";
import { useInputMask } from "@/hooks/use-input-mask";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ClienteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ClienteInsert | ClienteUpdate>({
    nome: "",
    tipo: "pessoa_fisica",
    documento: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  });
  const { fetchCep, fetchCnpj, loadingCep, loadingCnpj } = useExternalServices();
  const { phoneMask, documentMask, cepMask } = useInputMask();
  const [loading, setLoading] = useState(false);
  const [showCepDialog, setShowCepDialog] = useState(false);
  const [cepResult, setCepResult] = useState<any>(null);

  const isEditMode = !!id;

  // Consulta para buscar dados do cliente em modo de edição
  const { data: clienteData, isLoading: isLoadingCliente } = useQuery({
    queryKey: ["cliente", id],
    queryFn: () => fetchCliente(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (clienteData) {
      // Adaptar o tipo do cliente para o formulário
      let tipoAdaptado = clienteData.tipo;
      if (clienteData.tipo === 'cliente') {
        // Verificar pelo documento se é PF ou PJ
        tipoAdaptado = clienteData.documento && clienteData.documento.length > 14 
          ? "pessoa_juridica" 
          : "pessoa_fisica";
      }
      
      setFormData({
        nome: clienteData.nome || "",
        tipo: tipoAdaptado,
        documento: clienteData.documento || "",
        telefone: clienteData.telefone || "",
        email: clienteData.email || "",
        endereco: clienteData.endereco || "",
        cidade: clienteData.cidade || "",
        estado: clienteData.estado || "",
        cep: clienteData.cep || "",
        observacoes: clienteData.observacoes || "",
      });
    }
  }, [clienteData]);

  // Mutação para salvar cliente (novo ou editar existente)
  const mutation = useMutation({
    mutationFn: (data: ClienteInsert | ClienteUpdate) => {
      if (isEditMode) {
        return updateCliente(id!, data as ClienteUpdate);
      } else {
        const now = new Date().toISOString();
        return insertCliente({
          ...data as ClienteInsert,
          data_cadastro: now
        });
      }
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!"
      );
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", id] });
      navigate("/app/clientes");
    },
    onError: (error) => {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente", {
        description: "Ocorreu um erro ao processar sua solicitação."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpar documento ao trocar o tipo de pessoa
    if (name === "tipo") {
      setFormData((prev) => ({ ...prev, documento: "" }));
    }
  };

  // Função para buscar CEP
  const handleBuscarCep = async () => {
    if (!formData.cep) {
      toast.error("Digite um CEP para buscar");
      return;
    }

    try {
      setLoading(true);
      const cepData = await fetchCep(formData.cep);
      
      if (cepData) {
        setCepResult(cepData);
        setShowCepDialog(true);
        
        setFormData(prev => ({
          ...prev,
          endereco: `${cepData.logradouro}${cepData.complemento ? ', ' + cepData.complemento : ''}`,
          cidade: cepData.localidade,
          estado: cepData.uf,
          cep: cepData.cep
        }));
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP", {
        description: "Verifique se o CEP está correto e tente novamente"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar CNPJ
  const handleBuscarCnpj = async () => {
    if (!formData.documento || formData.tipo !== "pessoa_juridica") {
      toast.error("Digite um CNPJ válido para buscar");
      return;
    }

    try {
      setLoading(true);
      const cnpjData = await fetchCnpj(formData.documento);
      
      if (cnpjData) {
        setFormData(prev => ({
          ...prev,
          nome: cnpjData.nome,
          email: cnpjData.email || prev.email,
          telefone: cnpjData.telefone || prev.telefone,
          endereco: `${cnpjData.logradouro}${cnpjData.numero ? ', ' + cnpjData.numero : ''}${cnpjData.complemento ? ', ' + cnpjData.complemento : ''}`,
          cidade: cnpjData.municipio,
          estado: cnpjData.uf,
          cep: cnpjData.cep
        }));
        
        toast.success("CNPJ encontrado!", { 
          description: "Dados carregados com sucesso." 
        });
      }
    } catch (error) {
      toast.error("Erro ao buscar CNPJ", {
        description: "Verifique se o CNPJ está correto e tente novamente"
      });
    } finally {
      setLoading(false);
    }
  };

  // Aplica a máscara quando o campo é alterado
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedEvent = documentMask(e);
    handleChange(maskedEvent);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedEvent = phoneMask(e);
    handleChange(maskedEvent);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedEvent = cepMask(e);
    handleChange(maskedEvent);
  };

  if (isEditMode && isLoadingCliente) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do cliente...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/app/clientes")} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle>{isEditMode ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Atualize os dados do cliente"
              : "Preencha os dados para cadastrar um novo cliente"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-6">
            {/* Tipo de pessoa */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tipo">Tipo de Cadastro</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    formData.tipo === "pessoa_fisica" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectChange("tipo", "pessoa_fisica")}
                >
                  <div className="flex items-center">
                    <User className={`h-5 w-5 mr-2 ${formData.tipo === "pessoa_fisica" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={formData.tipo === "pessoa_fisica" ? "font-medium" : ""}>Pessoa Física</span>
                  </div>
                </div>
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    formData.tipo === "pessoa_juridica" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectChange("tipo", "pessoa_juridica")}
                >
                  <div className="flex items-center">
                    <Building2 className={`h-5 w-5 mr-2 ${formData.tipo === "pessoa_juridica" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={formData.tipo === "pessoa_juridica" ? "font-medium" : ""}>Pessoa Jurídica</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documento (CPF/CNPJ) com busca CNPJ */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="documento">
                  {formData.tipo === "pessoa_fisica" ? "CPF" : "CNPJ"}
                </Label>
                {formData.tipo === "pessoa_juridica" && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleBuscarCnpj}
                    disabled={loading || !formData.documento}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Buscar CNPJ
                  </Button>
                )}
              </div>
              <Input
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleDocumentChange}
                placeholder={
                  formData.tipo === "pessoa_fisica"
                    ? "Digite o CPF"
                    : "Digite o CNPJ"
                }
                startContent={
                  formData.tipo === "pessoa_fisica" ? 
                    <User className="h-4 w-4" /> : 
                    <Building2 className="h-4 w-4" />
                }
              />
            </div>

            {/* Nome */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nome">
                {formData.tipo === "pessoa_fisica" ? "Nome Completo" : "Razão Social"}
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome"
                required
              />
            </div>

            {/* Informações de contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite o email"
                  startContent={<Mail className="h-4 w-4" />}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  startContent={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Endereço - Seção */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Endereço
              </h3>
              
              {/* CEP com busca */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-3 sm:col-span-1">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cep">CEP</Label>
                    <div className="flex">
                      <Input
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        className="rounded-r-none"
                      />
                      <Button 
                        type="button" 
                        onClick={handleBuscarCep}
                        disabled={loading || !formData.cep}
                        className="rounded-l-none"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Digite a cidade"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observações adicionais sobre o cliente"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between px-6 py-4 bg-muted/10 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/app/clientes")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending || loading}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Modal de confirmação para CEP */}
      <Dialog open={showCepDialog} onOpenChange={setShowCepDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Endereço encontrado</DialogTitle>
            <DialogDescription>
              O CEP foi encontrado e os dados foram preenchidos automaticamente.
            </DialogDescription>
          </DialogHeader>
          {cepResult && (
            <div className="space-y-2 mt-2">
              <p><strong>Logradouro:</strong> {cepResult.logradouro}</p>
              {cepResult.complemento && <p><strong>Complemento:</strong> {cepResult.complemento}</p>}
              <p><strong>Bairro:</strong> {cepResult.bairro}</p>
              <p><strong>Cidade:</strong> {cepResult.localidade}</p>
              <p><strong>Estado:</strong> {cepResult.uf}</p>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowCepDialog(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClienteForm;
