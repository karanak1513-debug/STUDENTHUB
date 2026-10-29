import React, { useState, useEffect } from 'react';
import { triggerMiniConfetti, triggerConfetti, playChime } from '../../utils/celebration';

export default function AcademicJournalModal({ isOpen, onClose }) {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('scholara_academic_journal');
      return saved ? JSON.parse(saved) : [
        {
          id: 'j1',
          date: 'Yesterday, 9:30 PM',
          hours: '4.5',
          rating: 'Peak Flow',
          ratingStars: 5,
          breakthroughs: 'Solved Dijkstra and Bellman-Ford shortest-path graph proofs. Reviewed ML loss function convexity.',
          blockers: 'Dynamic programming state transitions on trees still need 1 more practice session.',
          tomorrowPriority: 'Midterm algorithm defense review with Prof. Vance.',
        },
      ];
    } catch {
      return [];
    }
  });

  const [hours, setHours] = useState('4.0');
  const [rating, setRating] = useState('Peak Flow');
  const [ratingStars, setRatingStars] = useState(5);
  const [breakthroughs, setBreakthroughs] = useState('');
  const [blockers, setBlockers] = useState('');
  const [tomorrowPriority, setTomorrowPriority] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'history'

  useEffect(() => {
    try {
      localStorage.setItem('scholara_academic_journal', JSON.stringify(entries));
    } catch (e) {
      console.warn('Could not save journal to localStorage', e);
    }
  }, [entries]);

  if (!isOpen) return null;

  const ratingsList = [
    { label: 'Peak Flow', stars: 5, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30' },
    { label: 'High Focus', stars: 4, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-500/30' },
    { label: 'Balanced', stars: 3, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-500/30' },
    { label: 'Distracted', stars: 2, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-500/30' },
    { label: 'Fatigued', stars: 1, color: 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-500/30' },
  ];

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!breakthroughs.trim() && !tomorrowPriority.trim()) return;

    const newEntry = {
      id: 'j-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      hours: hours || '0',
      rating,
      ratingStars,
      breakthroughs: breakthroughs.trim() || 'General study completed.',
      blockers: blockers.trim() || 'No major blockers encountered.',
      tomorrowPriority: tomorrowPriority.trim() || 'Continue active coursework sprint.',
    };

    setEntries((prev) => [newEntry, ...prev]);
    setBreakthroughs('');
    setBlockers('');
    setTomorrowPriority('');
    triggerMiniConfetti(0.5, 0.4);
    playChime('success');
    setActiveTab('history');
  };

  const handleDeleteEntry = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    playChime('bell');
  };

  const handleDownloadMarkdown = () => {
    triggerConfetti();
    playChime('success');

    const content = `# Scholara Academic Journal & Daily Standup Logs\nExported on: ${new Date().toLocaleString()}\n\n` +
      entries.map((entry, idx) => `
## Entry #${entries.length - idx}: ${entry.date}
- **Focus Output:** ${entry.hours} Hours (${entry.rating} - ${entry.ratingStars}/5 ⭐)
- **Breakthroughs & Topics Mastered:**
  ${entry.breakthroughs}
- **Blockers & Hurdles:**
  ${entry.blockers}
- **Top Priority For Tomorrow:**
  ${entry.tomorrowPriority}
---
`).join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Academic_Journal_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121217] text-slate-900 dark:text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">history_edu</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Academic Daily Standup & Journal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold">
                  ⌘M
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reflect on study sprints, log hours, identify roadblocks & plan tomorrow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={handleDownloadMarkdown}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-bold transition-all"
                title="Export Journal to Markdown File"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export .md</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200/80 dark:border-white/10 px-6 pt-3 gap-6 bg-slate-50/30 dark:bg-transparent">
          <button
            onClick={() => setActiveTab('write')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'write'
                ? 'text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Log Today's Standup
            {activeTab === 'write' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Past Logs History
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500">
              {entries.length}
            </span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto scrollbar-hide flex-1 space-y-5">
          {activeTab === 'write' ? (
            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* Output Hours & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Study Hours Completed Today
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-28 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-xs text-slate-400 font-medium">hrs in focus sprint</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Cognitive Flow State
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ratingsList.map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => {
                          setRating(r.label);
                          setRatingStars(r.stars);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold border transition-all ${
                          rating === r.label
                            ? r.color + ' ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-400'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breakthroughs & Topics */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                  <span>1. Breakthroughs & Topics Mastered Today</span>
                  <span className="text-[10px] text-blue-500 font-medium lowercase">what worked well</span>
                </label>
                <textarea
                  rows={3}
                  value={breakthroughs}
                  onChange={(e) => setBreakthroughs(e.target.value)}
                  placeholder="e.g. Completed lecture 8 notes on Neural Architecture, solved 4 Leetcode medium problems, practiced dynamic programming..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Roadblocks & Doubts */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                  <span>2. Roadblocks, Hurdles & Unresolved Questions</span>
                  <span className="text-[10px] text-red-500 font-medium lowercase">to clarify with professor/peers</span>
                </label>
                <textarea
                  rows={2}
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  placeholder="e.g. Still unclear on backpropagation matrix dimensions in layer 3. Need to re-read syllabus chapter 6..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Tomorrow's Top Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                  <span>3. #1 Academic Priority for Tomorrow</span>
                  <span className="text-[10px] text-emerald-500 font-medium lowercase">non-negotiable objective</span>
                </label>
                <input
                  type="text"
                  value={tomorrowPriority}
                  onChange={(e) => setTomorrowPriority(e.target.value)}
                  placeholder="e.g. Finish EC204 Central Bank Policy Paper draft before 3:00 PM..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">save</span>
                  <span>Save Journal Entry</span>
                </button>
              </div>
            </form>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No journal logs recorded yet. Write your first daily reflection!
                </div>
              ) : (
                entries.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.date}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {item.hours} hrs focus
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                          {item.rating} ({item.ratingStars}★)
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                          title="Delete entry"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] block">
                          Mastered & Done:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {item.breakthroughs}
                        </p>
                      </div>

                      {item.blockers && (
                        <div>
                          <span className="font-bold text-red-500 text-[11px] block">
                            Hurdles / Doubts:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {item.blockers}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="font-bold text-emerald-500 text-[11px] block">
                          Target For Tomorrow:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {item.tomorrowPriority}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
