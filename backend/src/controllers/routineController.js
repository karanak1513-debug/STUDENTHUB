import { realtimeDb, queryRun, queryGet, queryAll } from '../data/sqliteDb.js';

export const routineController = {
  getHabits: async (req, res, next) => {
    try {
      const habits = await realtimeDb.getHabits();
      res.json({ success: true, count: habits.length, data: habits });
    } catch (err) {
      next(err);
    }
  },

  createHabit: async (req, res, next) => {
    try {
      const { title, time, category, icon } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Habit title is required' });
      }

      const resInsert = await queryRun(
        `INSERT INTO habits (title, time, category, streak_days, completed, icon, created_at)
         VALUES (?, ?, ?, 0, 0, ?, ?)`,
        [title.trim(), time || '08:00 AM', category || 'General', icon || 'bolt', new Date().toISOString()]
      );

      const created = await queryGet('SELECT * FROM habits WHERE id = ?;', [resInsert.lastID]);
      res.status(201).json({
        success: true,
        message: 'Habit added successfully',
        data: { ...created, completed: Boolean(created.completed) },
      });
    } catch (err) {
      next(err);
    }
  },

  toggleHabit: async (req, res, next) => {
    try {
      const updated = await realtimeDb.toggleHabit(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Habit not found' });
      }

      res.json({
        success: true,
        message: `Habit marked as ${updated.completed ? 'completed' : 'pending'}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteHabit: async (req, res, next) => {
    try {
      const existing = await queryGet('SELECT * FROM habits WHERE id = ?;', [req.params.id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Habit not found' });
      }
      await queryRun('DELETE FROM habits WHERE id = ?;', [req.params.id]);
      res.json({ success: true, message: 'Habit deleted', data: { id: req.params.id } });
    } catch (err) {
      next(err);
    }
  },

  getTimeBlocks: async (req, res, next) => {
    try {
      const blocks = await realtimeDb.getTimeBlocks();
      res.json({ success: true, count: blocks.length, data: blocks });
    } catch (err) {
      next(err);
    }
  },

  createTimeBlock: async (req, res, next) => {
    try {
      const { time, title, type, icon } = req.body;
      if (!title || !time) {
        return res.status(400).json({ success: false, message: 'Time and title are required' });
      }

      const resInsert = await queryRun(
        `INSERT INTO time_blocks (title, time, type, icon) VALUES (?, ?, ?, ?)`,
        [title.trim(), time.trim(), type || 'Study Session', icon || 'schedule']
      );

      const created = await queryGet('SELECT * FROM time_blocks WHERE id = ?;', [resInsert.lastID]);
      res.status(201).json({
        success: true,
        message: 'Time block created successfully',
        data: created,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTimeBlock: async (req, res, next) => {
    try {
      const existing = await queryGet('SELECT * FROM time_blocks WHERE id = ?;', [req.params.id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Time block not found' });
      }
      await queryRun('DELETE FROM time_blocks WHERE id = ?;', [req.params.id]);
      res.json({ success: true, message: 'Time block deleted', data: { id: req.params.id } });
    } catch (err) {
      next(err);
    }
  },

  logFocusSession: async (req, res, next) => {
    try {
      const { durationMinutes, subject, mode } = req.body;
      const session = await realtimeDb.logFocusSession({
        durationMinutes: Number(durationMinutes) || 25,
        subject: subject || 'General Focus',
        mode: mode || 'focus',
      });

      res.status(201).json({
        success: true,
        message: 'Focus session logged successfully',
        data: session,
      });
    } catch (err) {
      next(err);
    }
  },

  getFocusSessions: async (req, res, next) => {
    try {
      const sessions = await realtimeDb.getFocusSessions();
      res.json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
      next(err);
    }
  },
};
