
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle,
  Info,
  Building,
  Phone,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AssistenciaType = {
  id: number;
  nome: string;
  email: string;
  plano: string;
  status: "Ativa" | "Inativa";
  dataRegistro: string;
  // Dados adicionais
  telefone?: string;
  celular?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  responsavel?: string;
  especialidades?: string[];
  descricao?: string;
  logo?: string;
  website?: string;
}

const AssistenciasList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assistencias, setAssistencias] = useState<AssistenciaType[]>([
    { 
      id: 1, 
      nome: "TecnoHelp", 
      email: "contato@tecnohelp.com", 
      plano: "Premium", 
      status: "Ativa", 
      dataRegistro: "10/01/2025",
      telefone: "(11) 3322-4455",
      celular: "(11) 98765-4321",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua Tecnológica, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      responsavel: "Carlos Silva",
      especialidades: ["Computadores", "Notebooks", "Impressoras"],
      descricao: "Assistência técnica especializada em equipamentos de informática.",
      website: "https://tecnohelp.com.br"
    },
    { 
      id: 2, 
      nome: "RapidFix", 
      email: "contato@rapidfix.com", 
      plano: "Básico", 
      status: "Ativa", 
      dataRegistro: "15/02/2025",
      telefone: "(21) 2233-4455",
      celular: "(21) 98888-7777",
      cnpj: "23.456.789/0001-12",
      endereco: "Av. Conserto Rápido, 456",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22222-000",
      responsavel: "Ana Pereira",
      especialidades: ["Celulares", "Tablets"],
      website: "https://rapidfix.com.br"
    },
    { id: 3, nome: "SOS Eletrônicos", email: "contato@soseletronicos.com", plano: "Empresarial", status: "Ativa", dataRegistro: "05/03/2025" },
    { id: 4, nome: "Conserta Tudo", email: "contato@consertatudo.com", plano: "Premium", status: "Inativa", dataRegistro: "20/01/2025" },
    { id: 5, nome: "Assist Tech", email: "contato@assisttech.com", plano: "Básico", status: "Ativa", dataRegistro: "12/04/2025" },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentAssistencia, setCurrentAssistencia] = useState<AssistenciaType | null>(null);
  const [activeTab, setActiveTab] = useState("dados-basicos");

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<AssistenciaType>();
  
  const filteredAssistencias = assistencias.filter(
    (assistencia) =>
      assistencia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistencia.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const planos = ["Básico", "Premium", "Empresarial"];
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", 
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", 
    "SP", "SE", "TO"
  ];
  
  const especialidadesOpcoes = [
    "Computadores", "Notebooks", "Impressoras", "Celulares", "Tablets", 
    "Smart TVs", "Eletrodomésticos", "Ar Condicionado", "Redes", "Servidores"
  ];

  // Funções CRUD
  const handleAdd = (data: Omit<AssistenciaType, 'id' | 'dataRegistro'>) => {
    const newId = Math.max(0, ...assistencias.map(a => a.id)) + 1;
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const newAssistencia: AssistenciaType = {
      id: newId,
      ...data,
      dataRegistro: formattedDate
    };
    
    setAssistencias(prev => [...prev, newAssistencia]);
    setIsAddDialogOpen(false);
    reset();
    toast.success("Assistência adicionada com sucesso!");
  };

  const handleEdit = (data: AssistenciaType) => {
    setAssistencias(prev => 
      prev.map(item => item.id === currentAssistencia?.id ? { ...item, ...data } : item)
    );
    setIsEditDialogOpen(false);
    setCurrentAssistencia(null);
    toast.success("Assistência atualizada com sucesso!");
  };

  const handleDelete = () => {
    if (currentAssistencia) {
      setAssistencias(prev => prev.filter(item => item.id !== currentAssistencia.id));
      setIsDeleteDialogOpen(false);
      setCurrentAssistencia(null);
      toast.success("Assistência removida com sucesso!");
    }
  };

  const openViewDialog = (assistencia: AssistenciaType) => {
    setCurrentAssistencia(assistencia);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (assistencia: AssistenciaType) => {
    setCurrentAssistencia(assistencia);
    // Reset form com dados da assistência
    Object.entries(assistencia).forEach(([key, value]) => {
      setValue(key as keyof AssistenciaType, value);
    });
    setIsEditDialogOpen(true);
    setActiveTab("dados-basicos");
  };

  const openDeleteDialog = (assistencia: AssistenciaType) => {
    setCurrentAssistencia(assistencia);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assistências</h1>
          <p className="text-muted-foreground">Gerencie as assistências técnicas cadastradas.</p>
        </div>
        <Button onClick={() => {
          reset();
          setActiveTab("dados-basicos");
          setIsAddDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Assistência
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Assistências</CardTitle>
          <div className="relative max-w-sm mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar assistências..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssistencias.map((assistencia) => (
                <TableRow key={assistencia.id}>
                  <TableCell className="font-medium">{assistencia.nome}</TableCell>
                  <TableCell>{assistencia.email}</TableCell>
                  <TableCell>{assistencia.telefone || "-"}</TableCell>
                  <TableCell>
                    {assistencia.cidade ? `${assistencia.cidade}/${assistencia.estado}` : "-"}
                  </TableCell>
                  <TableCell>{assistencia.plano}</TableCell>
                  <TableCell>
                    {assistencia.status === "Ativa" ? (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inativa
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openViewDialog(assistencia)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(assistencia)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(assistencia)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredAssistencias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Nenhuma assistência encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para visualizar detalhes da assistência */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Assistência</DialogTitle>
            <DialogDescription>Informações detalhadas sobre a assistência técnica</DialogDescription>
          </DialogHeader>
          
          {currentAssistencia && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentAssistencia.nome}</h3>
                    <p className="text-muted-foreground">{currentAssistencia.descricao || "Sem descrição fornecida."}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Contato</h4>
                      <div className="space-y-1 mt-1">
                        <p className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {currentAssistencia.telefone || "Não informado"}
                        </p>
                        <p className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {currentAssistencia.celular || "Não informado"}
                        </p>
                        <p className="flex items-center text-sm break-all">
                          <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                          {currentAssistencia.endereco
                            ? `${currentAssistencia.endereco}, ${currentAssistencia.cidade}/${currentAssistencia.estado}, ${currentAssistencia.cep}`
                            : "Endereço não informado"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Informações</h4>
                      <div className="space-y-1 mt-1">
                        <p className="flex items-center text-sm">
                          <Building className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          CNPJ: {currentAssistencia.cnpj || "Não informado"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Responsável:</span> {currentAssistencia.responsavel || "Não informado"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Website:</span>{" "}
                          {currentAssistencia.website ? (
                            <a 
                              href={currentAssistencia.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {currentAssistencia.website}
                            </a>
                          ) : (
                            "Não informado"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plano e Status</h4>
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Plano:</span> {currentAssistencia.plano}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {currentAssistencia.status === "Ativa" ? (
                        <span className="text-green-600 font-medium">Ativa</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inativa</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Data de registro:</span> {currentAssistencia.dataRegistro}
                    </p>
                  </div>
                  
                  {currentAssistencia.especialidades && currentAssistencia.especialidades.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Especialidades</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentAssistencia.especialidades.map(esp => (
                          <span 
                            key={esp} 
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                          >
                            {esp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  openEditDialog(currentAssistencia);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para adicionar nova assistência */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar Assistência</DialogTitle>
            <DialogDescription>
              Preencha as informações da nova assistência técnica
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes Adicionais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dados-basicos" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Assistência *</Label>
                    <Input
                      id="nome"
                      {...register("nome", { required: "Nome é obrigatório" })}
                      placeholder="Nome da assistência"
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500">{errors.nome.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email é obrigatório",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                      placeholder="Email de contato"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      {...register("telefone")}
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      {...register("celular")}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano *</Label>
                    <select
                      id="plano"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("plano", { required: "Plano é obrigatório" })}
                    >
                      <option value="">Selecione um plano</option>
                      {planos.map(plano => (
                        <option key={plano} value={plano}>{plano}</option>
                      ))}
                    </select>
                    {errors.plano && (
                      <p className="text-sm text-red-500">{errors.plano.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("status", { required: "Status é obrigatório" })}
                      defaultValue="Ativa"
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Inativa">Inativa</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      {...register("cnpj")}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      {...register("cep")}
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      {...register("endereco")}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      {...register("cidade")}
                      placeholder="Cidade"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <select
                      id="estado"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("estado")}
                    >
                      <option value="">Selecione um estado</option>
                      {estados.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="detalhes" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      {...register("responsavel")}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      placeholder="https://www.seusite.com.br"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      {...register("descricao")}
                      placeholder="Descreva brevemente sua assistência técnica"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Especialidades</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {especialidadesOpcoes.map(especialidade => (
                        <div key={especialidade} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`especialidade-${especialidade}`}
                            value={especialidade}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            onChange={(e) => {
                              const currentEspecialidades = getValues("especialidades") || [];
                              if (e.target.checked) {
                                setValue("especialidades", [...currentEspecialidades, especialidade]);
                              } else {
                                setValue(
                                  "especialidades",
                                  currentEspecialidades.filter(item => item !== especialidade)
                                );
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`especialidade-${especialidade}`}
                            className="text-sm font-normal"
                          >
                            {especialidade}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar assistência */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Assistência</DialogTitle>
            <DialogDescription>
              Atualize as informações da assistência técnica
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes Adicionais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dados-basicos" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nome">Nome da Assistência *</Label>
                    <Input
                      id="edit-nome"
                      {...register("nome", { required: "Nome é obrigatório" })}
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500">{errors.nome.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      {...register("email", { 
                        required: "Email é obrigatório",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-telefone">Telefone</Label>
                    <Input
                      id="edit-telefone"
                      {...register("telefone")}
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-celular">Celular</Label>
                    <Input
                      id="edit-celular"
                      {...register("celular")}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-plano">Plano *</Label>
                    <select
                      id="edit-plano"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("plano", { required: "Plano é obrigatório" })}
                    >
                      {planos.map(plano => (
                        <option key={plano} value={plano}>{plano}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("status")}
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Inativa">Inativa</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cnpj">CNPJ</Label>
                    <Input
                      id="edit-cnpj"
                      {...register("cnpj")}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-cep">CEP</Label>
                    <Input
                      id="edit-cep"
                      {...register("cep")}
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-endereco">Endereço</Label>
                    <Input
                      id="edit-endereco"
                      {...register("endereco")}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-cidade">Cidade</Label>
                    <Input
                      id="edit-cidade"
                      {...register("cidade")}
                      placeholder="Cidade"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-estado">Estado</Label>
                    <select
                      id="edit-estado"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("estado")}
                    >
                      <option value="">Selecione um estado</option>
                      {estados.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="detalhes" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-responsavel">Responsável</Label>
                    <Input
                      id="edit-responsavel"
                      {...register("responsavel")}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-website">Website</Label>
                    <Input
                      id="edit-website"
                      {...register("website")}
                      placeholder="https://www.seusite.com.br"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-descricao">Descrição</Label>
                    <Textarea
                      id="edit-descricao"
                      {...register("descricao")}
                      placeholder="Descreva brevemente sua assistência técnica"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Especialidades</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {especialidadesOpcoes.map(especialidade => {
                        const especialidades = getValues("especialidades") || [];
                        const isChecked = especialidades.includes(especialidade);
                        
                        return (
                          <div key={especialidade} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={`edit-especialidade-${especialidade}`}
                              value={especialidade}
                              defaultChecked={isChecked}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              onChange={(e) => {
                                const currentEspecialidades = getValues("especialidades") || [];
                                if (e.target.checked) {
                                  setValue("especialidades", [...currentEspecialidades, especialidade]);
                                } else {
                                  setValue(
                                    "especialidades",
                                    currentEspecialidades.filter(item => item !== especialidade)
                                  );
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`edit-especialidade-${especialidade}`}
                              className="text-sm font-normal"
                            >
                              {especialidade}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir a assistência {currentAssistencia?.nome}?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssistenciasList;

