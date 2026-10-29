import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { realtimeClient } from '../services/realtime';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('scholara_theme') === 'dark';
  });

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isStudyVaultOpen, setIsStudyVaultOpen] = useState(false);
  const [isZenFocusOpen, setIsZenFocusOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isSoundDockOpen, setIsSoundDockOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isExportDigestOpen, setIsExportDigestOpen] = useState(false);

  // Sidebar Hidden / Collapse option
  const [isSidebarHidden, setIsSidebarHidden] = useState(() => {
    return localStorage.getItem('scholara_sidebar_hidden') === 'true';
  });

  const [viewMode, setViewMode] = useState('responsive');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState('connected'); // 'connected' | 'reconnecting' | 'disconnected'

  // Notifications State (Persisted via SQLite)
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    program: 'BBA 3rd Semester',
    role: 'UG Scholar',
    university: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    gpa: '3.88',
    targetGpa: '4.00',
    streakDays: 14,
    dailyGoalHours: 5.0,
  });

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.dashboard.getProfile();
      if (res && res.data) {
        setProfile((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch backend profile:', err.message);
    }
  }, []);

  // Update profile in backend and local state
  const updateProfile = async (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    try {
      const res = await api.dashboard.updateProfile(updates);
      if (res && res.data) {
        setProfile((prev) => ({ ...prev, ...res.data }));
      }
      return res?.data;
    } catch (err) {
      console.error('Failed to sync profile updates to backend:', err);
    }
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarHidden((prev) => {
      const next = !prev;
      localStorage.setItem('scholara_sidebar_hidden', String(next));
      return next;
    });
  };

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const res = await api.tasks.getAll();
      if (res && res.data) {
        setTasks(res.data);
      }
      setTasksError(null);
    } catch (err) {
      console.warn('Backend unavailable, using local task cache:', err.message);
      setTasksError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // Fetch notifications from SQLite backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.notifications.getAll();
      if (res && res.data) {
        setNotifications(res.data);
        setUnreadNotificationsCount(res.data.filter((n) => !n.read).length);
      }
    } catch (err) {
      console.warn('Could not fetch notifications from backend:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchProfile();
    fetchNotifications();
  }, [fetchTasks, fetchProfile, fetchNotifications]);

  // Real-time synchronization layer with SQLite backend
  useEffect(() => {
    const unsubStatus = realtimeClient.onStatusChange((status) => {
      setRealtimeStatus(status);
    });

    const unsubData = realtimeClient.subscribe((payload) => {
      if (!payload || !payload.event) return;
      const { event, data } = payload;

      switch (event) {
        case 'TASK_CREATED':
        case 'TASKS_CREATED':
          if (data && data.id) {
            setTasks((prev) => {
              if (prev.some((t) => String(t.id) === String(data.id))) return prev;
              return [data, ...prev];
            });
          }
          break;

        case 'TASK_UPDATED':
        case 'TASKS_UPDATED':
          if (data && data.id) {
            setTasks((prev) =>
              prev.map((t) => (String(t.id) === String(data.id) ? { ...t, ...data } : t))
            );
          }
          break;

        case 'TASK_DELETED':
        case 'TASKS_DELETED':
          if (data && data.id) {
            setTasks((prev) => prev.filter((t) => String(t.id) !== String(data.id)));
          }
          break;

        case 'PROFILE_UPDATED':
          if (data) {
            setProfile((prev) => ({ ...prev, ...data }));
          }
          break;

        case 'NOTIFICATION_CREATED':
          if (data && data.id) {
            setNotifications((prev) => [data, ...prev.filter((n) => n.id !== data.id)]);
            setUnreadNotificationsCount((prev) => prev + 1);
          }
          break;

        case 'NOTIFICATION_UPDATED':
          if (data && data.id) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === data.id ? { ...n, ...data } : n))
            );
          }
          break;

        case 'NOTIFICATIONS_MARKED_ALL_READ':
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadNotificationsCount(0);
          break;

        case 'NOTIFICATION_DELETED':
          if (data && data.id) {
            setNotifications((prev) => prev.filter((n) => n.id !== data.id));
          }
          break;

        default:
          break;
      }
    });

    return () => {
      unsubStatus();
      unsubData();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('scholara_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('scholara_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleTaskCompleted = async (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const res = await api.tasks.toggle(taskId);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? res.data : task))
        );
      }
    } catch (err) {
      console.error('Failed to sync toggle with backend:', err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const addTask = async (newTask) => {
    const tempId = Date.now();
    const optimisticTask = {
      id: tempId,
      completed: false,
      priority: 'medium',
      ...newTask,
    };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const res = await api.tasks.create(newTask);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? res.data : t))
        );
        return res.data;
      }
    } catch (err) {
      console.error('Failed to save task to backend:', err);
    }
    return optimisticTask;
  };

  const updateTask = async (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    try {
      const res = await api.tasks.update(taskId, updates);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? res.data : task))
        );
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update task on backend:', err);
    }
  };

  const deleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await api.tasks.delete(taskId);
    } catch (err) {
      console.error('Failed to delete task on backend:', err);
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    try {
      await api.notifications.markRead(id);
    } catch (err) {
      console.error('Failed to mark notification read on backend:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadNotificationsCount(0);
    try {
      await api.notifications.markAllRead();
    } catch (err) {
      console.error('Failed to mark all notifications read on backend:', err);
    }
  };

  const dismissNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.notifications.delete(id);
    } catch (err) {
      console.error('Failed to delete notification on backend:', err);
    }
  };

  const requestBrowserNotificationPermission = async () => {
    if (!('Notification' in window)) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Could not request notification permission:', e);
      return 'denied';
    }
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        isNewTaskOpen,
        setIsNewTaskOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isSidebarHidden,
        setIsSidebarHidden,
        toggleSidebar,
        isNotificationOpen,
        setIsNotificationOpen,
        isStudyVaultOpen,
        setIsStudyVaultOpen,
        isZenFocusOpen,
        setIsZenFocusOpen,
        isFlashcardsOpen,
        setIsFlashcardsOpen,
        isScratchpadOpen,
        setIsScratchpadOpen,
        isSoundDockOpen,
        setIsSoundDockOpen,
        isJournalOpen,
        setIsJournalOpen,
        isExportDigestOpen,
        setIsExportDigestOpen,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        requestBrowserNotificationPermission,
        profile,
        updateProfile,
        viewMode,
        setViewMode,
        tasks,
        loadingTasks,
        tasksError,
        realtimeStatus,
        refreshTasks: fetchTasks,
        toggleTaskCompleted,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
