import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, profile, updateProfile, darkMode, toggleDarkMode } = useApp();

  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [role, setRole] = useState('');
  const [university, setUniversity] = useState('');
  const [avatar, setAvatar] = useState('');
  const [targetGpa, setTargetGpa] = useState('4.00');
  const [dailyGoalHours, setDailyGoalHours] = useState('5.0');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || 'Sarah Jenkins');
      setProgram(profile.program || 'BBA 3rd Semester');
      setRole(profile.role || 'UG Scholar');
      setUniversity(profile.university || 'Stanford University');
      setAvatar(profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256');
      setTargetGpa(profile.targetGpa || '4.00');
      setDailyGoalHours(String(profile.dailyGoalHours || '5.0'));
    }
  }, [profile, isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const presetAvatars = [
    { label: 'Scholar 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' },
    { label: 'Scholar 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256' },
    { label: 'Scholar 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256' },
    { label: 'Scholar 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256' },
    { label: 'Scholar 5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' },
    { label: 'Scholar 6', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim(),
      program: program.trim(),
      role: role.trim(),
      university: university.trim(),
      avatar: avatar.trim(),
      targetGpa: targetGpa.trim(),
      dailyGoalHours: parseFloat(dailyGoalHours) || 5.0,
    });

    triggerMiniConfetti(0.5, 0.5);
    playChime('success');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#121217] text-slate-900 dark:text-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Red & Blue Highlights */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Student Profile & Hub Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your name, degree, avatar, and study targets
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Profile Avatar
            </label>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-blue-600 shadow-md">
                <img src={avatar} alt="Current Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Paste image URL or pick below..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Avatar Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {presetAvatars.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(p.url)}
                  className={`w-9 h-9 rounded-xl overflow-hidden ring-2 transition-all flex-shrink-0 ${
                    avatar === p.url ? 'ring-red-600 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. UG Scholar / Class Rep"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Academic Program & University */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Program / Degree
              </label>
              <input
                type="text"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g. B.Tech Computer Science 4th Sem"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                University / Institute
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Delhi University / Stanford"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Targets: GPA & Daily Study Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target GPA (out of 4.00)
              </label>
              <input
                type="text"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                placeholder="4.00"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Daily Focus Goal (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(e.target.value)}
                placeholder="5.0"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Theme Quick Toggle */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Theme Mode
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between high-contrast Dark & Clean White mode
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-300 dark:border-white/10 text-xs font-extrabold flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px] text-blue-600 dark:text-red-500">
                {darkMode ? 'dark_mode' : 'light_mode'}
              </span>
              <span>{darkMode ? 'Dark Obsidian' : 'Clean White'}</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-bounce-subtle">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Changes persist to cloud profile</span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
