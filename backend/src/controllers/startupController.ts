import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { cacheService } from '../services/cacheService';
import { startupSchema, paginationSchema, searchFiltersSchema } from '../validations/schemas';

export class StartupController {
  // Listar startups com cache e paginação
  async list(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder } = paginationSchema.parse(req.query);
      const filters = searchFiltersSchema.parse(req.query);

      const cacheKey = `startups:${page}:${limit}:${sortBy}:${sortOrder}:${JSON.stringify(filters)}`;
      
      const startups = await cacheService.getOrSet(
        cacheKey,
        async () => {
          const where = {
            ...(filters.industry && { industry: filters.industry }),
            ...(filters.stage && { stage: filters.stage }),
            ...(filters.minFunding && { funding: { gte: filters.minFunding } }),
            ...(filters.maxFunding && { funding: { lte: filters.maxFunding } }),
            ...(filters.teamSize && { teamSize: filters.teamSize }),
          };

          const [data, total] = await Promise.all([
            prisma.startup.findMany({
              where,
              skip: (page - 1) * limit,
              take: limit,
              orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined,
            }),
            prisma.startup.count({ where }),
          ]);

          return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          };
        },
        300 // Cache por 5 minutos
      );

      return res.json(startups);
    } catch (error) {
      console.error('Erro ao listar startups:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar startup com validação
  async create(req: Request, res: Response) {
    try {
      const data = startupSchema.parse(req.body);
      
      const startup = await prisma.startup.create({
        data,
      });

      // Limpar cache relacionado a startups
      await cacheService.clearPattern('startups:*');

      return res.status(201).json(startup);
    } catch (error) {
      console.error('Erro ao criar startup:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar startup por ID com cache
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const cacheKey = `startup:${id}`;
      
      const startup = await cacheService.getOrSet(
        cacheKey,
        async () => {
          const data = await prisma.startup.findUnique({
            where: { id },
          });

          if (!data) {
            throw new Error('Startup não encontrada');
          }

          return data;
        },
        600 // Cache por 10 minutos
      );

      return res.json(startup);
    } catch (error) {
      if (error.message === 'Startup não encontrada') {
        return res.status(404).json({ error: 'Startup não encontrada' });
      }
      console.error('Erro ao buscar startup:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar startup com validação
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = startupSchema.parse(req.body);

      const startup = await prisma.startup.update({
        where: { id },
        data,
      });

      // Limpar cache relacionado a startups
      await cacheService.clearPattern('startups:*');
      await cacheService.del(`startup:${id}`);

      return res.json(startup);
    } catch (error) {
      console.error('Erro ao atualizar startup:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Deletar startup
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.startup.delete({
        where: { id },
      });

      // Limpar cache relacionado a startups
      await cacheService.clearPattern('startups:*');
      await cacheService.del(`startup:${id}`);

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar startup:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 