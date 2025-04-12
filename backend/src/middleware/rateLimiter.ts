import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { Request, Response } from 'express';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Configuração base do rate limiter
const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutos por padrão
    max: options.max || 100, // 100 requisições por janela por padrão
    message: options.message || 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
    store: new Redis({
      client: redis,
      prefix: 'rate-limit:',
    }),
  });
};

// Rate limiter para rotas de autenticação
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
});

// Rate limiter para rotas de API
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // 60 requisições por minuto
});

// Rate limiter para rotas de criação/edição
export const mutationLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requisições por minuto
});

// Rate limiter para rotas de consulta
export const queryLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por minuto
}); 