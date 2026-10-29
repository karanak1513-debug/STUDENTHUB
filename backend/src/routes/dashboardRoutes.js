import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/profile', dashboardController.getProfile);
router.put('/profile', dashboardController.updateProfile);
router.get('/stats', dashboardController.getStats);

export default router;
