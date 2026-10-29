import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const {
    setIsNewTaskOpen,
    profile,
    setIsSettingsOpen,
    isSidebarHidden,
    toggleSidebar,
    tasks,
    setIsStudyVaultOpen,
    setIsZenFocusOpen,
    setIsFlashcardsOpen,
    setIsSoundDockOpen,
    setIsJournalOpen,
    setIsExportDigestOpen,
  } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
    { name: 'To-Do List', path: '/todo', icon: 'checklist_rtl', badge: pendingTasksCount > 0 ? pendingTasksCount : null },
    { name: 'Assignments', path: '/assignments', icon: 'task' },
    { name: 'Routine', path: '/routine', icon: 'pace' },
    { name: 'Timetable', path: '/timetable', icon: 'calendar_month' },
    { name: 'Goals', path: '/goals', icon: 'military_tech' },
  ];

  const tools = [
    { label: 'Vault', icon: 'menu_book', color: 'text-blue-500', shortcut: '⌘I', action: () => setIsStudyVaultOpen(true) },
    { label: 'Arena', icon: 'bolt', color: 'text-red-500', shortcut: '⌘Z', action: () => setIsZenFocusOpen(true) },
    { label: 'Deck', icon: 'style', color: 'text-blue-400', action: () => setIsFlashcardsOpen(true) },
    { label: 'Audio', icon: 'headphones', color: 'text-indigo-400', shortcut: '⌘U', action: () => setIsSoundDockOpen(true) },
    { label: 'Standup', icon: 'history_edu', color: 'text-sky-500', shortcut: '⌘M', action: () => setIsJournalOpen(true) },
    { label: 'Digest', icon: 'assignment_turned_in', color: 'text-red-400', shortcut: '⌘E', action: () => setIsExportDigestOpen(true) },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col py-5 px-3.5 h-screen w-64 fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out select-none bg-white/75 dark:bg-[#0c0c14]/80 backdrop-blur-3xl border-r border-slate-200/70 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)] ${
        isSidebarHidden ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
      }`}
      aria-hidden={isSidebarHidden}
    >
      {/* Brand & Collapse Header */}
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-red-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-red-600 flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[18px] font-bold">bolt</span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              Scholara <span className="text-blue-600 dark:text-blue-400">OS</span>
            </h2>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Executive Student OS
            </p>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
          title="Hide Sidebar (⌘B)"
          id="hide-sidebar-btn"
        >
          <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
        </button>
      </div>

      {/* Profile Capsule (Click opens Settings) */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsSettingsOpen(true)}
        className="mb-3.5 p-2.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group shadow-xs"
        title="Click to edit profile & settings"
      >
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-1.5 ring-blue-600/70 shadow-sm group-hover:ring-blue-500 transition-all">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 border-2 border-white dark:border-[#0c0c14] rounded-full animate-pulse" />
        </div>

        <div className="overflow-hidden flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {profile.name}
            </h3>
            <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-600">
              edit
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
            {profile.program}
          </p>
        </div>
      </motion.div>

      {/* New Task CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsNewTaskOpen(true)}
        className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs py-2 px-3 rounded-xl mb-3 shadow-md shadow-blue-600/25 transition-all duration-200 flex justify-center items-center gap-2 shimmer-hover"
        id="desktop-new-task-btn"
      >
        <span className="material-symbols-outlined text-[17px]">add</span>
        <span>New Task</span>
        <kbd className="px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-mono text-white/90 ml-auto">
          ⌘N
        </kbd>
      </motion.button>

      {/* Main Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide pr-0.5">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-bold text-xs ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-600/15 border border-blue-500/30 dark:border-blue-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebarActivePill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-blue-600 to-red-600 rounded-r-full"
                    />
                  )}
                  <span
                    className={`material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'filled text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 tracking-tight">{item.name}</span>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Compact Futuristic Study Toolkit Grid (No Vertical Bloat) */}
        <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-white/5">
          <div className="flex items-center justify-between px-1.5 mb-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Study Toolkit
            </span>
            <span className="text-[8px] font-mono text-slate-400 dark:text-slate-600">HUD</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {tools.map((t) => (
              <motion.button
                key={t.label}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={t.action}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-blue-500/40 hover:bg-white/80 dark:hover:bg-white/[0.07] text-left transition-all group"
                title={`${t.label} ${t.shortcut ? `(${t.shortcut})` : ''}`}
              >
                <span className={`material-symbols-outlined text-[16px] ${t.color} group-hover:scale-110 transition-transform`}>
                  {t.icon}
                </span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {t.label}
                </span>
                {t.shortcut && (
                  <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 ml-auto hidden group-hover:inline">
                    {t.shortcut}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer: Focus Streak Card (Ultra-minimalist Glass Capsule) */}
      <div className="pt-2.5 mt-auto border-t border-slate-200/70 dark:border-white/10">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="text-sm">🔥</span>
            <span>{profile.streakDays || 14}-Day Streak</span>
          </div>
          <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md bg-red-600 text-white shadow-xs">
            TOP 5%
          </span>
        </div>
      </div>
    </aside>
  );
}
