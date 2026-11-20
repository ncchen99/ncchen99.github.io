/**
 * 念誠's page: two bands on one sheet of paper (the mission, then Resonance) and a foot.
 *
 * Everything here is the 共振 Resonance site's own language, by way of the team's business card
 * (Resonance-Business-Card): blobs.js is its port of the hero's metaball blobs, puppet.js + cast.js +
 * assets/mascots/ the Paper Pals, organic.js the hand-drawn button, rules, links and globe. This file
 * only stages them for this page. No build step: plain ES modules, served as they are.
 */
import { canvasLayer, smoothstep, lerp } from './blobs.js';
import { CAST } from './cast.js';
import { puppetEl, reach, mmPerUnit } from './puppet.js';
import {
  organicButton,
  organicBare,
  organicLink,
  globeIcon,
  arrowUpRightIcon,
  wavyLine,
  makePrng,
  INK,
  INK_STRONG,
} from './organic.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reducedMotion.matches;

// ── language ────────────────────────────────────────────────────────────

const META = {
  zh: {
    title: '陳念誠 — Nian-Cheng Chen',
    description: '結合資訊科技與商業，打造讓世界更溫暖的產品。',
    toggle: 'Switch to English',
    socials: '社群連結',
  },
  en: {
    title: 'Nian-Cheng Chen — 陳念誠',
    description: 'Blending technology and business to build products that make the world a little warmer.',
    toggle: '切換為中文',
    socials: 'Social links',
  },
};

const langOf = () => (document.documentElement.dataset.lang === 'en' ? 'en' : 'zh');

function applyLang(lang) {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const m = META[lang];
  document.title = m.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
  document.getElementById('lang').setAttribute('aria-label', m.toggle);
  document.querySelector('.socials')?.setAttribute('aria-label', m.socials);
}

function setupLang() {
  const button = document.getElementById('lang');
  document.getElementById('lang-globe').innerHTML = globeIcon();
  organicBare(button);
  applyLang(langOf());
  button.addEventListener('click', () => {
    const next = langOf() === 'zh' ? 'en' : 'zh';
    applyLang(next);
    try {
      localStorage.setItem('lang', next);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
    // A shared ?lang= link keeps in step with the toggle.
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next);
      history.replaceState(null, '', url);
    }
  });
  // Follow the system's language live, as long as the visitor hasn't picked one.
  addEventListener('languagechange', () => {
    let stored = null;
    try {
      stored = localStorage.getItem('lang');
    } catch {}
    if (stored || new URLSearchParams(location.search).has('lang')) return;
    applyLang(/^zh/i.test(navigator.languages?.[0] || navigator.language) ? 'zh' : 'en');
  });
}

// ── icons: the Resonance waves, and the outline glyphs the old site used ──

const WAVE_PATHS = [
  'M3.4,8.2 C5.4,5.9 7.3,5.8 9.2,8.0 C11.1,10.2 13.0,10.3 15.0,8.1 C16.9,6.0 18.8,5.9 20.7,8.1',
  'M3.0,12.1 C5.1,9.7 7.1,9.8 9.0,12.0 C10.9,14.2 12.9,14.3 14.9,12.1 C16.8,9.9 18.8,9.8 20.9,12.0',
  'M3.5,16.0 C5.4,13.8 7.4,13.7 9.3,15.9 C11.2,18.1 13.1,18.2 15.1,16.0 C17.0,13.9 18.9,13.8 20.8,16.0',
];

