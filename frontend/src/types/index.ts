export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  userId: string;
  businessModel?: string;
  mvpStatus: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
}

export interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
}

export interface StartupIdea {
  title: string;
  description: string;
  targetMarket?: string;
  expectedFeatures?: string[];
} 