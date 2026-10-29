import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../utils/celebration';

export default function GoalsPage() {
  const { profile } = useApp();
  const [milestones, setMilestones] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Academic');
  const [newDue, setNewDue] = useState('Next Month');

  // Interactive Course Assessment Forecaster
  const [targetCourse, setTargetCourse] = useState('CS501');
  const [desiredGradeTarget, setDesiredGradeTarget] = useState(93);
  const [assessments, setAssessments] = useState([
    { id: 'a1', name: 'Homework Problem Sets', weight: 20, score: 92, completed: true },
    { id: 'a2', name: 'Midterm Theory Exam', weight: 30, score: 85, completed: true },
    { id: 'a3', name: 'Course Laboratory Project', weight: 15, score: 94, completed: true },
    { id: 'a4', name: 'Final Comprehensive Exam', weight: 35, score: 0, completed: false },
  ]);

  const earnedWeight = assessments
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + (parseFloat(a.score || 0) / 100) * parseFloat(a.weight || 0), 0);

  const pendingWeight = assessments
    .filter((a) => !a.completed)
    .reduce((sum, a) => sum + parseFloat(a.weight || 0), 0);

  const totalAssessWeight = assessments.reduce((sum, a) => sum + parseFloat(a.weight || 0), 0);

  const requiredPendingScore =
    pendingWeight > 0
      ? Math.max(0, (((desiredGradeTarget - earnedWeight) / pendingWeight) * 100)).toFixed(1)
      : earnedWeight >= desiredGradeTarget ? '0.0' : 'N/A';

  const handleToggleAssessCompleted = (id) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
    playChime('success');
  };

  const handleUpdateAssessScore = (id, newScore) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, score: Number(newScore) } : a))
    );
  };

  const handleUpdateAssessWeight = (id, newWeight) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, weight: Number(newWeight) } : a))
    );
  };

  const handleDeleteAssess = (id) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    async function loadGoals() {
      try {
        const [milestonesRes, badgesRes] = await Promise.all([
          api.goals.getMilestones(),
          api.goals.getBadges(),
        ]);
        if (milestonesRes?.data) setMilestones(milestonesRes.data);
        if (badgesRes?.data) setBadges(badgesRes.data);
      } catch (err) {
        console.error('Failed to load goals/badges:', err);
      }
    }
    loadGoals();
  }, []);

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.goals.createMilestone({
        title: newTitle.trim(),
        tag: newTag,
        due: newDue,
        progress: '0%',
        percent: 0,
      });
      if (res?.data) {
        setMilestones((prev) => [...prev, res.data]);
        setIsAddModalOpen(false);
        setNewTitle('');
        triggerMiniConfetti(0.5, 0.5);
        playChime('success');
      }
    } catch (err) {
      console.error('Failed to create milestone:', err);
    }
  };

  const handleIncrementProgress = async (id, currentPercent, e) => {
    const nextPercent = Math.min(100, (currentPercent || 0) + 15);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    if (nextPercent === 100) {
      triggerConfetti();
    } else {
      triggerMiniConfetti(x, y);
    }
    playChime('success');

    try {
      const res = await api.goals.updateMilestone(id, {
        percent: nextPercent,
        progress: `${nextPercent}%`,
      });
      if (res?.data) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === id ? res.data : m))
        );
      }
    } catch (err) {
      console.error('Failed to increment milestone:', err);
    }
  };

  const handleDeleteMilestone = async (id, e) => {
    e.stopPropagation();
    try {
      await api.goals.deleteMilestone(id);
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  };

  const handleBadgeClick = (badge, e) => {
    if (badge.unlocked) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerMiniConfetti(x, y);
      playChime('success');
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
              Honor Roll & Milestones
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Goals & Honors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Track term GPA velocity, active milestones, and student achievement badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-md shadow-blue-600/25 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
            <span>Scholar Level 12</span>
          </span>
        </div>
      </motion.div>

      {/* Bento KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cumulative GPA Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="glass-card rounded-3xl p-5"
        >
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Cumulative GPA Score
          </h3>

          <div className="flex items-center justify-between">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 96 96">
                <circle
                  className="text-slate-100 dark:text-white/10"
                  cx="48"
                  cy="48"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-blue-600 transition-all duration-1000 ease-out"
                  cx="48"
                  cy="48"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 - 238.7 * 0.95}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  3.88
                </span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Target GPA
              </p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">4.00</p>
              <div className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                <span>+0.18 Term</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Hours Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Weekly Study Output
            </h3>
            <span className="material-symbols-outlined text-[20px] text-blue-500">timer</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">28.5</span>
              <span className="text-xs font-bold text-slate-400">/ 35 hrs goal</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              6.5 hrs remaining to weekly milestone
            </p>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all duration-1000"
              style={{ width: '81%' }}
            />
          </div>
        </motion.div>

        {/* On-Time Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              On-Time Deliverables Rate
            </h3>
            <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                96%
              </span>
              <span className="text-[10px] text-slate-400 font-bold">this semester</span>
            </div>

            {/* Mini Bar Chart */}
            <div className="flex items-end h-10 gap-1.5 mt-2">
              {[
                { label: 'W1', height: '80%' },
                { label: 'W2', height: '95%' },
                { label: 'W3', height: '70%' },
                { label: 'W4', height: '100%' },
                { label: 'W5', height: '96%', active: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-slate-100 dark:bg-white/10 rounded-t h-8 relative flex items-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        bar.active ? 'bg-gradient-to-t from-blue-600 to-red-600' : 'bg-blue-600/30'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course Assessment Forecaster */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Course Assessment & Final Exam Forecaster
                </h3>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Target Simulator
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Input your coursework scores to forecast the exact score required on your final exam
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/[0.04] px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs">
              <span className="text-slate-400 text-[10px] font-bold">Course:</span>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="CS501">CS501</option>
                <option value="ML405">ML405</option>
                <option value="EC204">EC204</option>
                <option value="MG301">MG301</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/[0.04] px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs">
              <span className="text-slate-400 text-[10px] font-bold">Target:</span>
              <select
                value={desiredGradeTarget}
                onChange={(e) => setDesiredGradeTarget(Number(e.target.value))}
                className="bg-transparent font-black text-xs text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
              >
                <option value={93}>A (93%)</option>
                <option value={90}>A- (90%)</option>
                <option value={87}>B+ (87%)</option>
                <option value={83}>B (83%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forecast Result Banner */}
        <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Required Score on Pending Assessment(s) ({pendingWeight}% weight)
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black ${
                  parseFloat(requiredPendingScore) <= 100
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-red-500'
                }`}
              >
                {requiredPendingScore}%
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                to secure an overall {desiredGradeTarget}%
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
              parseFloat(requiredPendingScore) <= 85
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            }`}
          >
            <span>{parseFloat(requiredPendingScore) <= 85 ? '✓ Well In Reach' : '⚡ High Focus Required'}</span>
          </span>
        </div>

        {/* Assessment Component Rows */}
        <div className="space-y-2">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border bg-white/60 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5"
            >
              <div className="col-span-6 flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleAssessCompleted(a.id)}
                  className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                    a.completed
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 dark:border-white/20'
                  }`}
                >
                  {a.completed && <span className="material-symbols-outlined text-[12px]">check</span>}
                </button>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {a.name}
                </span>
              </div>

              <div className="col-span-3 text-center text-xs font-bold text-slate-500">
                {a.weight}% weight
              </div>

              <div className="col-span-3 text-right">
                {a.completed ? (
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                    {a.score}%
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 italic">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Active Milestones & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Milestones Left 6 cols */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="lg:col-span-6 glass-card rounded-3xl p-5 sm:p-6"
        >
          <div className="flex justify-between items-center border-b border-slate-200/70 dark:border-white/10 pb-3 mb-3">
            <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">flag</span>
              <span>Active Milestones ({milestones.length})</span>
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-blue-600 font-black hover:text-red-600 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Goal</span>
            </button>
          </div>

          <div className="space-y-2">
            {milestones.map((item) => (
              <div
                key={item.id}
                onClick={(e) => handleIncrementProgress(item.id, item.percent, e)}
                className="p-3 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 hover:border-blue-500/40 transition-all cursor-pointer group space-y-1.5"
                title="Click to advance progress by 15%!"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.2 bg-blue-500/10 text-blue-600 text-[9px] font-black rounded mb-0.5">
                      {item.tag}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-blue-600">
                    {item.percent}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges Right 6 cols */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="lg:col-span-6 glass-card rounded-3xl p-5 sm:p-6"
        >
          <div className="flex justify-between items-center border-b border-slate-200/70 dark:border-white/10 pb-3 mb-3">
            <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">military_tech</span>
              <span>Badges & Honors</span>
            </h2>
            <span className="text-[10px] font-mono font-black bg-red-500/10 text-red-600 px-2.5 py-0.5 rounded-lg">
              {unlockedCount} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => handleBadgeClick(badge, e)}
                className={`p-3 rounded-2xl border text-center transition-all relative cursor-pointer ${
                  badge.unlocked
                    ? 'bg-white/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 shadow-xs'
                    : 'bg-white/30 dark:bg-white/[0.01] border-dashed border-slate-200 dark:border-white/10 opacity-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-1.5 ${
                    badge.unlocked ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {badge.unlocked ? badge.icon : 'lock'}
                  </span>
                </div>

                <h4 className="font-black text-xs text-slate-900 dark:text-white truncate">
                  {badge.name}
                </h4>
                <p className="text-[9px] text-slate-400 line-clamp-1">
                  {badge.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
