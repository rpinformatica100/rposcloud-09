
export type PlanStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'blocked';
export type PlanType = 'trial_plan' | 'monthly' | 'quarterly' | 'yearly';

export interface UserPlan {
  id: string;
  userId: string;
  planType: PlanType;
  status: PlanStatus;
  startDate: string;
  endDate: string;
  trialStartDate?: string;
  trialEndDate?: string;
  isTrialUsed: boolean;
  remainingDays: number;
  features: PlanFeatures;
  billing?: BillingInfo;
  isPaid: boolean;
}

export interface PlanFeatures {
  // Trial tem limitação de tempo, mas funcionalidades completas
  // Planos pagos têm funcionalidades completas sem limitação de tempo
  hasFullAccess: boolean;
  maxTrialDays?: number;
}

export interface BillingInfo {
  paymentMethod?: PaymentMethod;
  billingAddress?: Address;
  autoRenewal: boolean;
  nextBillingDate?: string;
  lastPaymentDate?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'pix' | 'boleto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PlanLimitation {
  feature: string;
  isBlocked: boolean;
  message: string;
  upgradeRequired: boolean;
}

// Configurações simplificadas - apenas Trial vs Pago
export const PLAN_CONFIGS: Record<PlanType, PlanFeatures> = {
  trial_plan: {
    hasFullAccess: true,
    maxTrialDays: 7,
  },
  monthly: {
    hasFullAccess: true,
  },
  quarterly: {
    hasFullAccess: true,
  },
  yearly: {
    hasFullAccess: true,
  },
};

// Metadados com preços por período
export const PLAN_METADATA = {
  trial_plan: {
    name: 'Trial Gratuito',
    isPaid: false,
    trialDays: 7,
    description: 'Acesso completo por 7 dias',
  },
  monthly: {
    name: 'Plano Mensal',
    isPaid: true,
    price: 49.90,
    description: 'Faturamento mensal',
    period: 'mensal',
  },
  quarterly: {
    name: 'Plano Trimestral',
    isPaid: true,
    price: 129.90,
    description: 'Faturamento trimestral - economia de 13%',
    period: 'trimestral',
    savings: 13,
  },
  yearly: {
    name: 'Plano Anual',
    isPaid: true,
    price: 399.90,
    description: 'Faturamento anual - economia de 33%',
    period: 'anual',
    savings: 33,
  },
} as const;
