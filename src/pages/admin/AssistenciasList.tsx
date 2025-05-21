
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

type AssistenciaType = {
  id: number;
  nome: string;
  email: string;
  plano: string;
  status: "Ativa" | "Inativa";
  dataRegistro: string;
}

const AssistenciasList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assistencias, setAssistencias] = useState<AssistenciaType[]>([
    { id: 1, nome: "TecnoHelp", email: "contato@tecnohelp.com", plano: "Premium", status: "Ativa", dataRegistro: "10/01/2025" },
    { id: 2, nome: "RapidFix", email: "contato@rapidfix.com", plano: "Básico", status: "Ativa", dataRegistro: "15/02/2025" },
    { id: 3, nome: "SOS Eletrônicos", email: "contato@soseletronicos.com", plano: "Empresarial", status: "Ativa", dataRegistro: "05/03/2025" },
    { id: 4, nome: "Conserta Tudo", email: "contato@consertatudo.com", plano: "Premium", status: "Inativa", dataRegistro: "20/01/2025" },
    { id: 5, nome: "Assist Tech", email: "contato@assisttech.com", plano: "Básico", status: "Ativa", dataRegistro: "12/04/2025" },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAssistencia, setCurrentAssistencia] = useState<AssistenciaType | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AssistenciaType>();
  
  const filteredAssistencias = assistencias.filter(
    (assistencia) =>
      assistencia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistencia.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const planos = ["Básico", "Premium", "Empresarial"];

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

  const openEditDialog = (assistencia: AssistenciaType) => {
    setCurrentAssistencia(assistencia);
    setValue("nome", assistencia.nome);
    setValue("email", assistencia.email);
    setValue("plano", assistencia.plano);
    setValue("status", assistencia.status);
    setIsEditDialogOpen(true);
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
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssistencias.map((assistencia) => (
                <TableRow key={assistencia.id}>
                  <TableCell className="font-medium">{assistencia.nome}</TableCell>
                  <TableCell>{assistencia.email}</TableCell>
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
                  <TableCell>{assistencia.dataRegistro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para adicionar nova assistência */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Assistência</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="plano">Plano</Label>
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
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>
            
            <DialogFooter>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Assistência</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome da assistência"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plano">Plano</Label>
              <select
                id="plano"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("plano", { required: "Plano é obrigatório" })}
              >
                {planos.map(plano => (
                  <option key={plano} value={plano}>{plano}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("status")}
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>
            
            <DialogFooter>
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
