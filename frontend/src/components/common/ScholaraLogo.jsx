import React from 'react';

export default function ScholaraLogo({ size = 'md', showText = true, className = '' }) {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full blur-xs opacity-40 group-hover:opacity-80 transition duration-300 pointer-events-none"></div>
        <img
          src="/logo.svg"
          alt="Scholara OS Logo"
          className={`relative ${currentSize} rounded-full object-contain shadow-md transition-transform duration-300 group-hover:scale-105`}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Scholara
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
              OS
            </span>
          </div>
          <span className="text-[8.5px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
            Student Platform
          </span>
        </div>
      )}
    </div>
  );
}
