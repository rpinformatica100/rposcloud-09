
// Tipos específicos para assinantes/assistências técnicas
export type TipoPessoa = 'pessoa_fisica' | 'pessoa_juridica' | 'mei';

export interface DadosPessoaFisica {
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  estadoCivil?: string;
}

export interface DadosPessoaJuridica {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  dataAbertura?: string;
  regimeTributario?: 'simples_nacional' | 'lucro_presumido' | 'lucro_real';
}

export interface DadosMEI {
  cnpj: string;
  nomeFantasia?: string;
  dataAbertura?: string;
  atividadePrincipal?: string;
}

export interface ResponsavelAssistencia {
  nome: string;
  cpf: string;
  cargo?: string;
  telefone?: string;
  email?: string;
}

export interface EnderecoCompleto {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pontoReferencia?: string;
}

export interface AssinanteCompleto {
  id: string;
  
  // Dados básicos
  tipoPessoa: TipoPessoa;
  nome: string; // Nome completo (PF) ou Razão Social (PJ/MEI)
  email: string;
  
  // Dados específicos por tipo
  dadosPF?: DadosPessoaFisica;
  dadosPJ?: DadosPessoaJuridica;
  dadosMEI?: DadosMEI;
  
  // Responsável (obrigatório para PJ/MEI)
  responsavel?: ResponsavelAssistencia;
  
  // Contato
  telefone: string;
  celular?: string;
  whatsapp?: string;
  
  // Endereço completo
  endereco: EnderecoCompleto;
  
  // Dados profissionais
  especialidades: string[];
  descricaoServicos?: string;
  horarioFuncionamento?: string;
  website?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Dados do sistema
  userId: string;
  planoId: string;
  statusCadastro: 'incompleto' | 'pendente_validacao' | 'completo' | 'bloqueado';
  dataRegistro: string;
  dataUltimaAtualizacao: string;
  cadastroCompleto: boolean;
  mensagemCadastroExibida: boolean;
  etapaAtual: number; // Adicionado para controle do wizard
  
  // Logo/imagem
  logo?: string;
  
  // Configurações
  configuracoes?: {
    emitirNFe?: boolean;
    usarAssinaturaDigital?: boolean;
    mostrarLogoNaOS?: boolean;
  };
}

// Interface para wizard de cadastro
export interface EtapaCadastro {
  numero: 1 | 2 | 3;
  titulo: string;
  descricao: string;
  concluida: boolean;
  campos: string[];
}

export const ETAPAS_CADASTRO: EtapaCadastro[] = [
  {
    numero: 1,
    titulo: "Dados Básicos",
    descricao: "Informações principais da assistência técnica",
    concluida: false,
    campos: ['tipoPessoa', 'nome', 'email', 'telefone']
  },
  {
    numero: 2,
    titulo: "Dados Fiscais",
    descricao: "Documentos e informações legais",
    concluida: false,
    campos: ['cpf', 'cnpj', 'endereco']
  },
  {
    numero: 3,
    titulo: "Perfil Profissional",
    descricao: "Especialidades e informações do negócio",
    concluida: false,
    campos: ['especialidades', 'descricaoServicos', 'responsavel']
  }
];

// Especialidades predefinidas
export const ESPECIALIDADES_ASSISTENCIA = [
  'Celulares e Smartphones',
  'Notebooks e Laptops',
  'Computadores Desktop',
  'Tablets',
  'Televisões',
  'Monitores',
  'Impressoras',
  'Equipamentos de Som',
  'Câmeras Digitais',
  'Consoles de Videogame',
  'Eletrodomésticos',
  'Eletroportáteis',
  'Ar Condicionado',
  'Micro-ondas',
  'Outros Eletrônicos'
];
