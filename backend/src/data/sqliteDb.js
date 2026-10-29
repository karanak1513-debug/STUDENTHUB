import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from './seedData.js';
import { broadcast } from '../realtime/realtimeServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const SQLITE_FILE = path.join(__dirname, 'database.sqlite');

let dbInstance = null;

// Promisified SQLite wrappers
export const queryAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    dbInstance.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const queryGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    dbInstance.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

export const queryRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    dbInstance.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export function initSqlite() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const db = new sqlite3.Database(SQLITE_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
      if (err) {
        console.error('Failed to open SQLite database:', err);
        return reject(err);
      }

      dbInstance = db;
      // Enable WAL mode for high performance concurrency
      db.run('PRAGMA journal_mode = WAL;');
      db.run('PRAGMA synchronous = NORMAL;');

      try {
        await createSchema();
        await seedIfEmpty();
        console.log(`📦 SQLite Realtime Database mounted at: ${SQLITE_FILE}`);
        resolve(dbInstance);
      } catch (schemaErr) {
        console.error('Failed to setup SQLite schema:', schemaErr);
        reject(schemaErr);
      }
    });
  });
}

async function createSchema() {
  await queryRun(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT,
      due TEXT,
      priority TEXT DEFAULT 'medium',
      completed INTEGER DEFAULT 0,
      tag TEXT DEFAULT 'General',
      created_at TEXT,
      updated_at TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      course TEXT,
      instructor TEXT,
      due TEXT,
      weight TEXT,
      progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      urgent INTEGER DEFAULT 0,
      created_at TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      time TEXT,
      category TEXT,
      streak_days INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      icon TEXT,
      created_at TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS time_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      time TEXT,
      type TEXT,
      icon TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      time TEXT,
      room TEXT,
      instructor TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      tag TEXT,
      due TEXT,
      progress TEXT DEFAULT '0%',
      percent INTEGER DEFAULT 0
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT,
      icon TEXT,
      unlocked INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS journal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      hours TEXT,
      rating TEXT,
      rating_stars INTEGER,
      breakthroughs TEXT,
      blockers TEXT,
      tomorrow_priority TEXT,
      created_at TEXT
    );
  `);

  await queryRun(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT,
      program TEXT,
      role TEXT,
      university TEXT,
      avatar TEXT,
      gpa TEXT,
      target_gpa TEXT,
      streak_days INTEGER,
      daily_goal_hours REAL
    );
  `);
}

async function seedIfEmpty() {
  const taskCount = await queryGet('SELECT COUNT(*) as cnt FROM tasks;');
  if (taskCount && taskCount.cnt === 0) {
    console.log('🌱 Seeding SQLite database with initial academic dataset...');

    // Seed Tasks
    for (const t of initialSeedData.tasks || []) {
      await queryRun(
        `INSERT INTO tasks (title, subject, due, priority, completed, tag, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [t.title, t.subject, t.due, t.priority, t.completed ? 1 : 0, t.tag || 'General', new Date().toISOString()]
      );
    }

    // Seed Assignments
    for (const a of initialSeedData.assignments || []) {
      await queryRun(
        `INSERT INTO assignments (title, course, instructor, due, weight, progress, status, urgent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.title, a.course, a.instructor, a.due, a.weight, a.progress || 0, a.status || 'pending', a.urgent ? 1 : 0, new Date().toISOString()]
      );
    }

    // Seed Habits
    for (const h of initialSeedData.habits || []) {
      await queryRun(
        `INSERT INTO habits (title, time, category, streak_days, completed, icon, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [h.title, h.time, h.category, h.streakDays || 0, h.completed ? 1 : 0, h.icon || 'bolt', new Date().toISOString()]
      );
    }

    // Seed Time Blocks
    for (const b of initialSeedData.timeBlocks || []) {
      await queryRun(
        `INSERT INTO time_blocks (title, time, type, icon) VALUES (?, ?, ?, ?)`,
        [b.title, b.time, b.type, b.icon || 'schedule']
      );
    }

    // Seed Timetable
    if (initialSeedData.timetable) {
      for (const [day, classes] of Object.entries(initialSeedData.timetable)) {
        for (const c of classes) {
          await queryRun(
            `INSERT INTO timetable (day, code, name, time, room, instructor) VALUES (?, ?, ?, ?, ?, ?)`,
            [day, c.code, c.name, c.time, c.room, c.instructor]
          );
        }
      }
    }

    // Seed Milestones
    for (const m of initialSeedData.milestones || []) {
      await queryRun(
        `INSERT INTO milestones (title, tag, due, progress, percent) VALUES (?, ?, ?, ?, ?)`,
        [m.title, m.tag, m.due, m.progress || '0%', m.percent || 0]
      );
    }

    // Seed Badges
    for (const b of initialSeedData.badges || []) {
      await queryRun(
        `INSERT INTO badges (name, desc, icon, unlocked, is_new) VALUES (?, ?, ?, ?, ?)`,
        [b.name, b.desc, b.icon, b.unlocked ? 1 : 0, b.isNew ? 1 : 0]
      );
    }

    // Seed Profile
    const p = initialSeedData.profile || {};
    await queryRun(
      `INSERT OR REPLACE INTO profile (id, name, program, role, university, avatar, gpa, target_gpa, streak_days, daily_goal_hours)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.name || 'Sarah Jenkins',
        p.program || 'BBA 3rd Semester',
        p.role || 'UG Scholar',
        p.university || 'Stanford University',
        p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        p.gpa || '3.88',
        p.targetGpa || '4.00',
        p.streakDays || 14,
        p.dailyGoalHours || 5.0,
      ]
    );
  }
}

