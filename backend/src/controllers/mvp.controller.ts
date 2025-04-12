import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { SubscriptionService } from '../services/subscription.service';

const prisma = new PrismaClient();
const aiService = new AIService();
const subscriptionService = new SubscriptionService();

export class MVPController {
  // Geração do MVP
  async generateMVP(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se o usuário tem acesso à assinatura Business ou superior
      const hasAccess = await subscriptionService.validateSubscriptionAccess(
        req.user.id,
        'BUSINESS'
      );

      if (!hasAccess) {
        return res.status(403).json({
          error: 'A geração do MVP exige uma assinatura BUSINESS ou superior.',
        });
      }

      // Verifica se a startup existe e pertence ao usuário autenticado
      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup não encontrada' });
      }

      // Gera os detalhes do MVP usando o serviço de IA
      const mvpData = await aiService.generateMVPSpecs(id);

      // Retorna os dados do MVP gerado (simulação de um MVP real)
      return res.json({
        features: [
          'Autenticação de usuário e perfis',
          'Formulário de submissão de ideia de startup',
          'Validação de ideia utilizando IA',
          'Geração de plano de negócios básico',
          'Dashboard simples com métricas da startup',
        ],
        userFlows: [
          'Registro de usuário e login',
          'Submissão de ideia e validação inicial',
          'Geração e visualização do plano de negócios',
          'Acompanhamento do progresso da startup',
        ],
        technologies: [
          'Frontend: React/Next.js com Tailwind CSS',
          'Backend: Node.js com Express',
          'Banco de dados: PostgreSQL com Prisma ORM',
          'Integração com IA: OpenAI API',
          'Autenticação: JWT',
        ],
        designNotes:
          'O MVP deve focar em um design limpo e profissional, com uma interface intuitiva. Utilize uma paleta de cores moderna, com tons principais de índigo e branco, e toques de verde para estados de sucesso. O layout deve ser responsivo e amigável para dispositivos móveis.',
        mockupUrl: 'https://www.figma.com/file/example-mockup-link',
      });
    } catch (error) {
      console.error('Erro ao gerar MVP:', error);
      return res.status(500).json({ error: 'Falha ao gerar MVP' });
    }
  }

  // Obter MVP existente
  async getMVP(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se a startup existe e pertence ao usuário
      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup não encontrada' });
      }

      // Se o status da startup for MVP ou LAUNCHED, retorna o MVP
      if (startup.status === 'MVP' || startup.status === 'LAUNCHED') {
        return res.json({
          features: [
            'Autenticação de usuário e perfis',
            'Formulário de submissão de ideia de startup',
            'Validação de ideia utilizando IA',
            'Geração de plano de negócios básico',
            'Dashboard simples com métricas da startup',
          ],
          userFlows: [
            'Registro de usuário e login',
            'Submissão de ideia e validação inicial',
            'Geração e visualização do plano de negócios',
            'Acompanhamento do progresso da startup',
          ],
          technologies: [
            'Frontend: React/Next.js com Tailwind CSS',
            'Backend: Node.js com Express',
            'Banco de dados: PostgreSQL com Prisma ORM',
            'Integração com IA: OpenAI API',
            'Autenticação: JWT',
          ],
          designNotes:
            'O MVP deve focar em um design limpo e profissional, com uma interface intuitiva. Utilize uma paleta de cores moderna, com tons principais de índigo e branco, e toques de verde para estados de sucesso. O layout deve ser responsivo e amigável para dispositivos móveis.',
          mockupUrl: 'https://www.figma.com/file/example-mockup-link',
        });
      }

      return res.status(404).json({ error: 'MVP não encontrado para esta startup' });
    } catch (error) {
      console.error('Erro ao buscar MVP:', error);
      return res.status(500).json({ error: 'Falha ao buscar MVP' });
    }
  }

  // Aprovação do MVP
  async approveMVP(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se a startup existe e pertence ao usuário
      const startup = await prisma.startup.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!startup) {
        return res.status(404).json({ error: 'Startup não encontrada' });
      }

      // Atualiza o status da startup para MVP
      const updatedStartup = await prisma.startup.update({
        where: { id },
        data: { status: 'MVP' },
      });

      return res.json(updatedStartup);
    } catch (error) {
      console.error('Erro ao aprovar MVP:', error);
      return res.status(500).json({ error: 'Falha ao aprovar MVP' });
    }
  }
}
