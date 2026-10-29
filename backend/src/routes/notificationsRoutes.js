import { Router } from 'express';
import { notificationsController } from '../controllers/notificationsController.js';

const router = Router();

router.get('/', notificationsController.getNotifications);
router.post('/', notificationsController.createNotification);
router.post('/mark-all-read', notificationsController.markAllRead);
router.patch('/:id/read', notificationsController.markRead);
router.delete('/:id', notificationsController.deleteNotification);

export default router;
