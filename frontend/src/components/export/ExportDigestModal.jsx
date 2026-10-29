import React from 'react';
import { useApp } from '../../context/AppContext';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function ExportDigestModal({ isOpen, onClose }) {
  const { profile, tasks } = useApp();

  if (!isOpen) return null;

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 20;

  const sampleCourses = [
    { code: 'CS501', title: 'Advanced Algorithms & Graph Theory', credits: 4, grade: 'A', instructor: 'Dr. Evelyn Vance' },
    { code: 'ML405', title: 'Machine Learning & Neural Labs', credits: 4, grade: 'A', instructor: 'Prof. Marcus Chen' },
    { code: 'EC204', title: 'Macroeconomic Analysis & Policy', credits: 3, grade: 'A-', instructor: 'Dr. Clara Thorne' },
    { code: 'MG301', title: 'Strategic Operations & Leadership', credits: 3, grade: 'A', instructor: 'Prof. Julian Ross' },
  ];

  const handlePrint = () => {
    triggerMiniConfetti(0.5, 0.4);
    playChime('bell');
    window.print();
  };

  const handleDownloadMarkdown = () => {
    triggerConfetti();
    playChime('success');

    const md = `# ACADEMIC STANDING & DIGEST REPORT
**Student:** ${profile.name || 'Sarah Jenkins'}  
**Program:** ${profile.program || 'BBA 3rd Semester'}  
**Institution:** ${profile.university || 'Stanford University'}  
**Generated:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}  
**Honors Standing:** Summa Cum Laude (Top 1% Track)

---

## 1. Executive Metrics
- **Cumulative GPA:** ${profile.gpa || '3.88'} / 4.00 (Target: ${profile.targetGpa || '4.00'})
- **Focus Velocity:** ${profile.streakDays || 14} Days Active Circadian Streak (Top 5% Consistency)
- **Coursework Execution Rate:** ${progressPct}% (${completedCount}/${tasks.length} deliverables completed)
- **Daily Focus Goal:** ${profile.dailyGoalHours || 5.0} Hours / Day

---

## 2. Active Course Enrollments
| Course Code | Course Name | Credits | Projected Grade | Instructor |
| :--- | :--- | :---: | :---: | :--- |
${sampleCourses.map((c) => `| **${c.code}** | ${c.title} | ${c.credits} | ${c.grade} | ${c.instructor} |`).join('\n')}

---

## 3. High-Priority Deliverables Roadmap
${tasks.map((t) => `- [${t.completed ? 'x' : ' '}] **${t.subject || 'Coursework'}:** ${t.title} (${t.due}) - Priority: ${t.priority?.toUpperCase()}`).join('\n')}

---
*Report generated via Scholara Student Platform OS.*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_Academic_Digest.md`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyClipboard = () => {
    const text = `Scholara Academic Digest - ${profile.name} (${profile.program})\nGPA: ${profile.gpa || '3.88'} | Streak: ${profile.streakDays || 14} Days | Tasks: ${completedCount}/${tasks.length} Completed (${progressPct}%)\nTerm Status: In Good Standing (Honors Track)`;
    navigator.clipboard.writeText(text);
    triggerMiniConfetti(0.5, 0.5);
    playChime('success');
    alert('Summary copied to clipboard!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121217] text-slate-900 dark:text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden flex flex-col max-h-[88vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Academic Progress Digest
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold">
                  ⌘E
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official student term report, coursework velocity & honor roll standing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto scrollbar-hide flex-1 space-y-6">
          {/* Identity Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-slate-100 to-red-600/10 dark:from-blue-950/30 dark:via-white/5 dark:to-red-950/30 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-600 shadow-sm"
              />
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">
                  {profile.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {profile.program} • {profile.university || 'Stanford University'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Honors Status
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-block mt-0.5">
                Summa Cum Laude Track
              </span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">GPA</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{profile.gpa || '3.88'}</span>
              <span className="text-[10px] text-slate-400 block">/ 4.00 Target</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Streak</span>
              <span className="text-2xl font-black text-red-600 dark:text-red-400">{profile.streakDays || 14}d</span>
              <span className="text-[10px] text-slate-400 block">Top 5% Consistency</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Tasks Done</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{progressPct}%</span>
              <span className="text-[10px] text-slate-400 block">{completedCount} of {tasks.length} Completed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Target</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{profile.dailyGoalHours || 5.0}h</span>
              <span className="text-[10px] text-slate-400 block">Focus Study/Day</span>
            </div>
          </div>

          {/* Enrolled Courses Table */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Term Enrollment Coursework</span>
              <span>14 Total Credits</span>
            </h5>
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {sampleCourses.map((c) => (
                <div key={c.code} className="p-3 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold font-mono">
                      {c.code}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{c.credits} Cr</span>
                    <span className="font-black px-2 py-0.5 rounded-md bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400">
                      {c.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-white/5">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">content_copy</span>
            <span>Copy Text</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-blue-600 text-xs font-bold border border-slate-200 dark:border-white/10 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">print</span>
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
