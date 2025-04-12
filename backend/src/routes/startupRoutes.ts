import { Router } from 'express';
import { StartupController } from '../controllers/startupController';
import { validate } from '../middleware/validator';
import { startupSchema, paginationSchema, searchFiltersSchema } from '../validations/schemas';
import { apiLimiter, mutationLimiter, queryLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new StartupController();

// Rotas públicas
router.get(
  '/',
  apiLimiter,
  queryLimiter,
  validate(paginationSchema),
  validate(searchFiltersSchema),
  controller.list.bind(controller)
);

router.get(
  '/:id',
  apiLimiter,
  queryLimiter,
  controller.getById.bind(controller)
);

// Rotas protegidas
router.use(authMiddleware);

router.post(
  '/',
  apiLimiter,
  mutationLimiter,
  validate(startupSchema),
  controller.create.bind(controller)
);

router.put(
  '/:id',
  apiLimiter,
  mutationLimiter,
  validate(startupSchema),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  apiLimiter,
  mutationLimiter,
  controller.delete.bind(controller)
);

export default router; 