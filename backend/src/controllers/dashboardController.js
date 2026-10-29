import { realtimeDb, queryGet, queryAll } from '../data/sqliteDb.js';

export const dashboardController = {
  getProfile: async (req, res, next) => {
    try {
      const profile = await realtimeDb.getProfile();
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updated = await realtimeDb.updateProfile(req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  getStats: async (req, res, next) => {
    try {
      const tasks = await realtimeDb.getTasks();
      const assignments = await realtimeDb.getAssignments();
      const habits = await realtimeDb.getHabits();
      const profile = await realtimeDb.getProfile();
      const timetable = await realtimeDb.getTimetable();

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.completed).length;
      const pendingTasks = totalTasks - completedTasks;
      const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === 'high').length;

      const pendingAssignments = assignments.filter((a) => a.status === 'pending').length;
      const submittedAssignments = assignments.filter((a) => a.status === 'submitted').length;

      const completedHabits = habits.filter((h) => h.completed).length;
      const habitProgressPercent = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

      // Authentic focus hours calculation from focus_sessions table
      const focusRow = await queryGet(
        "SELECT COALESCE(SUM(duration_minutes), 0) as totalMins, COUNT(*) as sessionsCount FROM focus_sessions WHERE DATE(completed_at) = DATE('now');"
      );
      const todayFocusMins = focusRow?.totalMins ? Number(focusRow.totalMins) : 0;
      const studyHoursToday = Math.round((todayFocusMins / 60) * 10) / 10;
      const todaySessionsCount = focusRow?.sessionsCount ? Number(focusRow.sessionsCount) : 0;

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
            todayFocusMinutes: todayFocusMins,
            studyHoursToday,
            todaySessionsCount,
            streakDays: profile.streakDays || 0,
            gpa: profile.gpa || '0.00',
            targetGpa: profile.targetGpa || '4.00',
            dailyGoalHours: profile.dailyGoalHours || 5.0,
          },
          todayClasses,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