// Universal unified database interface with Realtime Broadcasting
export const realtimeDb = {
  async getTasks() {
    const rows = await queryAll('SELECT * FROM tasks ORDER BY id DESC;');
    return rows.map((r) => ({
      ...r,
      completed: Boolean(r.completed),
    }));
  },

  async createTask(item) {
    const res = await queryRun(
      `INSERT INTO tasks (title, subject, due, priority, completed, tag, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.title,
        item.subject || 'CS501',
        item.due || 'Today',
        item.priority || 'medium',
        item.completed ? 1 : 0,
        item.tag || 'General',
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    const created = await queryGet('SELECT * FROM tasks WHERE id = ?;', [res.lastID]);
    const formatted = { ...created, completed: Boolean(created.completed) };
    broadcast('TASK_CREATED', formatted);
    return formatted;
  },

  async updateTask(id, updates) {
    const existing = await queryGet('SELECT * FROM tasks WHERE id = ?;', [id]);
    if (!existing) return null;

    const completed = updates.completed !== undefined ? (updates.completed ? 1 : 0) : existing.completed;
    const title = updates.title !== undefined ? updates.title : existing.title;
    const priority = updates.priority !== undefined ? updates.priority : existing.priority;
    const subject = updates.subject !== undefined ? updates.subject : existing.subject;
    const due = updates.due !== undefined ? updates.due : existing.due;
    const tag = updates.tag !== undefined ? updates.tag : existing.tag;

    await queryRun(
      `UPDATE tasks SET title = ?, completed = ?, priority = ?, subject = ?, due = ?, tag = ?, updated_at = ? WHERE id = ?;`,
      [title, completed, priority, subject, due, tag, new Date().toISOString(), id]
    );

    const updated = await queryGet('SELECT * FROM tasks WHERE id = ?;', [id]);
    const formatted = { ...updated, completed: Boolean(updated.completed) };
    broadcast('TASK_UPDATED', formatted);
    return formatted;
  },

  async deleteTask(id) {
    const existing = await queryGet('SELECT * FROM tasks WHERE id = ?;', [id]);
    if (!existing) return false;
    await queryRun('DELETE FROM tasks WHERE id = ?;', [id]);
    broadcast('TASK_DELETED', { id: Number(id) });
    return true;
  },

  async getAssignments() {
    const rows = await queryAll('SELECT * FROM assignments ORDER BY id DESC;');
    return rows.map((r) => ({
      ...r,
      urgent: Boolean(r.urgent),
    }));
  },

  async createAssignment(item) {
    const res = await queryRun(
      `INSERT INTO assignments (title, course, instructor, due, weight, progress, status, urgent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.title,
        item.course || 'CS501',
        item.instructor || 'Prof. Vance',
        item.due || 'Next Week',
        item.weight || '20%',
        item.progress || 0,
        item.status || 'pending',
        item.urgent ? 1 : 0,
        new Date().toISOString(),
      ]
    );
    const created = await queryGet('SELECT * FROM assignments WHERE id = ?;', [res.lastID]);
    const formatted = { ...created, urgent: Boolean(created.urgent) };
    broadcast('ASSIGNMENT_CREATED', formatted);
    return formatted;
  },

  async submitAssignment(id, submissionNotes) {
    await queryRun(
      `UPDATE assignments SET status = 'submitted', progress = 100 WHERE id = ?;`,
      [id]
    );
    const updated = await queryGet('SELECT * FROM assignments WHERE id = ?;', [id]);
    const formatted = { ...updated, urgent: Boolean(updated.urgent), notes: submissionNotes };
    broadcast('ASSIGNMENT_UPDATED', formatted);
    return formatted;
  },

  async getHabits() {
    const rows = await queryAll('SELECT * FROM habits ORDER BY id ASC;');
    return rows.map((r) => ({ ...r, completed: Boolean(r.completed) }));
  },

  async toggleHabit(id) {
    const h = await queryGet('SELECT * FROM habits WHERE id = ?;', [id]);
    if (!h) return null;
    const nextCompleted = h.completed ? 0 : 1;
    const nextStreak = nextCompleted ? h.streak_days + 1 : Math.max(0, h.streak_days - 1);
    await queryRun('UPDATE habits SET completed = ?, streak_days = ? WHERE id = ?;', [nextCompleted, nextStreak, id]);
    const updated = await queryGet('SELECT * FROM habits WHERE id = ?;', [id]);
    const formatted = { ...updated, completed: Boolean(updated.completed), streakDays: updated.streak_days };
    broadcast('HABIT_TOGGLED', formatted);
    return formatted;
  },

  async getTimeBlocks() {
    return queryAll('SELECT * FROM time_blocks ORDER BY id ASC;');
  },

  async getTimetable() {
    const rows = await queryAll('SELECT * FROM timetable ORDER BY id ASC;');
    const grouped = {};
    for (const r of rows) {
      if (!grouped[r.day]) grouped[r.day] = [];
      grouped[r.day].push(r);
    }
    return grouped;
  },

  async addTimetableClass(item) {
    const res = await queryRun(
      `INSERT INTO timetable (day, code, name, time, room, instructor) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.day, item.code, item.name, item.time, item.room, item.instructor]
    );
    const created = await queryGet('SELECT * FROM timetable WHERE id = ?;', [res.lastID]);
    broadcast('TIMETABLE_UPDATED', created);
    return created;
  },

  async deleteTimetableClass(id) {
    await queryRun('DELETE FROM timetable WHERE id = ?;', [id]);
    broadcast('TIMETABLE_CLASS_DELETED', { id: Number(id) });
    return true;
  },

  async getMilestones() {
    return queryAll('SELECT * FROM milestones ORDER BY id ASC;');
  },

  async createMilestone(item) {
    const res = await queryRun(
      `INSERT INTO milestones (title, tag, due, progress, percent) VALUES (?, ?, ?, ?, ?)`,
      [item.title, item.tag || 'Academic', item.due || 'Next Month', item.progress || '0%', item.percent || 0]
    );
    const created = await queryGet('SELECT * FROM milestones WHERE id = ?;', [res.lastID]);
    broadcast('MILESTONE_CREATED', created);
    return created;
  },

  async updateMilestone(id, updates) {
    const existing = await queryGet('SELECT * FROM milestones WHERE id = ?;', [id]);
    if (!existing) return null;
    const percent = updates.percent !== undefined ? updates.percent : existing.percent;
    const progress = updates.progress !== undefined ? updates.progress : `${percent}%`;
    await queryRun('UPDATE milestones SET percent = ?, progress = ? WHERE id = ?;', [percent, progress, id]);
    const updated = await queryGet('SELECT * FROM milestones WHERE id = ?;', [id]);
    broadcast('MILESTONE_UPDATED', updated);
    return updated;
  },

  async deleteMilestone(id) {
    await queryRun('DELETE FROM milestones WHERE id = ?;', [id]);
    broadcast('MILESTONE_DELETED', { id: Number(id) });
    return true;
  },

  async getBadges() {
    const rows = await queryAll('SELECT * FROM badges ORDER BY id ASC;');
    return rows.map((b) => ({
      ...b,
      unlocked: Boolean(b.unlocked),
      isNew: Boolean(b.is_new),
    }));
  },

  async getProfile() {
    const row = await queryGet('SELECT * FROM profile WHERE id = 1;');
    if (!row) return initialSeedData.profile;
    return {
      name: row.name,
      program: row.program,
      role: row.role,
      university: row.university,
      avatar: row.avatar,
      gpa: row.gpa,
      targetGpa: row.target_gpa,
      streakDays: row.streak_days,
      dailyGoalHours: row.daily_goal_hours,
    };
  },

  async updateProfile(updates) {
    const current = await this.getProfile();
    const updated = { ...current, ...updates };
    await queryRun(
      `UPDATE profile SET name = ?, program = ?, role = ?, university = ?, avatar = ?, gpa = ?, target_gpa = ?, streak_days = ?, daily_goal_hours = ? WHERE id = 1;`,
      [
        updated.name,
        updated.program,
        updated.role,
        updated.university,
        updated.avatar,
        updated.gpa,
        updated.targetGpa,
        updated.streakDays,
        updated.dailyGoalHours,
      ]
    );
    broadcast('PROFILE_UPDATED', updated);
    return updated;
  },
};
