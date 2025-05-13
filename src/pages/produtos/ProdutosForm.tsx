
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { produtosData } from "@/data/dados";
import { Produto } from "@/types";
import { gerarId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save } from "lucide-react";

const ProdutosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdicao = !!id;
  
  const produtoVazio: Produto = {
    id: "",
    nome: "",
    tipo: "produto",
    descricao: "",
    preco: 0,
    custo: 0,
    codigo: "",
    unidade: "un",
    estoque: 0,
    ativo: true
  };

  const [produto, setProduto] = useState<Produto>(produtoVazio);
  const [precoStr, setPrecoStr] = useState("");
  const [custoStr, setCustoStr] = useState("");

  useEffect(() => {
    if (isEdicao) {
      const produtoEncontrado = produtosData.find(p => p.id === id);
      if (produtoEncontrado) {
        setProduto(produtoEncontrado);
        setPrecoStr(produtoEncontrado.preco.toString());
        setCustoStr((produtoEncontrado.custo || 0).toString());
      } else {
        navigate("/app/produtos");
        toast({
          title: "Produto não encontrado",
          description: "O produto solicitado não foi encontrado",
          variant: "destructive",
        });
      }
    }
  }, [id, isEdicao, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (value: "produto" | "servico") => {
    setProduto(prev => ({ ...prev, tipo: value }));
  };

  const handleAtivoChange = (checked: boolean) => {
    setProduto(prev => ({ ...prev, ativo: checked }));
  };

  // Formatação de campos numéricos
  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrecoStr(value);
    const precoNumber = parseFloat(value.replace(",", ".")) || 0;
    setProduto(prev => ({ ...prev, preco: precoNumber }));
  };

  const handleCustoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustoStr(value);
    const custoNumber = parseFloat(value.replace(",", ".")) || 0;
    setProduto(prev => ({ ...prev, custo: custoNumber }));
  };

  const handleEstoqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setProduto(prev => ({ ...prev, estoque: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Em uma aplicação real, aqui enviaria dados para API
    // Simulando adição/atualização no array local
    
    if (!isEdicao) {
      // Adicionar novo produto
      const novoProduto = {
        ...produto,
        id: gerarId()
      };
      
      produtosData.push(novoProduto);
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso",
      });
    } else {
      // Atualizar produto existente
      const index = produtosData.findIndex(p => p.id === id);
      if (index !== -1) {
        produtosData[index] = produto;
      }
      
      toast({
        title: "Produto atualizado",
        description: "Os dados do produto foram atualizados",
      });
    }
    
    navigate("/app/produtos");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/app/produtos")}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdicao ? "Editar Item" : "Novo Item"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto/Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de item */}
            <div className="space-y-2">
              <Label>Tipo de Item</Label>
              <RadioGroup 
                value={produto.tipo} 
                onValueChange={(value) => handleTipoChange(value as "produto" | "servico")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="produto" id="produto" />
                  <Label htmlFor="produto">Produto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="servico" id="servico" />
                  <Label htmlFor="servico">Serviço</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Status */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ativo" 
                  checked={produto.ativo}
                  onCheckedChange={handleAtivoChange}
                />
                <Label htmlFor="ativo">{produto.ativo ? "Ativo" : "Inativo"}</Label>
              </div>
            </div>
            
            {/* Dados do produto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={produto.nome} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input 
                  id="codigo" 
                  name="codigo" 
                  value={produto.codigo || ""} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input 
                  id="unidade" 
                  name="unidade"
                  placeholder="un, kg, m, etc."
                  value={produto.unidade || ""} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preco">Preço de Venda *</Label>
                <Input 
                  id="preco" 
                  value={precoStr}
                  onChange={handlePrecoChange}
                  placeholder="0,00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custo">Custo</Label>
                <Input 
                  id="custo" 
                  value={custoStr}
                  onChange={handleCustoChange}
                  placeholder="0,00"
                />
              </div>
              
              {produto.tipo === "produto" && (
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input 
                    id="estoque" 
                    type="number"
                    min="0"
                    value={produto.estoque || 0}
                    onChange={handleEstoqueChange}
                  />
                </div>
              )}
            </div>
            
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                name="descricao" 
                value={produto.descricao} 
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/app/produtos")}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isEdicao ? "Atualizar" : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ProdutosForm;
