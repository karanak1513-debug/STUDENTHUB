import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from './seedData.js';
import { broadcast } from '../realtime/realtimeServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

let dbMemory = null;
let writeQueue = Promise.resolve();

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function initDb() {
  if (dbMemory) return dbMemory;

  try {
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      dbMemory = JSON.parse(fileData);
    } else {
      dbMemory = clone(initialSeedData);
      fs.writeFileSync(DB_FILE, JSON.stringify(dbMemory, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing db from file, resetting to seed data:', err);
    dbMemory = clone(initialSeedData);
    fs.writeFileSync(DB_FILE, JSON.stringify(dbMemory, null, 2), 'utf-8');
  }

  return dbMemory;
}

export async function persistDb() {
  writeQueue = writeQueue.then(async () => {
    try {
      const jsonContent = JSON.stringify(dbMemory, null, 2);
      await fs.promises.writeFile(DB_FILE, jsonContent, 'utf-8');
    } catch (err) {
      console.warn('Database write to disk skipped (in-memory state preserved):', err.message);
    }
  });
  return writeQueue;
}

export const db = {
  get(collection) {
    const state = initDb();
    return state[collection] || [];
  },

  getAll() {
    return initDb();
  },

  findById(collection, id) {
    const list = this.get(collection);
    return list.find((item) => String(item.id) === String(id));
  },

  async insert(collection, item) {
    const state = initDb();
    if (!state[collection]) {
      state[collection] = [];
    }

    const nextId =
      state[collection].length > 0
        ? Math.max(...state[collection].map((x) => (typeof x.id === 'number' ? x.id : 0))) + 1
        : 1;

    const newItem = {
      id: nextId,
      createdAt: new Date().toISOString(),
      ...item,
    };

    state[collection].unshift(newItem);
    await persistDb();
    broadcast(`${collection.toUpperCase()}_CREATED`, newItem);
    return newItem;
  },

  async update(collection, id, updates) {
    const state = initDb();
    const list = state[collection] || [];
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await persistDb();
    broadcast(`${collection.toUpperCase()}_UPDATED`, list[index]);
    return list[index];
  },

  async delete(collection, id) {
    const state = initDb();
    const list = state[collection] || [];
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;

    const removed = list.splice(index, 1);
    await persistDb();
    broadcast(`${collection.toUpperCase()}_DELETED`, { id, item: removed[0] });
    return removed[0];
  },

  async updateProfile(updates) {
    const state = initDb();
    state.profile = {
      ...state.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await persistDb();
    broadcast('PROFILE_UPDATED', state.profile);
    return state.profile;
  },

  async updateTimetableDay(day, items) {
    const state = initDb();
    if (!state.timetable) state.timetable = {};
    state.timetable[day] = items;
    await persistDb();
    return state.timetable[day];
  }
};
