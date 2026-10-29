import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../utils/celebration';

export default function DashboardPage() {
  const {
    tasks,
    toggleTaskCompleted,
    addTask,
    setIsNewTaskOpen,
    profile,
    setIsSettingsOpen,
    setIsZenFocusOpen,
    setIsStudyVaultOpen,
    setIsFlashcardsOpen,
    setIsSoundDockOpen,
    setIsJournalOpen,
    setIsExportDigestOpen,
  } = useApp();

  const [statsData, setStatsData] = useState(null);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('focus'); // 'focus' (25m), 'shortBreak' (5m), 'longFocus' (50m)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'high', 'active', 'done'
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskSubject, setQuickTaskSubject] = useState('CS501');

  // Live Current Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live dashboard analytics from backend
  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await api.dashboard.getStats();
        if (res && res.data && isMounted) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.warn('Could not load dashboard stats from backend:', err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [tasks]);

  // Pomodoro duration mapping
  const getModeDuration = (mode) => {
    switch (mode) {
      case 'shortBreak':
        return 5 * 60;
      case 'longFocus':
        return 50 * 60;
      default:
        return 25 * 60;
    }
  };

  const handleModeChange = (mode) => {
    setPomodoroMode(mode);
    setPomodoroActive(false);
    setPomodoroTime(getModeDuration(mode));
  };

  // Pomodoro countdown effect
  useEffect(() => {
    let timer = null;
    if (pomodoroActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroActive) {
      setPomodoroActive(false);
      triggerConfetti();
      playChime('bell');
      api.routines
        .logFocusSession({
          durationMinutes: Math.round(getModeDuration(pomodoroMode) / 60),
          subject: `${pomodoroMode.toUpperCase()} Session`,
        })
        .catch(console.error);
      setPomodoroTime(getModeDuration(pomodoroMode));
    }
    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroTime, pomodoroMode]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : statsData?.metrics?.taskProgressPercent || 0;

  const streakDays = profile?.streakDays || statsData?.metrics?.streakDays || 14;
  const profileName = profile?.name || 'Sarah Jenkins';
  const profileProgram = profile?.program || 'BBA 3rd Semester';

  const upcomingClasses = statsData?.todayClasses?.length
    ? statsData.todayClasses
    : [
        {
          id: 'c1',
          code: 'CS501',
          title: 'Advanced Algorithms & Graph Theory',
          time: '10:00 AM - 11:30 AM',
          room: 'Room 402 • Tech Hub',
          instructor: 'Dr. Evelyn Vance',
        },
        {
          id: 'c2',
          code: 'ML405',
          title: 'Machine Learning & Neural Labs',
          time: '01:00 PM - 03:00 PM',
          room: 'Virtual Lab A',
          instructor: 'Prof. Marcus Chen',
        },
        {
          id: 'c3',
          code: 'EC204',
          title: 'Macroeconomics Policy Seminar',
          time: '03:30 PM - 05:00 PM',
          room: 'Hall B-2',
          instructor: 'Prof. Sarah Lin',
        },
      ];

  // Milestone / Exam Countdown Radar
  const milestonesCountdown = [
    {
      id: 'm1',
      course: 'CS501',
      title: 'Midterm Algorithm Defense',
      target: new Date(Date.now() + 4 * 86400000 + 14 * 3600000),
      tag: 'Exam (30%)',
      urgent: true,
    },
    {
      id: 'm2',
      course: 'ML405',
      title: 'Neural Architecture Deliverable',
      target: new Date(Date.now() + 7 * 86400000 + 8 * 3600000),
      tag: 'Project (25%)',
      urgent: false,
    },
    {
      id: 'm3',
      course: 'EC204',
      title: 'Central Bank Policy Paper',
      target: new Date(Date.now() + 11 * 86400000 + 19 * 3600000),
      tag: 'Thesis (35%)',
      urgent: false,
    },
  ];

  const getTimeLeft = (targetDate) => {
    const diff = Math.max(0, targetDate - currentTime);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };

  // 7-Day Rhythm Habit Matrix
  const [habitsGrid, setHabitsGrid] = useState([
    { id: 'h1', title: 'Deep Work Sprint (90m)', icon: 'bolt', days: [true, true, true, true, false, true, true] },
    { id: 'h2', title: 'Lecture Slides Review', icon: 'menu_book', days: [true, true, false, true, true, true, false] },
    { id: 'h3', title: 'Active Problem Set Coding', icon: 'code', days: [true, false, true, true, true, false, true] },
    { id: 'h4', title: 'Mind Recovery & Hydration', icon: 'water_drop', days: [true, true, true, true, true, true, true] },
  ]);

  const toggleHabitDay = (habitId, dayIndex, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
    playChime('success');

    setHabitsGrid((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextDays = [...h.days];
          nextDays[dayIndex] = !nextDays[dayIndex];
          return { ...h, days: nextDays };
        }
        return h;
      })
    );
  };

  const handleTaskCheck = (taskId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
    playChime('success');
    toggleTaskCompleted(taskId);
  };

  const handleQuickAddTask = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    addTask({
      title: quickTaskTitle.trim(),
      subject: quickTaskSubject,
      due: 'Today, 8:00 PM',
      priority: 'high',
      tag: 'Sprint',
    });

    triggerMiniConfetti(0.5, 0.4);
    playChime('success');
    setQuickTaskTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'high') return t.priority === 'high' && !t.completed;
    if (taskFilter === 'active') return !t.completed;
    if (taskFilter === 'done') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO COMMAND COCKPIT (Ultra-Glassy HUD with Pomodoro Ring) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/10 via-white/50 to-red-900/10 dark:from-blue-950/40 dark:via-[#0c0c16]/80 dark:to-red-950/30 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-blue-900/5 dark:shadow-black/60"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Meta */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                ● {profileProgram}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                {profile.university || 'Stanford University'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20">
                Term Active
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Good Afternoon, <span className="text-blue-600 dark:text-blue-400">{profileName.split(' ')[0]}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                "Mastery is built through relentless 25-minute sprints. High discipline, zero excuses."
              </p>
            </div>
          </div>

          {/* Right: Glassy Focus Timer HUD Controller */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/70 dark:bg-[#12121e]/70 backdrop-blur-2xl p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-lg">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[15px] text-blue-500">schedule</span>
                <span>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Mode Selectors */}
              <div className="flex items-center gap-1 mt-2">
                {[
                  { id: 'focus', label: '25m Sprint' },
                  { id: 'shortBreak', label: '5m Rest' },
                  { id: 'longFocus', label: '50m Deep' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      pomodoroMode === mode.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Display & Start/Pause Button */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-2xl font-black tracking-tight text-slate-900 dark:text-white px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10">
                {formatTimer(pomodoroTime)}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPomodoroActive(!pomodoroActive)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs text-white shadow-md transition-all ${
                  pomodoroActive
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {pomodoroActive ? 'pause' : 'play_arrow'}
                </span>
                <span>{pomodoroActive ? 'Pause' : 'Start Focus'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. EXECUTIVE METRIC GLASS TILES (Staggered Grid with Specular Highlights) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tile 1: Coursework Deliverables */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Deliverables
            </span>
            <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {progressPercent}%
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              ({completedCount}/{tasks.length})
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full"
            />
          </div>
        </motion.div>

        {/* Tile 2: Circadian Focus Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Consistency
            </span>
            <span className="w-7 h-7 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {streakDays} Days
            </h3>
            <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded bg-red-600 text-white">
              TOP 5%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate">
            Daily circadian rhythm active
          </p>
        </motion.div>

        {/* Tile 3: Classes & Lectures Today */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Classes Today
            </span>
            <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">school</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {upcomingClasses.length}
            </h3>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              Next: CS501
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate">
            Room 402 • Tech Hub
          </p>
        </motion.div>

        {/* Tile 4: Target Honors GPA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Target Honors
            </span>
            <span className="w-7 h-7 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">military_tech</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {profile.gpa || '3.88'}
            </h3>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
              Target 4.00
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate">
            Goal: 5 hrs daily study
          </p>
        </motion.div>
      </div>

      {/* 3. EXAM & DEADLINE RADAR (Live Monospace Countdown Pills) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass-card rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-red-600">alarm</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Academic Deadlines & Exam Radar
            </h3>
          </div>
          <Link
            to="/assignments"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Deliverables Hub</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {milestonesCountdown.map((m) => {
            const timeLeft = getTimeLeft(m.target);
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {m.course}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      m.urgent
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {m.tag}
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {m.title}
                </h4>

                {/* Monospace Countdown Blocks */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 text-center font-mono">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {timeLeft.d}
                    </span>
                    <p className="text-[8px] text-slate-400 uppercase font-sans font-bold">Days</p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">:</span>
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {String(timeLeft.h).padStart(2, '0')}
                    </span>
                    <p className="text-[8px] text-slate-400 uppercase font-sans font-bold">Hrs</p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">:</span>
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {String(timeLeft.m).padStart(2, '0')}
                    </span>
                    <p className="text-[8px] text-slate-400 uppercase font-sans font-bold">Min</p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">:</span>
                  <div>
                    <span className="text-base font-black text-red-600 dark:text-red-400">
                      {String(timeLeft.s).padStart(2, '0')}
                    </span>
                    <p className="text-[8px] text-slate-400 uppercase font-sans font-bold">Sec</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 4. SPRINT TASKS & AGENDA SPLIT (Glassy 2-Column Command Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Active Sprint Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-600">checklist_rtl</span>
                <span>Active Sprint Tasks</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Realtime synced task backlog</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-white/60 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/80 dark:border-white/10 self-start sm:self-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'high', label: 'High' },
                { id: 'active', label: 'Pending' },
                { id: 'done', label: 'Done' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilter(f.id)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    taskFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Task Inline Adder */}
          <form onSubmit={handleQuickAddTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="Quick add task... (e.g., Review CS501 slides)"
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <select
              value={quickTaskSubject}
              onChange={(e) => setQuickTaskSubject(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs font-mono bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="CS501">CS501</option>
              <option value="ML405">ML405</option>
              <option value="EC204">EC204</option>
              <option value="General">Gen</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm transition-all"
            >
              Add
            </motion.button>
          </form>

          {/* Task Item List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-hide pr-1">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-xs font-bold text-slate-400">
                  No tasks match this filter. Clear to view all.
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                      t.completed
                        ? 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/40 dark:border-white/5 opacity-60'
                        : 'bg-white/60 dark:bg-white/[0.03] border-slate-200/70 dark:border-white/10 hover:border-blue-500/40'
                    }`}
                  >
                    <button
                      onClick={(e) => handleTaskCheck(t.id, e)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                        t.completed
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 dark:border-white/20 hover:border-blue-600'
                      }`}
                    >
                      {t.completed && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          t.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {t.subject || 'CS501'}
                        </span>
                        <span>•</span>
                        <span>{t.due || 'Today'}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        t.priority === 'high'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {t.priority || 'med'}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column (5 cols): Today's Classes & Rhythm Habits */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-5 space-y-5"
        >
          {/* Lecture Agenda */}
          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-600">calendar_month</span>
                <span>Today's Lectures</span>
              </h3>
              <Link to="/timetable" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                View Full
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingClasses.slice(0, 2).map((c, i) => (
                <div
                  key={c.id || i}
                  className="p-3 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {c.time}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                    {c.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {c.room} • {c.instructor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Circadian Habit Rhythm */}
          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-600">pace</span>
                <span>Circadian Habits</span>
              </h3>
              <Link to="/routine" className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">
                Routines
              </Link>
            </div>

            <div className="space-y-2">
              {habitsGrid.map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[17px] text-blue-500">
                      {h.icon}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {h.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {h.days.map((active, dayIdx) => (
                      <button
                        key={dayIdx}
                        onClick={(e) => toggleHabitDay(h.id, dayIdx, e)}
                        className={`w-5 h-5 rounded-md text-[9px] font-mono font-bold transition-all ${
                          active
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={active ? 'Completed' : 'Click to complete'}
                      >
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][dayIdx]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
