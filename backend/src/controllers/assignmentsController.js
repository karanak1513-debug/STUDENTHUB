import { db } from '../data/db.js';

export const assignmentsController = {
  getAssignments: (req, res, next) => {
    try {
      const { status, course, search } = req.query;
      let items = db.get('assignments');

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

  getAssignmentById: (req, res, next) => {
    try {
      const assignment = db.findById('assignments', req.params.id);
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      res.json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  },

  createAssignment: async (req, res, next) => {
    try {
      const { title, course, instructor, due, dueHours, urgent, weight, type, description } = req.body;
      if (!title || !course) {
        return res.status(400).json({
          success: false,
          message: 'Title and course are required fields',
        });
      }

      const newAssignment = await db.insert('assignments', {
        title: title.trim(),
        course: course.trim(),
        instructor: instructor || 'Staff',
        due: due || 'Upcoming',
        dueHours: typeof dueHours === 'number' ? dueHours : 72,
        urgent: Boolean(urgent),
        progress: 0,
        status: 'pending',
        weight: weight || '15%',
        type: type || 'Individual',
        description: description || '',
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
      const { id: _id, ...safeUpdates } = req.body;
      const updated = await db.update('assignments', req.params.id, safeUpdates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      res.json({
        success: true,
        message: 'Assignment updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  submitAssignment: async (req, res, next) => {
    try {
      const item = db.findById('assignments', req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      const updated = await db.update('assignments', req.params.id, {
        status: 'submitted',
        progress: 100,
        submittedAt: new Date().toISOString(),
        submissionNotes: req.body.notes || 'Submitted via Scholara Student Hub',
      });

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
      const removed = await db.delete('assignments', req.params.id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      res.json({
        success: true,
        message: 'Assignment removed successfully',
        data: removed,
      });
    } catch (err) {
      next(err);
    }
  },
};
