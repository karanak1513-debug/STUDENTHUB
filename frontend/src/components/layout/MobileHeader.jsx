import React from 'react';
import { useApp } from '../../context/AppContext';

export default function MobileHeader({ title = 'Sarah', onOpenSearch }) {
  const { darkMode, toggleDarkMode, setIsNewTaskOpen, setIsSettingsOpen, setIsNotificationOpen, notifications, profile } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex md:hidden justify-between items-center w-full px-4 py-3 bg-white/90 dark:bg-[#0c0c12]/90 backdrop-blur-2xl border-b border-slate-200/90 dark:border-white/10 sticky top-0 z-40 transition-colors">
      <div
        onClick={() => setIsSettingsOpen(true)}
        className="flex items-center gap-2.5 cursor-pointer"
        title="Tap to change profile & settings"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-600 shadow-sm">
            <img
              alt={profile.name}
              className="w-full h-full object-cover"
              src={profile.avatar}
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-white dark:border-[#0c0c12]"></span>
        </div>
        <div>
          <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
            {profile.name}
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[120px]">
            {profile.program}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors active:scale-95"
          title="Search (⌘K)"
        >
          <span className="material-symbols-outlined text-[19px]">search</span>
        </button>

        {/* Mini Notification Bar Trigger */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors relative active:scale-95"
          title="Mini Notifications"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Add Task */}
        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all active:scale-95"
          title="Add New Task"
        >
          <span className="material-symbols-outlined text-[19px]">add</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors active:scale-95"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[19px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
