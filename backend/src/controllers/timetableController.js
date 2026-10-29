import { realtimeDb, queryGet, queryRun, queryAll } from '../data/sqliteDb.js';

export const timetableController = {
  getTimetable: async (req, res, next) => {
    try {
      const timetable = await realtimeDb.getTimetable();
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
      const { day, code, name, time, room, instructor } = req.body;
      if (!day || !code || !name || !time) {
        return res.status(400).json({
          success: false,
          message: 'Day, code, name, and time are required',
        });
      }

      const newClass = await realtimeDb.addTimetableClass({
        day,
        code: code.trim(),
        name: name.trim(),
        time: time.trim(),
        room: room || 'Main Hall',
        instructor: instructor || 'Staff',
      });

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
      const existing = await queryGet('SELECT * FROM timetable WHERE id = ?;', [id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Class session not found' });
      }

      const { day, code, name, time, room, instructor } = req.body;
      await queryRun(
        `UPDATE timetable SET day = COALESCE(?, day), code = COALESCE(?, code), name = COALESCE(?, name),
         time = COALESCE(?, time), room = COALESCE(?, room), instructor = COALESCE(?, instructor)
         WHERE id = ?;`,
        [day, code, name, time, room, instructor, id]
      );

      const updated = await queryGet('SELECT * FROM timetable WHERE id = ?;', [id]);
      res.json({
        success: true,
        message: 'Class session updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteClass: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await queryGet('SELECT * FROM timetable WHERE id = ?;', [id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Class session not found' });
      }

      await realtimeDb.deleteTimetableClass(id);
      res.json({
        success: true,
        message: 'Class session removed',
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  },
};
