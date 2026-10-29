import { realtimeDb } from '../data/sqliteDb.js';

export const notificationsController = {
  getNotifications: async (req, res, next) => {
    try {
      const items = await realtimeDb.getNotifications();
      const unreadCount = items.filter((n) => !n.read).length;
      res.json({
        success: true,
        unreadCount,
        count: items.length,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  },

  createNotification: async (req, res, next) => {
    try {
      const { title, message, desc, type, category, dueDate } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Notification title is required' });
      }

      const created = await realtimeDb.createNotification({
        title,
        message: message || desc || '',
        type: type || 'blue',
        category: category || 'general',
        dueDate: dueDate || null,
      });

      res.status(201).json({
        success: true,
        message: 'Notification created',
        data: created,
      });
    } catch (err) {
      next(err);
    }
  },

  markRead: async (req, res, next) => {
    try {
      const updated = await realtimeDb.markNotificationRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      await realtimeDb.markAllNotificationsRead();
      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (err) {
      next(err);
    }
  },

  deleteNotification: async (req, res, next) => {
    try {
      await realtimeDb.deleteNotification(req.params.id);
      res.json({
        success: true,
        message: 'Notification deleted',
        data: { id: req.params.id },
      });
    } catch (err) {
      next(err);
    }
  },
};