const stroked = (inner, width = INK_STRONG) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" ` +
  `stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

const ICONS = {
  resonance: () => stroked(WAVE_PATHS.map((d) => `<path d="${d}"/>`).join('')),
  'resonance-mark': () => stroked(WAVE_PATHS.map((d) => `<path d="${d}"/>`).join(''), 2.4),
  github: () =>
    stroked(
      '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 ' +
        '20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 ' +
        '5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    ),
  instagram: () =>
    stroked(
      '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>' +
        '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    ),
  facebook: () => stroked('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
  // An envelope in the same pen: a slightly wobbly box and its fold.
  mail: () =>
    stroked(
      '<path d="M3.6,6.4 C8.9,5.9 15.2,6.0 20.4,6.3 C20.7,10.2 20.6,14.1 20.3,17.8 C15.1,18.2 8.9,18.1 3.7,17.7 C3.4,13.9 3.4,10.1 3.6,6.4 Z"/>' +
        '<path d="M4.1,7.1 C6.9,9.4 9.4,11.5 12.0,12.9 C14.6,11.4 17.2,9.4 19.9,7.0"/>',
    ),
};

function setupIcons() {
  for (const el of document.querySelectorAll('[data-icon]')) el.innerHTML = ICONS[el.dataset.icon]?.() ?? '';
  for (const el of document.querySelectorAll('.arrow')) el.innerHTML = arrowUpRightIcon();
}

// ── the hand-drawn bits ─────────────────────────────────────────────────

const NS = 'http://www.w3.org/2000/svg';
const svg = (name, attrs = {}) => {
  const el = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

/** A band's top edge: its paper's wavy rim, a few slow swells across the width (the site's SectionEdge). */
function edgePath(seed) {
  const W = 1440;
  const H = 30;
  const rand = makePrng(seed);
  const n = 6;
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([(i / n) * W, H * (0.3 + 0.42 * rand())]);
  const f = (v) => +v.toFixed(1);
  let d = `M0,${H} L0,${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const h = (x1 - x0) / 2.6;
    d += ` C${f(x0 + h)},${f(y0)} ${f(x1 - h)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return { d: `${d} L${W},${H} Z`, W, H };
}

function setupHandDrawn() {
  for (const el of document.querySelectorAll('svg.edge')) {
    const { d, W, H } = edgePath(Number(el.dataset.edge));
    el.setAttribute('viewBox', `0 0 ${W} ${H}`);
    el.setAttribute('preserveAspectRatio', 'none');
    el.append(svg('path', { d }));
  }
  // The pen's mark under a word: one quick wavy stroke, drawn in once the page is up.
  for (const el of document.querySelectorAll('.pen-mark')) {
    const s = svg('svg', { viewBox: '0 -4 100 8', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
    s.append(
      svg('path', {
        d: wavyLine(100, Number(el.dataset.pen), 2.2, 4),
        fill: 'none',
        stroke: 'currentColor',
        // Not a non-scaling stroke: Chrome would measure the dash (the drawing-in) in screen px, not along the path.
        'stroke-width': 1.5,
        'stroke-linecap': 'round',
        pathLength: 1,
      }),
    );
    el.append(s);
  }
  // A ground under the puppets' feet: a pen line, not a shadow.
  for (const el of document.querySelectorAll('.ground')) {
    const s = svg('svg', { viewBox: '0 -4 240 8', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
    s.append(
      svg('path', {
        d: wavyLine(240, Number(el.dataset.ground), 1.6, 6),
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': INK,
        'stroke-linecap': 'round',
        'vector-effect': 'non-scaling-stroke',
      }),
    );
    el.append(s);
  }
  for (const el of document.querySelectorAll('.visit')) organicButton(el, { variant: 'solid' });
  for (const el of document.querySelectorAll('.pen-link')) organicLink(el);
}

function drawPenMarks() {
  const marks = document.querySelectorAll('.pen-mark');
  if (still()) {
    marks.forEach((m) => m.setAttribute('data-drawn', ''));
    return;
  }
  // Two frames, so the undrawn state is painted before the transition starts.
  requestAnimationFrame(() => requestAnimationFrame(() => marks.forEach((m) => m.setAttribute('data-drawn', ''))));
}

// ── the Paper Pals ──────────────────────────────────────────────────────

/** Arm angles for a wave (degrees, 0 = pointing right): the business card's WAVE_ARM, the lean toward it. */
const POSES = {
  'hello-left': { arms: { l: 215 }, wave: { arm: 'l', to: 245 }, tilt: -4, face: [-10, 0] },
  'hello-right': { arms: { r: -35 }, wave: { arm: 'r', to: -65 }, tilt: 4, face: [10, 0] },
};
/** How tall 摺摺 would stand on each stage (rig mm; the stage's --mm makes them CSS px). */
const STAGE_HEIGHT = { mission: 360, meet: 300 };

/**
 * One puppet in its own box, cropped to what it draws (its arms at both ends of the wave), its ground at the
 * box's bottom, so the stage lays the box out with CSS like any other element.
 */
function mountPal(box, heightMm, blinkDelay) {
  const slug = box.dataset.pal;
  const rig = CAST[slug];
  const k = mmPerUnit(slug, heightMm);
  const pose = { ...POSES[box.dataset.pose], heightMm, blinkDelay };
  const [, groundY] = rig.ground;
  const top = Math.min(...rig.parts.filter((p) => p.name !== 'shadow').map((p) => p.y));
  const { left, right } = reach(slug, { ...pose, at: [0, 0] });
  const w = right - left;
  const h = (groundY - top) * k;
  box.style.width = `calc(var(--mm) * ${w.toFixed(2)})`;
  box.style.height = `calc(var(--mm) * ${h.toFixed(2)})`;
  const el = puppetEl(slug, { ...pose, at: [-left, h] });
  // Flat, as the rest of the page: the ground is a pen line under the feet, not a cast shadow.
  el.querySelectorAll('.pup__part--shadow').forEach((img) => img.remove());
  box.append(el);
  const imgs = [...el.querySelectorAll('img')];
  Promise.all(imgs.map((img) => img.decode().catch(() => {}))).then(() => box.setAttribute('data-loaded', ''));
}

function hello(stage) {
  if (still()) return;
  for (const pal of stage.querySelectorAll('.pal')) {
    pal.removeAttribute('data-hello');
    void pal.offsetWidth; // restart the animation
    pal.setAttribute('data-hello', '');
  }
}

function setupPals() {
  let delay = 0;
  for (const stage of document.querySelectorAll('.stage')) {
    const height = stage.classList.contains('stage--mission') ? STAGE_HEIGHT.mission : STAGE_HEIGHT.meet;
    for (const box of stage.querySelectorAll('.pal')) {
      mountPal(box, height, delay);
      delay += 1.7;
      if (!still()) box.setAttribute('data-live', '');
    }
    // A hello the first time the stage comes into view, and again when a pointer comes by.
    const seen = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          seen.disconnect();
          setTimeout(() => hello(stage), 600);
        }
      },
      { threshold: 0.5 },
    );
    seen.observe(stage);
    let last = 0;
    stage.addEventListener('pointerenter', () => {
      const now = performance.now();
      if (now - last > 4500) {
        last = now;
        hello(stage);
      }
    });
  }
  reducedMotion.addEventListener('change', () => {
    for (const pal of document.querySelectorAll('.pal')) pal.toggleAttribute('data-live', !still());
  });
}

// ── the blobs ───────────────────────────────────────────────────────────

/** The hero's pastels (tokens.css). */
const INKS = {
  peach: 'oklch(88% 0.08 55)',
  lavender: 'oklch(80% 0.07 290)',
  sage: 'oklch(78% 0.07 140)',
  yellow: 'oklch(88% 0.10 90)',
  sky: 'oklch(82% 0.07 220)',
};
/** The one paper both bands are on (--cream). */
const PAPER = 'oklch(96.5% 0.015 75)';

/**
 * Where each band's blobs rest, as fractions of the band (x, y) and of its scale (R), for a wide window and a
 * narrow one; `drift` is the way each strays before coming back. One small visitor comes in and melts into
 * its host, as on the landing hero. A y past 1 (or below 0) reaches into the next band: they share one canvas.
 */
const SCENES = {
  mission: {
    wide: {
      blobs: [
        // Up and to the right of 摺摺, touching only its shoulder: behind it, not round it.
        { x: 0.93, y: 0.22, R: 0.15, color: INKS.peach, alpha: 0.78, seed: 11, drift: [-0.5, 0.4] },
        // Down in the seam, under the socials rather than behind them.
        { x: -0.03, y: 1.04, R: 0.14, color: INKS.lavender, alpha: 0.7, seed: 23, drift: [0.7, -0.3] },
        { x: 0.47, y: 0.06, R: 0.07, color: INKS.yellow, alpha: 0.75, seed: 5, drift: [-0.4, 0.6] },
      ],
      visitor: { from: [1.02, 0.08], host: 0, R: 0.075, color: INKS.sage, alpha: 0.8, seed: 41 },
    },
    narrow: {
      blobs: [
        { x: 1.0, y: 0.03, R: 0.34, color: INKS.peach, alpha: 0.85, seed: 11, drift: [-0.5, 0.5] },
        { x: -0.06, y: 1.04, R: 0.3, color: INKS.lavender, alpha: 0.7, seed: 23, drift: [0.6, -0.4] },
      ],
      visitor: { from: [0.15, 0.04], host: 0, R: 0.17, color: INKS.sage, alpha: 0.8, seed: 41 },
    },
  },
  resonance: {
    wide: {
      blobs: [
        // Out at the right edge beside 聆聆, not round it, and low enough to stay out of the first screen.
        { x: 1.03, y: 0.3, R: 0.13, color: INKS.yellow, alpha: 0.7, seed: 61, drift: [-0.5, 0.4] },
        { x: -0.02, y: 0.8, R: 0.13, color: INKS.sky, alpha: 0.55, seed: 83, drift: [0.6, 0.3] },
      ],
      visitor: { from: [1.05, 0.55], host: 0, R: 0.06, color: INKS.peach, alpha: 0.85, seed: 7 },
    },
    narrow: {
      blobs: [
        { x: 1.04, y: 0.14, R: 0.28, color: INKS.yellow, alpha: 0.7, seed: 61, drift: [-0.5, 0.4] },
        { x: 0.0, y: 0.6, R: 0.34, color: INKS.sky, alpha: 0.55, seed: 83, drift: [0.6, 0.3] },
      ],
      visitor: { from: [1.08, 0.3], host: 0, R: 0.16, color: INKS.peach, alpha: 0.85, seed: 7 },
    },
  },
};

/** Seconds the blobs move for before they are at rest where they began (the hero's SETTLE, a little longer). */
const SETTLE = 18;
const STRAY = 0.26;
const VISIT_AT = 1.2;
const VISIT_FADE = 2.5;
const VISIT_ARRIVE = 9;
/** Where a visitor comes to rest, as a fraction of its host's radius from the host's centre. */
const ABSORB_AT = 0.55;

/** The lobes' own clock: runs with t, slows from 70 % of SETTLE and stops with it. */
function lobeClock(t) {
  const from = 0.7 * SETTLE;
  if (t <= from) return t;
  const span = SETTLE - from;
  const u = Math.min(1, (t - from) / span);
  return from + span * (u - (u * u) / 2);
}

/** The band's blobs at time t, in CSS px of a w × h band. */
function frame(scene, w, h, t) {
  const s = w < 720 ? w : Math.min(w, h * 1.6);
  const out = scene.blobs.map((b, i) => {
    const R = b.R * s;
    // Out along its way and back home by SETTLE, swaying a little to the side as it goes.
    const p = Math.min(1, t / SETTLE);
    const out = Math.sin(Math.PI * smoothstep(p));
    const side = Math.sin(2 * Math.PI * p) * (1 - p) * 0.35;
    const [dx, dy] = b.drift;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: b.x * w + (R * STRAY * (dx * out - dy * side)) / len,
      y: b.y * h + (R * STRAY * (dy * out + dx * side)) / len,
      R,
      seed: b.seed,
      color: b.color,
      alpha: b.alpha,
      i,
    };
  });
  const v = scene.visitor;
  if (v && t > VISIT_AT) {
    const host = out[v.host];
    const R0 = v.R * s;
    const fx = v.from[0] * w;
    const fy = v.from[1] * h;
    // It comes to rest just inside the host's near side (never its centre, where a puppet may stand)...
    const away = Math.hypot(fx - host.x, fy - host.y) || 1;
    const inner = host.R * ABSORB_AT;
    const tx = host.x + ((fx - host.x) / away) * inner;
    const ty = host.y + ((fy - host.y) / away) * inner;
    const go = smoothstep((t - VISIT_AT) / (VISIT_ARRIVE - VISIT_AT));
    // Its way bends a little, so it arrives rather than slides.
    const bend = Math.sin(Math.PI * go) * 0.12 * s;
    const x = lerp(fx, tx, go) - bend * 0.4;
    const y = lerp(fy, ty, go) + bend;
    // ...and is taken in as it goes: from its centre crossing the host's rim to its resting place it shrinks
    // to nothing. Its size is all its colour answers to (blobs.js paintAt weighs by R, not by w), so shrinking
    // it takes its colour along with its shape: no tint left behind once its outline has gone into the host.
    const d = Math.hypot(x - host.x, y - host.y);
    const absorb = smoothstep((host.R - d) / (host.R - inner));
    // Squared, so the last of its colour goes quickly instead of lingering as a speck; it is inside the host's
    // outline by then, so its shape shrinking faster shows nowhere.
    if (absorb < 0.97) {
      out.push({
        x,
        y,
        R: R0 * (1 - absorb) ** 2,
        w: smoothstep((t - VISIT_AT) / VISIT_FADE),
        seed: v.seed,
        color: v.color,
        alpha: v.alpha,
      });
    }
    // The host takes in a little of the visitor's size.
    host.R *= 1 + 0.06 * absorb;
  }
  return out;
}

function setupBlobs() {
  const host = document.querySelector('[data-blobs]');
  const bands = [...document.querySelectorAll('[data-scene]')];
  if (!host || !bands.length) return;
  let layer = null;
  let size = [0, 0];
  // Each band's box within the sheet (its offsetParent is <main>, as the layer's host is).
  let boxes = [];
  let start = 0;
  let t = 0;
  let running = false;
  let visible = false;
  let done = false;

  const measure = () => {
    boxes = bands.map((band) => ({
      scene: SCENES[band.dataset.scene][band.offsetWidth < 720 ? 'narrow' : 'wide'],
      top: band.offsetTop,
      w: band.offsetWidth,
      h: band.offsetHeight,
    }));
  };
  const draw = () => {
    if (!layer) return;
    const tt = still() ? SETTLE : t;
    const all = [];
    for (const { scene, top, w, h } of boxes) {
      if (!w || !h) continue;
      for (const b of frame(scene, w, h, tt)) all.push({ ...b, y: b.y + top });
    }
    layer.draw(all, lobeClock(tt));
  };
  const fit = () => {
    measure();
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    if (Math.abs(w - size[0]) >= 1 || Math.abs(h - size[1]) >= 1) {
      size = [w, h];
      layer?.destroy();
      layer = null;
      if (!w || !h) return;
      // The field is sampled every 6 px: fine enough for a soft outline, cheap enough to move at 60 fps.
      layer = canvasLayer(host, { box: { x: 0, y: 0, w, h }, paper: PAPER, grain: 0.18, cell: 6, colourCell: 20 });
      host.setAttribute('data-ready', '');
    }
    draw();
  };
  const tick = (now) => {
    if (!running) return;
    if (!start) start = now - t * 1000;
    t = (now - start) / 1000;
    draw();
    if (t >= SETTLE) {
      running = false;
      done = true;
      return;
    }
    requestAnimationFrame(tick);
  };
  const play = () => {
    if (running || done || still() || !visible) return;
    running = true;
    start = 0;
    requestAnimationFrame(tick);
  };

  const resize = new ResizeObserver(fit);
  resize.observe(host);
  for (const band of bands) resize.observe(band);
  // Only while the sheet is on screen: the time runs on from where it was when it comes back.
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) play();
    else running = false;
  }).observe(host);
  reducedMotion.addEventListener('change', () => {
    if (still()) running = false;
    draw();
    play();
  });
}

// ── go ──────────────────────────────────────────────────────────────────

document.getElementById('year').textContent = String(new Date().getFullYear());
setupLang();
setupIcons();
setupHandDrawn();
setupPals();
setupBlobs();
// Draw the marks under the words once their faces are in (the line sits under the real glyphs), or after a
// moment regardless: the Chinese faces come in many small pieces, and the page shouldn't wait on all of them.
Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]).then(drawPenMarks);
