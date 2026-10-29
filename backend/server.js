import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './src/config/index.js';
import { initDb } from './src/data/db.js';
import { initSqlite } from './src/data/sqliteDb.js';
import { setupRealtimeServer } from './src/realtime/realtimeServer.js';
import apiRoutes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../frontend/dist');

const app = express();

// Security Hardening
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Initialize database
initDb();

// CORS Configuration
const configuredOrigins = config.clientOrigin
  ? config.clientOrigin.split(',').map((o) => o.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || configuredOrigins.includes('*') || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Mount API routes
app.use('/api', apiRoutes);

// If frontend build exists (e.g. production unified deployment), serve it
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Root Route for API-only mode
  app.get('/', (req, res) => {
    res.json({
      name: 'Scholara Student Productivity Hub Backend API',
      version: '1.0.0',
      status: 'online',
      documentation: '/api/health',
      endpoints: {
        tasks: '/api/tasks',
        assignments: '/api/assignments',
        routines: '/api/routines',
        timetable: '/api/timetable',
        goals: '/api/goals',
        dashboard: '/api/dashboard',
      },
    });
  });
}

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize databases
initDb();
initSqlite().catch((err) => console.error('Failed to init SQLite Realtime DB:', err));

// Start Server
const server = app.listen(config.port, config.host, () => {
  setupRealtimeServer(server);
  console.log(`====================================================`);
  console.log(`🎓 Scholara Server running on port ${config.port}`);
  console.log(`📡 Host: ${config.host} | Environment: ${config.nodeEnv}`);
  console.log(`⚡ Realtime DB: SQLite3 WAL + WebSocket & SSE Stream`);
  console.log(`🚀 Health check: http://localhost:${config.port}/api/health`);
  console.log(`====================================================`);
});

// Handle graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server gracefully`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
