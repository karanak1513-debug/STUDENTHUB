import { Router } from 'express';
import { goalsController } from '../controllers/goalsController.js';

const router = Router();

router.get('/milestones', goalsController.getMilestones);
router.post('/milestones', goalsController.createMilestone);
router.put('/milestones/:id', goalsController.updateMilestone);
router.patch('/milestones/:id', goalsController.updateMilestone);
router.delete('/milestones/:id', goalsController.deleteMilestone);

router.get('/badges', goalsController.getBadges);

export default router;
