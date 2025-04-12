import { z } from 'zod';

// Schema de validação para usuário
export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

// Schema de validação para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema de validação para startup
export const startupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  industry: z.string().min(2, 'Indústria é obrigatória'),
  stage: z.enum(['IDEA', 'MVP', 'MARKET', 'SCALE']),
  funding: z.number().min(0, 'Funding não pode ser negativo'),
  teamSize: z.number().min(1, 'Tamanho da equipe deve ser pelo menos 1'),
});

// Schema de validação para análise
export const analysisSchema = z.object({
  startupId: z.string().uuid('ID da startup inválido'),
  type: z.enum(['MARKET', 'TECHNICAL', 'FINANCIAL']),
  data: z.record(z.any()),
});

// Schema de validação para feedback
export const feedbackSchema = z.object({
  analysisId: z.string().uuid('ID da análise inválido'),
  content: z.string().min(10, 'Feedback deve ter no mínimo 10 caracteres'),
  rating: z.number().min(1).max(5),
});

// Schema de validação para paginação
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Schema de validação para filtros de busca
export const searchFiltersSchema = z.object({
  industry: z.string().optional(),
  stage: z.enum(['IDEA', 'MVP', 'MARKET', 'SCALE']).optional(),
  minFunding: z.number().min(0).optional(),
  maxFunding: z.number().min(0).optional(),
  teamSize: z.number().min(1).optional(),
}); 