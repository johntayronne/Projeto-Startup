export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface PlanFeatures {
  maxStartups: number;
  aiModels: string[];
  imageGeneration: boolean;
  prioritySupport: boolean;
  customization: boolean;
  consulting: boolean;
}

export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  [SubscriptionPlan.FREE]: {
    maxStartups: 1,
    aiModels: ['gpt-3.5-turbo'],
    imageGeneration: false,
    prioritySupport: false,
    customization: false,
    consulting: false
  },
  [SubscriptionPlan.STARTER]: {
    maxStartups: 3,
    aiModels: ['gpt-3.5-turbo', 'claude-instant'],
    imageGeneration: true,
    prioritySupport: false,
    customization: false,
    consulting: false
  },
  [SubscriptionPlan.PRO]: {
    maxStartups: 10,
    aiModels: ['gpt-4', 'claude-2', 'deepseek-coder'],
    imageGeneration: true,
    prioritySupport: true,
    customization: true,
    consulting: false
  },
  [SubscriptionPlan.ENTERPRISE]: {
    maxStartups: -1, // ilimitado
    aiModels: ['gpt-4', 'claude-3', 'deepseek-coder', 'custom-models'],
    imageGeneration: true,
    prioritySupport: true,
    customization: true,
    consulting: true
  }
}; 