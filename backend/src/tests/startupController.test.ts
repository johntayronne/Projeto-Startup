import { Request, Response } from 'express';
import { StartupController } from '../controllers/startupController';
import { prisma } from '../lib/prisma';
import { cacheService } from '../services/cacheService';

// Mock do Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    startup: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock do CacheService
jest.mock('../services/cacheService', () => ({
  cacheService: {
    getOrSet: jest.fn(),
    clearPattern: jest.fn(),
    del: jest.fn(),
  },
}));

describe('StartupController', () => {
  let controller: StartupController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    controller = new StartupController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
    mockReq = {};
  });

  describe('list', () => {
    it('deve retornar lista de startups com cache', async () => {
      const mockStartups = {
        data: [{ id: 1, name: 'Startup 1' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockReq.query = { page: '1', limit: '10' };
      (cacheService.getOrSet as jest.Mock).mockResolvedValue(mockStartups);

      await controller.list(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith(mockStartups);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      mockReq.query = { page: '1', limit: '10' };
      (cacheService.getOrSet as jest.Mock).mockRejectedValue(new Error('Erro de cache'));

      await controller.list(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });

  describe('create', () => {
    it('deve criar uma nova startup', async () => {
      const mockStartup = { id: 1, name: 'Nova Startup' };
      mockReq.body = {
        name: 'Nova Startup',
        description: 'Descrição da startup',
        industry: 'Tech',
        stage: 'IDEA',
        funding: 0,
        teamSize: 1,
      };

      (prisma.startup.create as jest.Mock).mockResolvedValue(mockStartup);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockStartup);
      expect(cacheService.clearPattern).toHaveBeenCalledWith('startups:*');
    });

    it('deve retornar erro 500 em caso de falha na criação', async () => {
      mockReq.body = {
        name: 'Nova Startup',
        description: 'Descrição da startup',
        industry: 'Tech',
        stage: 'IDEA',
        funding: 0,
        teamSize: 1,
      };

      (prisma.startup.create as jest.Mock).mockRejectedValue(new Error('Erro de criação'));

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });

  describe('getById', () => {
    it('deve retornar uma startup por ID', async () => {
      const mockStartup = { id: 1, name: 'Startup 1' };
      mockReq.params = { id: '1' };
      (cacheService.getOrSet as jest.Mock).mockResolvedValue(mockStartup);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith(mockStartup);
    });

    it('deve retornar erro 404 quando startup não é encontrada', async () => {
      mockReq.params = { id: '1' };
      (cacheService.getOrSet as jest.Mock).mockRejectedValue(new Error('Startup não encontrada'));

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Startup não encontrada' });
    });
  });
}); 