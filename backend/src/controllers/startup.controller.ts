const { PrismaClient } = require('@prisma/client');
const { AIService } = require('../services/ai.service');

const prisma = new PrismaClient();
const aiService = new AIService();

class StartupController {
  async create(req, res) {
    try {
      const { name, description, industry, targetMarket } = req.body;
      const userId = req.user.id;

      // Validate idea using AI
      const validation = await aiService.validateIdea(description);

      const startup = await prisma.startup.create({
        data: {
          name,
          description,
          industry,
          targetMarket,
          status: 'IDEA',
          userId,
          validationScore: validation.score,
          validationFeedback: validation.feedback
        }
      });

      return res.status(201).json(startup);
    } catch (error) {
      console.error('Create startup error:', error);
      return res.status(500).json({ error: 'Failed to create startup' });
    }
  }

  async list(req, res) {
    try {
      const userId = req.user.id;

      const startups = await prisma.startup.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(startups);
    } catch (error) {
      console.error('List startups error:', error);
      return res.status(500).json({ error: 'Failed to list startups' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup not found' });
      }

      return res.json(startup);
    } catch (error) {
      console.error('Get startup error:', error);
      return res.status(500).json({ error: 'Failed to get startup' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, description, industry, targetMarket } = req.body;

      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup not found' });
      }

      const updatedStartup = await prisma.startup.update({
        where: { id },
        data: {
          name,
          description,
          industry,
          targetMarket
        }
      });

      return res.json(updatedStartup);
    } catch (error) {
      console.error('Update startup error:', error);
      return res.status(500).json({ error: 'Failed to update startup' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup not found' });
      }

      await prisma.startup.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Delete startup error:', error);
      return res.status(500).json({ error: 'Failed to delete startup' });
    }
  }
}

module.exports = { StartupController };