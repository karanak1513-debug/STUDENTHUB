import { db } from '../data/db.js';

export const dashboardController = {
  getProfile: (req, res, next) => {
    try {
      const all = db.getAll();
      res.json({ success: true, data: all.profile });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updated = await db.updateProfile(req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  getStats: (req, res, next) => {
    try {
      const all = db.getAll();
      const tasks = all.tasks || [];
      const assignments = all.assignments || [];
      const habits = all.habits || [];
      const profile = all.profile || {};
      const timetable = all.timetable || {};

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.completed).length;
      const pendingTasks = totalTasks - completedTasks;
      const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === 'high').length;

      const pendingAssignments = assignments.filter((a) => a.status === 'pending').length;
      const submittedAssignments = assignments.filter((a) => a.status === 'submitted').length;

      const completedHabits = habits.filter((h) => h.completed).length;
      const habitProgressPercent = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

      // Determine current day of week (Mon-Fri default fallback to Mon)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayDay = dayNames[new Date().getDay()];
      const todayClasses = timetable[todayDay] || timetable['Mon'] || [];

      res.json({
        success: true,
        data: {
          profile,
          metrics: {
            totalTasks,
            completedTasks,
            pendingTasks,
            taskProgressPercent,
            highPriorityTasks,
            pendingAssignments,
            submittedAssignments,
            completedHabits,
            totalHabits: habits.length,
            habitProgressPercent,
            studyHoursToday: profile.studyHoursToday || 4.5,
            streakDays: profile.streakDays || 14,
            gpa: profile.gpa || '3.84',
            attendanceRate: profile.attendanceRate || 96,
          },
          todayClasses,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
