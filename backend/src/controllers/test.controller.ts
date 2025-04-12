import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { SubscriptionPlan } from '../types/subscription';

const aiService = new AIService();

export class TestController {
  async testAIProviders(req: Request, res: Response) {
    try {
      const { idea } = req.body;
      
      if (!idea) {
        return res.status(400).json({ error: 'É necessário fornecer uma ideia para teste' });
      }

      console.log('🚀 Iniciando teste com todos os provedores de IA');

      // Teste com plano FREE
      console.log('\n📝 Testando plano FREE:');
      const freeResult = await aiService.validateIdea(idea, SubscriptionPlan.FREE);
      
      // Teste com plano STARTER
      console.log('\n📝 Testando plano STARTER:');
      const starterResult = await aiService.validateIdea(idea, SubscriptionPlan.STARTER);
      
      // Teste com plano PRO
      console.log('\n📝 Testando plano PRO:');
      const proResult = await aiService.validateIdea(idea, SubscriptionPlan.PRO);
      
      // Teste de geração de imagem
      console.log('\n🎨 Testando geração de imagem:');
      const imageResult = await aiService.generateImage(
        `Create a modern logo for a startup with the following idea: ${idea}`,
        SubscriptionPlan.PRO
      );

      return res.json({
        free: freeResult,
        starter: starterResult,
        pro: proResult,
        image: imageResult
      });
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      return res.status(500).json({
        error: 'Erro ao testar provedores de IA',
        details: error.message
      });
    }
  }
} 