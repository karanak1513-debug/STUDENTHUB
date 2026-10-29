import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function NewTaskModal() {
  const { isNewTaskOpen, setIsNewTaskOpen, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Economics');
  const [due, setDue] = useState('Today, 6:00 PM');
  const [priority, setPriority] = useState('high');
  const [tag, setTag] = useState('Assignment');

  if (!isNewTaskOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      subject,
      due,
      priority,
      tag,
    });

    triggerMiniConfetti(0.5, 0.5);
    playChime('success');

    setTitle('');
    setIsNewTaskOpen(false);
  };

  const subjects = ['Economics', 'Management', 'Accounting', 'Marketing', 'Statistics', 'Personal'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={() => setIsNewTaskOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#121217] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">add_task</span>
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Create New Task
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register an action item, problem set, or study sprint
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewTaskOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Finish Market Structure Regression Model"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setSubject(sub)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    subject === sub
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-600/40 font-bold'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="high">🔴 High Priority (Red)</option>
                <option value="medium">🔵 Medium Priority (Blue)</option>
                <option value="low">⚪ Normal Priority (White/Black)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Assignment">Assignment</option>
                <option value="Reading">Reading</option>
                <option value="Exam Prep">Exam Prep</option>
                <option value="Project">Project</option>
                <option value="Personal">Personal Routine</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Due Date / Target Time
            </label>
            <input
              type="text"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              placeholder="e.g. Tomorrow, 5:00 PM"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-white font-black text-sm shadow-md shadow-blue-600/30 hover:shadow-lg transition-all active:scale-95"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
