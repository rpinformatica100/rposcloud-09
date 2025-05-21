
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileText, CheckCircle, XCircle, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type PagamentoType = {
  id: string;
  assistencia: string;
  plano: string;
  valor: number;
  data: string;
  status: "Aprovado" | "Recusado";
  metodo: string;
}

const PagamentosList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagamentos, setPagamentos] = useState<PagamentoType[]>([
    { 
      id: "PAG-001", 
      assistencia: "TecnoHelp", 
      plano: "Premium", 
      valor: 99.90, 
      data: "15/05/2025", 
      status: "Aprovado", 
      metodo: "Cartão de Crédito" 
    },
    { 
      id: "PAG-002", 
      assistencia: "RapidFix", 
      plano: "Básico", 
      valor: 49.90, 
      data: "12/05/2025", 
      status: "Aprovado", 
      metodo: "PIX" 
    },
    { 
      id: "PAG-003", 
      assistencia: "SOS Eletrônicos", 
      plano: "Empresarial", 
      valor: 199.90, 
      data: "10/05/2025", 
      status: "Aprovado", 
      metodo: "Boleto" 
    },
    { 
      id: "PAG-004", 
      assistencia: "Conserta Tudo", 
      plano: "Premium", 
      valor: 99.90, 
      data: "08/05/2025", 
      status: "Recusado", 
      metodo: "Cartão de Crédito" 
    },
    { 
      id: "PAG-005", 
      assistencia: "TecnoHelp", 
      plano: "Premium (Anual)", 
      valor: 959.00, 
      data: "01/04/2025", 
      status: "Aprovado", 
      metodo: "Cartão de Crédito" 
    },
  ]);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPagamento, setCurrentPagamento] = useState<PagamentoType | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PagamentoType>();

  const filteredPagamentos = pagamentos.filter(
    (pagamento) =>
      pagamento.assistencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total de pagamentos aprovados
  const totalAprovado = pagamentos
    .filter(p => p.status === "Aprovado")
    .reduce((total, p) => total + p.valor, 0);

  // Métodos de pagamento disponíveis
  const metodosPagamento = [
    "Cartão de Crédito",
    "Cartão de Débito",
    "PIX",
    "Boleto",
    "Transferência Bancária"
  ];

  // Funções CRUD
  const handleEdit = (data: PagamentoType) => {
    setPagamentos(prev => 
      prev.map(item => item.id === currentPagamento?.id ? { ...item, ...data } : item)
    );
    setIsEditDialogOpen(false);
    setCurrentPagamento(null);
    toast.success("Pagamento atualizado com sucesso!");
  };

  const handleDelete = () => {
    if (currentPagamento) {
      setPagamentos(prev => prev.filter(item => item.id !== currentPagamento.id));
      setIsDeleteDialogOpen(false);
      setCurrentPagamento(null);
      toast.success("Pagamento removido com sucesso!");
    }
  };

  const openViewDialog = (pagamento: PagamentoType) => {
    setCurrentPagamento(pagamento);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (pagamento: PagamentoType) => {
    setCurrentPagamento(pagamento);
    setValue("id", pagamento.id);
    setValue("assistencia", pagamento.assistencia);
    setValue("plano", pagamento.plano);
    setValue("valor", pagamento.valor);
    setValue("data", pagamento.data);
    setValue("status", pagamento.status);
    setValue("metodo", pagamento.metodo);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (pagamento: PagamentoType) => {
    setCurrentPagamento(pagamento);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-muted-foreground">Acompanhe todos os pagamentos realizados no sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalAprovado.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagamentos.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((pagamentos.filter(p => p.status === "Aprovado").length / pagamentos.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <div className="relative max-w-sm mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar pagamentos..." 
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
                <TableHead>ID</TableHead>
                <TableHead>Assistência</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell className="font-medium">{pagamento.id}</TableCell>
                  <TableCell>{pagamento.assistencia}</TableCell>
                  <TableCell>{pagamento.plano}</TableCell>
                  <TableCell>R$ {pagamento.valor.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{pagamento.data}</TableCell>
                  <TableCell>{pagamento.metodo}</TableCell>
                  <TableCell>
                    {pagamento.status === "Aprovado" ? (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprovado
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3 mr-1" />
                        Recusado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Ver comprovante"
                        onClick={() => openViewDialog(pagamento)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Editar"
                        onClick={() => openEditDialog(pagamento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Remover"
                        onClick={() => openDeleteDialog(pagamento)}
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

      {/* Diálogo para visualizar pagamento */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
          </DialogHeader>
          {currentPagamento && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-bold mb-2">Comprovante de Pagamento</h3>
                <p className="text-sm mb-4">#{currentPagamento.id}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assistência:</span>
                    <span className="font-medium">{currentPagamento.assistencia}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plano:</span>
                    <span className="font-medium">{currentPagamento.plano}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Data:</span>
                    <span className="font-medium">{currentPagamento.data}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Método:</span>
                    <span className="font-medium">{currentPagamento.metodo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${currentPagamento.status === 'Aprovado' ? 'text-green-600' : 'text-red-600'}`}>
                      {currentPagamento.status}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium">Valor Total:</span>
                    <span className="font-bold text-lg">R$ {currentPagamento.valor.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar pagamento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pagamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <Input type="hidden" {...register("id")} />
            
            <div className="space-y-2">
              <Label htmlFor="assistencia">Assistência</Label>
              <Input
                id="assistencia"
                {...register("assistencia", { required: "Assistência é obrigatória" })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plano">Plano</Label>
              <Input
                id="plano"
                {...register("plano", { required: "Plano é obrigatório" })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                {...register("valor", { 
                  required: "Valor é obrigatório",
                  valueAsNumber: true
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                {...register("data", { required: "Data é obrigatória" })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Pagamento</Label>
              <select
                id="metodo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("metodo", { required: "Método é obrigatório" })}
              >
                {metodosPagamento.map(metodo => (
                  <option key={metodo} value={metodo}>{metodo}</option>
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
                <option value="Aprovado">Aprovado</option>
                <option value="Recusado">Recusado</option>
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
          <p>Tem certeza que deseja excluir o pagamento {currentPagamento?.id}?</p>
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

export default PagamentosList;
