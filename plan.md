# תכנית אתר לימוד הסתברות אינטראקטיבי לילדים
## Interactive Probability Education Website — Design & Curriculum Plan

**Target Audience:** Children ages 10–12
**Language:** Hebrew (RTL primary)
**Platform:** Static site — pure Vanilla HTML/CSS/JS, no build step, GitHub Pages compatible
**Date:** 2026-02-27

---

## 1. Educational Goals

By the end of the site, students will be able to:
- Define probability as a ratio between favorable outcomes and total outcomes
- Calculate basic probabilities for coins, dice, and cards
- Describe and enumerate sample spaces
- Identify and calculate complementary events
- Compute probabilities of compound (AND/OR) events
- Reason informally about conditional probability

---

## 2. Site Structure

```
/
├── index.html               ← Landing page / World Map
├── style/
│   ├── global.css           ← Reset, RTL, design tokens, typography
│   ├── worlds.css           ← World map & navigation styles
│   └── animations.css       ← Keyframe library, particle effects
├── js/
│   ├── state.js             ← LocalStorage-backed progress & XP store
│   ├── rewards.js           ← Stars, badges, XP logic
│   ├── audio.js             ← Sound effects (Web Audio API, no files needed)
│   └── utils.js             ← Random, shuffle, math helpers
├── worlds/
│   ├── 01-coins/
│   │   ├── index.html
│   │   ├── coins.css
│   │   └── coins.js
│   ├── 02-dice/
│   │   ├── index.html
│   │   ├── dice.css
│   │   └── dice.js
│   ├── 03-sample-space/
│   │   ├── index.html
│   │   ├── sample-space.css
│   │   └── sample-space.js
│   ├── 04-complement/
│   │   ├── index.html
│   │   ├── complement.css
│   │   └── complement.js
│   ├── 05-compound/
│   │   ├── index.html
│   │   ├── compound.css
│   │   └── compound.js
│   └── 06-conditional/
│       ├── index.html
│       ├── conditional.css
│       └── conditional.js
├── components/
│   ├── header.html          ← Shared top nav (injected via JS fetch)
│   ├── progress-bar.html
│   └── badge-modal.html
└── assets/
    ├── icons/               ← SVG icons only (no raster images)
    ├── sounds/              ← Optional: small OGG click/win sounds
    └── fonts/               ← Self-hosted woff2 subsets
```

---

## 3. Modules (Worlds)

### World 01 — "עולם המטבע" (The Coin World)
**Concept:** Introduction to probability — what is chance? Equally likely outcomes.
**Core idea:** P(event) = favorable outcomes / total outcomes
**Hebrew terms introduced:** הסתברות, תוצאה, שוויון סיכויים

**Mini-game — "הטלת מטבע":**
- Giant animated coin that the user clicks/taps to flip
- After each flip the result (עץ / פלי) animates with a big bounce
- A running tally bar chart shows experimental frequency vs. theoretical 1/2
- After 10 flips: "כמה פעמים קיבלת עץ? האם קיבלת בדיוק 5? למה?"
- Challenge round: predict 5 flips in a row → XP bonus for each correct prediction
- Concept card slides in explaining 1/2 with a fraction visual

**Learning check:** 3 quick multiple-choice questions
**Stars:** 1 star per correct answer, max 3 stars
**Badge unlocked:** "מטבע הזהב" — gold coin badge

---

### World 02 — "ארמון הקוביות" (The Dice Palace)
**Concept:** Sample outcomes, counting, probability with dice
**Core idea:** P(event) = |A| / |S|, enumerating outcomes
**Hebrew terms introduced:** מרחב מדגם, תוצאה אפשרית

**Mini-game — "קוביות קסם":**
- 3D-flipping die (CSS 3D transform cube animation)
- User rolls one die repeatedly and marks results on a grid
- After 20 rolls: animated bar chart of frequency distribution
- "מהי ההסתברות לקבל 6? לקבל מספר זוגי?"
- Two-dice mode unlocks after single-die challenge: user drags two dice and calculates sum
- Drag-and-drop: match outcome to its probability fraction

**Learning check:** 4 questions (mix of MC and fill-in-the-blank)
**Stars:** max 3
**Badge unlocked:** "שיגעון הקוביות" — glowing die badge

---

### World 03 — "גן מרחב המדגם" (Sample Space Garden)
**Concept:** Systematic listing of sample spaces; tree diagrams
**Core idea:** Organized counting, multiplication principle
**Hebrew terms introduced:** עץ הסתברות, מכפלה, ספירה שיטתית

