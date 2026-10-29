import { Router } from 'express';
import { routineController } from '../controllers/routineController.js';

const router = Router();

router.get('/habits', routineController.getHabits);
router.post('/habits', routineController.createHabit);
router.patch('/habits/:id/toggle', routineController.toggleHabit);
router.delete('/habits/:id', routineController.deleteHabit);

router.get('/timeblocks', routineController.getTimeBlocks);
router.post('/timeblocks', routineController.createTimeBlock);
router.delete('/timeblocks/:id', routineController.deleteTimeBlock);

router.get('/focus-sessions', routineController.getFocusSessions);
router.post('/focus-sessions', routineController.logFocusSession);

export default router;
