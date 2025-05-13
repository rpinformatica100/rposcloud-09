
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ClienteRow, ClienteInsert, fetchCliente, insertCliente, updateCliente 
} from "@/integrations/supabase/helpers";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ClientesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdicao = !!id;
  
  const clienteVazio: ClienteInsert = {
    nome: "",
    tipo: "cliente",
    email: "",
    telefone: "",
    documento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  };

  const [cliente, setCliente] = useState<ClienteInsert>(clienteVazio);

  // Fetch cliente if in edit mode
  const { data: clienteData, isLoading } = useQuery({
    queryKey: ['cliente', id],
    queryFn: () => fetchCliente(id!),
    enabled: isEdicao,
    meta: {
      onSuccess: (data) => {
        if (data) {
          setCliente(data);
        }
      }
    }
  });

  // React to data changes
  useEffect(() => {
    if (clienteData) {
      setCliente(clienteData);
    }
  }, [clienteData]);

  // Mutations for insert and update
  const insertMutation = useMutation({
    mutationFn: insertCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso",
      });
      navigate("/app/clientes");
    },
    onError: (error) => {
      console.error("Erro ao adicionar cliente:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o cliente",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, cliente }: { id: string, cliente: ClienteInsert }) => 
      updateCliente(id, cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', id] });
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados",
      });
      navigate("/app/clientes");
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (value: "cliente" | "fornecedor") => {
    setCliente(prev => ({ ...prev, tipo: value }));
  };

  const handleEstadoChange = (value: string) => {
    setCliente(prev => ({ ...prev, estado: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEdicao) {
      // Adicionar novo cliente
      insertMutation.mutate(cliente);
    } else if (id) {
      // Atualizar cliente existente
      updateMutation.mutate({ id, cliente });
    }
  };

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/app/clientes")}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdicao ? "Editar Cliente" : "Novo Cliente"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de cadastro */}
            <div className="space-y-2">
              <Label>Tipo de Cadastro</Label>
              <RadioGroup 
                value={cliente.tipo} 
                onValueChange={(value) => handleTipoChange(value as "cliente" | "fornecedor")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cliente" id="cliente" />
                  <Label htmlFor="cliente">Cliente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fornecedor" id="fornecedor" />
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo / Razão social *</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={cliente.nome} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documento">CPF / CNPJ *</Label>
                <Input 
                  id="documento" 
                  name="documento" 
                  value={cliente.documento || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={cliente.email || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={cliente.telefone || ''} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Endereço */}
            <div>
              <h3 className="text-md font-medium mb-2">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Logradouro</Label>
                  <Input 
                    id="endereco" 
                    name="endereco" 
                    placeholder="Rua, Avenida, etc."
                    value={cliente.endereco || ''} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    name="cidade" 
                    value={cliente.cidade || ''} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={cliente.estado || ''} 
                    onValueChange={handleEstadoChange}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">Acre</SelectItem>
                      <SelectItem value="AL">Alagoas</SelectItem>
                      <SelectItem value="AP">Amapá</SelectItem>
                      <SelectItem value="AM">Amazonas</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PA">Pará</SelectItem>
                      <SelectItem value="PB">Paraíba</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="RO">Rondônia</SelectItem>
                      <SelectItem value="RR">Roraima</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="SE">Sergipe</SelectItem>
                      <SelectItem value="TO">Tocantins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    name="cep" 
                    value={cliente.cep || ''} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                name="observacoes" 
                value={cliente.observacoes || ""} 
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/app/clientes")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={insertMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEdicao ? "Atualizar" : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ClientesForm;
