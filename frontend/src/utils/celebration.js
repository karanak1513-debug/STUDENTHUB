import confetti from 'canvas-confetti';

/**
 * Trigger celebratory confetti animation
 */
export function triggerConfetti(options = {}) {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
      ...options,
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#4f46e5', '#8b5cf6', '#ec4899'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch (e) {
    console.debug('Confetti effect failed', e);
  }
}

/**
 * Small burst of confetti for task checkboxes
 */
export function triggerMiniConfetti(x = 0.5, y = 0.5) {
  try {
    confetti({
      particleCount: 40,
      spread: 45,
      origin: { x, y },
      zIndex: 9999,
      colors: ['#10b981', '#6366f1', '#f59e0b'],
      disableForReducedMotion: true,
      scalar: 0.7,
    });
  } catch (e) {
    // ignore
  }
}

/**
 * Synthesizes a clean audio chime using Web Audio API
 */
export function playChime(type = 'success') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.4);
      });
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    }
  } catch (e) {
    // Audio context may require user interaction
  }
}
