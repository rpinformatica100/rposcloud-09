export type PlanStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'blocked';
export type PlanType = 'trial_plan' | 'basic' | 'professional' | 'enterprise';

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
  isPaid: boolean; // Nova propriedade para distinguir planos pagos
}

export interface PlanFeatures {
  maxOrders: number;
  maxUsers: number;
  maxStorage: number; // in GB
  hasAdvancedReports: boolean;
  hasPrioritySupport: boolean;
  hasAPI: boolean;
  hasCustomization: boolean;
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

export const PLAN_CONFIGS: Record<PlanType, PlanFeatures> = {
  trial_plan: {
    maxOrders: 50,
    maxUsers: 2,
    maxStorage: 1,
    hasAdvancedReports: false,
    hasPrioritySupport: false,
    hasAPI: false,
    hasCustomization: false,
  },
  basic: {
    maxOrders: 100,
    maxUsers: 2,
    maxStorage: 5,
    hasAdvancedReports: false,
    hasPrioritySupport: false,
    hasAPI: false,
    hasCustomization: false,
  },
  professional: {
    maxOrders: 1000,
    maxUsers: 5,
    maxStorage: 10,
    hasAdvancedReports: true,
    hasPrioritySupport: true,
    hasAPI: false,
    hasCustomization: false,
  },
  enterprise: {
    maxOrders: -1, // unlimited
    maxUsers: -1, // unlimited
    maxStorage: 100,
    hasAdvancedReports: true,
    hasPrioritySupport: true,
    hasAPI: true,
    hasCustomization: true,
  },
};

export const PLAN_METADATA = {
  trial_plan: {
    name: 'Trial Gratuito',
    isPaid: false,
    trialDays: 7,
  },
  basic: {
    name: 'Básico',
    isPaid: true,
    price: 49.90,
  },
  professional: {
    name: 'Profissional',
    isPaid: true,
    price: 129.90,
  },
  enterprise: {
    name: 'Enterprise',
    isPaid: true,
    price: 399.90,
  },
} as const;
