
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, Download, Eye, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

interface EmpresaConfig {
  logo?: string;
  nome?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  site?: string;
  observacoes?: string;
}

const PrintOrderButton = ({ ordem, itens, cliente }: PrintOrderButtonProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaConfig>({});

  // Fetch company info
  const { data: configData } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .filter('chave', 'like', 'empresa_%');

      if (error) throw error;
      return data;
    }
  });

  // Process config data when it changes
  React.useEffect(() => {
    if (configData) {
      const info: EmpresaConfig = {};
      configData.forEach(config => {
        const key = config.chave.replace('empresa_', '') as keyof EmpresaConfig;
        info[key] = config.valor;
      });
      setEmpresaInfo(info);
    }
  }, [configData]);

  // Generate a shareable link for the order
  const generateShareableLink = () => {
    // Create a shareable link with a JWT or some other form of authentication token
    // This is a placeholder implementation - in a real app, you would generate a secure token
    const host = window.location.origin;
    const linkId = btoa(`${ordem.id}-${Date.now()}`); // Simple encoding - not secure
    const shareLink = `${host}/share/ordem/${linkId}`;
    setShareUrl(shareLink);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink).then(() => {
      toast({
        title: "Link copiado",
        description: "O link da OS foi copiado para a área de transferência",
      });
    });
  };
  
  // View order in a new window
  const viewOrder = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de visualização. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(getOrderHtml(false));
    printWindow.document.close();
  };

  // Print order
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

    printWindow.document.write(getOrderHtml(true));
    printWindow.document.close();
    
    // Fecha o diálogo após abrir a janela de impressão
    setIsDialogOpen(false);
  };

  // Download PDF (using browser's print-to-PDF functionality)
  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela para download. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(getOrderHtml(true, true));
    printWindow.document.close();
    
    // Automatic PDF print dialog
    setTimeout(() => {
      printWindow.print();
      // Close dialog after print
      setIsDialogOpen(false);
    }, 500);
  };

  // Generate HTML content for the order
  const getOrderHtml = (forPrinting: boolean = false, forDownload: boolean = false) => {
    return `
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
          .company-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
          }
          .logo-container {
            width: 120px;
            margin-right: 20px;
          }
          .logo-container img {
            max-width: 100%;
            max-height: 80px;
            object-fit: contain;
          }
          .company-info {
            flex-grow: 1;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .order-number {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            color: #2563eb;
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
            ${forDownload ? 'Salvar como PDF' : 'Imprimir'}
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; background-color: #64748b; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Fechar
          </button>
        </div>
        
        <!-- Company Information -->
        <div class="company-header">
          <div class="logo-container">
            ${empresaInfo.logo ? `<img src="${empresaInfo.logo}" alt="Logo da Empresa">` : ''}
          </div>
          <div class="company-info">
            <div class="company-name">${empresaInfo.nome || 'Sua Empresa'}</div>
            ${empresaInfo.cnpj ? `<div>${empresaInfo.cnpj}</div>` : ''}
            ${empresaInfo.endereco ? `<div>${empresaInfo.endereco}${empresaInfo.cidade ? ', ' + empresaInfo.cidade : ''}${empresaInfo.estado ? '/' + empresaInfo.estado : ''}</div>` : ''}
            ${empresaInfo.telefone || empresaInfo.email ? `<div>${empresaInfo.telefone || ''}${empresaInfo.telefone && empresaInfo.email ? ' | ' : ''}${empresaInfo.email || ''}</div>` : ''}
            ${empresaInfo.site ? `<div>${empresaInfo.site}</div>` : ''}
          </div>
        </div>

        <div class="order-number">ORDEM DE SERVIÇO #${ordem.numero}</div>
        
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
          ${empresaInfo.observacoes ? `<p>${empresaInfo.observacoes}</p>` : ''}
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Visualizar OS Button */}
      <Button variant="outline" onClick={viewOrder}>
        <Eye className="mr-2 h-4 w-4" />
        Visualizar OS
      </Button>

      {/* Print/Download Dialog */}
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

      {/* Share Link Button */}
      <Button variant="outline" onClick={generateShareableLink}>
        <Link2 className="mr-2 h-4 w-4" />
        Compartilhar Link
      </Button>
    </div>
  );
};

export default PrintOrderButton;
