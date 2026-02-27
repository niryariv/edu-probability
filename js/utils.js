/**
 * עולם ההסתברות — Utils.js
 * Shared probability utilities, confetti system, and Web Audio sound effects
 */

(function () {
  'use strict';

  /* ─── WEB AUDIO CONTEXT ─────────────────────────────────── */
  /** Lazily initialised so we don't create it until user interaction */
  let _audioCtx = null;

  function getAudioCtx() {
    if (!_audioCtx) {
      try {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('[ProbabilityUtils] Web Audio API not available.', e);
        return null;
      }
    }
    // Resume if suspended (autoplay policy)
    if (_audioCtx.state === 'suspended') {
      _audioCtx.resume();
    }
    return _audioCtx;
  }

  /* ─── CONFETTI COLOURS ──────────────────────────────────── */
  const CONFETTI_COLORS = [
    '#FF6B35', '#4ECDC4', '#FFD166',
    '#845EC2', '#06D6A0', '#EF476F',
    '#FFFFFF', '#1A1A2E', '#F9C74F',
  ];

  /* ─── PROBABILITY UTILITIES ──────────────────────────────── */

  const ProbabilityUtils = {

    /**
     * Generate a random integer in [min, max] (inclusive).
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    random(min, max) {
      if (min > max) [min, max] = [max, min];
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Generate a random float in [min, max).
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
     * Pick a random element from an array.
     * @template T
     * @param {T[]} arr
     * @returns {T}
     */
    randomChoice(arr) {
      if (!arr || arr.length === 0) return undefined;
      return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Shuffle an array in-place (Fisher-Yates).
     * @template T
     * @param {T[]} arr
     * @returns {T[]} the same array, shuffled
     */
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /**
     * Calculate theoretical probability as a decimal.
     * @param {number} favorable - number of favorable outcomes
     * @param {number} total     - total number of outcomes
     * @returns {number} probability in [0, 1], or 0 if total is 0
     */
    calcProbability(favorable, total) {
      if (total === 0) return 0;
      return Math.max(0, Math.min(1, favorable / total));
    },

    /**
     * Format a probability as a simplified fraction string.
     * e.g. formatFraction(2, 6) → "1/3"
     * @param {number} n - numerator
     * @param {number} d - denominator
     * @returns {string}
     */
    formatFraction(n, d) {
      if (d === 0) return '0/1';
      const g = ProbabilityUtils._gcd(Math.abs(n), Math.abs(d));
      const sn = n / g;
      const sd = d / g;
      return `${sn}/${sd}`;
    },

    /**
     * Format a probability as a percentage string.
     * e.g. formatPercent(1, 4) → "25%"
     * @param {number} n - numerator
     * @param {number} d - denominator
     * @param {number} [decimals=0] - decimal places
     * @returns {string}
     */
    formatPercent(n, d, decimals = 0) {
      if (d === 0) return '0%';
      return `${((n / d) * 100).toFixed(decimals)}%`;
    },

    /**
     * Format a probability as a decimal string.
     * e.g. formatDecimal(1, 3) → "0.33"
     * @param {number} n
     * @param {number} d
     * @param {number} [decimals=2]
     * @returns {string}
     */
    formatDecimal(n, d, decimals = 2) {
      if (d === 0) return '0';
      return (n / d).toFixed(decimals);
    },

    /**
     * Internal: greatest common divisor (Euclidean algorithm).
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    _gcd(a, b) {
      return b === 0 ? a : ProbabilityUtils._gcd(b, a % b);
    },

    /**
     * Simulate multiple coin flips.
     * @param {number} count
     * @returns {{ heads: number, tails: number, results: string[] }}
     */
    flipCoins(count) {
      const results = Array.from({ length: count }, () =>
        Math.random() < 0.5 ? 'heads' : 'tails'
      );
      return {
        results,
        heads: results.filter((r) => r === 'heads').length,
        tails: results.filter((r) => r === 'tails').length,
      };
    },

    /**
     * Simulate rolling an n-sided die.
     * @param {number} [sides=6]
     * @returns {number} 1..sides
     */
    rollDie(sides = 6) {
      return ProbabilityUtils.random(1, sides);
    },

    /**
     * Simulate drawing without replacement from a pool.
     * @param {any[]} pool
     * @param {number} count
     * @returns {any[]}
     */
    drawWithoutReplacement(pool, count) {
      const copy = [...pool];
      ProbabilityUtils.shuffle(copy);
      return copy.slice(0, Math.min(count, copy.length));
    },

    /**
     * Simulate drawing with replacement from a pool.
     * @param {any[]} pool
     * @param {number} count
     * @returns {any[]}
     */
    drawWithReplacement(pool, count) {
      return Array.from({ length: count }, () =>
        pool[Math.floor(Math.random() * pool.length)]
      );
    },

    /* ── CONFETTI PARTICLE SYSTEM ─────────────────────────── */

    /**
     * Launch a confetti particle system into a container element.
     * @param {HTMLElement|null} container - the element to fill with confetti
     * @param {number} [count=50]          - number of particles
     */
    launchConfetti(container, count = 50) {
      if (!container) return;

      container.innerHTML = '';

      const fragment = document.createDocumentFragment();

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';

        // Random properties
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const size  = ProbabilityUtils.randomFloat(8, 16);
        const startX = ProbabilityUtils.randomFloat(5, 95); // % from left
        const duration = ProbabilityUtils.randomFloat(1.5, 3.5);
        const delay    = ProbabilityUtils.randomFloat(0, 1.2);
        const shape    = Math.random() < 0.3 ? '50%' : (Math.random() < 0.5 ? '0%' : '2px');

        Object.assign(particle.style, {
          position:        'absolute',
          left:            `${startX}%`,
          top:             `-${size}px`,
          width:           `${size}px`,
          height:          `${size}px`,
          background:      color,
          borderRadius:    shape,
          animation:       `confettiFall ${duration}s ${delay}s ease-in forwards,
                            confettiSway ${duration * 0.7}s ${delay}s ease-in-out infinite`,
          willChange:      'transform, opacity',
          zIndex:          '1',
        });

        fragment.appendChild(particle);
      }

      container.appendChild(fragment);

      // Clean up after all particles have fallen
      setTimeout(() => {
        container.innerHTML = '';
      }, 5000);
    },

    /* ── WEB AUDIO SOUND EFFECTS ──────────────────────────── */

    /**
     * Play a synthesised sound effect.
     * @param {'correct'|'wrong'|'complete'|'flip'|'tick'|'pop'} type
     */
    playSound(type) {
      const ctx = getAudioCtx();
      if (!ctx) return;

      try {
        switch (type) {
          case 'correct':  ProbabilityUtils._soundCorrect(ctx);  break;
          case 'wrong':    ProbabilityUtils._soundWrong(ctx);    break;
          case 'complete': ProbabilityUtils._soundComplete(ctx); break;
          case 'flip':     ProbabilityUtils._soundFlip(ctx);     break;
          case 'tick':     ProbabilityUtils._soundTick(ctx);     break;
          case 'pop':      ProbabilityUtils._soundPop(ctx);      break;
          default:         ProbabilityUtils._soundPop(ctx);      break;
        }
      } catch (e) {
        // Silent fail — sounds are enhancement only
      }
    },

    /** Correct-answer chime: rising two-note melody */
    _soundCorrect(ctx) {
      const t = ctx.currentTime;
      [[523.25, 0, 0.12], [659.25, 0.13, 0.18], [783.99, 0.27, 0.22]].forEach(
        ([freq, offset, dur]) => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + offset);
          gain.gain.setValueAtTime(0.22, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, t + offset + dur);
          osc.start(t + offset);
          osc.stop(t + offset + dur + 0.05);
        }
      );
    },

    /** Wrong-answer buzz: descending dissonant tone */
    _soundWrong(ctx) {
      const t = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.3);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.4);
    },

    /** Complete fanfare: ascending arpeggio */
    _soundComplete(ctx) {
      const t = ctx.currentTime;
      const notes = [
        [523.25, 0.00], [659.25, 0.10], [783.99, 0.20],
        [1046.50, 0.32], [1318.51, 0.45],
      ];
      notes.forEach(([freq, offset]) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + offset);
        gain.gain.setValueAtTime(0.2, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.25);
        osc.start(t + offset);
        osc.stop(t + offset + 0.3);
      });
    },

    /** Card flip: short swishing tone */
    _soundFlip(ctx) {
      const t = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.12);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.18);
    },

    /** Tick: brief high click */
    _soundTick(ctx) {
      const t = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.start(t);
      osc.stop(t + 0.05);
    },

    /** Pop: satisfying little pop sound */
    _soundPop(ctx) {
      const t = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.12);
    },

    /* ── DOM HELPERS ─────────────────────────────────────── */

    /**
     * Animate a numeric counter from its current display value to a target.
     * @param {HTMLElement} el
     * @param {number}      target
     * @param {number}      [duration=600] ms
     */
    animateCounter(el, target, duration = 600) {
      if (!el) return;
      const start    = parseInt(el.textContent, 10) || 0;
      const delta    = target - start;
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + delta * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    },

    /**
     * Temporarily apply a CSS class to an element (for one-shot animations).
     * @param {HTMLElement} el
     * @param {string}      className
     * @param {number}      [duration=600] ms
     */
    flashClass(el, className, duration = 600) {
      if (!el) return;
      el.classList.add(className);
      setTimeout(() => el.classList.remove(className), duration);
    },

    /**
     * Create an accessible toast notification.
     * @param {string}  message
     * @param {'success'|'error'|'info'} [type='info']
     * @param {number}  [duration=3000] ms
     */
    showToast(message, type = 'info', duration = 3000) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        Object.assign(container.style, {
          position:  'fixed',
          bottom:    '1.5rem',
          left:      '50%',       // RTL: centered
          transform: 'translateX(-50%)',
          zIndex:    '9999',
          display:   'flex',
          flexDirection: 'column',
          gap:       '0.5rem',
          alignItems: 'center',
          pointerEvents: 'none',
        });
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }

      const colors = {
        success: { bg: '#06D6A0', text: '#1A1A2E' },
        error:   { bg: '#EF476F', text: '#FFFFFF' },
        info:    { bg: '#4ECDC4', text: '#1A1A2E' },
      };
      const c = colors[type] || colors.info;

      const toast = document.createElement('div');
      Object.assign(toast.style, {
        background:   c.bg,
        color:        c.text,
        fontFamily:   "'Heebo', Arial Hebrew, sans-serif",
        fontWeight:   '700',
        fontSize:     '1rem',
        padding:      '0.65rem 1.25rem',
        borderRadius: '12px',
        border:       '2px solid #1A1A2E',
        boxShadow:    '3px 3px 0 #1A1A2E',
        animation:    'bounceInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        pointerEvents: 'auto',
        maxWidth:     '90vw',
        textAlign:    'center',
        direction:    'rtl',
      });
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity    = '0';
        toast.style.transform  = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
      }, duration);
    },

  };

  /* ─── EXPORT ──────────────────────────────────────────────── */
  window.ProbabilityUtils = ProbabilityUtils;

  // Also expose as ES-style named export for module pages that use type="module"
  if (typeof exports !== 'undefined') {
    exports.ProbabilityUtils = ProbabilityUtils;
  }

})();
