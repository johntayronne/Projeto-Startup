import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AIService } from '../services/ai.service';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionPlan } from '../types/subscription';

const aiService = new AIService();
const subscriptionService = new SubscriptionService();

export class AIController {
  async validateIdea(req: AuthRequest, res: Response) {
    try {
      const { idea } = req.body;
      if (!idea) return res.status(400).json({ error: 'Idea is required' });
      
      // Get user subscription
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      
      const subscription = await subscriptionService.getUserSubscription(userId);
      const userPlan = subscription?.plan as SubscriptionPlan || SubscriptionPlan.FREE;
      
      const validation = await aiService.validateIdea(idea, userPlan);
      return res.json(validation);
    } catch (error) {
      console.error('Error validating idea:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
  }

  async generateMarketAnalysis(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) return res.status(400).json({ error: 'Startup ID is required' });

      const analysis = await aiService.generateMarketAnalysis(id);
      return res.json(analysis);
    } catch (error) {
      console.error('Error generating market analysis:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
  }
  
  async generateImage(req: AuthRequest, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Image prompt is required' });
      
      // Get user subscription
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      
      const subscription = await subscriptionService.getUserSubscription(userId);
      const userPlan = subscription?.plan as SubscriptionPlan || SubscriptionPlan.FREE;
      
      const imageResult = await aiService.generateImage(prompt, userPlan);
      return res.json(imageResult);
    } catch (error) {
      console.error('Error generating image:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
  }
}
