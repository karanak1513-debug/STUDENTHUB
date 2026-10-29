import { Router } from 'express';
import { timetableController } from '../controllers/timetableController.js';

const router = Router();

router.get('/', timetableController.getTimetable);
router.post('/', timetableController.addClass);
router.put('/:id', timetableController.updateClass);
router.delete('/:id', timetableController.deleteClass);

export default router;
