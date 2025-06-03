import { Cliente, Produto, OrdemServico, MovimentoFinanceiro, Configuracao } from '../types';
import { formatarData } from '../lib/utils';

// Dados de exemplo - Clientes
export const clientesData: Cliente[] = [
  {
    id: "1",
    nome: "Empresa ABC Ltda",
    tipo: "cliente",
    email: "contato@empresaabc.com",
    telefone: "(11) 98765-4321",
    documento: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    observacoes: "Cliente prioritário",
    dataCadastro: "2023-01-15T00:00:00",
    ativo: true
  },
  {
    id: "2",
    nome: "João da Silva",
    tipo: "cliente",
    email: "joao.silva@email.com",
    telefone: "(11) 91234-5678",
    documento: "123.456.789-00",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    dataCadastro: "2023-02-20T00:00:00",
    ativo: true
  },
  {
    id: "3",
    nome: "Suprimentos XYZ",
    tipo: "fornecedor",
    email: "vendas@suprimentosxyz.com",
    telefone: "(11) 3333-4444",
    documento: "98.765.432/0001-10",
    endereco: "Rua dos Fornecedores, 456",
    cidade: "São Paulo",
    estado: "SP",
    cep: "04567-890",
    observacoes: "Fornecedor de material de escritório",
    dataCadastro: "2023-03-10T00:00:00",
    ativo: true
  }
];

// Dados de exemplo - Produtos e Serviços
export const produtosData: Produto[] = [
  {
    id: "1",
    nome: "Formatação de Computador",
    tipo: "servico",
    descricao: "Formatação completa com backup e reinstalação do sistema operacional",
    preco: 150.00,
    custo: 50.00,
    codigo: "SERV-001",
    unidade: "un",
    ativo: true
  },
  {
    id: "2",
    nome: "SSD 240GB",
    tipo: "produto",
    descricao: "SSD Kingston A400 240GB",
    preco: 250.00,
    custo: 180.00,
    codigo: "PROD-001",
    unidade: "un",
    estoque: 15,
    ativo: true
  },
  {
    id: "3",
    nome: "Memória RAM 8GB DDR4",
    tipo: "produto",
    descricao: "Memória RAM DDR4 8GB 2666Mhz",
    preco: 300.00,
    custo: 220.00,
    codigo: "PROD-002",
    unidade: "un",
    estoque: 10,
    ativo: true
  },
  {
    id: "4",
    nome: "Limpeza de Notebook",
    tipo: "servico",
    descricao: "Limpeza interna completa com troca de pasta térmica",
    preco: 120.00,
    custo: 30.00,
    codigo: "SERV-002",
    unidade: "un",
    ativo: true
  }
];

// Dados de exemplo - Ordens de Serviço
export const ordensData: OrdemServico[] = [
  {
    id: "1",
    numero: "OS-2023-0001",
    clienteId: "1",
    cliente: clientesData[0],
    status: "concluida",
    dataAbertura: "2023-05-10T14:30:00",
    dataPrevisao: "2023-05-12T14:30:00",
    dataConclusao: "2023-05-11T16:45:00",
    descricao: "Manutenção de computadores do escritório",
    responsavel: "Técnico Carlos",
    prioridade: "media",
    itens: [
      {
        id: "1",
        produtoId: "1",
        produto: produtosData[0],
        quantidade: 3,
        valorUnitario: 150.00,
        valorTotal: 450.00
      },
      {
        id: "2",
        produtoId: "2",
        produto: produtosData[1],
        quantidade: 1,
        valorUnitario: 250.00,
        valorTotal: 250.00
      }
    ],
    valorTotal: 700.00,
    observacoes: "Cliente solicitou urgência"
  },
  {
    id: "2",
    numero: "OS-2023-0002",
    clienteId: "2",
    cliente: clientesData[1],
    status: "andamento",
    dataAbertura: "2023-05-15T09:15:00",
    dataPrevisao: "2023-05-18T09:15:00",
    descricao: "Notebook não liga",
    responsavel: "Técnico Ana",
    prioridade: "alta",
    itens: [
      {
        id: "1",
        produtoId: "4",
        produto: produtosData[3],
        quantidade: 1,
        valorUnitario: 120.00,
        valorTotal: 120.00
      }
    ],
    valorTotal: 120.00
  }
];

// Dados de exemplo - Movimentos Financeiros
export const financeirosData: MovimentoFinanceiro[] = [
  {
    id: "1",
    tipo: "receita",
    descricao: "Pagamento OS-2023-0001",
    valor: 700.00,
    data: "2023-05-11T16:45:00",
    pago: true,
    dataPagamento: "2023-05-11T16:45:00",
    categoria: "Serviços",
    metodoPagamento: "Cartão de Crédito",
    ordemId: "1"
  },
  {
    id: "2",
    tipo: "despesa",
    descricao: "Pagamento de Fornecedor",
    valor: 500.00,
    data: "2023-05-05T10:30:00",
    pago: true,
    dataPagamento: "2023-05-05T10:30:00",
    categoria: "Fornecedores",
    metodoPagamento: "Transferência"
  },
  {
    id: "3",
    tipo: "receita",
    descricao: "Pagamento Parcial OS-2023-0002",
    valor: 60.00,
    data: "2023-05-15T09:15:00",
    pago: true,
    dataPagamento: "2023-05-15T09:15:00",
    categoria: "Serviços",
    metodoPagamento: "Dinheiro",
    ordemId: "2"
  }
];

// Dados de exemplo - Configurações
export const configuracoesData: Configuracao[] = [
  {
    id: "1",
    chave: "empresa_nome",
    valor: "TechService Manutenção",
    descricao: "Nome da empresa"
  },
  {
    id: "2",
    chave: "empresa_telefone",
    valor: "(11) 4567-8901",
    descricao: "Telefone de contato da empresa"
  },
  {
    id: "3",
    chave: "empresa_email",
    valor: "contato@techservice.com",
    descricao: "Email de contato da empresa"
  },
  {
    id: "4",
    chave: "numeracao_os",
    valor: "OS-{ANO}-{SEQUENCIAL}",
    descricao: "Formato da numeração das ordens de serviço"
  }
];