**Mini-game — "גנן עץ ההסתברות":**
- Interactive tree diagram builder: user drags "branches" to build a tree for coin+die, outfit combinations, etc.
- Each branch animates as a growing vine/leaf (CSS path animation)
- System checks if tree is complete and correct; highlights missing branches in red with a bounce
- "כמה תוצאות אפשריות?" — user types/taps a number
- Bonus: "ספור את הדרכים" puzzle — how many outfits from 3 shirts × 2 pants?

**Learning check:** 3 questions including one tree-building task
**Stars:** max 3
**Badge unlocked:** "גנן המדגם" — tree badge

---

### World 04 — "מבצר ההשלמה" (The Complement Fortress)
**Concept:** Complementary events; P(A') = 1 − P(A)
**Core idea:** The probability of "not A" equals 1 minus P(A)
**Hebrew terms introduced:** אירוע משלים, הסתברות כ-1, כלל ההשלמה

**Mini-game — "שומר המבצר":**
- Fortress gate animation: the gate is 100% of the probability bar
- User is shown P(A) as a colored segment; they must drag the "complement" block to fill the rest of the bar to exactly 1
- Examples: "הסתברות לגשם = 0.3, מהי ההסתברות שלא ירד גשם?"
- Timed challenge: fill 5 complement bars as fast as possible (star timer)
- Visual: pie chart splits in two with smooth animation

**Learning check:** 4 questions
**Stars:** max 3
**Badge unlocked:** "שומר ההשלמה" — shield badge

---

### World 05 — "גלקסיית אירועים מורכבים" (Compound Events Galaxy)
**Concept:** Union (OR), intersection (AND), independent vs. mutually exclusive events
**Core idea:** P(A∪B) = P(A)+P(B)−P(A∩B); independence: P(A∩B) = P(A)·P(B)
**Hebrew terms introduced:** אירועים מורכבים, חיתוך, איחוד, עצמאות

**Mini-game — "מפת הגלקסיה":**
- Two overlapping planet Venn-diagram circles, animated with glowing orbits
- User drags "event cards" (outcome chips) into the correct region (A only, B only, both, neither)
- After sorting, fractions light up showing P(A), P(B), P(A∩B), P(A∪B)
- Independence detector: slider for P(A)×P(B) vs. P(A∩B) — do they match? → "עצמאיים!"
- Galaxy points (XP multiplier) for completing quickly

**Learning check:** 5 questions
**Stars:** max 3
**Badge unlocked:** "מגלה הגלקסיה" — galaxy/star badge

---

### World 06 — "מקדש ההתניה" (The Conditional Temple)
**Concept:** Conditional probability — P(A|B)
**Core idea:** P(A|B) = P(A∩B) / P(B); reduced sample space
**Hebrew terms introduced:** הסתברות מותנית, בהינתן, מרחב מצומצם

**Mini-game — "חדר הסודות":**
- A "secret room" is revealed one door at a time (similar to Monty Hall framing)
- User sees a bag of colored marbles; some are revealed to be "not red" — what's the updated probability of drawing blue?
- Interactive: user removes marbles from the "eliminated" zone and re-counts
- Two-stage experiment: draw a card, reveal it's a face card — what's the probability it's a King?
- Animation: sample space physically shrinks to the conditional region (zoom-in)

**Learning check:** 4 questions including one scenario problem
**Stars:** max 3
**Badge unlocked:** "חכם ההתניה" — temple/scroll badge

---

## 4. Reward & Progress System

### XP (ניקוד ניסיון)
| Action | XP |
|--------|----|
| Completing a mini-game experiment | +10 |
| Correct answer in learning check | +15 |
| Perfect score on a module | +25 bonus |
| Timed challenge completed | +20 |
| Daily return bonus | +5 |

### Stars (כוכבים)
- Each module: 0–3 stars based on learning check score
- Stars displayed on the world map as glowing animations
- Total stars shown in header with animated counter

### Badges (עיטורים)
- One unique badge per module (see module sections above)
- Badge unlock triggers a full-screen celebration animation:
  - Confetti burst (canvas-based particle system)
  - Badge spins in with scale + rotation keyframe
  - Sound effect (optional Web Audio API tone)
  - Share button (navigator.share API)

### Level System (רמות)
| XP Range | Level Title (Hebrew) |
|----------|---------------------|
| 0–49 | חוקר מתחיל |
| 50–149 | חוקר צעיר |
| 150–299 | חוקר מנוסה |
| 300–499 | מדען הסתברות |
| 500+ | גאון ההסתברות |

### Progress Persistence
- All state stored in `localStorage` under key `prob_edu_state`
- Schema:
```json
{
  "xp": 0,
  "completedModules": [],
  "stars": {"01-coins": 3, "02-dice": 2},
  "badges": ["coin-gold"],
  "lastVisit": "2026-02-27"
}
```

---

## 5. Visual Theme & Design System

### Overall Style
**"Duolingo meets Minecraft Education meets Khan Academy Kids"**
- Bright, saturated colors with dark outlines (neo-brutalist cartoon)
- Rounded corners everywhere (border-radius: 16px–32px)
- Drop shadows with colored offset (not grey shadows)
- Thick borders (2px–4px solid dark color)
- Bouncy micro-animations on every interactive element
- No photographic images — SVG illustrations only
- Each world has its own color identity (see below)

### Color Palette

**Global / Brand**
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#FF6B35` | Main CTA buttons, accents |
| `--color-secondary` | `#4ECDC4` | Secondary actions, links |
| `--color-background` | `#FFFBF0` | Page background (warm white) |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-text` | `#1A1A2E` | Body text |
| `--color-text-light` | `#6B7280` | Captions, hints |
| `--color-success` | `#06D6A0` | Correct answer feedback |
| `--color-error` | `#EF476F` | Wrong answer feedback |
| `--color-warning` | `#FFD166` | Stars, highlights |
| `--color-xp` | `#845EC2` | XP bar, level display |

**Per-World Accent Colors**
| World | Primary | Secondary |
|-------|---------|-----------|
| 01 Coins | `#FFD700` | `#FFA500` |
| 02 Dice | `#FF6B6B` | `#C0392B` |
| 03 Sample Space | `#52B788` | `#2D6A4F` |
| 04 Complement | `#5C85D6` | `#2C4AAF` |
| 05 Compound | `#B07FE8` | `#6B3FA0` |
| 06 Conditional | `#F4A261` | `#E76F51` |

### Typography

**Primary Font: Heebo** (Google Fonts — Hebrew + Latin)
- Weights: 400 (body), 700 (headings), 900 (display/numbers)
- Excellent Hebrew RTL rendering
- Free, web-safe Google Fonts delivery

**Fallback stack:**
```css
font-family: 'Heebo', 'Arial Hebrew', 'David', sans-serif;
```

**Type Scale (rem, base 16px):**
| Role | Size | Weight |
|------|------|--------|
| Display (hero numbers) | 4rem | 900 |
| H1 | 2.5rem | 700 |
| H2 | 1.75rem | 700 |
| H3 | 1.25rem | 700 |
| Body | 1rem | 400 |
| Caption | 0.875rem | 400 |
| Button | 1.125rem | 700 |

### Animation Library (animations.css)

Key keyframe definitions:
```css
@keyframes bounce-in    /* Elements entering screen */
@keyframes wiggle        /* Wrong answer feedback */
@keyframes pop           /* Correct answer celebration */
@keyframes spin-badge    /* Badge unlock */
@keyframes confetti-fall /* Celebration particles */
@keyframes pulse-glow    /* XP bar, star highlights */
@keyframes float         /* Idle state for characters */
@keyframes slide-rtl     /* RTL page transitions */
```

All animations respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

---

## 6. Interactive Elements Per Module

### Shared Interactive Components

**Probability Fraction Display**
- Animated numerator/denominator that count up to value
- Fraction bar with color fill animation
- Equivalent decimal shown below in smaller text

**XP Notification Toast**
- Slides in from top-right (RTL: top-left)
- Shows "+15 XP" with purple glow
- Auto-dismisses after 2s

**Star Rating Display**
- 3 outline stars → fill with golden glow on earn
- CSS-only animation (no JS for the star fill)

**Progress Bar (World Map)**
- Dotted path connecting all worlds (SVG polyline)
- Each world node: circular button with world icon
- Completed: full color + star count
- Locked: greyscale + lock icon
- Current: pulsing border animation

### Module-Specific Interactions

**World 01 (Coins)**
- Click/tap to flip: CSS 3D rotateY(180deg) transition, 0.6s ease
- Bar chart: CSS grid columns with height animation
- Prediction input: large tap targets (min 44×44px) for mobile

**World 02 (Dice)**
- 3D die: CSS perspective + rotateX/rotateY to show correct face
- Roll button: shake animation before settling
- Grid tally: tap to mark, SVG checkmark animation

**World 03 (Sample Space)**
- Tree builder: HTML5 drag-and-drop with touch support (pointer events)
- Branch animation: SVG stroke-dashoffset grows on connect
- Outcome bubbles: snap to node positions

**World 04 (Complement)**
- Probability bar: draggable divider (pointer events)
- Snap to correct answer ±5% tolerance
- Pie chart: SVG stroke-dasharray animation

**World 05 (Compound)**
- Venn diagram: SVG circles with CSS clip-path
- Drag cards: pointer events with drop zones
- Fraction calculator: animated fill as cards are placed

**World 06 (Conditional)**
- Marble bag: clickable marbles (SVG circles, pointer cursor)
- Remove animation: scale(0) + fade out
- Sample space zoom: CSS transform scale + translate on correct answer

---

## 7. ADHD-Friendly Design Principles

- **Sessions are short:** each mini-game is completable in 3–5 minutes
- **Immediate feedback:** every tap/click produces instant visual + optional audio response
- **Progress is always visible:** XP bar and stars update in real time
- **No long text blocks:** all instructions are max 2 sentences; key words bold/colored
- **Chunked learning:** concept → experiment → challenge → check (4 phases per module)
- **Escape hatch:** "Home" button always visible; no penalty for leaving mid-session
- **Celebration frequency:** small wins celebrated every 2–3 interactions, not just at module end
- **High contrast mode:** toggle available in header (meets WCAG AA)

---

## 8. RTL (Right-to-Left) Implementation

```css
/* global.css */
html {
  direction: rtl;
  text-align: right;
}

/* Flip all logical properties */
.flex-row { flex-direction: row-reverse; }
.progress-bar { direction: rtl; }

/* Icons that imply direction must be flipped */
.icon-arrow-right { transform: scaleX(-1); }
```

All JavaScript string manipulations use `Intl` and avoid left-biased assumptions.
SVG text elements use `text-anchor: end` by default.

---

## 9. Tech Stack Details

### HTML
- Semantic HTML5: `<main>`, `<section>`, `<article>`, `<nav>`, `<dialog>`
- Each world is a standalone `index.html` (no SPA router needed)
- `<template>` elements for reusable card patterns
- `lang="he"` on `<html>` element

### CSS
- CSS Custom Properties (design tokens) — no preprocessor
- CSS Grid + Flexbox for all layout
- Container Queries for component-level responsiveness
- `@layer` for cascade management: `base, layout, components, utilities`
- No CSS framework (keeps bundle tiny)

### JavaScript
- Vanilla ES2020+ (no framework, no bundler)
- Modules via `<script type="module">`
- `localStorage` for all persistence
- `Web Animations API` for complex sequences
- `Canvas API` for confetti particle system
- `IntersectionObserver` for scroll-triggered animations
- Optional: `Web Audio API` for synthesized sound effects (no audio files needed)
- No dependencies — loads instantly, works offline after first visit

### Hosting
- GitHub Pages (static, free)
- No server-side code
- All assets self-contained

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Total page weight (per world) | < 150KB |
| No external requests except Google Fonts | ✓ |

---

## 10. Accessibility

- All interactive elements have `aria-label` in Hebrew
- Focus styles visible and high-contrast
- `role="status"` for live XP/score updates (screen readers)
- Drag-and-drop interactions have keyboard alternatives
- Font size minimum 16px for body, 14px for captions
- Color is never the sole means of conveying information (icons + text always accompany)

---

## 11. Mobile-First Responsive Design

**Breakpoints:**
```css
/* Mobile first */
/* Default: 320px–599px */
@media (min-width: 600px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

**Touch targets:** minimum 44×44px on all interactive elements
**Gesture support:** swipe left/right for module navigation (pointer events)
**Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
**PWA-ready:** `manifest.json` and service worker for offline caching (bonus)

---

## 12. Implementation Roadmap

| Phase | Deliverables | Priority |
|-------|-------------|---------|
| 1 — Foundation | `index.html`, `global.css`, `state.js`, `rewards.js`, world map | High |
| 2 — World 01 | Coin flip mini-game, learning check, badge system | High |
| 3 — World 02 | Dice mini-game, frequency chart | High |
| 4 — World 03 | Tree diagram builder | Medium |
| 5 — World 04 | Complement bar game | Medium |
| 6 — World 05 | Venn diagram compound events | Medium |
| 7 — World 06 | Conditional marble game | Medium |
| 8 — Polish | Animations, audio, PWA manifest, accessibility audit | Low |
