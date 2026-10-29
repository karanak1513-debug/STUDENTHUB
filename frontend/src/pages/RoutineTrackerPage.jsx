import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../utils/celebration';

export default function RoutineTrackerPage() {
  const [timerRunning, setTimerRunning] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('scholara_routine_timer'));
      if (saved?.running && saved?.lastTimestamp && saved?.remainingSeconds) {
        const elapsed = Math.floor((Date.now() - saved.lastTimestamp) / 1000);
        return saved.remainingSeconds - elapsed > 0;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [timerSeconds, setTimerSeconds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('scholara_routine_timer'));
      if (saved?.remainingSeconds !== undefined && saved?.lastTimestamp) {
        if (saved.running) {
          const elapsed = Math.floor((Date.now() - saved.lastTimestamp) / 1000);
          return Math.max(0, saved.remainingSeconds - elapsed);
        }
        return saved.remainingSeconds;
      }
      return 45 * 60;
    } catch {
      return 45 * 60;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'scholara_routine_timer',
      JSON.stringify({
        running: timerRunning,
        remainingSeconds: timerSeconds,
        lastTimestamp: Date.now(),
      })
    );
  }, [timerRunning, timerSeconds]);

  const [habits, setHabits] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('08:00 AM');
  const [newHabitCategory, setNewHabitCategory] = useState('Study');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  // Fetch habits and timeblocks from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [habitsRes, blocksRes] = await Promise.all([
          api.routines.getHabits(),
          api.routines.getTimeBlocks(),
        ]);
        if (habitsRes?.data) setHabits(habitsRes.data);
        if (blocksRes?.data) setTimeBlocks(blocksRes.data);
      } catch (err) {
        console.error('Failed to load routines data:', err);
      }
    }
    loadData();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      triggerConfetti();
      playChime('bell');
      api.routines
        .logFocusSession({
          durationMinutes: 45,
          subject: 'Routine Focus Block',
        })
        .catch(console.error);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleHabit = async (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
    playChime('success');

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );

    try {
      const res = await api.routines.toggleHabit(id);
      if (res?.data) {
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? res.data : h))
        );
      }
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    try {
      const res = await api.routines.createHabit({
        title: newHabitTitle.trim(),
        time: newHabitTime,
        category: newHabitCategory,
      });
      if (res?.data) {
        setHabits((prev) => [...prev, res.data]);
        setNewHabitTitle('');
        setIsAddingHabit(false);
        triggerMiniConfetti(0.5, 0.5);
        playChime('success');
      }
    } catch (err) {
      console.error('Failed to create habit:', err);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(45 * 60);
  };

  const completedHabits = habits.filter((h) => h.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
              Circadian Discipline & Rhythm
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Routine & Time Blocks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Master your focus schedule through structured circadian time blocks and daily checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            Schedule Active
          </span>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 cols: Time Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-8 space-y-4"
        >
          <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3 gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">
                  view_timeline
                </span>
                <span>Scheduled Blocks ({timeBlocks.length})</span>
              </h2>

              <div className="flex items-center gap-3 text-xs font-black">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Deep Work
                </span>
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Lecture
                </span>
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Wellness
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {timeBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-4 group cursor-pointer hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">
                        {block.icon || 'schedule'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {block.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                        {block.type}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-white/10 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 whitespace-nowrap">
                    {block.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right 4 cols: Focus Timer & Habit Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-4 space-y-5"
        >
          {/* Focus Timer Widget */}
          <section className="glass-card rounded-3xl p-5 text-center relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Sprint Pomodoro
              </h3>
              <span className="material-symbols-outlined text-red-600 text-[18px]">
                hourglass_top
              </span>
            </div>

            <div className="my-5">
              <div className="text-4xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-tight">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bold">
                {timerRunning ? '⚡ Flow Session in Progress' : 'Ready to begin routine block'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={resetTimer}
                className="w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
                title="Reset Timer"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all"
                title={timerRunning ? 'Pause' : 'Start'}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
              </motion.button>

              <button
                onClick={() => setTimerSeconds(25 * 60)}
                className="w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
                title="25 min sprint"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </button>
            </div>
          </section>

          {/* Daily Habit Streak List */}
          <section className="glass-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="text-red-600">🔥</span>
                <span>Habit Matrix</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                  {completedHabits}/{habits.length} Done
                </span>
                <button
                  onClick={() => setIsAddingHabit(!isAddingHabit)}
                  className="p-1 rounded-lg text-blue-600 hover:bg-blue-600/10 transition-colors"
                  title="Add Habit"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            {isAddingHabit && (
              <form onSubmit={handleCreateHabit} className="p-3 bg-white/60 dark:bg-white/[0.04] rounded-2xl space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="New habit e.g. Review Flashcards"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    placeholder="Time e.g. 08:00 AM"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white font-black rounded-xl text-xs"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={(e) => toggleHabit(habit.id, e)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    habit.completed
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-300'
                      : 'bg-white/60 dark:bg-white/[0.03] border-slate-200/70 dark:border-white/10 hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        habit.completed
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-300 dark:border-white/20'
                      }`}
                    >
                      {habit.completed && (
                        <span className="material-symbols-outlined text-[14px] font-bold">
                          check
                        </span>
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-xs font-bold leading-snug ${
                          habit.completed ? 'line-through opacity-70' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {habit.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        {habit.time} • {habit.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500">
                    {habit.streak || 5}d
                  </span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
