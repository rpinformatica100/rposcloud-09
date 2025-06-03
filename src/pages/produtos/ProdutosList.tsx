
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { produtosData } from "@/data/dados";
import { Produto } from "@/types";
import { Package, Plus, Search, ShoppingCart, Wrench } from "lucide-react";
import { formatarMoeda } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActionDropdownMenu, Edit, Trash } from "@/components/ui/action-dropdown-menu";
import { useTableSort } from "@/hooks/useTableSort";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";

const ProdutosList = () => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosData);
  const [filtro, setFiltro] = useState("");
  const [tabAtual, setTabAtual] = useState("todos");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filtrar produtos conforme busca e tab selecionada
  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(filtro.toLowerCase()) || 
                         produto.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
                         (produto.codigo || "").toLowerCase().includes(filtro.toLowerCase());
    
    if (tabAtual === "todos") return matchesSearch;
    return matchesSearch && produto.tipo === tabAtual;
  });

  const { sortedData, sortConfig, requestSort } = useTableSort(produtosFiltrados, { key: 'nome', direction: 'asc' });

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter(produto => produto.id !== id));
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });
    }
  };

  const handleRowClick = (produtoId: string) => {
    navigate(`/produtos/${produtoId}`);
  };

  const getActions = (produto: Produto) => [
    {
      label: "Editar",
      icon: Edit,
      onClick: () => navigate(`/produtos/editar/${produto.id}`)
    },
    {
      label: "Excluir",
      icon: Trash,
      onClick: () => handleExcluir(produto.id),
      variant: "destructive" as const,
      separator: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos e Serviços</h1>
        <Button onClick={() => navigate('/produtos/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Catálogo</CardTitle>
              <CardDescription>
                Gerencie seus produtos e serviços
              </CardDescription>
            </div>
            <div className="flex w-full md:w-auto">
              <Input 
                placeholder="Buscar produto..." 
                className="md:w-[300px]"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                startContent={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="todos" value={tabAtual} onValueChange={setTabAtual}>
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="produto">Produtos</TabsTrigger>
              <TabsTrigger value="servico">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value={tabAtual}>
              {sortedData.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-5 p-4 bg-muted/50 font-medium text-sm">
                    <div className="md:col-span-2">
                      <SortableTableHeader sortKey="nome" sortConfig={sortConfig} onSort={requestSort}>
                        Produto
                      </SortableTableHeader>
                    </div>
                    <div className="hidden md:block">
                      <SortableTableHeader sortKey="codigo" sortConfig={sortConfig} onSort={requestSort}>
                        Código
                      </SortableTableHeader>
                    </div>
                    <div className="hidden md:block">
                      <SortableTableHeader sortKey="preco" sortConfig={sortConfig} onSort={requestSort}>
                        Preço
                      </SortableTableHeader>
                    </div>
                    <div className="text-right">Ações</div>
                  </div>

                  {sortedData.map((produto) => (
                    <div 
                      key={produto.id} 
                      className="grid grid-cols-1 md:grid-cols-5 p-4 border-t items-center hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleRowClick(produto.id)}
                    >
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            produto.tipo === "produto" 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-purple-100 text-purple-600"
                          }`}>
                            {produto.tipo === "produto" ? (
                              <ShoppingCart className="h-4 w-4" />
                            ) : (
                              <Wrench className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{produto.nome}</span>
                              <Badge className={!produto.ativo ? "bg-red-500" : "bg-green-500"}>
                                {produto.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {produto.descricao}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden mt-1">
                              <span>Código: {produto.codigo || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium md:hidden mt-1">
                              <span>{formatarMoeda(produto.preco)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block text-muted-foreground">
                        {produto.codigo || "N/A"}
                      </div>
                      <div className="hidden md:block font-medium">
                        {formatarMoeda(produto.preco)}
                      </div>
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <ActionDropdownMenu actions={getActions(produto)} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto encontrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProdutosList;
