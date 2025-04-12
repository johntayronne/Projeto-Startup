// controllers/subscription.controller.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { SubscriptionPlan } from '../types/subscription';

dotenv.config();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export class SubscriptionController {
  async createSubscription(req: Request, res: Response) {
    const { priceId, paymentMethodId } = req.body;
    
    try {
      // Validação dos dados
      if (!priceId || !paymentMethodId) {
        return res.status(400).json({ error: "Price ID e Payment Method ID são obrigatórios." });
      }

      // Usuário autenticado (garante que req.user existe)
      const user = req.user; // Certifique-se que o tipo 'user' está corretamente populado pelo seu middleware de autenticação

      if (!user) {
        return res.status(401).json({ error: "Usuário não autenticado!" });
      }

      // Iniciar transação no banco de dados
      const transaction = await prisma.$transaction(async (prisma) => {
        // Verificando se o cliente existe no Stripe, se não, criando um novo
        let stripeCustomer = await prisma.user.findUnique({
          where: { id: user.id },
          select: { stripeCustomerId: true },
        });

        if (!stripeCustomer?.stripeCustomerId) {
          // Criando um cliente no Stripe
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId },
          });

          // Atualizando o usuário no banco de dados com o ID do cliente Stripe
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id },
          });

          stripeCustomer = { stripeCustomerId: customer.id };
        }

        // Criando a assinatura no Stripe
        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomer.stripeCustomerId,
          items: [{ price: priceId }],
          expand: ["latest_invoice.payment_intent"],
        });

        // Salvando a assinatura no banco de dados
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
          },
        });

        return subscription;
      });

      // Respondendo com os dados da assinatura criada
      return res.json({
        subscription: {
          id: transaction.id,
          status: transaction.status,
          latestInvoice: transaction.latest_invoice,
        },
      });
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
      return res.status(500).json({ error: "Erro ao criar assinatura" });
    }
  }
}

export class SubscriptionService {
  private readonly PLAN_PRICES = {
    [SubscriptionPlan.FREE]: process.env.STRIPE_PLAN_FREE,
    [SubscriptionPlan.STARTER]: process.env.STRIPE_PLAN_STARTER,
    [SubscriptionPlan.PRO]: process.env.STRIPE_PLAN_PRO,
    [SubscriptionPlan.ENTERPRISE]: process.env.STRIPE_PLAN_ENTERPRISE
  };

  async createCheckoutSession(userId: string, plan: SubscriptionPlan) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const priceId = this.PLAN_PRICES[plan];
    if (!priceId) throw new Error('Plano não encontrado');

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan: plan
      }
    });

    return session;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.activateSubscription(
          session.metadata?.userId || '',
          session.metadata?.plan as SubscriptionPlan,
          session.subscription as string
        );
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.cancelSubscription(subscription.metadata?.userId || '');
        break;
      }
    }
  }

  private async activateSubscription(userId: string, plan: SubscriptionPlan, stripeSubscriptionId: string) {
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        stripeSubscriptionId,
        status: 'ACTIVE'
      },
      update: {
        plan,
        stripeSubscriptionId,
        status: 'ACTIVE'
      }
    });
  }

  private async cancelSubscription(userId: string) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date()
      }
    });
  }

  async validateSubscriptionAccess(userId: string, requiredPlan: SubscriptionPlan): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return false;
    }

    const planLevels = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.STARTER]: 1,
      [SubscriptionPlan.PRO]: 2,
      [SubscriptionPlan.ENTERPRISE]: 3
    };

    return planLevels[subscription.plan] >= planLevels[requiredPlan];
  }

  async getUserSubscription(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId }
    });
  }

  async cancelUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) throw new Error('Assinatura não encontrada');

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    await this.cancelSubscription(userId);
  }
}
