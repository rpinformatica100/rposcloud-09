
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clientesData } from "@/data/dados";
import { Cliente } from "@/types";
import { UserPlus, Search, Edit, Trash, User, Building, Mail, Phone } from "lucide-react";
import { formatarData } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ClientesList = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesData);
  const [filtro, setFiltro] = useState("");
  const [tabAtual, setTabAtual] = useState("todos");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso",
      });
    }
  };

  // Filtrar clientes conforme busca e tab selecionada
  const clientesFiltrados = clientes.filter(cliente => {
    // Filtro por texto
    const matchesSearch = cliente.nome.toLowerCase().includes(filtro.toLowerCase()) || 
                         cliente.email.toLowerCase().includes(filtro.toLowerCase()) || 
                         cliente.documento.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtro por tipo
    if (tabAtual === "todos") return matchesSearch;
    return matchesSearch && cliente.tipo === tabAtual;
  });

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
                startContent={<Search className="h-4 w-4 text-muted-foreground" />}
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
              {clientesFiltrados.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                    <div className="md:col-span-2">Nome</div>
                    <div className="hidden md:block">Documento</div>
                    <div className="hidden md:block">Contato</div>
                    <div className="hidden lg:block">Data Cadastro</div>
                    <div className="text-right">Ações</div>
                  </div>

                  {clientesFiltrados.map((cliente) => (
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
                        {formatarData(cliente.dataCadastro)}
                      </div>
                      <div className="flex justify-end gap-2 mt-2 md:mt-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/app/clientes/editar/${cliente.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleExcluir(cliente.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
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
