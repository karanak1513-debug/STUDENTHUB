import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { triggerMiniConfetti, playChime } from '../utils/celebration';

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [schedule, setSchedule] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM - 11:30 AM');
  const [newRoom, setNewRoom] = useState('Room 402 • Tech Hub');
  const [newInstructor, setNewInstructor] = useState('Prof. Davis');

  const days = [
    { key: 'Mon', name: 'Monday', date: 'Oct 23' },
    { key: 'Tue', name: 'Tuesday', date: 'Oct 24' },
    { key: 'Wed', name: 'Wednesday', date: 'Oct 25' },
    { key: 'Thu', name: 'Thursday', date: 'Oct 26' },
    { key: 'Fri', name: 'Friday', date: 'Oct 27' },
  ];

  const fetchTimetable = async () => {
    try {
      const res = await api.timetable.getAll();
      if (res && res.data) {
        setSchedule(res.data);
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    try {
      const res = await api.timetable.addClass({
        day: selectedDay,
        code: newCode.trim(),
        name: newName.trim(),
        time: newTime.trim(),
        room: newRoom.trim(),
        instructor: newInstructor.trim(),
      });
      if (res && res.data) {
        setSchedule((prev) => ({
          ...prev,
          [selectedDay]: [...(prev[selectedDay] || []), res.data],
        }));
        setIsAddModalOpen(false);
        setNewCode('');
        setNewName('');
        triggerMiniConfetti(0.5, 0.5);
        playChime('success');
      }
    } catch (err) {
      console.error('Failed to add class:', err);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await api.timetable.deleteClass(id);
      setSchedule((prev) => {
        const next = { ...prev };
        if (next[selectedDay]) {
          next[selectedDay] = next[selectedDay].filter((c) => c.id !== id);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Lecture & Lab Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Lecture halls, seminar rooms, lab slots, and office consultation hours.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-white/[0.04] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-[17px] text-blue-600">calendar_month</span>
            <span>Week 8 • Active</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Add Class</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Day Selector Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
      >
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
              selectedDay === d.key
                ? 'bg-gradient-to-br from-blue-600 to-red-600 text-white border-transparent shadow-lg shadow-blue-600/25 scale-[1.02]'
                : 'glass-card border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-500/40'
            }`}
          >
            <p className="text-xs font-black">{d.name}</p>
            <p
              className={`text-[10px] mt-0.5 font-bold ${
                selectedDay === d.key ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              {d.date}
            </p>
          </button>
        ))}
      </motion.div>

      {/* Selected Day Agenda View */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="glass-card rounded-3xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">event_available</span>
            </div>
            <div>
              <h2 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                {days.find((d) => d.key === selectedDay)?.name}'s Lectures
              </h2>
              <p className="text-[10px] text-slate-400">Class schedule & room locations</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            {schedule[selectedDay]?.length || 0} Sessions
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {!schedule[selectedDay] || schedule[selectedDay].length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
              ☕ No classes scheduled for this day. Free study & relaxation time!
            </div>
          ) : (
            schedule[selectedDay].map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {item.code}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {item.instructor}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-red-600">
                        location_on
                      </span>
                      {item.room}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-center">
                  <span className="text-[11px] font-mono font-bold bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span>
                    {item.time}
                  </span>
                  <button
                    onClick={() => handleDeleteClass(item.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"
                    title="Remove class"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Class Modal */}
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
              className="glass-card bg-white/95 dark:bg-[#10101a]/95 w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10 mb-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Add Class to {days.find((d) => d.key === selectedDay)?.name}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS501"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graph Theory & Optimization"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Room / Hall
                    </label>
                    <input
                      type="text"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      className="w-full px-3 py-2 bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-xl shadow-md"
                  >
                    Save Class
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
