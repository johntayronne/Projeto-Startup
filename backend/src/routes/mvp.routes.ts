import { Router } from 'express';
import { MVPController } from '../controllers/mvp.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const mvpController = new MVPController();

router.use(authMiddleware);

// Routes for /api/mvp/...
router.post('/startups/:id/mvp', mvpController.generateMVP);
router.get('/startups/:id/mvp', mvpController.getMVP);
router.post('/startups/:id/mvp/approve', mvpController.approveMVP);

// Routes for /api/startups/:id/mvp endpoints (for backward compatibility)
router.post('/generate/:id', mvpController.generateMVP);
router.get('/:id', mvpController.getMVP);

export default router;