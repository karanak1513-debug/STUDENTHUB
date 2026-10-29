import { Router } from 'express';
import tasksRoutes from './tasksRoutes.js';
import assignmentsRoutes from './assignmentsRoutes.js';
import routineRoutes from './routineRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import goalsRoutes from './goalsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import { sseHandler } from '../realtime/realtimeServer.js';
import { SQLITE_FILE } from '../data/sqliteDb.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'SQLite Realtime (WAL mode)',
    databaseFile: SQLITE_FILE,
    realtimeStream: '/api/realtime/stream',
    webSocketPath: '/ws',
    timestamp: new Date().toISOString(),
    service: 'Scholara Productivity Hub API',
  });
});

// Realtime SSE stream
router.get('/realtime/stream', sseHandler);
router.get('/realtime/status', (req, res) => {
  res.json({
    realtime: true,
    protocol: ['websocket', 'sse'],
    wsUrl: `ws://${req.headers.host || 'localhost:5000'}/ws`,
    sseUrl: `http://${req.headers.host || 'localhost:5000'}/api/realtime/stream`,
    database: 'SQLite 3 WAL',
  });
});

router.use('/tasks', tasksRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/routines', routineRoutes);
router.use('/timetable', timetableRoutes);
router.use('/goals', goalsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
