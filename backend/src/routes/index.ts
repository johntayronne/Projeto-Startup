import { Router } from 'express';
import userRoutes from './user.routes';
import startupRoutes from './startup.routes';
import subscriptionRoutes from './subscription.routes';
import aiRoutes from './ai.routes';
import mvpRoutes from './mvp.routes';
import testRoutes from './test.routes';

const router = Router();

// Rotas públicas
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
router.use('/users', userRoutes);
router.use('/startups', startupRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/ai', aiRoutes);
router.use('/mvp', mvpRoutes);
router.use('/test', testRoutes);

export default router;
