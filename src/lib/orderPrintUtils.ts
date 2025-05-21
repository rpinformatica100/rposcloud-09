
import { OrdemServico, ItemOrdemServico, Cliente } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

export interface EmpresaConfig {
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

const statusText = (status: string) => {
  switch (status) {
    case "aberta": return "Aberta";
    case "em_andamento":
    case "andamento": return "Em Andamento";
    case "concluida": return "Concluída";
    case "cancelada": return "Cancelada";
    default: return status;
  }
};

const prioridadeText = (priority: string) => {
  switch (priority) {
    case "baixa": return "Baixa";
    case "media": return "Média";
    case "alta": return "Alta";
    case "urgente": return "Urgente";
    default: return priority;
  }
};

export const getOrderHtml = (
  ordem: OrdemServico,
  itens: ItemOrdemServico[],
  cliente: Cliente | undefined,
  empresaInfo: EmpresaConfig,
  forPrinting: boolean = false,
  forDownload: boolean = false
) => {
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
          margin: 10mm; /* Reduced margin */
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font */
          line-height: 1.4; /* Adjusted line height */
          color: #333;
          margin: 0;
          padding: 0;
        }
        .print-container {
          max-width: 190mm; /* Max width within A4 margins */
          margin: 0 auto;
          padding: 10px; /* Add some padding */
        }
        .header-empresa {
          display: flex;
          justify-content: space-between;
          align-items: flex-start; /* Align items to top */
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .logo-container {
          width: 90px; /* Slightly smaller logo */
          margin-right: 15px;
        }
        .logo-container img {
          max-width: 100%;
          max-height: 50px; /* Max height for logo */
          object-fit: contain;
        }
        .empresa-info {
          flex-grow: 1;
          text-align: left;
        }
        .empresa-nome {
          font-size: 16px; /* Maintained font size */
          font-weight: bold;
          color: #1e3a8a; /* Darker blue */
          margin-bottom: 2px;
        }
        .empresa-detalhes {
          font-size: 10px; /* Smaller font for details */
          color: #555;
        }
        .os-numero-container {
           text-align: right;
        }
        .os-numero-titulo {
          font-size: 18px;
          font-weight: bold;
          color: #1e3a8a; /* Darker blue */
          margin: 0 0 5px 0;
        }
        .os-data-abertura {
          font-size: 11px;
          color: #555;
        }
        .section {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #f9fafb;
        }
        .section-title {
          font-size: 13px;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive grid */
          gap: 8px;
          font-size: 11px;
        }
        .info-item {
          margin-bottom: 3px;
        }
        .info-label {
          font-weight: 600; /* Semibold */
          color: #4b5563;
          display: block;
          font-size: 10px;
          margin-bottom: 1px;
        }
        .info-value {
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 6px 8px; /* Adjusted padding */
          text-align: left;
          vertical-align: top; /* Align content to top */
        }
        th {
          background-color: #f0f2f5; /* Lighter gray */
          font-weight: 600; /* Semibold */
          font-size: 10px;
          text-transform: uppercase;
        }
        .text-right { text-align: right; }
        .font-medium { font-weight: 500; }
        .total-section {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #ccc;
          text-align: right;
        }
        .total-label {
          font-size: 12px;
          color: #555;
        }
        .total-valor {
          font-size: 16px;
          font-weight: bold;
          color: #1e3a8a;
        }
        .observacoes-texto {
          font-size: 11px;
          white-space: pre-wrap; /* Preserve line breaks */
          padding: 8px;
          border: 1px dashed #ddd;
          border-radius: 4px;
          background-color: #fff;
          margin-top:5px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 9px;
          color: #777;
        }
        .signatures {
          display: flex;
          justify-content: space-around; /* Space signatures out */
          margin-top: 40px;
          page-break-inside: avoid;
        }
        .signature-block {
          width: 40%; /* Width for each signature block */
          text-align: center;
        }
        .signature-line {
          border-top: 1px solid #555;
          margin-top: 30px; /* Space for signature */
          padding-top: 5px;
          font-size: 10px;
          color: #333;
        }
        .item-observacao {
          font-size: 9px;
          color: #666;
          font-style: italic;
          margin-top: 2px;
        }
        .status-badge, .prioridade-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          display: inline-block;
        }
        .status-aberta { background-color: #e0f2fe; color: #0284c7; }
        .status-em_andamento, .status-andamento { background-color: #fef9c3; color: #ca8a04; }
        .status-concluida { background-color: #dcfce7; color: #16a34a; }
        .status-cancelada { background-color: #fee2e2; color: #dc2626; }
        .prioridade-baixa { background-color: #dcfce7; color: #16a34a; }
        .prioridade-media { background-color: #fef3c7; color: #d97706; }
        .prioridade-alta { background-color: #fee2e2; color: #ef4444; }
        .prioridade-urgente { background-color: #fecaca; color: #b91c1c; font-weight: bold; }

        @media print {
          .no-print { display: none; }
          body { padding: 0; margin: 0; width: auto; }
          .print-container { width: 100%; padding: 0; box-shadow: none; border: none; }
          .section { border: 1px solid #eee; background-color: transparent; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: center; margin-bottom: 15px; padding: 10px; background-color: #f0f0f0;">
        <button onclick="window.print();" style="padding: 8px 15px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
          ${forDownload ? 'Salvar como PDF' : 'Imprimir'}
        </button>
        <button onclick="window.close();" style="padding: 8px 15px; background-color: #64748b; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Fechar
        </button>
      </div>
      
      <div class="print-container">
        <div class="header-empresa">
          <div class="empresa-info">
            ${empresaInfo.logo ? `<div class="logo-container"><img src="${empresaInfo.logo}" alt="Logo"></div>` : ''}
            <div class="empresa-nome">${empresaInfo.nome || 'Nome da Empresa'}</div>
            <div class="empresa-detalhes">
              ${empresaInfo.cnpj ? `CNPJ: ${empresaInfo.cnpj}<br>` : ''}
              ${empresaInfo.endereco ? `${empresaInfo.endereco}${empresaInfo.cidade ? ', ' + empresaInfo.cidade : ''}${empresaInfo.estado ? '/' + empresaInfo.estado : ''}<br>` : ''}
              ${empresaInfo.telefone || empresaInfo.email ? `${empresaInfo.telefone || ''}${empresaInfo.telefone && empresaInfo.email ? ' | ' : ''}${empresaInfo.email || ''}` : ''}
            </div>
          </div>
          <div class="os-numero-container">
            <div class="os-numero-titulo">OS #${ordem.numero}</div>
            <div class="os-data-abertura">Abertura: ${formatDate(ordem.dataAbertura)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Dados do Cliente</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">${cliente?.nome || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPF/CNPJ:</span>
              <span class="info-value">${cliente?.documento || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Telefone:</span>
              <span class="info-value">${cliente?.telefone || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${cliente?.email || 'N/A'}</span>
            </div>
            <div class="info-item" style="grid-column: 1 / -1;"> {/* Full width */}
              <span class="info-label">Endereço:</span>
              <span class="info-value">${cliente?.endereco || ''}${cliente?.cidade ? `, ${cliente.cidade}` : ''}${cliente?.estado ? `/${cliente.estado}` : ''}${cliente?.cep ? ` - CEP: ${cliente.cep}` : ''}</span>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Detalhes da Ordem de Serviço</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value"><span class="status-badge status-${ordem.status}">${statusText(ordem.status)}</span></span>
            </div>
            <div class="info-item">
              <span class="info-label">Prioridade:</span>
              <span class="info-value"><span class="prioridade-badge prioridade-${ordem.prioridade}">${prioridadeText(ordem.prioridade)}</span></span>
            </div>
             <div class="info-item">
              <span class="info-label">Previsão de Conclusão:</span>
              <span class="info-value">${ordem.dataPrevisao ? formatDate(ordem.dataPrevisao) : 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Conclusão:</span>
              <span class="info-value">${ordem.dataConclusao ? formatDate(ordem.dataConclusao) : 'Pendente'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Responsável Técnico:</span>
              <span class="info-value">${ordem.responsavel || 'N/A'}</span>
            </div>
          </div>
          ${ordem.descricao ? `
            <div style="margin-top: 10px;">
              <span class="info-label" style="font-size:11px;">Descrição do Serviço/Problema:</span>
              <div class="observacoes-texto" style="background-color: #fff; font-size:11px;">${ordem.descricao}</div>
            </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Itens da Ordem de Serviço</div>
          <table>
            <thead>
              <tr>
                <th>Item/Serviço</th>
                <th style="width: 10%;" class="text-right">Qtd</th>
                <th style="width: 20%;" class="text-right">Valor Unit.</th>
                <th style="width: 20%;" class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itens.map(item => `
              <tr>
                <td>
                  ${item.produto?.nome || 'Item não identificado'}
                  ${item.observacao ? `<div class="item-observacao">${item.observacao}</div>` : ''}
                </td>
                <td class="text-right">${item.quantidade}</td>
                <td class="text-right">${formatCurrency(Number(item.valorUnitario) || 0)}</td>
                <td class="text-right">${formatCurrency(Number(item.valorTotal) || 0)}</td>
              </tr>
              `).join('')}
              ${itens.length === 0 ? `<tr><td colspan="4" style="text-align:center; padding:10px;">Nenhum item na ordem.</td></tr>` : ''}
            </tbody>
          </table>
          <div class="total-section">
            <span class="total-label">Valor Total: </span>
            <span class="total-valor">${formatCurrency(Number(ordem.valorTotal) || 0)}</span>
          </div>
        </div>
        
        ${ordem.solucao ? `
        <div class="section">
          <div class="section-title">Solução Aplicada</div>
          <div class="observacoes-texto">${ordem.solucao}</div>
        </div>
        ` : ''}

        ${ordem.observacoes ? `
        <div class="section">
          <div class="section-title">Observações Adicionais</div>
          <div class="observacoes-texto">${ordem.observacoes}</div>
        </div>
        ` : ''}
        
        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line">Assinatura do Técnico</div>
          </div>
          <div class="signature-block">
            <div class="signature-line">Assinatura do Cliente</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
          ${empresaInfo.observacoes ? `<p style="font-size:8px">${empresaInfo.observacoes}</p>` : ''}
          ${empresaInfo.site ? `<p><a href="${empresaInfo.site}" style="color:#1e3a8a; text-decoration:none;">${empresaInfo.site}</a></p>` : ''}
        </div>
      </div>

      <script>
        window.onload = function() {
          ${forPrinting || forDownload ? 'setTimeout(function() { window.print(); }, 500);' : ''}
        }
      </script>
    </body>
    </html>
  `;
};

