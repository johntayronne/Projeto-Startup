import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { MVPController } from "../controllers/mvp.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const aiController = new AIController();
const mvpController = new MVPController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// AI validation routes
router.post("/validate-idea", aiController.validateIdea);

// MVP routes
router.post("/mvp/:id", mvpController.generateMVP);
router.get("/mvp/:id", mvpController.getMVP);

// Market analysis route
router.post("/market-analysis/:id", aiController.generateMarketAnalysis);

// Image generation route
router.post("/generate-image", aiController.generateImage);

export default router;
