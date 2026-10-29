import React, { useState, useEffect } from 'react';
import { triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function ScratchpadDrawer({ isOpen, onClose }) {
  const [content, setContent] = useState(() => {
    return (
      localStorage.getItem('scholara_scratchpad') ||
      `# Sprint Notes & Study Thoughts 🚀\n\n- [x] Read CS501 Lecture 12 on Graph Traversal\n- [ ] Complete ML405 Problem 3 (L2 Ridge derivation)\n- [ ] Review Macroeconomics Money Multiplier quiz\n\n### Quick Formulas:\n- Dijkstra Invariant: d[v] <= d[u] + w(u,v)\n- Ridge Estimator: β_ridge = (X'X + λI)^(-1) X'Y`
    );
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('scholara_scratchpad', content);
  }, [content]);

  if (!isOpen) return null;

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    playChime('success');
    triggerMiniConfetti(0.85, 0.2);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Clear your scratchpad notes?')) {
      setContent('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-[#121217] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col transform animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Instant Scratchpad
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Autosaved locally • Markdown ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Copy notes to clipboard"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Clear scratchpad"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-5 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type notes, formulas, scratchpad calculations, or study reflections..."
            className="w-full flex-1 bg-transparent border-none outline-none resize-none font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed placeholder:text-slate-400"
          />
        </div>

        {/* Footer Statistics */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span>{words} words</span>
            <span>•</span>
            <span>{chars} characters</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {copied ? 'Copied to clipboard!' : 'Auto-saved'}
          </span>
        </div>
      </div>
    </div>
  );
}
