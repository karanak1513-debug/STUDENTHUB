import React from 'react';
import { motion } from 'framer-motion';
import ScholaraLogo from './ScholaraLogo';

export default function LoadingSpinner({
  message = 'Synchronizing Academic Cockpit...',
  fullScreen = false,
  size = 'md',
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center p-8 space-y-5"
    >
      {/* Central Kinetic Glowing Logo with Spinning Orbit Rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer ambient blur halo */}
        <div className="absolute w-28 h-28 bg-blue-600/20 dark:bg-blue-500/25 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Orbit Ring 1: Clockwise Conic Gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-2 border-transparent border-t-blue-600 border-r-cyan-400 dark:border-t-blue-400 dark:border-r-cyan-300"
        />

        {/* Orbit Ring 2: Counter-Clockwise Dotted Accent */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
          className="absolute w-24 h-24 rounded-full border border-dashed border-blue-500/30 dark:border-blue-400/20"
        />

        {/* Center Scholara Emblem */}
        <div className="absolute">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ScholaraLogo size={size === 'lg' ? 'lg' : 'md'} showText={false} />
          </motion.div>
        </div>
      </div>

      {/* Loading Label with Shimmer */}
      <div className="text-center space-y-2 max-w-xs">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <h4 className="text-xs sm:text-sm font-black tracking-tight text-slate-800 dark:text-slate-100">
            {message}
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Verifying SQLite WAL state & active study sprints
        </p>
      </div>

      {/* Kinetic Infinite Progress Shimmer Bar */}
      <div className="w-48 h-1 bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"
        />
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#09090e]/85 backdrop-blur-2xl">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center w-full">{content}</div>;
}
