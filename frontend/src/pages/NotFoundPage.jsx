import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScholaraLogo from '../components/common/ScholaraLogo';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      {/* Outer Glow Halo */}
      <div className="absolute w-96 h-96 bg-blue-600/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass 404 Cockpit Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 22,
          stiffness: 240,
        }}
        className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 text-center space-y-6 overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xl"
      >
        {/* Top Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <ScholaraLogo size="xs" showText={false} />
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Navigation Exception
          </span>
        </motion.div>

        {/* Floating 404 Numeric Hero with Radar Visual */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          {/* Animated Orbital Scan Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute w-44 h-44 rounded-full border border-dashed border-blue-500/30 dark:border-blue-400/20"
          />

          {/* Floating 404 Text */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="relative"
          >
            <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 select-none drop-shadow-sm">
              404
            </h1>
          </motion.div>

          <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
            ERROR: ROUTE_UNRESOLVED
          </span>
        </div>

        {/* Informative Explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-2 max-w-sm mx-auto"
        >
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Vector Lost
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            The requested syllabus path, deliverable ID, or cockpit module cannot be located in this semester's database index.
          </p>
        </motion.div>

        {/* Interactive Recovery Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">space_dashboard</span>
            <span>Return to Cockpit</span>
          </Link>
        </motion.div>

        {/* Quick Nav Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Jump:
          </span>
          {[
            { label: 'Sprint Tasks', path: '/todo' },
            { label: 'Deliverables', path: '/assignments' },
            { label: 'Timetable', path: '/timetable' },
            { label: 'Routines', path: '/routine' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
