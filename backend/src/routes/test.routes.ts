import { Router } from 'express';
import { TestController } from '../controllers/test.controller';

const router = Router();
const testController = new TestController();

router.post('/ai-providers', testController.testAIProviders);

export default router; 