import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";

const router = Router();
const subscriptionController = new SubscriptionController(); // Instanciando o controlador

// Usando o método do controlador
router.post("/", subscriptionController.createSubscription.bind(subscriptionController));

export default router;
