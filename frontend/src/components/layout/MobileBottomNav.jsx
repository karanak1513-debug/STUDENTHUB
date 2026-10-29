import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  const tabs = [
    { name: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
    { name: 'To-Do', path: '/todo', icon: 'checklist_rtl' },
    { name: 'Assign', path: '/assignments', icon: 'task' },
    { name: 'Routine', path: '/routine', icon: 'pace' },
    { name: 'Timetable', path: '/timetable', icon: 'calendar_month' },
    { name: 'Goals', path: '/goals', icon: 'military_tech' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-16 bg-white/95 dark:bg-[#0c0c12]/95 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] border-t border-slate-200/90 dark:border-white/10">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center rounded-2xl px-2.5 py-1.5 transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 bg-gradient-to-r from-blue-600 to-red-600 rounded-full shadow-sm shadow-blue-600/50"></span>
              )}
              <span
                className={`material-symbols-outlined text-[21px] transition-transform duration-200 ${
                  isActive ? 'filled scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight font-black">
                {tab.name}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
