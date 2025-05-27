// Tipos de dados para o sistema de OS

export interface Cliente {
  id: string;
  nome: string;
  tipo: 'cliente' | 'fornecedor';
  email: string;
  telefone: string;
  documento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string;
  dataCadastro: string;
}

export interface Produto {
  id: string;
  nome: string;
  tipo: 'produto' | 'servico';
  descricao: string;
  preco: number;
  custo?: number;
  codigo?: string;
  unidade?: string;
  estoque?: number;
  ativo: boolean;
}

export interface OrdemServico {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: Cliente;
  status: 'aberta' | 'andamento' | 'concluida' | 'cancelada';
  dataAbertura: string;
  dataPrevisao?: string;
  dataConclusao?: string;
  descricao: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  itens: ItemOrdemServico[];
  valorTotal: number;
  observacoes?: string;
  assistenciaId?: string;  // ID da assistência técnica responsável
  assistencia?: Assistencia;  // Dados da assistência técnica
  solucao?: string;
  formaPagamento?: string;
  integradoFinanceiro?: boolean;
  movimentoFinanceiroId?: string;
}

export interface ItemOrdemServico {
  id: string;
  produtoId: string;
  produto?: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacao?: string;
}

export interface MovimentoFinanceiro {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  data: string;
  pago: boolean;
  dataPagamento?: string;
  categoria: string;
  metodoPagamento?: string;
  ordemId?: string;
  observacoes?: string;
}

export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao: string;
}

// Novas interfaces para configurações de pagamento
export interface ConfiguracoesPagamento {
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    ativo: boolean;
  };
  mercadoPago: {
    accessToken: string;
    publicKey: string;
    ativo: boolean;
  };
}

export interface PagamentoCheckout {
  planoId: number;
  metodoPagamento: 'stripe' | 'mercadopago';
  preco: number;
  planoNome: string;
}

// Tipo para Assistências Técnicas
export interface Assistencia {
  id: string;
  nome: string;
  email: string;
  plano: string;
  status: 'Ativa' | 'Inativa';
  dataRegistro: string;
  telefone?: string;
  celular?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  responsavel?: string;
  especialidades?: string[];
  descricao?: string;
  logo?: string;
  website?: string;
  // Campos adicionais para autenticação
  userId?: string;
  senha?: string;
  ultimoLogin?: string;
  // Campo para controle de cadastro completo
  cadastroCompleto?: boolean;
  // Campo que controla se a mensagem de cadastro já foi mostrada
  mensagemCadastroExibida?: boolean;
}

// Updated interface for Plano to match the changes in PlanosList.tsx
export interface Plano {
  id: number;
  nome: string;
  periodo: 'mensal' | 'trimestral' | 'anual';
  preco: number;
  destacado: boolean;
  descricao: string;
}

// Database interface types for Supabase
export interface OrdemDB {
  id: string;
  numero: string;
  cliente_id: string;
  cliente?: ClienteDB;
  status: 'aberta' | 'andamento' | 'concluida' | 'cancelada';
  data_abertura: string;
  data_previsao?: string;
  data_conclusao?: string;
  descricao: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  valor_total: number;
  observacoes?: string;
  assistencia_id?: string;
  solucao?: string;
  forma_pagamento?: string;
  integrado_financeiro?: boolean;
  movimento_financeiro_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteDB {
  id: string;
  nome: string;
  tipo: string;
  email?: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  data_cadastro: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdemItemDB {
  id: string;
  ordem_id: string;
  produto_id: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacao?: string;
  produto?: {
    nome: string;
    tipo: string;
  };
  created_at?: string;
  updated_at?: string;
}
