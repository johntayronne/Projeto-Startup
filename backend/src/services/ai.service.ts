import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import axios from 'axios';
import { SubscriptionPlan, PLAN_FEATURES } from '../types/subscription';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Configuração das APIs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface AIProvider {
  name: string;
  validateIdea: (idea: string) => Promise<any>;
  generateImage: (prompt: string) => Promise<string>;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  async validateIdea(idea: string) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a startup advisor analyzing business ideas." },
        { role: "user", content: `Analyze this startup idea and provide feedback: ${idea}` },
      ],
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data[0].url || '';
  }
}

class ClaudeProvider implements AIProvider {
  name = 'Claude';
  private apiKey = process.env.CLAUDE_API_KEY;

  async validateIdea(idea: string) {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: `Analyze this startup idea and provide feedback: ${idea}` }
      ]
    }, {
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    return response.data.content[0].text;
  }

  async generateImage(prompt: string): Promise<string> {
    throw new Error('Claude não suporta geração de imagens');
  }
}

class DeepseekProvider implements AIProvider {
  name = 'Deepseek';
  private apiKey = process.env.DEEPSEEK_API_KEY;

  async validateIdea(idea: string) {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a startup advisor analyzing business ideas.' },
        { role: 'user', content: `Analyze this startup idea and provide feedback: ${idea}` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.data.choices[0].message.content;
  }

  async generateImage(prompt: string): Promise<string> {
    throw new Error('Deepseek não suporta geração de imagens');
  }
}

class StabilityProvider implements AIProvider {
  name = 'Stability AI';
  private apiKey = process.env.STABILITY_API_KEY;

  async validateIdea(idea: string) {
    throw new Error('Stability AI não suporta análise de texto');
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      steps: 30,
      samples: 1,
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data.artifacts[0].base64;
  }
}

export class AIService {
  private providers: AIProvider[];
  
  constructor() {
    this.providers = [
      new OpenAIProvider(),
      new ClaudeProvider(),
      new DeepseekProvider(),
      new StabilityProvider()
    ];
  }

  private async getAvailableProviders(userPlan: SubscriptionPlan) {
    const planFeatures = PLAN_FEATURES[userPlan];
    return this.providers.filter(provider => 
      planFeatures.aiModels.some(model => model.toLowerCase().includes(provider.name.toLowerCase()))
    );
  }

  async validateIdea(idea: string, userPlan: SubscriptionPlan = SubscriptionPlan.FREE) {
    console.log('🔍 Iniciando validação de ideia');
    
    const availableProviders = await this.getAvailableProviders(userPlan);
    if (availableProviders.length === 0) {
      throw new Error('Nenhum provedor de IA disponível para seu plano');
    }

    try {
      const results = await Promise.all(
        availableProviders.map(async provider => {
          try {
            console.log(`🤖 Tentando provedor: ${provider.name}`);
            const feedback = await provider.validateIdea(idea);
            return { provider: provider.name, feedback, success: true };
          } catch (error) {
            console.error(`❌ Erro com provedor ${provider.name}:`, error);
            return { provider: provider.name, feedback: null, success: false };
          }
        })
      );

      const successfulResults = results.filter(r => r.success);
      if (successfulResults.length === 0) {
        throw new Error('Todos os provedores de IA falharam');
      }

      const bestResult = successfulResults[0];
      return {
        feedback: bestResult.feedback,
        score: this.calculateIdeaScore(bestResult.feedback || ""),
        provider: bestResult.provider
      };
    } catch (error) {
      console.error("❌ Erro na validação:", error);
      throw error;
    }
  }

  async generateImage(prompt: string, userPlan: SubscriptionPlan = SubscriptionPlan.FREE) {
    if (!PLAN_FEATURES[userPlan].imageGeneration) {
      throw new Error('Geração de imagens não disponível no seu plano');
    }

    const imageProviders = this.providers.filter(p => {
      try {
        return typeof p.generateImage === 'function';
      } catch {
        return false;
      }
    });

    for (const provider of imageProviders) {
      try {
        console.log(`🎨 Tentando gerar imagem com ${provider.name}`);
        const imageUrl = await provider.generateImage(prompt);
        return { url: imageUrl, provider: provider.name };
      } catch (error) {
        console.error(`❌ Erro ao gerar imagem com ${provider.name}:`, error);
        continue;
      }
    }

    throw new Error('Não foi possível gerar a imagem com nenhum provedor disponível');
  }

  async generateMVPSpecs(startupId: string) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is missing");
    }

    try {
      const startup = await prisma.startup.findUnique({
        where: { id: startupId }
      });

      if (!startup) {
        throw new Error("Startup not found");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are a technical product manager creating MVP specifications." 
          },
          { 
            role: "user", 
            content: `Create MVP specifications for this startup idea: ${startup.description}` 
          },
        ],
        temperature: 0.7,
      });

      const specs = completion.choices[0].message.content;

      return {
        features: [
          'User authentication and profiles',
          'Startup idea submission form',
          'AI-powered idea validation',
          'Basic business plan generation',
          'Simple dashboard with startup metrics'
        ],
        userFlows: [
          'User registration and login',
          'Idea submission and initial validation',
          'Business plan generation and viewing',
          'Startup progress tracking'
        ],
        technologies: [
          'Frontend: React/Next.js with Tailwind CSS',
          'Backend: Node.js with Express',
          'Database: PostgreSQL with Prisma ORM',
          'AI Integration: OpenAI API',
          'Authentication: JWT'
        ],
        designNotes: specs || 'Focus on clean, professional design with intuitive user interface.',
        mockupUrl: 'https://www.figma.com/file/example-mockup-link'
      };
    } catch (error) {
      console.error('Error generating MVP specs:', error);
      throw error;
    }
  }

  async generateMarketAnalysis(startupId: string) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is missing");
    }

    try {
      const startup = await prisma.startup.findUnique({
        where: { id: startupId }
      });

      if (!startup) {
        throw new Error("Startup not found");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are a market research analyst providing detailed market analysis." 
          },
          { 
            role: "user", 
            content: `Provide market analysis for this startup: ${startup.description}` 
          },
        ],
        temperature: 0.7,
      });

      const analysis = completion.choices[0].message.content;

      return {
        marketSize: '$50B by 2025',
        growthRate: '15% YoY',
        competitors: [
          'Competitor A',
          'Competitor B',
          'Competitor C'
        ],
        trends: [
          'AI Integration',
          'Remote Work',
          'Digital Transformation'
        ],
        opportunities: [
          'Untapped SME market',
          'International expansion',
          'API integrations'
        ],
        threats: [
          'New market entrants',
          'Regulatory changes',
          'Economic uncertainty'
        ],
        aiAnalysis: analysis
      };
    } catch (error) {
      console.error('Error generating market analysis:', error);
      throw error;
    }
  }

  private calculateIdeaScore(feedback: string): number {
    const positiveIndicators = ['innovative', 'potential', 'market opportunity', 'scalable', 'viable', 'promising'];
    let score = 50;

    positiveIndicators.forEach(indicator => {
      if (feedback.toLowerCase().includes(indicator)) {
        score += 8;
      }
    });

    return Math.min(score, 100);
  }
}