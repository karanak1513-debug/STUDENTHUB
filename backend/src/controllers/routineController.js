import { db } from '../data/db.js';

export const routineController = {
  getHabits: (req, res, next) => {
    try {
      const habits = db.get('habits');
      res.json({ success: true, count: habits.length, data: habits });
    } catch (err) {
      next(err);
    }
  },

  createHabit: async (req, res, next) => {
    try {
      const { title, time, category } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Habit title is required' });
      }

      const newHabit = await db.insert('habits', {
        title: title.trim(),
        time: time || '08:00 AM',
        category: category || 'General',
        completed: false,
      });

      res.status(201).json({
        success: true,
        message: 'Habit added successfully',
        data: newHabit,
      });
    } catch (err) {
      next(err);
    }
  },

  toggleHabit: async (req, res, next) => {
    try {
      const habit = db.findById('habits', req.params.id);
      if (!habit) {
        return res.status(404).json({ success: false, message: 'Habit not found' });
      }

      const updated = await db.update('habits', req.params.id, {
        completed: !habit.completed,
      });

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
      const removed = await db.delete('habits', req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Habit not found' });
      }
      res.json({ success: true, message: 'Habit deleted', data: removed });
    } catch (err) {
      next(err);
    }
  },

  getTimeBlocks: (req, res, next) => {
    try {
      const blocks = db.get('timeBlocks');
      res.json({ success: true, count: blocks.length, data: blocks });
    } catch (err) {
      next(err);
    }
  },

  createTimeBlock: async (req, res, next) => {
    try {
      const { time, title, type, color, icon } = req.body;
      if (!title || !time) {
        return res.status(400).json({ success: false, message: 'Time and title are required' });
      }

      const newBlock = await db.insert('timeBlocks', {
        time: time.trim(),
        title: title.trim(),
        type: type || 'Study Session',
        color: color || 'border-primary bg-primary/10 text-primary dark:text-primary-fixed',
        icon: icon || 'schedule',
      });

      res.status(201).json({
        success: true,
        message: 'Time block created successfully',
        data: newBlock,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTimeBlock: async (req, res, next) => {
    try {
      const removed = await db.delete('timeBlocks', req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Time block not found' });
      }
      res.json({ success: true, message: 'Time block deleted', data: removed });
    } catch (err) {
      next(err);
    }
  },

  logFocusSession: async (req, res, next) => {
    try {
      const { durationMinutes, subject } = req.body;
      const session = await db.insert('focusSessions', {
        durationMinutes: Number(durationMinutes) || 25,
        subject: subject || 'General Focus',
        completedAt: new Date().toISOString(),
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

  getFocusSessions: (req, res, next) => {
    try {
      const sessions = db.get('focusSessions');
      res.json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
      next(err);
    }
  },
};
