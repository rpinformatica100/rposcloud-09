
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clientesData } from "@/data/dados";
import { Cliente } from "@/types";
import { gerarId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface ClienteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteAdicionado: (cliente: Cliente) => void;
}

const ClienteFormModal = ({ open, onOpenChange, onClienteAdicionado }: ClienteFormModalProps) => {
  const { toast } = useToast();
  
  const clienteVazio: Omit<Cliente, 'id'> = {
    nome: "",
    email: "",
    telefone: "",
    tipo: "cliente",
    endereco: "",
    observacoes: "",
    ativo: true,
    dataCadastro: new Date().toISOString(),
  };

  const [cliente, setCliente] = useState<Omit<Cliente, 'id'>>(clienteVazio);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cliente.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const novoCliente: Cliente = {
      ...cliente,
      id: gerarId(),
    };

    // Adicionar à lista de clientes
    clientesData.push(novoCliente);

    toast({
      title: "Cliente adicionado",
      description: `${cliente.nome} foi adicionado com sucesso`,
    });

    // Notificar o componente pai
    onClienteAdicionado(novoCliente);
    
    // Limpar formulário e fechar modal
    setCliente(clienteVazio);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setCliente(clienteVazio);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Adicionar Novo Cliente
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente para adicioná-lo rapidamente e continuar com a ordem de serviço.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome" className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Nome do Cliente <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                id="nome" 
                name="nome" 
                value={cliente.nome} 
                onChange={handleInputChange}
                placeholder="Nome completo do cliente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                E-mail
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={cliente.email} 
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                Telefone
              </Label>
              <Input 
                id="telefone" 
                name="telefone" 
                value={cliente.telefone} 
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                Endereço
              </Label>
              <Input 
                id="endereco" 
                name="endereco" 
                value={cliente.endereco} 
                onChange={handleInputChange}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                name="observacoes" 
                value={cliente.observacoes || ""} 
                onChange={handleInputChange}
                rows={3}
                placeholder="Observações sobre o cliente (opcional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteFormModal;
