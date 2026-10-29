import React, { useState } from 'react';
import { triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function StudyVaultModal({ isOpen, onClose }) {
  const [activeCourse, setActiveCourse] = useState('all'); // 'all', 'CS501', 'ML405', 'EC204'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAddingFormula, setIsAddingFormula] = useState(false);

  const [formulas, setFormulas] = useState([
    {
      id: 'f1',
      course: 'CS501',
      title: 'Master Theorem for Divide & Conquer',
      category: 'Algorithms',
      formula: 'T(n) = a T(n/b) + f(n)\n• If f(n) = O(n^(log_b(a) - ε)) => T(n) = Θ(n^log_b(a))\n• If f(n) = Θ(n^log_b(a)) => T(n) = Θ(n^log_b(a) * log n)\n• If f(n) = Ω(n^(log_b(a) + ε)) => T(n) = Θ(f(n))',
      notes: 'Used to solve recurrence relations for MergeSort, BinarySearch, Strassen.',
    },
    {
      id: 'f2',
      course: 'ML405',
      title: 'L2 Regularization (Ridge Regression)',
      category: 'Loss Functions',
      formula: 'Loss = MSE + λ ∑ (w_i)^2\nAnalytical Solution: w = (X^T X + λ I)^(-1) X^T y',
      notes: 'Shrinks parameters towards zero without setting them to exact zero. Prevents multicollinearity.',
    },
    {
      id: 'f3',
      course: 'ML405',
      title: 'Binary Cross-Entropy Loss (Log-Loss)',
      category: 'Classification',
      formula: 'L(y, p) = - [ y log(p) + (1 - y) log(1 - p) ]',
      notes: 'Convex loss function for binary logistic regression & sigmoid outputs.',
    },
    {
      id: 'f4',
      course: 'EC204',
      title: 'Simple Money Multiplier & Reserve Ratio',
      category: 'Monetary Policy',
      formula: 'Money Multiplier (m) = 1 / RRR\nTotal Money Created = Initial Deposit * (1 / RRR)',
      notes: 'RRR = Required Reserve Ratio. Inversely proportional to reserve requirement percentage.',
    },
    {
      id: 'f5',
      course: 'CS501',
      title: 'Dijkstra Shortest Path Relaxation Invariant',
      category: 'Graph Theory',
      formula: 'if (dist[u] + weight(u, v) < dist[v]) {\n    dist[v] = dist[u] + weight(u, v);\n    pq.push({dist[v], v});\n}',
      notes: 'Greedy shortest path. Invariant fails with negative weights (use Bellman-Ford).',
    },
    {
      id: 'f6',
      course: 'EC204',
      title: 'Fisher Equation of Real Interest Rate',
      category: 'Macroeconomics',
      formula: 'r ≈ i - π\n(Exact: 1 + i = (1 + r)(1 + π))',
      notes: 'r = real rate, i = nominal interest rate, π = expected inflation rate.',
    },
  ]);

  // New formula form state
  const [newCourse, setNewCourse] = useState('CS501');
  const [newTitle, setNewTitle] = useState('');
  const [newFormulaText, setNewFormulaText] = useState('');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playChime('success');
    triggerMiniConfetti(0.5, 0.4);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddFormula = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFormulaText.trim()) return;

    setFormulas((prev) => [
      {
        id: `f-${Date.now()}`,
        course: newCourse,
        title: newTitle.trim(),
        category: 'Custom Formula',
        formula: newFormulaText.trim(),
        notes: newNotes.trim() || 'Custom user formula entry.',
      },
      ...prev,
    ]);

    setNewTitle('');
    setNewFormulaText('');
    setNewNotes('');
    setIsAddingFormula(false);
    triggerMiniConfetti(0.5, 0.5);
    playChime('success');
  };

  const filteredFormulas = formulas.filter((item) => {
    const matchesCourse = activeCourse === 'all' || item.course === activeCourse;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const courses = [
    { id: 'all', label: 'All Courses' },
    { id: 'CS501', label: 'CS501 Algorithms' },
    { id: 'ML405', label: 'ML405 Machine Learning' },
    { id: 'EC204', label: 'EC204 Economics' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121217] text-slate-900 dark:text-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Academic Study Vault & Formula Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                  VAULT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Core formulas, theorems, cheat sheets & lecture drive shortcuts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingFormula(!isAddingFormula)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-600/20 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Formula</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Search & Course Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search formulas, theorems, derivations, algorithms (e.g. Master Theorem, L2, Dijkstra)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#181822] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCourse(c.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeCourse === c.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-[#1a1a24] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Formula Inline Form */}
        {isAddingFormula && (
          <form onSubmit={handleAddFormula} className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900/40 space-y-3 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs font-bold"
              >
                <option value="CS501">CS501 Algorithms</option>
                <option value="ML405">ML405 Machine Learning</option>
                <option value="EC204">EC204 Economics</option>
                <option value="General">General / Math</option>
              </select>

              <input
                type="text"
                required
                placeholder="Formula or Theorem Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs font-bold"
              />
            </div>

            <textarea
              rows={3}
              required
              placeholder="Formula equation or pseudocode..."
              value={newFormulaText}
              onChange={(e) => setNewFormulaText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 font-mono text-xs"
            />

            <input
              type="text"
              placeholder="Key notes / when to use (optional)..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingFormula(false)}
                className="px-3 py-1 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
              >
                Save to Vault
              </button>
            </div>
          </form>
        )}

        {/* Formula Cards List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              No formulas match your search. Click "Add Formula" to record a new one!
            </div>
          ) : (
            filteredFormulas.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-blue-600/40 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
                        {item.course}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.formula)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white'
                      }`}
                      title="Copy formula"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h4>

                  {/* Formula Codebox */}
                  <div className="p-3.5 rounded-xl bg-slate-900 dark:bg-[#07070a] text-blue-400 dark:text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre">
                    {item.formula}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>{filteredFormulas.length} formulas in vault</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            Scholara Academic Vault
          </span>
        </div>
      </div>
    </div>
  );
}
