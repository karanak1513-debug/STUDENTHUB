import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function MiniNotificationBar() {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    requestBrowserNotificationPermission,
  } = useApp();

  const [permissionState, setPermissionState] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isNotificationOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermissionState(res);
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4 sm:pr-8 bg-black/20 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsNotificationOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-white/95 dark:bg-[#121217]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">notifications</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Notifications
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark read
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Browser Permission Request Prompt */}
        {permissionState === 'default' && (
          <div className="mx-3 mt-2.5 p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400 shrink-0">
                notifications_active
              </span>
              <span className="text-[11px] text-blue-900 dark:text-blue-200 font-medium truncate">
                Enable desktop deadline alerts
              </span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 transition-colors"
            >
              Enable
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-80 overflow-y-auto scrollbar-hide p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No new notifications. You're fully up to date!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.read && markNotificationRead(item.id)}
                className={`p-3 rounded-2xl transition-all flex items-start gap-3 relative group cursor-pointer ${
                  item.read
                    ? 'bg-transparent opacity-75'
                    : 'bg-slate-50/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5'
                }`}
              >
                {/* Accent icon dot */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.type === 'red'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : item.type === 'green'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.type === 'red' ? 'alarm' : item.type === 'green' ? 'check_circle' : 'schedule'}
                  </span>
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h5>
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {item.message || item.desc}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">
                    {formatTimeAgo(item.created_at) || item.time || 'Recently'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all absolute right-2 top-2"
                  title="Dismiss notification"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50/60 dark:bg-white/5 border-t border-slate-200/80 dark:border-white/10 text-center">
          <span className="text-[11px] text-slate-400 font-medium">
            Scholara Priority Alerts (SQLite Synced)
          </span>
        </div>
      </div>
    </div>
  );
}
