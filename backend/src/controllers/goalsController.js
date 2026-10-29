import { db } from '../data/db.js';

export const goalsController = {
  getMilestones: (req, res, next) => {
    try {
      const milestones = db.get('milestones');
      res.json({ success: true, count: milestones.length, data: milestones });
    } catch (err) {
      next(err);
    }
  },

  createMilestone: async (req, res, next) => {
    try {
      const { tag, title, progress, percent, due, color } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Milestone title is required' });
      }

      const newMilestone = await db.insert('milestones', {
        tag: tag || 'General',
        title: title.trim(),
        progress: progress || '0%',
        percent: Number(percent) || 0,
        due: due || 'Upcoming',
        color: color || 'bg-primary text-primary',
      });

      res.status(201).json({
        success: true,
        message: 'Milestone created successfully',
        data: newMilestone,
      });
    } catch (err) {
      next(err);
    }
  },

  updateMilestone: async (req, res, next) => {
    try {
      const { id: _id, ...safeUpdates } = req.body;
      const updated = await db.update('milestones', req.params.id, safeUpdates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Milestone not found' });
      }
      res.json({
        success: true,
        message: 'Milestone updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteMilestone: async (req, res, next) => {
    try {
      const removed = await db.delete('milestones', req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Milestone not found' });
      }
      res.json({
        success: true,
        message: 'Milestone deleted successfully',
        data: removed,
      });
    } catch (err) {
      next(err);
    }
  },

  getBadges: (req, res, next) => {
    try {
      const badges = db.get('badges');
      res.json({ success: true, count: badges.length, data: badges });
    } catch (err) {
      next(err);
    }
  },
};
