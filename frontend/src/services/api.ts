import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { StartupIdea } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await getSession();
  
  if (session?.accessToken) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  
  return config;
});

export const startupService = {
  create: async (idea: StartupIdea) => {
    const response = await api.post('/startups', idea);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/startups');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/startups/${id}`);
    return response.data;
  },
  
  generateMVP: async (id: string) => {
    const response = await api.post(`/startups/${id}/mvp`);
    return response.data;
  }
};

export const subscriptionService = {
  getCurrentPlan: async () => {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },
  
  upgrade: async (plan: string) => {
    const response = await api.post('/subscriptions/upgrade', { plan });
    return response.data;
  }
};

export const aiService = {
  generateBusinessModel: async (startupId: string) => {
    const response = await api.post(`/ai/business-model`, { startupId });
    return response.data;
  },
  
  generateWebsite: async (startupId: string) => {
    const response = await api.post(`/ai/website`, { startupId });
    return response.data;
  }
};

export default api; 