import { db } from '../data/db.js';

export const timetableController = {
  getTimetable: (req, res, next) => {
    try {
      const timetable = db.get('timetable') || {};
      const { day } = req.query;

      if (day) {
        const classes = timetable[day] || [];
        return res.json({
          success: true,
          day,
          count: classes.length,
          data: classes,
        });
      }

      res.json({
        success: true,
        data: timetable,
      });
    } catch (err) {
      next(err);
    }
  },

  addClass: async (req, res, next) => {
    try {
      const { day, code, name, time, room, instructor, color } = req.body;
      if (!day || !code || !name || !time) {
        return res.status(400).json({
          success: false,
          message: 'Day, code, name, and time are required',
        });
      }

      const timetable = db.get('timetable') || {};
      const dayList = timetable[day] ? [...timetable[day]] : [];

      const nextId =
        Object.values(timetable)
          .flat()
          .reduce((max, item) => Math.max(max, typeof item.id === 'number' ? item.id : 0), 0) + 1;

      const newClass = {
        id: nextId,
        code: code.trim(),
        name: name.trim(),
        time: time.trim(),
        room: room || 'Main Hall',
        instructor: instructor || 'Staff',
        color:
          color ||
          'border-l-4 border-primary bg-primary/10 text-primary dark:text-primary-fixed',
      };

      dayList.push(newClass);
      await db.updateTimetableDay(day, dayList);

      res.status(201).json({
        success: true,
        message: 'Class session added successfully',
        data: newClass,
      });
    } catch (err) {
      next(err);
    }
  },

  updateClass: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { day, id: _id, ...updates } = req.body;
      const timetable = db.get('timetable') || {};

      let found = false;
      let updatedItem = null;

      for (const [d, list] of Object.entries(timetable)) {
        const index = list.findIndex((c) => String(c.id) === String(id));
        if (index !== -1) {
          found = true;
          list[index] = { ...list[index], ...updates };
          updatedItem = list[index];
          await db.updateTimetableDay(d, list);
          break;
        }
      }

      if (!found) {
        return res.status(404).json({ success: false, message: 'Class session not found' });
      }

      res.json({
        success: true,
        message: 'Class session updated successfully',
        data: updatedItem,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteClass: async (req, res, next) => {
    try {
      const { id } = req.params;
      const timetable = db.get('timetable') || {};

      let removed = null;
      for (const [d, list] of Object.entries(timetable)) {
        const index = list.findIndex((c) => String(c.id) === String(id));
        if (index !== -1) {
          removed = list.splice(index, 1)[0];
          await db.updateTimetableDay(d, list);
          break;
        }
      }

      if (!removed) {
        return res.status(404).json({ success: false, message: 'Class session not found' });
      }

      res.json({
        success: true,
        message: 'Class session removed',
        data: removed,
      });
    } catch (err) {
      next(err);
    }
  },
};
