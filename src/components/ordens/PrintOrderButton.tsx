
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/formatters";

// Tipos
interface Cliente {
  id: string;
  nome: string;
  documento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface OrdemItem {
  id: string;
  produto_id?: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacao?: string;
  produto?: {
    nome: string;
    tipo: string;
  };
}

interface Ordem {
  id: string;
  numero: string;
  cliente_id?: string;
  data_abertura?: string;
  data_previsao?: string;
  data_conclusao?: string;
  prioridade: string;
  status: string;
  descricao?: string;
  observacoes?: string;
  valor_total?: number;
  cliente?: Cliente;
  itens?: OrdemItem[];
}

interface PrintOrderButtonProps {
  ordem: Ordem;
  itens: OrdemItem[];
  cliente?: Cliente;
}

const PrintOrderButton = ({ ordem, itens, cliente }: PrintOrderButtonProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const printOrder = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }

    // Conteúdo HTML da OS para impressão
    const printContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ordem de Serviço #${ordem.numero}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .order-info {
            font-size: 14px;
          }
          .client-info {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #2563eb;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }
          .signature-line {
            width: 45%;
            border-top: 1px solid #000;
            padding-top: 5px;
            text-align: center;
          }
          .status-${ordem.status} {
            color: ${
              ordem.status === "aberta" ? "#2563eb" :
              ordem.status === "em_andamento" ? "#f59e0b" :
              ordem.status === "concluida" ? "#10b981" :
              ordem.status === "cancelada" ? "#ef4444" : "#333"
            };
            font-weight: bold;
          }
          .priority-${ordem.prioridade} {
            color: ${
              ordem.prioridade === "baixa" ? "#10b981" :
              ordem.prioridade === "media" ? "#f59e0b" :
              ordem.prioridade === "alta" ? "#ef4444" : "#333"
            };
            font-weight: bold;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              padding: 0;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; margin-bottom: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
            Imprimir
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; background-color: #64748b; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Fechar
          </button>
        </div>
        
        <h1>ORDEM DE SERVIÇO #${ordem.numero}</h1>
        
        <div class="header">
          <div class="order-info">
            <p><span class="section-title">Data Abertura:</span> ${formatDate(ordem.data_abertura || '')}</p>
            <p><span class="section-title">Previsão:</span> ${formatDate(ordem.data_previsao || '')}</p>
            ${ordem.data_conclusao ? `<p><span class="section-title">Conclusão:</span> ${formatDate(ordem.data_conclusao)}</p>` : ''}
          </div>
          <div class="order-info">
            <p><span class="section-title">Status:</span> <span class="status-${ordem.status}">${
              ordem.status === "aberta" ? "Aberta" :
              ordem.status === "em_andamento" ? "Em Andamento" :
              ordem.status === "concluida" ? "Concluída" :
              ordem.status === "cancelada" ? "Cancelada" : ordem.status
            }</span></p>
            <p><span class="section-title">Prioridade:</span> <span class="priority-${ordem.prioridade}">${
              ordem.prioridade === "baixa" ? "Baixa" :
              ordem.prioridade === "media" ? "Média" :
              ordem.prioridade === "alta" ? "Alta" : ordem.prioridade
            }</span></p>
          </div>
        </div>
        
        <div class="client-info">
          <p class="section-title">DADOS DO CLIENTE</p>
          <p><strong>Nome:</strong> ${cliente?.nome || 'N/A'}</p>
          ${cliente?.documento ? `<p><strong>Documento:</strong> ${cliente.documento}</p>` : ''}
          ${cliente?.telefone ? `<p><strong>Telefone:</strong> ${cliente.telefone}</p>` : ''}
          ${cliente?.email ? `<p><strong>Email:</strong> ${cliente.email}</p>` : ''}
          ${cliente?.endereco ? `<p><strong>Endereço:</strong> ${cliente.endereco}${cliente.cidade ? ', ' + cliente.cidade : ''}${cliente.estado ? '/' + cliente.estado : ''}${cliente.cep ? ' - CEP: ' + cliente.cep : ''}</p>` : ''}
        </div>
        
        ${ordem.descricao ? `
        <div class="description">
          <p class="section-title">DESCRIÇÃO DO SERVIÇO</p>
          <p>${ordem.descricao}</p>
        </div>
        ` : ''}
        
        <p class="section-title">ITENS</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itens.map(item => `
            <tr>
              <td>${item.produto?.nome || 'Item sem nome'} ${item.observacao ? `<br><small>${item.observacao}</small>` : ''}</td>
              <td>${item.quantidade}</td>
              <td>${formatCurrency(item.valor_unitario)}</td>
              <td>${formatCurrency(item.valor_total)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <p>Total: ${formatCurrency(ordem.valor_total || 0)}</p>
        </div>
        
        ${ordem.observacoes ? `
        <div class="observations">
          <p class="section-title">OBSERVAÇÕES</p>
          <p>${ordem.observacoes}</p>
        </div>
        ` : ''}
        
        <div class="signatures">
          <div class="signature-line">
            Assinatura do Técnico
          </div>
          <div class="signature-line">
            Assinatura do Cliente
          </div>
        </div>
        
        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Fecha o diálogo após abrir a janela de impressão
    setIsDialogOpen(false);
  };

  const downloadPDF = () => {
    toast({
      title: "Em breve",
      description: "A função de download em PDF estará disponível em breve.",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir / Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Imprimir ou Baixar OS</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">
            Escolha como deseja obter a Ordem de Serviço #{ordem.numero}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={printOrder} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir OS
            </Button>
            <Button variant="outline" onClick={downloadPDF} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar como PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintOrderButton;
