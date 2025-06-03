import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { financeirosData } from "@/data/dados";
import { MovimentoFinanceiro } from "@/types";
import { gerarId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, DollarSign, Calendar, FileText } from "lucide-react";

const FinanceiroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdicao = !!id;
  
  const movimentoVazio: MovimentoFinanceiro = {
    id: "",
    tipo: "receita",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    pago: true,
    dataPagamento: new Date().toISOString().split('T')[0],
    categoria: "Geral",
    metodoPagamento: "Dinheiro"
  };

  const [movimento, setMovimento] = useState<MovimentoFinanceiro>(movimentoVazio);

  useEffect(() => {
    if (isEdicao) {
      const movimentoEncontrado = financeirosData.find(m => m.id === id);
      if (movimentoEncontrado) {
        setMovimento(movimentoEncontrado);
      } else {
        navigate("/app/financeiro");
        toast({
          title: "Movimento não encontrado",
          description: "O movimento financeiro solicitado não foi encontrado",
          variant: "destructive",
        });
      }
    }
  }, [id, isEdicao, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovimento(prev => ({ 
      ...prev, 
      [name]: name === "valor" ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMovimento(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (value: "receita" | "despesa") => {
    setMovimento(prev => ({ ...prev, tipo: value }));
  };

  const handlePagoChange = (checked: boolean) => {
    setMovimento(prev => ({ 
      ...prev, 
      pago: checked,
      dataPagamento: checked ? new Date().toISOString().split('T')[0] : undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movimento.descricao) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha a descrição do movimento",
        variant: "destructive",
      });
      return;
    }

    if (movimento.valor <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }
    
    if (!isEdicao) {
      // Adicionar novo movimento
      const novoMovimento = {
        ...movimento,
        id: gerarId(),
      };
      
      financeirosData.unshift(novoMovimento);
      
      toast({
        title: "Movimento registrado",
        description: "O movimento financeiro foi registrado com sucesso",
      });
    } else {
      // Atualizar movimento existente
      const index = financeirosData.findIndex(m => m.id === id);
      if (index !== -1) {
        financeirosData[index] = movimento;
      }
      
      toast({
        title: "Movimento atualizado",
        description: "O movimento financeiro foi atualizado",
      });
    }
    
    navigate("/app/financeiro");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/app/financeiro")}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdicao ? "Editar Movimento" : "Novo Movimento Financeiro"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Movimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Movimento</Label>
              <RadioGroup 
                value={movimento.tipo} 
                onValueChange={(value) => handleTipoChange(value as "receita" | "despesa")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="receita" id="receita" />
                  <Label htmlFor="receita" className="text-green-600 cursor-pointer">Receita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="despesa" id="despesa" />
                  <Label htmlFor="despesa" className="text-red-600 cursor-pointer">Despesa</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Descrição <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="descricao" 
                  name="descricao" 
                  value={movimento.descricao} 
                  onChange={handleInputChange}
                  placeholder="Descrição do movimento financeiro"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Valor <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="valor" 
                  name="valor" 
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={movimento.valor || ""} 
                  onChange={handleInputChange}
                  startContent="R$"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Data <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="data" 
                  name="data" 
                  type="date"
                  value={movimento.data} 
                  onChange={handleInputChange}
                  required
                />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="categoria" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Categoria
                </Label>
                <Select 
                  value={movimento.categoria} 
                  onValueChange={(value) => handleSelectChange("categoria", value)}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Produtos">Produtos</SelectItem>
                    <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                    <SelectItem value="Impostos">Impostos</SelectItem>
                    <SelectItem value="Funcionários">Funcionários</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pago" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    Status de Pagamento
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="pago" 
                      checked={movimento.pago}
                      onCheckedChange={handlePagoChange}
                    />
                    <Label htmlFor="pago" className="cursor-pointer">
                      {movimento.pago ? "Pago" : "Pendente"}
                    </Label>
                  </div>
                </div>
              </div>
          
              {movimento.pago && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="dataPagamento" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Data de Pagamento
                    </Label>
                    <Input 
                      id="dataPagamento" 
                      name="dataPagamento" 
                      type="date"
                      value={movimento.dataPagamento} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metodoPagamento" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Método de Pagamento
                    </Label>
                    <Select 
                      value={movimento.metodoPagamento || ""} 
                      onValueChange={(value) => handleSelectChange("metodoPagamento", value)}
                    >
                      <SelectTrigger id="metodoPagamento">
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                        <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Boleto">Boleto</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/app/financeiro")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEdicao ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroForm;
