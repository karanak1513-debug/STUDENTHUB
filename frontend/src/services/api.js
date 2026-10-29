const RAW_BASE = import.meta.env.VITE_API_URL || '/api';
const BASE_URL = RAW_BASE.endsWith('/') ? RAW_BASE.slice(0, -1) : RAW_BASE;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || `HTTP error! status: ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Tasks
  tasks: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/tasks${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/tasks/${id}`),
    create: (taskData) =>
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    update: (id, updates) =>
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    toggle: (id) =>
      request(`/tasks/${id}/toggle`, {
        method: 'PATCH',
      }),
    delete: (id) =>
      request(`/tasks/${id}`, {
        method: 'DELETE',
      }),
  },

  // Assignments
  assignments: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/assignments${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/assignments/${id}`),
    create: (data) =>
      request('/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, updates) =>
      request(`/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    submit: (id, notes = '') =>
      request(`/assignments/${id}/submit`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      }),
    delete: (id) =>
      request(`/assignments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Routines & Habits
  routines: {
    getHabits: () => request('/routines/habits'),
    createHabit: (data) =>
      request('/routines/habits', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleHabit: (id) =>
      request(`/routines/habits/${id}/toggle`, {
        method: 'PATCH',
      }),
    deleteHabit: (id) =>
      request(`/routines/habits/${id}`, {
        method: 'DELETE',
      }),
    getTimeBlocks: () => request('/routines/timeblocks'),
    createTimeBlock: (data) =>
      request('/routines/timeblocks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    deleteTimeBlock: (id) =>
      request(`/routines/timeblocks/${id}`, {
        method: 'DELETE',
      }),
    logFocusSession: (data) =>
      request('/routines/focus-sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getFocusSessions: () => request('/routines/focus-sessions'),
  },

  // Timetable
  timetable: {
    getAll: (day) => {
      const query = day ? `?day=${day}` : '';
      return request(`/timetable${query}`);
    },
    addClass: (data) =>
      request('/timetable', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateClass: (id, data) =>
      request(`/timetable/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteClass: (id) =>
      request(`/timetable/${id}`, {
        method: 'DELETE',
      }),
  },

  // Goals & Achievements
  goals: {
    getMilestones: () => request('/goals/milestones'),
    createMilestone: (data) =>
      request('/goals/milestones', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateMilestone: (id, data) =>
      request(`/goals/milestones/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    deleteMilestone: (id) =>
      request(`/goals/milestones/${id}`, {
        method: 'DELETE',
      }),
    getBadges: () => request('/goals/badges'),
  },

  // Dashboard & Profile
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getProfile: () => request('/dashboard/profile'),
    updateProfile: (data) =>
      request('/dashboard/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};
