import { prisma } from '../lib/prisma';

// Limpar o banco de dados antes de cada teste
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Configurar variáveis de ambiente para testes
process.env.JWT_SECRET = 'test-secret';
process.env.REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/startup_test';
process.env.REDIS_URL = 'redis://localhost:6379';

// Configurar timeout global para testes
jest.setTimeout(30000); 