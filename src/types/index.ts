
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

// Tipo para Assistências Técnicas
export interface Assistencia {
  id: string | number;
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
}

