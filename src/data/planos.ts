
export interface PlanoData {
  id: number;
  nome: string;
  periodo: "monthly" | "quarterly" | "yearly";
  preco: number;
  destacado: boolean;
  descricao: string;
  features: string[];
  savings?: number;
}

export const planosDisponiveis: PlanoData[] = [
  {
    id: 1,
    nome: "Plano Mensal",
    periodo: "monthly",
    preco: 49.90,
    destacado: false,
    descricao: "Faturamento mensal - flexibilidade máxima",
    features: [
      "Ordens de serviço ilimitadas",
      "Cadastro ilimitado de clientes",
      "Controle de estoque",
      "Relatórios básicos",
      "Suporte técnico",
      "Backup automático"
    ]
  },
  {
    id: 2,
    nome: "Plano Trimestral",
    periodo: "quarterly",
    preco: 129.90,
    destacado: true,
    descricao: "Faturamento trimestral - economia de 13%",
    features: [
      "Ordens de serviço ilimitadas",
      "Cadastro ilimitado de clientes",
      "Controle avançado de estoque",
      "Relatórios detalhados",
      "Suporte técnico prioritário",
      "Backup automático",
      "13% de economia"
    ],
    savings: 13
  },
  {
    id: 3,
    nome: "Plano Anual",
    periodo: "yearly",
    preco: 399.90,
    destacado: false,
    descricao: "Faturamento anual - máxima economia de 33%",
    features: [
      "Ordens de serviço ilimitadas",
      "Cadastro ilimitado de clientes",
      "Controle avançado de estoque",
      "Relatórios detalhados e análises",
      "Suporte técnico VIP",
      "Backup automático",
      "Integração com sistemas externos",
      "33% de economia",
      "Consultoria mensal"
    ],
    savings: 33
  }
];

export const trialFeatures = [
  "Acesso completo por 7 dias",
  "Todas as funcionalidades liberadas",
  "Suporte técnico",
  "Sem limite de ordens de serviço",
  "Sem compromisso"
];
