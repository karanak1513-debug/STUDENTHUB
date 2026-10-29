import { db } from '../data/db.js';

export const tasksController = {
  getTasks: (req, res, next) => {
    try {
      const { priority, completed, search, tag } = req.query;
      let tasks = db.get('tasks');

      if (priority) {
        tasks = tasks.filter((t) => t.priority?.toLowerCase() === priority.toLowerCase());
      }
      if (typeof completed !== 'undefined') {
        const isCompleted = completed === 'true' || completed === '1';
        tasks = tasks.filter((t) => Boolean(t.completed) === isCompleted);
      }
      if (tag) {
        tasks = tasks.filter((t) => t.tag?.toLowerCase() === tag.toLowerCase());
      }
      if (search) {
        const query = search.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title?.toLowerCase().includes(query) ||
            t.subject?.toLowerCase().includes(query) ||
            t.tag?.toLowerCase().includes(query)
        );
      }

      res.json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },

  getTaskById: (req, res, next) => {
    try {
      const task = db.findById('tasks', req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  createTask: async (req, res, next) => {
    try {
      const { title, subject, due, priority, tag } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Task title is required' });
      }

      const newTask = await db.insert('tasks', {
        title: title.trim(),
        subject: subject || 'General',
        due: due || 'Today',
        priority: priority || 'medium',
        completed: false,
        tag: tag || 'Task',
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask,
      });
    } catch (err) {
      next(err);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const { id: _id, ...safeUpdates } = req.body;
      const updated = await db.update('tasks', req.params.id, safeUpdates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({
        success: true,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  toggleTask: async (req, res, next) => {
    try {
      const task = db.findById('tasks', req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const updated = await db.update('tasks', req.params.id, {
        completed: !task.completed,
      });

      res.json({
        success: true,
        message: `Task marked as ${updated.completed ? 'completed' : 'pending'}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const removed = await db.delete('tasks', req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({
        success: true,
        message: 'Task deleted successfully',
        data: removed,
      });
    } catch (err) {
      next(err);
    }
  },
};
