
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
  useEffect(() => {
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
    
    // Trigger print after window is loaded
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
    
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
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close dialog after print
        setIsDialogOpen(false);
      }, 500);
    };
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
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            width: 210mm;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
          }
          .print-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
          }
          h1 {
            text-align: center;
            color: #2563eb;
            padding-bottom: 10px;
            margin-top: 0;
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
            padding-bottom: 10px;
          }
          .logo-container {
            width: 100px;
            margin-right: 15px;
          }
          .logo-container img {
            max-width: 100%;
            max-height: 60px;
            object-fit: contain;
          }
          .company-info {
            flex-grow: 1;
          }
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .order-number {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .order-info {
            font-size: 12px;
          }
          .client-info {
            margin-bottom: 15px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background-color: #f9fafb;
          }
          .patient-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 15px;
            font-size: 12px;
          }
          .patient-info .full-width {
            grid-column: 1 / -1;
          }
          .patient-info .label {
            font-weight: bold;
            display: block;
            font-size: 10px;
            color: #4b5563;
            margin-bottom: 2px;
          }
          .patient-info .value {
            display: block;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #2563eb;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-size: 11px;
          }
          .footer {
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            font-size: 10px;
            position: relative;
            clear: both;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 14px;
            margin: 15px 0;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            page-break-inside: avoid;
          }
          .signature-line {
            width: 45%;
            border-top: 1px solid #000;
            padding-top: 5px;
            text-align: center;
            font-size: 12px;
          }
          .qrcode {
            text-align: center;
            float: right;
            margin-left: 10px;
            max-width: 100px;
          }
          .qrcode img {
            max-width: 100%;
            height: auto;
          }
          .qrcode-info {
            font-size: 9px;
            margin-top: 5px;
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
          .description, .observations {
            margin-bottom: 15px;
            font-size: 12px;
          }
          .item-observation {
            font-size: 10px;
            color: #666;
            font-style: italic;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              padding: 0;
              margin: 0;
              width: auto;
            }
            .print-container {
              width: 100%;
              padding: 0;
            }
            html, body {
              height: 99%;
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
        
        <div class="print-container">
          <!-- Company Information -->
          <div class="company-header">
            <div class="logo-container">
              ${empresaInfo.logo ? `<img src="${empresaInfo.logo}" alt="Logo da Empresa">` : ''}
            </div>
            <div class="company-info">
              <div class="company-name">${empresaInfo.nome || 'Sua Empresa'}</div>
              ${empresaInfo.cnpj ? `<div style="font-size:11px">${empresaInfo.cnpj}</div>` : ''}
              ${empresaInfo.endereco ? `<div style="font-size:11px">${empresaInfo.endereco}${empresaInfo.cidade ? ', ' + empresaInfo.cidade : ''}${empresaInfo.estado ? '/' + empresaInfo.estado : ''}</div>` : ''}
              ${empresaInfo.telefone || empresaInfo.email ? `<div style="font-size:11px">${empresaInfo.telefone || ''}${empresaInfo.telefone && empresaInfo.email ? ' | ' : ''}${empresaInfo.email || ''}</div>` : ''}
            </div>
          </div>

          <div class="order-number">ORDEM DE SERVIÇO #${ordem.numero}</div>
          
          <!-- Client information in the new compact format -->
          <div class="patient-info">
            <div>
              <span class="label">Cliente:</span>
              <span class="value">${cliente?.nome || 'N/A'}</span>
            </div>
            <div>
              <span class="label">CPF/CNPJ:</span>
              <span class="value">${cliente?.documento || 'N/A'}</span>
            </div>
            ${cliente?.telefone ? `
            <div>
              <span class="label">Telefone:</span>
              <span class="value">${cliente.telefone}</span>
            </div>` : ''}
            ${cliente?.email ? `
            <div>
              <span class="label">Email:</span>
              <span class="value">${cliente.email}</span>
            </div>` : ''}
            <div class="full-width">
              <span class="label">Endereço:</span>
              <span class="value">${cliente?.endereco || 'N/A'}${cliente?.cidade ? ', ' + cliente.cidade : ''}${cliente?.estado ? '/' + cliente.estado : ''}${cliente?.cep ? ' - CEP: ' + cliente.cep : ''}</span>
            </div>
          </div>
          
          <div class="header">
            <div class="order-info">
              <p style="margin: 4px 0;"><span class="section-title">Data Abertura:</span> ${formatDate(ordem.data_abertura || '')}</p>
              <p style="margin: 4px 0;"><span class="section-title">Previsão:</span> ${formatDate(ordem.data_previsao || '')}</p>
              ${ordem.data_conclusao ? `<p style="margin: 4px 0;"><span class="section-title">Conclusão:</span> ${formatDate(ordem.data_conclusao)}</p>` : ''}
            </div>
            <div class="order-info">
              <p style="margin: 4px 0;"><span class="section-title">Status:</span> <span class="status-${ordem.status}">${
                ordem.status === "aberta" ? "Aberta" :
                ordem.status === "em_andamento" ? "Em Andamento" :
                ordem.status === "concluida" ? "Concluída" :
                ordem.status === "cancelada" ? "Cancelada" : ordem.status
              }</span></p>
              <p style="margin: 4px 0;"><span class="section-title">Prioridade:</span> <span class="priority-${ordem.prioridade}">${
                ordem.prioridade === "baixa" ? "Baixa" :
                ordem.prioridade === "media" ? "Média" :
                ordem.prioridade === "alta" ? "Alta" : ordem.prioridade
              }</span></p>
            </div>
          </div>
          
          ${ordem.descricao ? `
          <div class="description">
            <p class="section-title">DESCRIÇÃO DO SERVIÇO</p>
            <p style="margin-top: 5px;">${ordem.descricao}</p>
          </div>
          ` : ''}
          
          <p class="section-title">ITENS</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="width: 15%;">Qtd</th>
                <th style="width: 20%;">Valor Unit.</th>
                <th style="width: 20%;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itens.map(item => `
              <tr>
                <td>${item.produto?.nome || 'Item sem nome'} ${item.observacao ? `<div class="item-observation">${item.observacao}</div>` : ''}</td>
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
            <p style="margin-top: 5px;">${ordem.observacoes}</p>
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
            ${empresaInfo.observacoes ? `<p style="font-size:9px">${empresaInfo.observacoes}</p>` : ''}
            ${empresaInfo.site ? `<p><a href="${empresaInfo.site}" style="color:#2563eb; text-decoration:none;">${empresaInfo.site}</a></p>` : ''}
          </div>
        </div>

        <script>
          window.onload = function() {
            ${forPrinting || forDownload ? 'setTimeout(function() { window.print(); }, 1000);' : ''}
          }
        </script>
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
