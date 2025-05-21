
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
import { Edit, Plus, Trash, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

type PlanoType = {
  id: number;
  nome: string;
  periodo: "mensal" | "trimestral" | "anual";
  preco: number;
  destacado: boolean;
  descricao: string;
}

const PlanosList = () => {
  const [planos, setPlanos] = useState<PlanoType[]>([
    { 
      id: 1, 
      nome: "Plano Mensal", 
      periodo: "mensal",
      preco: 49.90,
      destacado: false,
      descricao: "Acesso completo por 1 mês"
    },
    { 
      id: 2, 
      nome: "Plano Trimestral", 
      periodo: "trimestral",
      preco: 129.90,
      destacado: true,
      descricao: "Acesso completo por 3 meses, economia de 15%"
    },
    { 
      id: 3, 
      nome: "Plano Anual", 
      periodo: "anual",
      preco: 399.90,
      destacado: false,
      descricao: "Acesso completo por 12 meses, economia de 35%"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlano, setCurrentPlano] = useState<PlanoType | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PlanoType>();

  // CRUD functions
  const handleAdd = (data: Omit<PlanoType, 'id'>) => {
    const newId = Math.max(0, ...planos.map(p => p.id)) + 1;
    
    const newPlano: PlanoType = {
      id: newId,
      ...data,
    };
    
    setPlanos(prev => [...prev, newPlano]);
    setIsAddDialogOpen(false);
    reset();
    toast.success("Plano adicionado com sucesso!");
  };

  const handleEdit = (data: PlanoType) => {
    const updatedPlano = {
      ...data,
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

  const toggleDestaque = (planoId: number) => {
    setPlanos(prev => 
      prev.map(plano => ({
        ...plano,
        destacado: plano.id === planoId ? true : false
      }))
    );
    toast.success("Plano destacado atualizado!");
  };

  const openEditDialog = (plano: PlanoType) => {
    setCurrentPlano(plano);
    setValue("id", plano.id);
    setValue("nome", plano.nome);
    setValue("periodo", plano.periodo);
    setValue("preco", plano.preco);
    setValue("destacado", plano.destacado);
    setValue("descricao", plano.descricao);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (plano: PlanoType) => {
    setCurrentPlano(plano);
    setIsDeleteDialogOpen(true);
  };

  // Watch if the current form value has destacado=true
  const isDestacado = watch("destacado");

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
                <TableHead>Período</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">{plano.nome}</TableCell>
                  <TableCell>
                    {plano.periodo === "mensal" ? "Mensal" : 
                     plano.periodo === "trimestral" ? "Trimestral" : 
                     "Anual"}
                  </TableCell>
                  <TableCell>R$ {plano.preco.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {plano.destacado ? 
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> : 
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleDestaque(plano.id)}
                        >
                          Destacar
                        </Button>
                      }
                    </div>
                  </TableCell>
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
        <h2 className="text-xl font-semibold mb-4">Visualização dos Planos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id} className={plano.destacado ? "border-2 border-primary relative" : ""}>
              {plano.destacado && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-md">
                  Recomendado
                </div>
              )}
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-primary">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground">
                    {plano.periodo === "mensal" ? " /mês" : 
                     plano.periodo === "trimestral" ? " /trimestre" : 
                     " /ano"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{plano.descricao}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <span>Acesso a todas as funcionalidades</span>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <span>Suporte técnico</span>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <span>Atualizações incluídas</span>
                  </div>
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
              <Label htmlFor="periodo">Período</Label>
              <select 
                id="periodo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("periodo", { required: "Período é obrigatório" })}
              >
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="destacado">Destacar como recomendado</Label>
                <Switch
                  id="destacado"
                  {...register("destacado")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas um plano pode ser destacado como recomendado por vez
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("descricao", { required: "Descrição é obrigatória" })}
                placeholder="Descrição do plano"
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
            <Input type="hidden" {...register("id", { valueAsNumber: true })} />
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome do plano"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <select 
                id="periodo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("periodo", { required: "Período é obrigatório" })}
              >
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="destacado">Destacar como recomendado</Label>
                <Switch
                  id="destacado"
                  {...register("destacado")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas um plano pode ser destacado como recomendado por vez
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("descricao", { required: "Descrição é obrigatória" })}
                placeholder="Descrição do plano"
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
