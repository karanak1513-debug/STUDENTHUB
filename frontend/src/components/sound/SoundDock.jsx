import React, { useState, useRef, useEffect } from 'react';

export default function SoundDock({ isOpen, onClose }) {
  const [activeTrack, setActiveTrack] = useState('off'); // 'off', 'rain', 'drone', 'cafe', 'gamma'
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef(null);
  const activeSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  const tracks = [
    { id: 'drone', label: 'Binaural Pink Drone', icon: 'waves', desc: 'Alpha wave focus frequencies' },
    { id: 'rain', label: 'Library Rainstorm', icon: 'water_drop', desc: 'Calming soft raindrop frequencies' },
    { id: 'cafe', label: 'Campus Ambient Cafe', icon: 'coffee', desc: 'Gentle warmth & murmur filter' },
    { id: 'gamma', label: '40Hz Gamma Concentration', icon: 'graphic_eq', desc: 'Pure cognitive analytical focus' },
  ];

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
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start();
        activeSourceRef.current = whiteNoise;
      } else if (type === 'rain') {
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
      } else if (type === 'cafe') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.025;
        }
        const cafeSource = ctx.createBufferSource();
        cafeSource.buffer = noiseBuffer;
        cafeSource.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        cafeSource.connect(filter);
        filter.connect(gain);
        cafeSource.start();
        activeSourceRef.current = cafeSource;
      } else if (type === 'gamma') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
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

  const handleSelectTrack = (id) => {
    if (activeTrack === id) {
      setActiveTrack('off');
      stopAudio();
    } else {
      setActiveTrack(id);
      playSynthesizedSound(id, volume);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4 sm:pr-8 bg-black/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm glass-panel rounded-3xl p-5 shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">headphones</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                Focus Soundscape Studio
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Synthesized Web Audio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-2 py-3">
          {tracks.map((t) => {
            const isPlaying = activeTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 group ${
                  isPlaying
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25 scale-[1.01]'
                    : 'bg-white/60 dark:bg-white/5 border-slate-200/70 dark:border-white/10 hover:border-blue-600/40 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isPlaying
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{t.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-black text-xs leading-snug">{t.label}</h5>
                    <p
                      className={`text-[10px] ${
                        isPlaying ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {t.desc}
                    </p>
                  </div>
                </div>

                {isPlaying && (
                  <div className="flex items-end gap-1 h-4 px-1">
                    <span className="w-1 bg-white rounded-full eq-bar-1"></span>
                    <span className="w-1 bg-white rounded-full eq-bar-2"></span>
                    <span className="w-1 bg-white rounded-full eq-bar-3"></span>
                    <span className="w-1 bg-white rounded-full eq-bar-4"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Volume Slider & Controls */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3">
          <span className="material-symbols-outlined text-[17px] text-slate-400">
            {volume === 0 ? 'volume_off' : volume > 0.5 ? 'volume_up' : 'volume_down'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
          />
          <span className="text-[11px] font-mono font-bold text-slate-400 min-w-[32px] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
