import { Router } from 'express';
import { assignmentsController } from '../controllers/assignmentsController.js';

const router = Router();

router.get('/', assignmentsController.getAssignments);
router.get('/:id', assignmentsController.getAssignmentById);
router.post('/', assignmentsController.createAssignment);
router.put('/:id', assignmentsController.updateAssignment);
router.patch('/:id/submit', assignmentsController.submitAssignment);
router.delete('/:id', assignmentsController.deleteAssignment);

export default router;
