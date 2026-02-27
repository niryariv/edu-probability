/**
 * עולם ההסתברות — App.js
 * Core application logic: progress tracking, card rendering, celebrations
 */

(function () {
  'use strict';

  /* ─── CONSTANTS ─────────────────────────────────────────── */
  const STORAGE_KEY = 'probability-game-progress';

  /** Ordered list of module IDs — earlier modules must be completed to unlock the next */
  const MODULE_ORDER = [
    '01-coins',
    '02-dice',
    '03-spinners',
    '04-cards',
    '05-bag',
    '06-quiz',
  ];

  /** XP awarded per star */
  const XP_PER_STAR = 25;

  /* ─── DEFAULT PROGRESS STRUCTURE ────────────────────────── */
  function defaultProgress() {
    return {
      xp: 0,
      modules: {
        '01-coins':    { stars: 0, completed: false },
        '02-dice':     { stars: 0, completed: false },
        '03-spinners': { stars: 0, completed: false },
        '04-cards':    { stars: 0, completed: false },
        '05-bag':      { stars: 0, completed: false },
        '06-quiz':     { stars: 0, completed: false },
      },
    };
  }

  /* ─── PERSISTENCE ────────────────────────────────────────── */

  /**
   * Load progress from localStorage.
   * Falls back to a fresh default if no saved data exists or parse fails.
   * @returns {Object} progress object
   */
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle new keys added in updates
      const def = defaultProgress();
      return {
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        modules: Object.fromEntries(
          MODULE_ORDER.map((id) => [
            id,
            {
              stars:     parsed.modules?.[id]?.stars     ?? def.modules[id].stars,
              completed: parsed.modules?.[id]?.completed ?? def.modules[id].completed,
            },
          ])
        ),
      };
    } catch (e) {
      console.warn('[ProbabilityApp] Failed to load progress, resetting.', e);
      return defaultProgress();
    }
  }

  /**
   * Persist progress object to localStorage.
   * @param {Object} progress
   */
  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('[ProbabilityApp] Failed to save progress.', e);
    }
  }

  /* ─── COMPUTED HELPERS ───────────────────────────────────── */

  /**
   * Count total stars earned across all modules.
   * @param {Object} progress
   * @returns {number}
   */
  function totalStars(progress) {
    return MODULE_ORDER.reduce((sum, id) => sum + (progress.modules[id]?.stars || 0), 0);
  }

  /**
   * Count how many modules have been completed.
   * @param {Object} progress
   * @returns {number}
   */
  function completedCount(progress) {
    return MODULE_ORDER.filter((id) => progress.modules[id]?.completed).length;
  }

  /**
   * Determine whether a given module is currently unlocked.
   * Module 0 is always unlocked; subsequent modules require the previous to be completed.
   * @param {string} moduleId
   * @param {Object} progress
   * @returns {boolean}
   */
  function checkModuleLock(moduleId, progress) {
    const idx = MODULE_ORDER.indexOf(moduleId);
    if (idx <= 0) return true; // first module always unlocked
    const prevId = MODULE_ORDER[idx - 1];
    return progress.modules[prevId]?.completed === true;
  }

  /* ─── UI UPDATES ──────────────────────────────────────────── */

  /**
   * Render all module cards — sets locked/unlocked/completed state and star displays.
   * @param {Object} progress
   */
  function renderModuleCards(progress) {
    MODULE_ORDER.forEach((moduleId) => {
      const card = document.querySelector(`[data-module="${moduleId}"]`);
      if (!card) return;

      const isUnlocked = checkModuleLock(moduleId, progress);
      const moduleData = progress.modules[moduleId] || { stars: 0, completed: false };

      // Locked state
      if (!isUnlocked) {
        card.classList.add('locked');
      } else {
        card.classList.remove('locked');
      }

      // Completed state
      if (moduleData.completed) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }

      // Star display
      const starsEl = document.getElementById(`stars-${moduleId}`);
      if (starsEl) {
        const starSpans = starsEl.querySelectorAll('.star');
        starSpans.forEach((span, i) => {
          const filled = i < moduleData.stars;
          span.setAttribute('data-filled', String(filled));
          span.classList.toggle('filled', filled);
        });
        starsEl.setAttribute(
          'aria-label',
          `${moduleData.stars} מתוך 3 כוכבים`
        );
      }

      // Unlock/disable button
      const btn = document.getElementById(`btn-${moduleId}`);
      if (btn) {
        if (!isUnlocked) {
          btn.setAttribute('aria-disabled', 'true');
          btn.setAttribute('tabindex', '-1');
        } else {
          btn.removeAttribute('aria-disabled');
          btn.setAttribute('tabindex', '0');
          // Update button text if completed
          if (moduleData.completed) {
            const textSpan = btn.querySelector('span:first-child');
            if (textSpan) textSpan.textContent = 'שחק שוב';
          }
        }
      }
    });
  }

  /**
   * Update the overall progress bar and fraction label.
   * @param {Object} progress
   */
  function updateProgressBar(progress) {
    const done   = completedCount(progress);
    const total  = MODULE_ORDER.length;
    const pct    = Math.round((done / total) * 100);

    const fill   = document.getElementById('progress-bar-fill');
    const label  = document.getElementById('progress-bar-label');
    const frac   = document.getElementById('progress-fraction');
    const track  = document.getElementById('progress-bar-track');

    if (fill)  fill.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}%`;
    if (frac)  frac.textContent = `${done} / ${total} עולמות`;
    if (track) {
      track.setAttribute('aria-valuenow', done);
      track.setAttribute('aria-valuemax', total);
    }
  }

  /**
   * Update the XP counter and star total in the header.
   * @param {Object} progress
   */
  function updateHeaderStats(progress) {
    const xpEl    = document.getElementById('xp-value');
    const starsEl = document.getElementById('stars-count');

    if (xpEl) {
      const prevXP = parseInt(xpEl.textContent, 10) || 0;
      xpEl.textContent = progress.xp;
      if (progress.xp > prevXP) {
        xpEl.closest('.xp-display')?.classList.add('anim-pop');
        setTimeout(() => xpEl.closest('.xp-display')?.classList.remove('anim-pop'), 450);
      }
    }

    if (starsEl) {
      starsEl.textContent = totalStars(progress);
    }

    // Update header star icon to filled if any stars earned
    const headerStar = document.querySelector('.stars-total .star');
    if (headerStar && totalStars(progress) > 0) {
      headerStar.classList.add('filled');
    }
  }

  /* ─── CELEBRATION ────────────────────────────────────────── */

  /**
   * Show the celebration overlay with confetti and earned-stars display.
   * @param {number} stars - number of stars awarded (0-3)
   * @param {string} [message] - optional custom message in Hebrew
   */
  function showCelebration(stars, message) {
    const overlay   = document.getElementById('celebration-overlay');
    const starsEl   = document.getElementById('celebration-stars');
    const textEl    = document.getElementById('celebration-text');
    const confettiC = document.getElementById('confetti-container');

    if (!overlay) return;

    // Build star display with staggered pop animation
    if (starsEl) {
      starsEl.innerHTML = '';
      const totalToShow = 3;
      for (let i = 0; i < totalToShow; i++) {
        const span = document.createElement('span');
        span.className = 'star' + (i < stars ? ' filled' : '');
        span.textContent = '★';
        span.style.fontSize = '3rem';
        span.style.display = 'inline-block';
        if (i < stars) {
          span.style.animationDelay = `${i * 0.2}s`;
          span.classList.add('anim-star-pop');
        }
        starsEl.appendChild(span);
      }
    }

    // Message
    if (textEl) {
      const messages = {
        0: 'נסה שוב — אתה יכול! 💪',
        1: 'טוב מאוד! ⭐',
        2: 'כל הכבוד! ⭐⭐',
        3: 'מושלם! אלוף! 🏆⭐⭐⭐',
      };
      textEl.textContent = message || messages[stars] || 'כל הכבוד!';
    }

    // Clear old confetti
    if (confettiC) confettiC.innerHTML = '';

    // Launch confetti if stars awarded
    if (stars > 0 && window.ProbabilityUtils) {
      window.ProbabilityUtils.launchConfetti(confettiC, stars * 20);
    }

    // Show overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Play sound
    if (window.ProbabilityUtils) {
      window.ProbabilityUtils.playSound(stars >= 2 ? 'complete' : 'correct');
    }

    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      }
    }, 8000);

    // Cancel auto-dismiss if user clicks elsewhere
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        clearTimeout(dismissTimer);
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      }
    }, { once: true });
  }

  /* ─── MODULE COMPLETION (called from module pages) ────────── */

  /**
   * Record module completion results and update global progress.
   * Called by individual module pages after quiz completion.
   * @param {string} moduleId   e.g. '01-coins'
   * @param {number} starsEarned 0-3
   */
  function completeModule(moduleId, starsEarned) {
    const progress = loadProgress();

    const prevStars = progress.modules[moduleId]?.stars || 0;
    const newStars  = Math.max(prevStars, starsEarned);
    const xpGain    = Math.max(0, newStars - prevStars) * XP_PER_STAR;

    progress.modules[moduleId] = {
      stars:     newStars,
      completed: true,
    };
    progress.xp += xpGain;

    saveProgress(progress);

    // Refresh UI if on home page
    if (document.getElementById('modules-grid')) {
      renderModuleCards(progress);
      updateProgressBar(progress);
      updateHeaderStats(progress);
    }

    return { starsEarned: newStars, xpGain };
  }

  /* ─── RESET ──────────────────────────────────────────────── */

  /**
   * Reset all progress (for dev/testing).
   * Exposed on window.ProbabilityApp for console access.
   */
  function resetProgress() {
    const fresh = defaultProgress();
    saveProgress(fresh);
    if (document.getElementById('modules-grid')) {
      renderModuleCards(fresh);
      updateProgressBar(fresh);
      updateHeaderStats(fresh);
    }
    console.info('[ProbabilityApp] Progress reset.');
    return fresh;
  }

  /* ─── KEYBOARD ACCESSIBILITY ─────────────────────────────── */
  function setupCardKeyboard() {
    document.querySelectorAll('.module-card:not(.locked)').forEach((card) => {
      const btn = card.querySelector('.btn-start');
      if (!btn) return;
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  function init() {
    const progress = loadProgress();
    renderModuleCards(progress);
    updateProgressBar(progress);
    updateHeaderStats(progress);
    setupCardKeyboard();

    // Animate progress bar in on load
    const fill = document.getElementById('progress-bar-fill');
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.transition = '';
          const done  = completedCount(progress);
          const total = MODULE_ORDER.length;
          fill.style.width = `${Math.round((done / total) * 100)}%`;
        });
      });
    }
  }

  /* ─── PUBLIC API ──────────────────────────────────────────── */
  window.ProbabilityApp = {
    loadProgress,
    saveProgress,
    completeModule,
    showCelebration,
    checkModuleLock,
    resetProgress,
    renderModuleCards,
    updateProgressBar,
    updateHeaderStats,
    totalStars,
    completedCount,
    MODULE_ORDER,
    STORAGE_KEY,
    XP_PER_STAR,
  };

  /* ─── BOOT ─────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
