import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import AppNavbar from './AppNavbar';
import MobileBottomNav from './MobileBottomNav';
import NewTaskModal from './NewTaskModal';
import SettingsModal from './SettingsModal';
import MiniNotificationBar from './MiniNotificationBar';
import CommandPalette from '../common/CommandPalette';
import StudyVaultModal from '../vault/StudyVaultModal';
import ZenFocusModal from '../focus/ZenFocusModal';
import FlashcardsModal from '../flashcards/FlashcardsModal';
import ScratchpadDrawer from '../notes/ScratchpadDrawer';
import SoundDock from '../sound/SoundDock';
import AcademicJournalModal from '../journal/AcademicJournalModal';
import ExportDigestModal from '../export/ExportDigestModal';

export default function AppLayout() {
  const {
    isSidebarHidden,
    toggleSidebar,
    setIsNewTaskOpen,
    isStudyVaultOpen,
    setIsStudyVaultOpen,
    isZenFocusOpen,
    setIsZenFocusOpen,
    isFlashcardsOpen,
    setIsFlashcardsOpen,
    isScratchpadOpen,
    setIsScratchpadOpen,
    isSoundDockOpen,
    setIsSoundDockOpen,
    isJournalOpen,
    setIsJournalOpen,
    isExportDigestOpen,
    setIsExportDigestOpen,
  } = useApp();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewTaskOpen(true);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsStudyVaultOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setIsZenFocusOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsScratchpadOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setIsSoundDockOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsJournalOpen((prev) => !prev);
      }
      if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportDigestOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, setIsNewTaskOpen, setIsStudyVaultOpen, setIsZenFocusOpen, setIsScratchpadOpen, setIsSoundDockOpen, setIsJournalOpen, setIsExportDigestOpen]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-white flex flex-col md:flex-row transition-colors selection:bg-blue-600/20 selection:text-blue-600">
      {/* Background Animated Red & Blue Aurora Glow */}
      <div className="aurora-bg">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
      </div>

      {/* Desktop Sidebar (Smooth sliding, zero duplicate footer icons) */}
      <Sidebar />

      {/* Main Content Area: dynamically adjusts margin based on sidebar state */}
      <div
        className={`flex-1 flex flex-col min-h-screen pb-24 md:pb-12 relative z-10 transition-all duration-300 ease-in-out ${
          isSidebarHidden ? 'md:ml-0' : 'md:ml-64'
        }`}
      >
        {/* Unified Top Navigation Bar */}
        <AppNavbar onOpenSearch={() => setIsCommandPaletteOpen(true)} />

        {/* Page Content with unified spacing & max-width container */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full transition-all duration-300">
          <Outlet />
        </main>
      </div>

      {/* Discreet Minimal Study Dock (Bottom Right) */}
      <aside aria-label="Quick Actions" className="fixed bottom-20 md:bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsScratchpadOpen(true)}
          className="p-2.5 rounded-xl bg-white/90 dark:bg-[#121217]/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-lg hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 backdrop-blur-md active:scale-95 transition-all"
          title="Instant Scratchpad (⌘J)"
        >
          <span className="material-symbols-outlined text-[19px]">edit_note</span>
        </button>

        <button
          onClick={() => setIsStudyVaultOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#121217]/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-lg hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 backdrop-blur-md active:scale-95 transition-all group"
          title="Academic Study Vault & Formulas (⌘I)"
        >
          <span className="material-symbols-outlined text-[19px] text-red-500 group-hover:scale-110 transition-transform">
            menu_book
          </span>
          <span className="text-xs font-bold hidden sm:inline">Vault</span>
          <kbd className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-[9px] font-mono text-slate-500 dark:text-slate-400">
            ⌘I
          </kbd>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Interactive Modals & Drawers */}
      <NewTaskModal />
      <SettingsModal />
      <MiniNotificationBar />
      <StudyVaultModal isOpen={isStudyVaultOpen} onClose={() => setIsStudyVaultOpen(false)} />
      <ZenFocusModal isOpen={isZenFocusOpen} onClose={() => setIsZenFocusOpen(false)} />
      <FlashcardsModal isOpen={isFlashcardsOpen} onClose={() => setIsFlashcardsOpen(false)} />
      <ScratchpadDrawer isOpen={isScratchpadOpen} onClose={() => setIsScratchpadOpen(false)} />
      <SoundDock isOpen={isSoundDockOpen} onClose={() => setIsSoundDockOpen(false)} />
      <AcademicJournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
      <ExportDigestModal isOpen={isExportDigestOpen} onClose={() => setIsExportDigestOpen(false)} />

      {/* Quick Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
