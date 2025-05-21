
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
import { Edit, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type PlanoType = {
  id: number;
  nome: string;
  preco: number;
  precoAnual: number;
  maxOrdens: number | null;
  maxClientes: number | null;
  maxUsuarios: number | null;
  recursos: string;
}

const PlanosList = () => {
  const [planos, setPlanos] = useState<PlanoType[]>([
    { 
      id: 1, 
      nome: "Básico", 
      preco: 49.90, 
      precoAnual: 479.00,
      maxOrdens: 50,
      maxClientes: 30,
      maxUsuarios: 5,
      recursos: "Gestão de até 50 ordens, Cadastro de 30 clientes, 5 usuários, Relatórios básicos"
    },
    { 
      id: 2, 
      nome: "Profissional", 
      preco: 99.90, 
      precoAnual: 959.00,
      maxOrdens: 500,
      maxClientes: null,
      maxUsuarios: 15,
      recursos: "Gestão de até 500 ordens, Cadastro de clientes ilimitado, 15 usuários, Relatórios avançados, Suporte prioritário"
    },
    { 
      id: 3, 
      nome: "Empresarial", 
      preco: 199.90, 
      precoAnual: 1919.00,
      maxOrdens: null,
      maxClientes: null,
      maxUsuarios: null,
      recursos: "Ordens ilimitadas, Clientes ilimitados, Usuários ilimitados, Relatórios personalizados, Suporte 24/7"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlano, setCurrentPlano] = useState<PlanoType | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PlanoType>();

  // Funções CRUD
  const handleAdd = (data: Omit<PlanoType, 'id'>) => {
    const newId = Math.max(0, ...planos.map(p => p.id)) + 1;
    
    const newPlano: PlanoType = {
      id: newId,
      ...data,
      maxOrdens: data.maxOrdens === 0 ? null : data.maxOrdens,
      maxClientes: data.maxClientes === 0 ? null : data.maxClientes,
      maxUsuarios: data.maxUsuarios === 0 ? null : data.maxUsuarios
    };
    
    setPlanos(prev => [...prev, newPlano]);
    setIsAddDialogOpen(false);
    reset();
    toast.success("Plano adicionado com sucesso!");
  };

  const handleEdit = (data: PlanoType) => {
    const updatedPlano = {
      ...data,
      maxOrdens: data.maxOrdens === 0 ? null : data.maxOrdens,
      maxClientes: data.maxClientes === 0 ? null : data.maxClientes,
      maxUsuarios: data.maxUsuarios === 0 ? null : data.maxUsuarios
    };
    
    setPlanos(prev => 
      prev.map(item => item.id === currentPlano?.id ? updatedPlano : item)
    );
    setIsEditDialogOpen(false);
    setCurrentPlano(null);
    toast.success("Plano atualizado com sucesso!");
  };

  const handleDelete = () => {
    if (currentPlano) {
      setPlanos(prev => prev.filter(item => item.id !== currentPlano.id));
      setIsDeleteDialogOpen(false);
      setCurrentPlano(null);
      toast.success("Plano removido com sucesso!");
    }
  };

  const openEditDialog = (plano: PlanoType) => {
    setCurrentPlano(plano);
    setValue("id", plano.id);
    setValue("nome", plano.nome);
    setValue("preco", plano.preco);
    setValue("precoAnual", plano.precoAnual);
    setValue("maxOrdens", plano.maxOrdens || 0);
    setValue("maxClientes", plano.maxClientes || 0);
    setValue("maxUsuarios", plano.maxUsuarios || 0);
    setValue("recursos", plano.recursos);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (plano: PlanoType) => {
    setCurrentPlano(plano);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos</h1>
          <p className="text-muted-foreground">Gerencie os planos de assinatura disponíveis.</p>
        </div>
        <Button onClick={() => {
          reset();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço Mensal</TableHead>
                <TableHead>Preço Anual</TableHead>
                <TableHead>Ordens</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">{plano.nome}</TableCell>
                  <TableCell>R$ {plano.preco.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>R$ {plano.precoAnual.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{plano.maxOrdens ? `${plano.maxOrdens}` : "Ilimitado"}</TableCell>
                  <TableCell>{plano.maxClientes ? `${plano.maxClientes}` : "Ilimitado"}</TableCell>
                  <TableCell>{plano.maxUsuarios ? `${plano.maxUsuarios}` : "Ilimitado"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(plano)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(plano)}
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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Detalhes dos Planos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id}>
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-primary">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground"> /mês</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ou R$ {plano.precoAnual.toFixed(2).replace('.', ',')} /ano
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {plano.recursos.split(", ").map((recurso, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                      <span>{recurso}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Diálogo para adicionar novo plano */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Plano</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome do plano"
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Mensal (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                {...register("preco", { 
                  required: "Preço é obrigatório",
                  valueAsNumber: true
                })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precoAnual">Preço Anual (R$)</Label>
              <Input
                id="precoAnual"
                type="number"
                step="0.01"
                min="0"
                {...register("precoAnual", { 
                  required: "Preço anual é obrigatório",
                  valueAsNumber: true
                })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxOrdens">Máximo de Ordens (0 para ilimitado)</Label>
              <Input
                id="maxOrdens"
                type="number"
                min="0"
                {...register("maxOrdens", { valueAsNumber: true })}
                placeholder="Máximo de ordens"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxClientes">Máximo de Clientes (0 para ilimitado)</Label>
              <Input
                id="maxClientes"
                type="number"
                min="0"
                {...register("maxClientes", { valueAsNumber: true })}
                placeholder="Máximo de clientes"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxUsuarios">Máximo de Usuários (0 para ilimitado)</Label>
              <Input
                id="maxUsuarios"
                type="number"
                min="0"
                {...register("maxUsuarios", { valueAsNumber: true })}
                placeholder="Máximo de usuários"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recursos">Recursos (separados por vírgula)</Label>
              <textarea
                id="recursos"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("recursos", { required: "Recursos são obrigatórios" })}
                placeholder="Descreva os recursos, separados por vírgulas"
              ></textarea>
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

      {/* Diálogo para editar plano */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <Input type="hidden" {...register("id")} />
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome do plano"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Mensal (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                {...register("preco", { 
                  required: "Preço é obrigatório",
                  valueAsNumber: true
                })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precoAnual">Preço Anual (R$)</Label>
              <Input
                id="precoAnual"
                type="number"
                step="0.01"
                min="0"
                {...register("precoAnual", { 
                  required: "Preço anual é obrigatório",
                  valueAsNumber: true
                })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxOrdens">Máximo de Ordens (0 para ilimitado)</Label>
              <Input
                id="maxOrdens"
                type="number"
                min="0"
                {...register("maxOrdens", { valueAsNumber: true })}
                placeholder="Máximo de ordens"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxClientes">Máximo de Clientes (0 para ilimitado)</Label>
              <Input
                id="maxClientes"
                type="number"
                min="0"
                {...register("maxClientes", { valueAsNumber: true })}
                placeholder="Máximo de clientes"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxUsuarios">Máximo de Usuários (0 para ilimitado)</Label>
              <Input
                id="maxUsuarios"
                type="number"
                min="0"
                {...register("maxUsuarios", { valueAsNumber: true })}
                placeholder="Máximo de usuários"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recursos">Recursos (separados por vírgula)</Label>
              <textarea
                id="recursos"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("recursos", { required: "Recursos são obrigatórios" })}
                placeholder="Descreva os recursos, separados por vírgulas"
              ></textarea>
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
          <p>Tem certeza que deseja excluir o plano {currentPlano?.nome}?</p>
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

export default PlanosList;
