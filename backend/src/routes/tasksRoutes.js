import { Router } from 'express';
import { tasksController } from '../controllers/tasksController.js';

const router = Router();

router.get('/', tasksController.getTasks);
router.get('/:id', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.patch('/:id/toggle', tasksController.toggleTask);
router.delete('/:id', tasksController.deleteTask);

export default router;
