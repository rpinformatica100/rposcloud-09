
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, Download, Eye, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { OrdemServico, ItemOrdemServico, Cliente } from "@/types";
import { getOrderHtml, EmpresaConfig } from "@/lib/orderPrintUtils";
import type { ConfiguracaoRow } from "@/integrations/supabase/helpers";

interface PrintOrderButtonProps {
  ordem: OrdemServico;
  itens: ItemOrdemServico[];
  cliente?: Cliente;
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
        .like('chave', 'empresa_%');

      if (error) throw error;
      return data as ConfiguracaoRow[];
    }
  });

  // Process config data when it changes
  useEffect(() => {
    if (configData) {
      const info: EmpresaConfig = {};
      configData.forEach(config => {
        const key = config.chave.replace('empresa_', '') as keyof EmpresaConfig;
        info[key] = config.valor || '';
      });
      setEmpresaInfo(info);
    }
  }, [configData]);

  // Generate a shareable link for the order
  const generateShareableLink = () => {
    const host = window.location.origin;
    const shareLink = `${host}/share/ordem/${ordem.id}`;
    setShareUrl(shareLink);
    
    navigator.clipboard.writeText(shareLink).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link da OS foi copiado para a área de transferência. Este link pode precisar de configuração adicional para ser acessível publicamente.",
      });
    }).catch(err => {
      console.error("Falha ao copiar o link: ", err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive"
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
    
    printWindow.document.write(getOrderHtml(ordem, itens, cliente, empresaInfo, false));
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

    printWindow.document.write(getOrderHtml(ordem, itens, cliente, empresaInfo, true));
    printWindow.document.close();
    
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
    
    printWindow.document.write(getOrderHtml(ordem, itens, cliente, empresaInfo, true, true));
    printWindow.document.close();

    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={viewOrder} size="sm">
        <Eye className="mr-2 h-4 w-4" />
        Visualizar OS
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / Baixar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Imprimir ou Baixar OS #{ordem.numero}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={printOrder} className="w-full">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir OS
            </Button>
            <Button variant="outline" onClick={downloadPDF} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar como PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={generateShareableLink} size="sm">
        <Link2 className="mr-2 h-4 w-4" />
        Copiar Link OS
      </Button>
    </div>
  );
};

export default PrintOrderButton;
