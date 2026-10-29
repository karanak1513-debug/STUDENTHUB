import { realtimeDb, queryGet, queryRun } from '../data/sqliteDb.js';

export const assignmentsController = {
  getAssignments: async (req, res, next) => {
    try {
      const { status, course, search } = req.query;
      let items = await realtimeDb.getAssignments();

      if (status) {
        items = items.filter((a) => a.status?.toLowerCase() === status.toLowerCase());
      }
      if (course) {
        items = items.filter((a) => a.course?.toLowerCase() === course.toLowerCase());
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(
          (a) =>
            a.title?.toLowerCase().includes(query) ||
            a.course?.toLowerCase().includes(query) ||
            a.instructor?.toLowerCase().includes(query)
        );
      }

      res.json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  },

  getAssignmentById: async (req, res, next) => {
    try {
      const assignment = await queryGet('SELECT * FROM assignments WHERE id = ?;', [req.params.id]);
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      res.json({ success: true, data: { ...assignment, urgent: Boolean(assignment.urgent) } });
    } catch (err) {
      next(err);
    }
  },

  createAssignment: async (req, res, next) => {
    try {
      const { title, course, instructor, due, weight, progress, status, urgent } = req.body;
      if (!title || !course) {
        return res.status(400).json({
          success: false,
          message: 'Title and course are required fields',
        });
      }

      const newAssignment = await realtimeDb.createAssignment({
        title: title.trim(),
        course: course.trim(),
        instructor: instructor || 'Faculty Staff',
        due: due || 'Upcoming',
        weight: weight || '15%',
        progress: Number(progress) || 0,
        status: status || 'pending',
        urgent: Boolean(urgent),
      });

      res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        data: newAssignment,
      });
    } catch (err) {
      next(err);
    }
  },

  updateAssignment: async (req, res, next) => {
    try {
      const existing = await queryGet('SELECT * FROM assignments WHERE id = ?;', [req.params.id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      const { title, course, instructor, due, weight, progress, status, urgent } = req.body;
      await queryRun(
        `UPDATE assignments SET title = COALESCE(?, title), course = COALESCE(?, course), instructor = COALESCE(?, instructor),
         due = COALESCE(?, due), weight = COALESCE(?, weight), progress = COALESCE(?, progress),
         status = COALESCE(?, status), urgent = COALESCE(?, urgent) WHERE id = ?;`,
        [
          title,
          course,
          instructor,
          due,
          weight,
          progress !== undefined ? Number(progress) : null,
          status,
          urgent !== undefined ? (urgent ? 1 : 0) : null,
          req.params.id,
        ]
      );

      const updated = await queryGet('SELECT * FROM assignments WHERE id = ?;', [req.params.id]);
      res.json({
        success: true,
        message: 'Assignment updated successfully',
        data: { ...updated, urgent: Boolean(updated.urgent) },
      });
    } catch (err) {
      next(err);
    }
  },

  submitAssignment: async (req, res, next) => {
    try {
      const updated = await realtimeDb.submitAssignment(req.params.id, req.body.notes);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      res.json({
        success: true,
        message: 'Assignment successfully marked as submitted!',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAssignment: async (req, res, next) => {
    try {
      const existing = await queryGet('SELECT * FROM assignments WHERE id = ?;', [req.params.id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      await queryRun('DELETE FROM assignments WHERE id = ?;', [req.params.id]);
      res.json({
        success: true,
        message: 'Assignment removed successfully',
        data: { id: req.params.id },
      });
    } catch (err) {
      next(err);
    }
  },
};
