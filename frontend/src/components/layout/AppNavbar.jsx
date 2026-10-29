import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ScholaraLogo from '../common/ScholaraLogo';

export default function AppNavbar({ onOpenSearch }) {
  const location = useLocation();
  const {
    isSidebarHidden,
    toggleSidebar,
    setIsNotificationOpen,
    notifications,
    profile,
    setIsSettingsOpen,
    darkMode,
    toggleDarkMode,
    setIsNewTaskOpen,
    setIsSoundDockOpen,
    realtimeStatus,
  } = useApp();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
      case '/':
        return 'Executive Overview';
      case '/todo':
        return 'Active Sprint Tasks';
      case '/assignments':
        return 'Coursework & Deliverables';
      case '/routine':
        return 'Circadian Routine Blocks';
      case '/timetable':
        return 'Lecture Schedule';
      case '/goals':
        return 'Academic Honors & Badges';
      default:
        return 'Overview';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-[#09090e]/75 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/10 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Sidebar Toggle & Page Breadcrumbs */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border ${
              isSidebarHidden
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 hover:text-blue-600'
            }`}
            title={isSidebarHidden ? 'Expand Sidebar (⌘B)' : 'Hide Sidebar (⌘B)'}
            id="sidebar-toggle-btn"
          >
            <span className="material-symbols-outlined text-[19px]">
              {isSidebarHidden ? 'dock_to_right' : 'dock_to_left'}
            </span>
            {isSidebarHidden && (
              <span className="text-[11px] font-black hidden sm:inline pr-1">Menu</span>
            )}
          </motion.button>

          <div className="flex items-center gap-2">
            {isSidebarHidden && (
              <div className="mr-1">
                <ScholaraLogo size="xs" showText={false} />
              </div>
            )}
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hidden sm:inline">
              Scholara OS
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </div>

        {/* Center / Right: Glassy Hub Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Realtime SQLite MCP Database Status Indicator */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${
              realtimeStatus === 'connected'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 shadow-xs'
                : realtimeStatus === 'reconnecting'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-300'
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'
            }`}
            title="Realtime SQLite Database WAL stream active (WebSocket /ws + SSE fallback)"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                realtimeStatus === 'connected'
                  ? 'bg-blue-600 animate-pulse'
                  : realtimeStatus === 'reconnecting'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-mono tracking-wider uppercase">
              {realtimeStatus === 'connected' ? 'SQLite Live' : realtimeStatus}
            </span>
          </div>

          {/* Quick Command Palette Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/40 transition-all group"
            title="Search commands, courses, shortcuts (⌘K)"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600 group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="hidden lg:inline text-xs">Search</span>
            <kbd className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-[9px] font-mono border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
              ⌘K
            </kbd>
          </motion.button>

          {/* Audio Visualizer Dock Pill */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSoundDockOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/60 dark:bg-white/[0.04] hover:border-blue-500/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 text-xs font-bold transition-all group"
            title="Focus Soundscape Studio (⌘U)"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-500 group-hover:scale-110 transition-transform">
              headphones
            </span>
            <div className="flex items-end gap-0.5 h-2.5 px-0.5">
              <span className="w-0.5 bg-blue-600 rounded-full eq-bar-1" />
              <span className="w-0.5 bg-blue-600 rounded-full eq-bar-2" />
              <span className="w-0.5 bg-blue-600 rounded-full eq-bar-3" />
            </div>
          </motion.button>

          {/* New Task (If Sidebar Hidden) */}
          {isSidebarHidden && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNewTaskOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-600/30 transition-all"
              title="Create New Task"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">New</span>
            </motion.button>
          )}

          {/* Mini Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-600 hover:border-red-500/40 transition-all"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white dark:ring-[#09090e] animate-pulse" />
            )}
          </motion.button>

          {/* Dark / Light Mode Switch */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-500/40 transition-all"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </motion.button>

          {/* Profile Capsule (Opens Settings) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 cursor-pointer hover:border-blue-500/50 transition-all group"
            title="Settings & Profile"
          >
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-blue-600"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-red-600 rounded-full border border-white dark:border-[#09090e]" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[80px]">
                {profile.name.split(' ')[0]}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
