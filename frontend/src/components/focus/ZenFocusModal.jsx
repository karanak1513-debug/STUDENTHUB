import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { triggerConfetti, triggerMiniConfetti, playChime } from '../../utils/celebration';

export default function ZenFocusModal({ isOpen, onClose }) {
  const { tasks, toggleTaskCompleted, profile } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusMode, setFocusMode] = useState('25m'); // '25m', '5m', '50m'
  const [soundTrack, setSoundTrack] = useState('drone'); // 'drone', 'rain', 'gamma', 'off'
  const [volume, setVolume] = useState(0.2);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioCtxRef = useRef(null);
  const activeSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  const quotes = [
    '"The secret to mastery is intense, uninterrupted concentration."',
    '"Discipline is choosing between what you want now and what you want most."',
    '"One focused hour today beats ten distracted hours tomorrow."',
    '"Great students aren’t smarter; they protect their focus obsessively."',
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const qTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 12000);
    return () => clearInterval(qTimer);
  }, [quotes.length]);

  // Set default task if none selected
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      const active = tasks.find((t) => !t.completed);
      if (active) setSelectedTaskId(active.id);
    }
  }, [tasks, selectedTaskId]);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerConfetti();
      playChime('bell');
      if (selectedTaskId) {
        toggleTaskCompleted(selectedTaskId);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, selectedTaskId, toggleTaskCompleted]);

  // Audio Synthesizer via Web Audio API
  const stopAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch (e) {}
      activeSourceRef.current = null;
    }
  };

  const playSynthesizedSound = (type, vol) => {
    stopAudio();
    if (type === 'off') return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (type === 'drone') {
        // Pink / Brown Focus Noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
          b6 = white * 0.115926;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start();
        activeSourceRef.current = whiteNoise;
      } else if (type === 'rain') {
        // Filtered soft rain noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.02;
        }
        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(0.5, ctx.currentTime);
        rainSource.connect(filter);
        filter.connect(gain);
        rainSource.start();
        activeSourceRef.current = rainSource;
      } else if (type === 'gamma') {
        // 40Hz Gamma Focus Frequency Oscillation
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(40, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(15, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        osc.connect(gain);
        osc.start();
        activeSourceRef.current = osc;
      }
    } catch (e) {
      console.warn('Audio could not start:', e);
    }
  };

  const handleSoundChange = (track) => {
    setSoundTrack(track);
    if (track === 'off') {
      stopAudio();
    } else {
      playSynthesizedSound(track, volume);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
      setIsRunning(false);
    }
  }, [isOpen]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard shortcut: Space to pause/play, Esc to close
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalModeSeconds = focusMode === '5m' ? 5 * 60 : focusMode === '50m' ? 50 * 60 : 25 * 60;
  const progressPercent = ((totalModeSeconds - secondsLeft) / totalModeSeconds) * 100;
  const strokeOffset = 440 - (440 * progressPercent) / 100;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col justify-between p-6 sm:p-12 animate-fade-in select-none">
      {/* Background Red/Blue subtle glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase text-white">
              Hyperfocus <span className="text-blue-500">Arena</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              Zero Distraction Zen Mode
            </p>
          </div>
        </div>

        {/* Ambient Sound & Fullscreen controls */}
        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Selector */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 text-xs border border-white/10">
            {[
              { id: 'off', label: 'Mute', icon: 'volume_off' },
              { id: 'drone', label: 'Binaural Pink', icon: 'waves' },
              { id: 'rain', label: 'Rain', icon: 'water_drop' },
              { id: 'gamma', label: '40Hz Gamma', icon: 'graphic_eq' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSoundChange(s.id)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                  soundTrack === s.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

          {/* Close Zen Mode */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-red-600 border border-white/10 text-white transition-all"
            title="Exit Focus Mode (ESC)"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Center: Massive Focus Clock */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-8">
        {/* Active Task Capsule */}
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 max-w-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
              Active Focus Target
            </span>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="bg-transparent border-none text-white text-sm font-bold outline-none cursor-pointer w-full truncate"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#121217] text-white">
                  {t.title} ({t.subject || 'General'})
                </option>
              ))}
            </select>
          </div>
          {currentTask && (
            <button
              onClick={() => {
                toggleTaskCompleted(currentTask.id);
                triggerMiniConfetti(0.5, 0.5);
                playChime('success');
              }}
              className={`p-1.5 rounded-xl border transition-all ${
                currentTask.completed
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-white/20 text-white hover:border-blue-500'
              }`}
              title="Mark Task Complete"
            >
              <span className="material-symbols-outlined text-[18px]">
                {currentTask.completed ? 'check_circle' : 'circle'}
              </span>
            </button>
          )}
        </div>

        {/* Circular Radial Countdown */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
          {isRunning && (
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping pointer-events-none"></div>
          )}
          <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]" viewBox="0 0 160 160">
            <circle
              className="text-white/10"
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <circle
              className={isRunning ? 'text-red-500 transition-all duration-500' : 'text-blue-500 transition-all duration-500'}
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray="440"
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl sm:text-7xl font-mono font-black tracking-tight text-white drop-shadow-md">
              {formattedTime}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              {isRunning ? 'Deep Work In Progress' : 'Session Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!isRunning) playChime('bell');
                setIsRunning(!isRunning);
              }}
              className={`px-8 py-3.5 rounded-2xl font-black text-base transition-all duration-200 flex items-center gap-2 active:scale-95 shadow-xl ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/40 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/40 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Pause (Space)' : 'Start Sprint (Space)'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(totalModeSeconds);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Reset Timer"
            >
              <span className="material-symbols-outlined text-[22px]">replay</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2">
            {[
              { id: '25m', label: '25m Sprint', secs: 25 * 60 },
              { id: '5m', label: '5m Break', secs: 5 * 60 },
              { id: '50m', label: '50m Deep Dive', secs: 50 * 60 },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setFocusMode(m.id);
                  setIsRunning(false);
                  setSecondsLeft(m.secs);
                }}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                  focusMode === m.id
                    ? 'bg-white/20 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Quote of the Sprint */}
      <div className="relative z-10 text-center max-w-xl mx-auto pb-4">
        <p className="text-sm font-medium text-slate-400 italic transition-all duration-500">
          {quotes[quoteIndex]}
        </p>
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1 block">
          Scholara Focus Engine • {profile?.name || 'Student'}
        </span>
      </div>
    </div>
  );
}
