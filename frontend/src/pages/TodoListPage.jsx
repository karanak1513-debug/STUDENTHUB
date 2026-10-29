import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { triggerMiniConfetti, playChime } from '../utils/celebration';

export default function TodoListPage() {
  const { tasks, toggleTaskCompleted, addTask, deleteTask } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'high', 'completed'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'board'
  const [selectedSubject, setSelectedSubject] = useState('Economics');

  const suggestions = [
    { label: 'Read Chapter 4', subject: 'Economics' },
    { label: 'Complete Problem Set', subject: 'Statistics' },
    { label: 'Review Lecture Slides', subject: 'Management' },
    { label: 'Prep for Quiz', subject: 'Marketing' },
  ];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    addTask({
      title: quickInput.trim(),
      subject: selectedSubject,
      due: 'Today, 8:00 PM',
      priority: 'high',
      tag: 'General',
    });

    triggerMiniConfetti(0.5, 0.4);
    playChime('success');
    setQuickInput('');
  };

  const handleToggle = (taskId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
    playChime('success');
    toggleTaskCompleted(taskId);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'high') return matchesSearch && task.priority === 'high';
    if (activeFilter === 'completed') return matchesSearch && task.completed;
    if (activeFilter === 'active') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  const todayTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Sprint Execution Terminal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            To-Do & Action Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Coursework deliverables, deep study sprints, and priority action items.
          </p>
        </div>

        {/* Glass Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks, courses, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all backdrop-blur-xl"
          />
        </div>
      </motion.div>

      {/* Quick Add Bar with Glass Refraction */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="glass-card rounded-3xl p-4 sm:p-5 relative overflow-hidden space-y-3"
      >
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full flex items-center bg-white/60 dark:bg-white/[0.04] rounded-2xl px-3.5 py-2.5 border border-slate-200/80 dark:border-white/10 focus-within:border-blue-500 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-[20px] mr-2.5">
              add_task
            </span>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="What needs to get done? e.g. Finish econometrics assignment..."
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="Economics">Economics</option>
              <option value="Management">Management</option>
              <option value="Statistics">Statistics</option>
              <option value="Marketing">Marketing</option>
              <option value="Accounting">Accounting</option>
              <option value="Personal">Personal</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!quickInput.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 disabled:opacity-40 text-white font-black text-xs shadow-md shadow-blue-600/25 transition-all whitespace-nowrap"
            >
              Add Task
            </motion.button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide pt-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Quick Prompts:
          </span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuickInput(sug.label);
                setSelectedSubject(sug.subject);
              }}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-white/50 dark:bg-white/[0.03] hover:bg-blue-500/10 hover:text-blue-600 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap transition-colors"
            >
              + {sug.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filter Chips & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Tasks', count: tasks.length },
            { id: 'active', label: 'In Progress', count: todayTasks.length },
            { id: 'high', label: 'High Priority', count: tasks.filter((t) => t.priority === 'high').length },
            { id: 'completed', label: 'Completed', count: completedTasks.length },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeFilter === chip.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                  activeFilter === chip.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                }`}
              >
                {chip.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white/60 dark:bg-white/[0.04] rounded-xl p-1 border border-slate-200/80 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">view_list</span>
            List
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'board'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">view_column</span>
            Board
          </button>
        </div>
      </div>

      {/* Task Views */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Active Tasks Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                Active Items
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-black">
                  {todayTasks.length}
                </span>
              </h3>
            </div>

            {todayTasks.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center border-dashed">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl">task_alt</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  All caught up!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  No active tasks matching this filter.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence>
                  {todayTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card rounded-2xl p-4 flex items-start gap-3.5 group hover:border-blue-500/50"
                    >
                      <button
                        onClick={(e) => handleToggle(task.id, e)}
                        className="mt-0.5 w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-white/20 hover:border-blue-600 flex items-center justify-center transition-colors text-blue-600 active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[15px] opacity-0 group-hover:opacity-60 transition-opacity">
                          check
                        </span>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                                task.priority === 'high'
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {task.subject}
                            </span>
                            <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              {task.tag || 'Sprint'}
                            </span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-all"
                              title="Delete task"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined text-[14px]">flag</span>
                            {task.due}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">timer</span>
                            45m focus target
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Completed Group */}
          {completedTasks.length > 0 && (
            <div className="space-y-2.5 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  Completed Tasks
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-black">
                    {completedTasks.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-2 opacity-75">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center gap-3 group"
                  >
                    <button
                      onClick={(e) => handleToggle(task.id, e)}
                      className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </button>
                    <span className="flex-1 text-xs font-medium line-through text-slate-400 dark:text-slate-500 truncate">
                      {task.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{task.subject}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-all"
                      title="Delete task"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* To Do Column */}
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                To Do ({todayTasks.length})
              </h4>
            </div>
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/70 dark:bg-white/[0.04] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2 group hover:border-blue-500/40 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                      {task.subject}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggle(task.id, e)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </p>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">event</span>
                    {task.due}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sprints Column */}
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Active Sprints (1)
              </h4>
            </div>
            <div className="bg-white/70 dark:bg-white/[0.04] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2">
              <span className="text-[10px] font-black bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md">
                Management
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Team Presentation Slide Deck
              </p>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">group</span>
                Collaborative peer review
              </span>
            </div>
          </div>

          {/* Completed Column */}
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Completed ({completedTasks.length})
              </h4>
            </div>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/50 dark:bg-white/[0.02] p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs space-y-1 opacity-70 group flex justify-between items-center"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">{task.subject}</span>
                    <p className="text-xs font-medium line-through text-slate-400 truncate">
                      {task.title}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
