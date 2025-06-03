
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClienteRow, fetchClientes, deleteCliente } from "@/integrations/supabase/helpers";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UserPlus, Search, User, Building, Mail, Phone } from "lucide-react";
import { formatarData } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActionDropdownMenu, Edit, Trash } from "@/components/ui/action-dropdown-menu";

const ClientesList = () => {
  const [filtro, setFiltro] = useState("");
  const [tabAtual, setTabAtual] = useState("todos");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clientes from Supabase
  const { data: clientes = [], isLoading, error } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir cliente:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    }
  });

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteMutation.mutate(id);
    }
  };

  const getActions = (cliente: ClienteRow) => [
    {
      label: "Editar",
      icon: Edit,
      onClick: () => navigate(`/app/clientes/${cliente.id}/editar`)
    },
    {
      label: "Excluir",
      icon: Trash,
      onClick: () => handleExcluir(cliente.id),
      variant: "destructive" as const,
      separator: true
    }
  ];

  // Filtrar clientes conforme busca e tab selecionada
  const clientesFiltrados = clientes.filter((cliente: ClienteRow) => {
    // Filtro por texto
    const matchesSearch = 
      cliente.nome?.toLowerCase().includes(filtro.toLowerCase()) || 
      cliente.email?.toLowerCase().includes(filtro.toLowerCase()) || 
      cliente.documento?.toLowerCase().includes(filtro.toLowerCase()) || 
      false;
    
    // Filtro por tipo
    if (tabAtual === "todos") return matchesSearch;
    return matchesSearch && cliente.tipo === tabAtual;
  });

  if (error) {
    console.error("Erro ao carregar clientes:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Clientes e Fornecedores</h1>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <p>Erro ao carregar clientes. Por favor, tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Clientes e Fornecedores</h1>
        <Button onClick={() => navigate('/app/clientes/novo')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Gerencie seus clientes e fornecedores
              </CardDescription>
            </div>
            <div className="flex w-full md:w-auto">
              <Input 
                placeholder="Buscar cliente..." 
                className="md:w-[300px]"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="todos" value={tabAtual} onValueChange={setTabAtual}>
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="cliente">Clientes</TabsTrigger>
              <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
            </TabsList>

            <TabsContent value={tabAtual}>
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Carregando clientes...</p>
                </div>
              ) : clientesFiltrados.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                    <div className="md:col-span-2">Nome</div>
                    <div className="hidden md:block">Documento</div>
                    <div className="hidden md:block">Contato</div>
                    <div className="hidden lg:block">Data Cadastro</div>
                    <div className="text-right">Ações</div>
                  </div>

                  {clientesFiltrados.map((cliente: ClienteRow) => (
                    <div 
                      key={cliente.id} 
                      className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 p-4 border-t items-center"
                    >
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            cliente.tipo === "cliente" 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-purple-100 text-purple-600"
                          }`}>
                            {cliente.tipo === "cliente" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Building className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              {cliente.documento}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden mt-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{cliente.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden mt-1">
                              <Phone className="h-3 w-3" />
                              <span>{cliente.telefone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block text-muted-foreground">
                        {cliente.documento}
                      </div>
                      <div className="hidden md:block">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{cliente.telefone}</span>
                        </div>
                      </div>
                      <div className="hidden lg:block text-muted-foreground">
                        {cliente.data_cadastro ? formatarData(cliente.data_cadastro) : '-'}
                      </div>
                      <div className="flex justify-end">
                        <ActionDropdownMenu actions={getActions(cliente)} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Nenhum cliente encontrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientesList;
