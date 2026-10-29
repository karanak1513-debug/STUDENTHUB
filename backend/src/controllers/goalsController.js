import { realtimeDb, queryGet, queryRun } from '../data/sqliteDb.js';

export const goalsController = {
  getMilestones: async (req, res, next) => {
    try {
      const milestones = await realtimeDb.getMilestones();
      res.json({ success: true, count: milestones.length, data: milestones });
    } catch (err) {
      next(err);
    }
  },

  createMilestone: async (req, res, next) => {
    try {
      const { tag, title, progress, percent, due } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Milestone title is required' });
      }

      const newMilestone = await realtimeDb.createMilestone({
        tag: tag || 'General',
        title: title.trim(),
        progress: progress || `${percent || 0}%`,
        percent: Number(percent) || 0,
        due: due || 'Upcoming',
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
      const updated = await realtimeDb.updateMilestone(req.params.id, safeUpdates);
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
      const removed = await realtimeDb.deleteMilestone(req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Milestone not found' });
      }
      res.json({
        success: true,
        message: 'Milestone deleted successfully',
        data: { id: req.params.id },
      });
    } catch (err) {
      next(err);
    }
  },

  getBadges: async (req, res, next) => {
    try {
      const badges = await realtimeDb.getBadges();
      res.json({ success: true, count: badges.length, data: badges });
    } catch (err) {
      next(err);
    }
  },
};
