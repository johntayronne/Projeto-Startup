const { Router } = require('express');
const { StartupController } = require('../controllers/startup.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = Router();
const startupController = new StartupController();

router.use(authMiddleware);

router.post('/', startupController.create.bind(startupController));
router.get('/', startupController.list.bind(startupController));
router.get('/:id', startupController.getById.bind(startupController));
router.put('/:id', startupController.update.bind(startupController));
router.delete('/:id', startupController.delete.bind(startupController));

module.exports = router;