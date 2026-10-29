import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { triggerConfetti, playChime } from '../../utils/celebration';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const {
    toggleDarkMode,
    setIsNewTaskOpen,
    setIsSettingsOpen,
    toggleSidebar,
    setIsStudyVaultOpen,
    setIsZenFocusOpen,
    setIsFlashcardsOpen,
    setIsScratchpadOpen,
    setIsSoundDockOpen,
    setIsJournalOpen,
    setIsExportDigestOpen,
  } = useApp();

  const commands = [
    {
      category: 'Smart Toolkit',
      items: [
        {
          id: 'act-vault',
          label: 'Academic Study Vault & Formula Cheat Sheets',
          icon: 'menu_book',
          badge: '⌘I',
          action: () => setIsStudyVaultOpen(true),
        },
        {
          id: 'act-zen',
          label: 'Enter Hyperfocus Zen Arena (Ambient Sound + Pomodoro)',
          icon: 'bolt',
          badge: '⌘Z',
          action: () => setIsZenFocusOpen(true),
        },
        {
          id: 'act-flashcards',
          label: 'Launch Active Recall Flashcards Deck',
          icon: 'style',
          badge: 'F',
          action: () => setIsFlashcardsOpen(true),
        },
        {
          id: 'act-scratchpad',
          label: 'Open Instant Scratchpad Notes',
          icon: 'edit_note',
          badge: '⌘J',
          action: () => setIsScratchpadOpen(true),
        },
        {
          id: 'act-sound',
          label: 'Focus Soundscape Studio (Rain, Binaural Pink, Cafe, Gamma)',
          icon: 'headphones',
          badge: '⌘U',
          action: () => setIsSoundDockOpen(true),
        },
        {
          id: 'act-journal',
          label: 'Academic Daily Standup & Mind Logbook',
          icon: 'history_edu',
          badge: '⌘M',
          action: () => setIsJournalOpen(true),
        },
        {
          id: 'act-export',
          label: 'Export Term Academic Digest Report (Print / PDF / Markdown)',
          icon: 'assignment_turned_in',
          badge: '⌘E',
          action: () => setIsExportDigestOpen(true),
        },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { id: 'nav-dash', label: 'Go to Dashboard', icon: 'space_dashboard', action: () => navigate('/dashboard') },
        { id: 'nav-todo', label: 'Go to To-Do List', icon: 'checklist_rtl', action: () => navigate('/todo') },
        { id: 'nav-assign', label: 'Go to Coursework Assignments', icon: 'task', action: () => navigate('/assignments') },
        { id: 'nav-routine', label: 'Go to Routine Tracker', icon: 'pace', action: () => navigate('/routine') },
        { id: 'nav-timetable', label: 'Go to Class Timetable', icon: 'calendar_month', action: () => navigate('/timetable') },
        { id: 'nav-goals', label: 'Go to Goals & Badges', icon: 'military_tech', action: () => navigate('/goals') },
      ],
    },
    {
      category: 'Quick Actions',
      items: [
        {
          id: 'act-settings',
          label: 'Open Settings (Change Name, Degree, Avatar)',
          icon: 'manage_accounts',
          badge: 'S',
          action: () => setIsSettingsOpen(true),
        },
        {
          id: 'act-toggle-sidebar',
          label: 'Hide / Unhide Sidebar',
          icon: 'dock_to_left',
          badge: 'H',
          action: () => toggleSidebar(),
        },
        {
          id: 'act-new-task',
          label: 'Create New Task',
          icon: 'add_circle',
          badge: 'N',
          action: () => setIsNewTaskOpen(true),
        },
        {
          id: 'act-theme',
          label: 'Toggle Dark / Light Theme',
          icon: 'contrast',
          badge: 'T',
          action: () => toggleDarkMode(),
        },
        {
          id: 'act-confetti',
          label: 'Celebrate! (Confetti Blast)',
          icon: 'celebration',
          action: () => {
            triggerConfetti();
            playChime('success');
          },
        },
      ],
    },
  ];

  const flattenedItems = commands
    .flatMap((g) => g.items)
    .filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (flattenedItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (flattenedItems.length || 1)) % (flattenedItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flattenedItems[selectedIndex]) {
          flattenedItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flattenedItems, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white/95 dark:bg-[#121217]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10">
          <span className="material-symbols-outlined text-blue-600 text-2xl mr-3">
            search
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to page... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto py-2 px-2 scrollbar-hide">
          {flattenedItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              No matching commands found.
            </div>
          ) : (
            flattenedItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 translate-x-1'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 py-0.5 rounded bg-white dark:bg-[#1a1a24] font-bold">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-[#1a1a24] font-bold">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1a1a24] font-bold">↵</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <img src="/logo.svg" alt="Scholara Logo" className="w-4 h-4 rounded-full" />
            <span className="text-blue-600 dark:text-blue-400 font-bold">Scholara OS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
