import React, { useState, useEffect } from 'react';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function FlashcardsModal({ isOpen, onClose }) {
  const [cards, setCards] = useState([
    {
      id: 1,
      subject: 'CS501 • Algorithms',
      question: 'What is the time complexity of QuickSelect for finding the k-th smallest element on average vs worst case?',
      answer: 'Average: O(n) linear time.\nWorst case: O(n²) when bad pivots are chosen repeatedly. Can be made O(n) worst-case with Median of Medians.',
      mastered: false,
    },
    {
      id: 2,
      subject: 'ML405 • Machine Learning',
      question: 'Explain the bias-variance tradeoff and how L2 regularization (Ridge) affects them.',
      answer: 'High bias leads to underfitting; high variance leads to overfitting.\nL2 regularization introduces small bias by shrinking weights, which significantly reduces model variance.',
      mastered: false,
    },
    {
      id: 3,
      subject: 'EC204 • Macroeconomics',
      question: 'What are the three primary tools used by Central Banks to control money supply?',
      answer: '1. Open Market Operations (buying/selling bonds)\n2. Reserve Requirements\n3. Discount / Repo Rate adjustments.',
      mastered: false,
    },
    {
      id: 4,
      subject: 'CS501 • Algorithms',
      question: 'Why does Dijkstra’s algorithm fail with negative edge weights?',
      answer: 'Dijkstra assumes that adding an edge to a path cannot decrease its total length (greedy step). Negative weights break this invariant. Use Bellman-Ford instead!',
      mastered: false,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newSubject, setNewSubject] = useState('CS501');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  // Filter cards by course
  const filteredCards = cards.filter((c) => {
    if (filterCourse === 'All') return true;
    return c.subject?.includes(filterCourse);
  });

  const activeDeck = filteredCards.length > 0 ? filteredCards : cards;
  const safeIndex = Math.max(0, Math.min(currentIndex, activeDeck.length - 1));
  const currentCard = activeDeck[safeIndex] || cards[0];
  const masteredCount = cards.filter((c) => c.mastered).length;
  const progressPercent = Math.round((masteredCount / Math.max(1, cards.length)) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, activeDeck.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % Math.max(1, activeDeck.length));
  };

  // Keyboard navigation when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
        playChime('bell');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeDeck.length]);

  if (!isOpen) return null;

  const handleRate = (rating) => {
    if (rating === 'mastered') {
      setCards((prev) =>
        prev.map((c) => (c.id === currentCard.id ? { ...c, mastered: true } : c))
      );
      triggerMiniConfetti(0.5, 0.4);
      playChime('success');
      if (masteredCount + 1 === cards.length) {
        triggerConfetti();
      }
    } else {
      playChime('bell');
    }
    handleNext();
  };

  const handleResetDeck = () => {
    setCards((prev) => prev.map((c) => ({ ...c, mastered: false })));
    setCurrentIndex(0);
    setIsFlipped(false);
    playChime('bell');
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setCards((prev) => [
      ...prev,
      {
        id: Date.now(),
        subject: newSubject,
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        mastered: false,
      },
    ]);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingCard(false);
    triggerMiniConfetti(0.5, 0.5);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121217] text-slate-900 dark:text-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <span className="material-symbols-outlined text-[20px]">style</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Active Recall Flashcards
                </h3>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  ({currentIndex + 1} / {cards.length})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spaced repetition card deck for term exam readiness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingCard(!isAddingCard)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Add New Card"
            >
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Deck Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-red-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Chips & Deck Reset */}
        <div className="px-6 py-2 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
            {['All', 'CS501', 'ML405', 'EC204'].map((course) => (
              <button
                key={course}
                onClick={() => {
                  setFilterCourse(course);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterCourse === course
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDeck}
              className="text-[11px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              title="Reset Mastered Status"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span>Reset</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded hidden sm:inline">
              Space: Flip
            </span>
          </div>
        </div>

        {/* New Card Inline Drawer */}
        {isAddingCard && (
          <form onSubmit={handleAddCard} className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Course tag (e.g. CS501)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-1/3 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs font-bold"
              />
              <span className="text-xs text-slate-500 font-semibold">Add Card to Deck</span>
            </div>
            <textarea
              rows={2}
              placeholder="Question / Front of card..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <textarea
              rows={2}
              placeholder="Answer / Back of card..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-3 py-1 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/30"
              >
                Save Card
              </button>
            </div>
          </form>
        )}

        {/* 3D Flip Card Container */}
        <div className="p-6">
          <div
            onClick={() => {
              playChime('bell');
              setIsFlipped(!isFlipped);
            }}
            className="w-full min-h-[220px] rounded-3xl p-6 sm:p-8 cursor-pointer relative transition-all duration-300 flex flex-col justify-between border select-none group hover:scale-[1.01] shadow-lg bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#181822] dark:via-[#121217] dark:to-[#0f0f15] border-slate-200/90 dark:border-white/10"
          >
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20">
                {currentCard.subject}
              </span>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">sync</span>
                {isFlipped ? 'Answer' : 'Tap to Flip'}
              </span>
            </div>

            {/* Content Front vs Back */}
            <div className="my-auto py-4">
              {!isFlipped ? (
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-extrabold text-red-500 block mb-1">
                    Question
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-extrabold text-blue-500 block mb-1">
                    Answer & Derivation
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-200/60 dark:border-white/5">
              <span>{currentCard.mastered ? '🏆 Mastered' : '⏳ In Review'}</span>
              <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                {isFlipped ? 'Click for Question' : 'Click to Reveal Answer'}
              </span>
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              onClick={() => handleRate('hard')}
              className="py-3 px-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-black transition-all flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span>Needs Review</span>
            </button>

            <button
              onClick={() => handleRate('good')}
              className="py-3 px-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-black transition-all flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>Got It</span>
            </button>

            <button
              onClick={() => handleRate('mastered')}
              className="py-3 px-2 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 text-white font-black text-xs transition-all shadow-md shadow-blue-600/30 flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Mastered!</span>
            </button>
          </div>

          {/* Card Prev/Next Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Previous</span>
            </button>
            <span>
              {masteredCount} of {cards.length} cards mastered
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
