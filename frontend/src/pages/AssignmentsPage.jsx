import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../utils/celebration';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'submitted'
  const [timelinePeriod, setTimelinePeriod] = useState('week'); // 'week', 'month'
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS304');
  const [newInstructor, setNewInstructor] = useState('Prof. Davis');
  const [newDue, setNewDue] = useState('Oct 25, 2024, 11:59 PM');
  const [newWeight, setNewWeight] = useState('20%');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.assignments.getAll();
      if (res && res.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmitting = async (id, title) => {
    try {
      setSubmittingId(id);
      const res = await api.assignments.submit(id, 'Submitted via Scholara Hub');
      if (res && res.data) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === id ? res.data : a))
        );
        triggerConfetti();
        playChime('success');
        showNotification(`🎉 "${title}" has been successfully submitted!`);
      }
    } catch (err) {
      console.error('Failed to submit assignment:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.assignments.create({
        title: newTitle.trim(),
        course: newCourse,
        instructor: newInstructor,
        due: newDue,
        weight: newWeight,
        urgent: true,
      });
      if (res && res.data) {
        setAssignments((prev) => [res.data, ...prev]);
        setIsAddModalOpen(false);
        setNewTitle('');
        triggerMiniConfetti(0.5, 0.5);
        playChime('success');
        showNotification(`Assignment "${res.data.title}" added to your tracker.`);
      }
    } catch (err) {
      console.error('Failed to add assignment:', err);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = assignments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'submitted') return a.status === 'submitted';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black border border-white/20 backdrop-blur-xl"
          >
            <span className="material-symbols-outlined text-[20px]">celebration</span>
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
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
              Coursework & Deliverables Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Assignments & Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Coursework deadlines, project milestone roadmaps, and grade percentages.
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-black text-xs shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Assignment</span>
        </motion.button>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left 8 Cols: Timeline & Urgent Coursework */}
        <div className="xl:col-span-8 space-y-5">
          {/* Timeline View Section */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="glass-card rounded-3xl p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">view_timeline</span>
                </div>
                <div>
                  <h2 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                    Submission Timeline & Sprints
                  </h2>
                  <p className="text-[10px] text-slate-400">Gantt schedule of active deliverables</p>
                </div>
              </div>

              <div className="flex gap-1 bg-white/60 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                <button
                  onClick={() => setTimelinePeriod('week')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    timelinePeriod === 'week'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimelinePeriod('month')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    timelinePeriod === 'month'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div className="min-w-[580px] space-y-3">
                <div className="grid grid-cols-5 gap-2 text-[11px] font-black text-slate-400 border-b border-slate-200/60 dark:border-white/5 pb-2">
                  <div>Mon 12</div>
                  <div className="text-blue-600 flex items-center gap-1 font-black">
                    <span>Tue 13 (Today)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  </div>
                  <div>Wed 14</div>
                  <div>Thu 15</div>
                  <div>Fri 16</div>
                </div>

                {/* Timeline Gantt Bars */}
                <div className="space-y-2.5 relative pt-1">
                  {assignments.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="h-10 relative bg-white/50 dark:bg-white/[0.02] rounded-xl border border-slate-200/60 dark:border-white/5"
                    >
                      <div
                        className={`absolute ${
                          idx === 0
                            ? 'left-[10%] w-[45%]'
                            : idx === 1
                            ? 'left-[25%] w-[40%]'
                            : 'left-[45%] w-[50%]'
                        } top-1 bottom-1 ${
                          item.status === 'submitted'
                            ? 'bg-blue-600 text-white shadow-blue-600/30'
                            : idx % 2 === 0
                            ? 'bg-red-600 text-white shadow-red-600/30'
                            : 'bg-slate-900 dark:bg-white dark:text-black text-white'
                        } rounded-lg flex items-center px-3 shadow-sm hover:brightness-110 transition-all cursor-pointer text-xs font-black`}
                      >
                        <span className="truncate">
                          {item.course}: {item.title} (
                          {item.status === 'submitted' ? 'Submitted' : `${item.progress}%`})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Urgent & Due Soon */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">
                alarm
              </span>
              <span>Active & Urgent Coursework</span>
            </h2>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2 glass-card rounded-3xl">
                <span className="material-symbols-outlined animate-spin text-blue-600">progress_activity</span>
                <span>Loading coursework...</span>
              </div>
            ) : assignments.filter((a) => a.status === 'pending').length === 0 ? (
              <div className="p-8 glass-card rounded-3xl text-center text-xs text-slate-500 font-medium">
                🎉 No active coursework pending. You're completely caught up!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {assignments
                  .filter((a) => a.status === 'pending')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-red-500/50"
                    >
                      <div className="space-y-2.5 relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-red-500/20">
                            Due: {item.due}
                          </span>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                            Weight: {item.weight}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                            {item.course} • {item.instructor}
                          </p>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] font-black">
                            <span className="text-slate-500">Draft Progress</span>
                            <span className="text-blue-600">{item.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all duration-700"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-white/10 relative z-10">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSubmitting(item.id, item.title)}
                          disabled={submittingId === item.id}
                          className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          <span>{submittingId === item.id ? 'Submitting...' : 'Upload & Submit'}</span>
                        </motion.button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.section>

          {/* All Coursework Table */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="glass-card rounded-3xl p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                All Coursework ({assignments.length})
              </h3>

              <div className="flex items-center gap-1.5">
                {['all', 'pending', 'submitted'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-xl text-xs font-black capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/60 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/60 dark:border-white/5 pb-2 font-black">
                    <th className="pb-2.5 uppercase tracking-wider">Course</th>
                    <th className="pb-2.5 uppercase tracking-wider">Assignment</th>
                    <th className="pb-2.5 uppercase tracking-wider">Due Date</th>
                    <th className="pb-2.5 uppercase tracking-wider">Status</th>
                    <th className="pb-2.5 uppercase tracking-wider">Grade</th>
                    <th className="pb-2.5 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-500">
                        Loading coursework...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-xs text-slate-400 font-medium">
                        No coursework found matching this tab.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 font-black text-blue-600 dark:text-blue-400">
                          {item.course}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">
                          {item.due}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              item.status === 'submitted'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            }`}
                          >
                            {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 font-black text-slate-800 dark:text-slate-200">
                          {item.grade || '—'}
                        </td>
                        <td className="py-3 text-right">
                          {item.status === 'pending' && (
                            <button
                              onClick={() => handleSubmitting(item.id, item.title)}
                              disabled={submittingId === item.id}
                              className="text-xs font-bold text-blue-600 hover:text-red-600 transition-colors"
                            >
                              Submit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Right 4 Cols: Quick Actions & Predicted GPA */}
        <div className="xl:col-span-4 space-y-5">
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="glass-card rounded-3xl p-5 text-center space-y-3"
          >
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="border-2 border-dashed border-blue-500/40 rounded-2xl p-5 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
              </div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                Add & Track Assignment
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Register new coursework papers or capstone deliverables
              </p>
              <button
                type="button"
                className="mt-3 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black rounded-xl shadow-xs"
              >
                Register Deliverable
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="glass-card rounded-3xl p-5 space-y-2.5"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Cumulative Term Standing
            </h3>
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold">Predicted Term GPA</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  3.88 / 4.00
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Dean's List
              </span>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Add Assignment Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card bg-white/95 dark:bg-[#10101a]/95 w-full max-w-lg rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200/70 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">post_add</span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Register Assignment
                    </h3>
                    <p className="text-[10px] text-slate-400">Add to term deliverables schedule</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Title & Subject Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Econometric Modeling & Regression Paper"
                    className="w-full px-3.5 py-2.5 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      Grade Weight
                    </label>
                    <input
                      type="text"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black rounded-xl shadow-md"
                  >
                    Save Deliverable
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
