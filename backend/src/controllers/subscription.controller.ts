import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

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

      const user = req.user; // Certifique-se que o tipo 'user' está corretamente populado pelo seu middleware de autenticação
      if (!user) {
        return res.status(401).json({ error: "Usuário não autenticado!" });
      }

      // Iniciar transação no banco de dados
      const transaction = await prisma.$transaction(async (prisma) => {
        let stripeCustomer = await prisma.user.findUnique({
          where: { id: user.id },
          select: { stripeCustomerId: true },
        });

        if (!stripeCustomer?.stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id },
          });

          stripeCustomer = { stripeCustomerId: customer.id };
        }

        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomer.stripeCustomerId,
          items: [{ price: priceId }],
          expand: ["latest_invoice.payment_intent"],
        });

        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
          },
        });

        return subscription; // Retornando a assinatura para uso posterior
      });

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
