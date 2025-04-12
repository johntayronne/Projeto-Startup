import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface StartupData {
  title: string;
  description: string;
  targetMarket?: string;
  expectedFeatures?: string;
  userId: string;
}

interface Startup extends StartupData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const startupService = {
  create: async (data: StartupData): Promise<Startup> => {
    const response = await axios.post<ApiResponse<Startup>>(`${API_URL}/startups`, data);
    return response.data.data;
  },

  getAll: async (): Promise<Startup[]> => {
    const response = await axios.get<ApiResponse<Startup[]>>(`${API_URL}/startups`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Startup> => {
    const response = await axios.get<ApiResponse<Startup>>(`${API_URL}/startups/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<StartupData>): Promise<Startup> => {
    const response = await axios.put<ApiResponse<Startup>>(`${API_URL}/startups/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/startups/${id}`);
  }
}; 