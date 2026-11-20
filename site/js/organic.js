/**
 * The Resonance site's hand-drawn controls, for the card page (card.html and
 * the short pages made from it). Ported from the Resonance repo, not redrawn:
 *
 *   src/lib/design/prng.ts, wobRect.ts, wavyPath.ts, strokes.ts   the shapes (verbatim)
 *   atoms/OrganicButton + ShapeGrain + BrushWash                   a button: a filled wobbly
 *                                                                  pill, no pen line, the grain
 *                                                                  of the fill, the hover brush
 *   atoms/Divider                                                  the wavy hand-drawn rule
 *   atoms/OrganicLink                                              the pen's wavy underline
 *   sections/SiteHeader/LanguageSelect + atoms/Icon globe          the frameless globe + language
 *
 * No framework: each helper draws into an element at its measured size
 * (ResizeObserver, like the site's useElementSize) and returns destroy().
 * Colours come from css/organic.css, so the dark theme is CSS only.
 */

/* ── strokes.ts: one pen for the whole page ───────────────────────────── */

/** Primary structural outline. */
export const INK = 1.8;
/** Secondary marks drawn with a lighter hand: dividers. */
export const INK_LIGHT = 1.2;
/** The same pen pressed harder: icons, focus. */
export const INK_STRONG = 2.2;

/* ── prng.ts ──────────────────────────────────────────────────────────── */

/** Stable small seed derived from a string (e.g. a link's href). */
export function seedFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (Math.abs(h) % 9973) + 1;
}

export function makePrng(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ── wobRect.ts ───────────────────────────────────────────────────────── */

/**
 * A wobbly rounded rectangle: bezier quarter-circle corners with a jittered
 * radius, edges of a few cubics joined by seeded wobble anchors.
 */
export function wobRect(W, H, R, seed, mag, opts = {}) {
  const rnd = makePrng(seed);
  const m = mag != null ? mag : Math.min(W, H) * 0.025;
  const K = 0.552;

  const curve = opts.curve ?? 1;
  const cornerJitter = opts.cornerJitter ?? 1;
  const cornerOffset = opts.cornerOffset ?? 0;

  const resolveSegs = (val, fallback) => {
    if (val == null) return fallback;
    if (Array.isArray(val)) {
      const [lo, hi] = val;
      return lo + Math.floor(rnd() * (hi - lo + 1));
    }
    return val | 0;
  };
  const segH = resolveSegs(opts.segmentsH, 3);
  const segV = resolveSegs(opts.segmentsV, 3);

  const radii = opts.cornerRadii;
  const corner = (r) => r + (rnd() - 0.5) * 2 * (Math.min(r * 0.07, Math.max(0, Math.min(W, H) / 2 - r) * 0.4) * cornerJitter);
  const Rtl = corner(radii?.[0] ?? R);
  const Rtr = corner(radii?.[1] ?? R);
  const Rbr = corner(radii?.[2] ?? R);
  const Rbl = corner(radii?.[3] ?? R);

  const oCap = Math.max(0, Math.min(W, H) * 0.5 - Math.max(Rtl, Rtr, Rbr, Rbl)) * 0.6;
  const oMag = Math.min(cornerOffset, oCap);
  const ox = () => (rnd() - 0.5) * 2 * oMag;
  const oy = () => (rnd() - 0.5) * 2 * oMag;
  const tlX = ox(), tlY = oy();
  const trX = ox(), trY = oy();
  const brX = ox(), brY = oy();
  const blX = ox(), blY = oy();

  const perpAmp = Math.min(m * 0.95 * curve, Math.min(W, H) * 0.032 * Math.max(1, curve));

  const f = (n) => +n.toFixed(2);
  const C = (x1, y1, x2, y2, x, y) => `C ${f(x1)},${f(y1)} ${f(x2)},${f(y2)} ${f(x)},${f(y)}`;

  const cubicH = (P0, P1) => {
    const h = Math.abs(P1[0] - P0[0]) / 3;
    const dir = P1[0] >= P0[0] ? 1 : -1;
    return C(P0[0] + dir * h, P0[1], P1[0] - dir * h, P1[1], P1[0], P1[1]);
  };
  const cubicV = (P0, P1) => {
    const h = Math.abs(P1[1] - P0[1]) / 3;
    const dir = P1[1] >= P0[1] ? 1 : -1;
    return C(P0[0], P0[1] + dir * h, P1[0], P1[1] - dir * h, P1[0], P1[1]);
  };

  const buildEdge = (P0, P1, axis, segs) => {
    const emit = axis === 'x' ? cubicH : cubicV;
    const len = axis === 'x' ? Math.abs(P1[0] - P0[0]) : Math.abs(P1[1] - P0[1]);
    if (segs < 2 || len < perpAmp * 4) return [emit(P0, P1)];
    const anchors = [];
    const anchorJitter = Math.min(0.08, 0.4 / segs);
    for (let i = 1; i < segs; i++) {
      const t = i / segs + (rnd() - 0.5) * anchorJitter;
      const x = P0[0] + (P1[0] - P0[0]) * t;
      const y = P0[1] + (P1[1] - P0[1]) * t;
      anchors.push(axis === 'x' ? [x, y + (rnd() - 0.5) * 2 * perpAmp] : [x + (rnd() - 0.5) * 2 * perpAmp, y]);
    }
    const result = [];
    let prev = P0;
    for (const a of anchors) {
      result.push(emit(prev, a));
      prev = a;
    }
    result.push(emit(prev, P1));
    return result;
  };

  const TLa = [0, Rtl + tlY];
  const TLb = [Rtl + tlX, 0];
  const TRa = [W - Rtr + trX, 0];
  const TRb = [W, Rtr + trY];
  const BRa = [W, H - Rbr + brY];
  const BRb = [W - Rbr + brX, H];
  const BLa = [Rbl + blX, H];
  const BLb = [0, H - Rbl + blY];

  const parts = [`M ${f(TLa[0])},${f(TLa[1])}`];
  parts.push(C(0, TLa[1] * (1 - K) + TLb[1] * K, TLb[0] * (1 - K) + TLa[0] * K, 0, TLb[0], TLb[1]));
  parts.push(...buildEdge(TLb, TRa, 'x', segH));
  parts.push(C(TRa[0] + (W - TRa[0]) * K, 0, W, TRb[1] * (1 - K), TRb[0], TRb[1]));
  parts.push(...buildEdge(TRb, BRa, 'y', segV));
  parts.push(C(W, BRa[1] + (H - BRa[1]) * K, BRb[0] + (W - BRb[0]) * K, H, BRb[0], BRb[1]));
  parts.push(...buildEdge(BRb, BLa, 'x', segH));
  parts.push(C(BLa[0] * (1 - K), H, 0, BLb[1] + (H - BLb[1]) * K, BLb[0], BLb[1]));
  parts.push(...buildEdge(BLb, TLa, 'y', segV));
  parts.push('Z');
  return parts.join(' ');
}

/* ── wavyPath.ts ──────────────────────────────────────────────────────── */

/** A wobbly horizontal line from (0,0) to (W,0): the Divider's. */
export function wavyLine(W, seed = 1, amp = 2, steps = 5) {
  const rnd = makePrng(seed);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * W;
    const y = i === 0 || i === steps ? 0 : (rnd() - 0.5) * 2 * amp;
    pts.push([x, y]);
  }
  const f = (n) => +n.toFixed(2);
  let d = `M ${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const h = (x1 - x0) / 3;
    d += ` C ${f(x0 + h)},${f(y0)} ${f(x1 - h)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return d;
}

/**
 * A pen's wavy underline at its real width: a crest every ~`half` px,
 * alternating up and down, each crest's height and place nudged by the seed,
 * settling back on the line at both ends.
 */
export function penWavePoints(W, seed = 1, amp = 1.2, half = 4.5) {
  const rnd = makePrng(seed);
  const n = Math.max(2, Math.round(W / half));
  const step = W / n;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    if (i === 0 || i === n) {
      pts.push([i * step, 0]);
      continue;
    }
    const x = i * step + (rnd() - 0.5) * step * 0.3;
    const y = (i % 2 === 1 ? -1 : 1) * amp * (0.65 + 0.7 * rnd());
    pts.push([x, y]);
  }
  return pts;
}

export function penWave(W, seed = 1, amp = 1.2, half = 4.5) {
  return pointsToBezier(penWavePoints(W, seed, amp, half));
}

export function pointsToBezier(pts) {
  const f = (n) => +n.toFixed(2);
  let out = `M ${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const midX = (x0 + x1) / 2;
    out += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return out;
}

/* ── the globe (atoms/Icon/icons/globe.tsx) ───────────────────────────── */

/** The wobbly globe: a closed bezier loop, a bowed equator, a bowed meridian. */
export function globeIcon(strokeWidth = INK_STRONG) {
  return (
    `<svg class="o-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">` +
    `<path d="M11.9,3.5 C16.4,3.7 20.4,7.6 20.4,12.1 C20.5,16.7 16.5,20.4 12.0,20.4 C7.4,20.5 3.5,16.4 3.5,11.9 C3.6,7.4 7.6,3.6 11.9,3.5 Z"/>` +
    `<path d="M3.7,12.1 C8.0,13.5 15.7,10.6 20.3,12.0"/>` +
    `<path d="M12.0,3.6 C9.4,6.5 8.9,17.4 12.1,20.4 C15.2,17.7 14.9,6.4 12.0,3.6 Z"/>` +
    `</svg>`
  );
}

/**
 * An arrow up toward the right ("opens elsewhere"), in the hand of the site's icons (Icon `share`,
 * `arrow-right`): the shaft swept up in one bowed stroke, the head one flick from its upper wing round the
 * tip and down, the wings unequal and the pen running a little past where it turns. Its viewBox hugs
 * the drawing, so at 13 px the stroke reads at the weight of the 600 label beside it.
 */
export function arrowUpRightIcon(strokeWidth = INK_STRONG) {
  return (
    `<svg class="o-arrow-svg" viewBox="4 4 16 16" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">` +
    `<path d="M5.9,18.3 C9.4,16.9 13.5,12.6 17.3,6.9"/>` +
    `<path d="M9.8,6.6 C12.4,6.0 15.2,6.0 17.9,6.3 C18.1,8.8 17.9,11.4 17.0,13.9"/>` +
    `</svg>`
  );
}

/* ── DOM ──────────────────────────────────────────────────────────────── */

const NS = 'http://www.w3.org/2000/svg';
let uid = 0;

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

/** Calls fn(w, h) with the element's layout size now and whenever it changes (useElementSize). */
function measured(el, fn) {
  let w = -1;
  let h = -1;
  const update = () => {
    const nw = el.offsetWidth;
    const nh = el.offsetHeight;
    if (nw === w && nh === h) return;
    w = nw;
    h = nh;
    fn(w, h);
  };
  const ro = new ResizeObserver(update);
  ro.observe(el);
  update();
  return () => ro.disconnect();
}

/**
 * BrushWash: a disc that grows by `transform` from where the pointer came in
 * until it covers the shape, clipped to the shape's own outline, and withdraws
 * toward where the pointer left. Pointer events (not mouse ones), so a mouse
 * gets it on hover and a finger while it presses, and a tap never leaves it on.
 */
function brushWash(host, { duration, overshoot = 6 }) {
  const region = document.createElement('div');
  region.className = 'o-wash';
  region.setAttribute('aria-hidden', 'true');
  const ink = document.createElement('div');
  ink.className = 'o-wash-ink';
  ink.style.transitionDuration = `${duration}ms`;
  region.append(ink);
  let w = 0;
  let h = 0;
  let x = 0;
  let y = 0;
  let on = false;
  const paint = () => {
    if (!w || !h) return;
    const full = Math.hypot(w, h) + overshoot;
    const reach = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + overshoot;
    Object.assign(ink.style, {
      left: `${x - full}px`,
      top: `${y - full}px`,
      width: `${full * 2}px`,
      height: `${full * 2}px`,
      transform: `scale(${on ? reach / full : 0})`,
    });
    ink.toggleAttribute('data-on', on);
  };
  const at = (e) => {
    const r = host.getBoundingClientRect();
    // The host may be scaled by a press; map back to its own (unscaled) box.
    x = ((e.clientX - r.left) / (r.width || 1)) * w;
    y = ((e.clientY - r.top) / (r.height || 1)) * h;
  };
  const enter = (e) => {
    at(e);
    on = true;
    paint();
  };
  const leave = (e) => {
    at(e);
    on = false;
    paint();
  };
  host.addEventListener('pointerenter', enter);
  host.addEventListener('pointerleave', leave);
  host.addEventListener('pointercancel', leave);
  return {
    el: region,
    shape(W, H, d) {
      w = W;
      h = H;
      Object.assign(region.style, { width: `${w}px`, height: `${h}px`, clipPath: `path('${d}')` });
      paint();
    },
    destroy() {
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointercancel', leave);
      region.remove();
    },
  };
}

/** The site's button geometry (OrganicButton): calm pills, gentle wobble. */
const BTN_R = 16;
const BTN_SEG_H = [2, 3];
const BTN_CURVE = 1.3;
const BTN_JITTER = 1.3;

function buttonPath(w, h, R, seed) {
  return wobRect(w, h, R, seed, Math.min(w, h) * 0.04, {
    segmentsH: BTN_SEG_H,
    segmentsV: 1,
    curve: BTN_CURVE,
    cornerJitter: BTN_JITTER,
    cornerOffset: Math.min(w, h) * 0.03,
  });
}

/**
 * OrganicButton on an existing <button> or <a>: a filled wobbly shape with no
 * pen line (`solid` = the verb, deep terracotta; `tonal` = everything beside
 * it, a soft terracotta tint), the button's grain, and the hover brush. The
 * element's own children are its label; put them in one `.o-label` span.
 * Until measured it stands in as a plain pill of its own fill.
 */
export function organicButton(el, { variant = 'solid', seed = variant === 'solid' ? 3 : 601, grain = 0.38 } = {}) {
  el.classList.add('o-btn');
  el.dataset.variant = variant;
  el.dataset.shapePending = '';
  const id = `o${seed}-${++uid}`;

  const face = svgEl('svg', { class: 'o-face', 'aria-hidden': 'true', focusable: 'false' });
  const fill = svgEl('path', { class: 'o-fill' });
  face.append(fill);

  // ShapeGrain: grey fractal noise, clipped to the shape.
  const tex = svgEl('svg', { class: 'o-face o-grain', 'aria-hidden': 'true', focusable: 'false' });
  const defs = svgEl('defs');
  const filter = svgEl('filter', { id: `sg-${id}`, x: '0%', y: '0%', width: '100%', height: '100%' });
  filter.append(
    svgEl('feTurbulence', { type: 'fractalNoise', baseFrequency: 1.1, numOctaves: 2, stitchTiles: 'stitch', seed }),
    svgEl('feColorMatrix', { type: 'saturate', values: 0 }),
  );
  const transfer = svgEl('feComponentTransfer');
  transfer.append(svgEl('feFuncA', { type: 'linear', slope: grain }));
  filter.append(transfer, svgEl('feComposite', { in2: 'SourceGraphic', operator: 'in' }));
  const clip = svgEl('clipPath', { id: `sgc-${id}` });
  const clipPath = svgEl('path');
  clip.append(clipPath);
  defs.append(filter, clip);
  const g = svgEl('g', { 'clip-path': `url(#sgc-${id})` });
  const noise = svgEl('path', { fill: 'black', filter: `url(#sg-${id})` });
  g.append(noise);
  tex.append(defs, g);

  const wash = brushWash(el, { duration: 340, overshoot: 4 });
  el.prepend(face, tex, wash.el);

  const stop = measured(el, (w, h) => {
    if (!w || !h) return;
    const d = buttonPath(w, h, BTN_R, seed);
    for (const s of [face, tex]) {
      s.setAttribute('width', w);
      s.setAttribute('height', h);
      s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }
    fill.setAttribute('d', d);
    clipPath.setAttribute('d', d);
    noise.setAttribute('d', d);
    wash.shape(w, h, d);
    delete el.dataset.shapePending;
  });

  return {
    destroy() {
      stop();
      wash.destroy();
      face.remove();
      tex.remove();
      el.classList.remove('o-btn');
      delete el.dataset.shapePending;
    },
  };
}

/**
 * The header's language control (LanguageSelect's frameless trigger): the
 * wobbly globe beside the language's own name, no box and no chevron, as on
 * resonance.channel. A pointer brushes a faint terracotta wash into a wobbly
 * shape under it, the site's hover for anything pressable.
 */
export function organicBare(el, { seed = 53 } = {}) {
  el.classList.add('o-bare');
  const wash = brushWash(el, { duration: 340, overshoot: 4 });
  el.prepend(wash.el);
  const stop = measured(el, (w, h) => {
    if (w && h) wash.shape(w, h, buttonPath(w, h, 10, seed));
  });
  return {
    destroy() {
      stop();
      wash.destroy();
      el.classList.remove('o-bare');
    },
  };
}

/**
 * Divider: a wavy hand-drawn rule, INK_LIGHT, in a soft rule colour. The line
 * is drawn on a 240-wide box and stretched with a non-scaling stroke, exactly
 * as the site's (the same as drawing it at the measured width: its x is t × W).
 */
export function organicDivider(el, { seed = 17, amplitude = 1.4, steps = 7, strokeWidth = INK_LIGHT } = {}) {
  const W = 240;
  const h = amplitude * 2 + strokeWidth * 2;
  el.classList.add('o-divider');
  el.setAttribute('aria-hidden', 'true');
  const svg = svgEl('svg', {
    viewBox: `0 ${-h / 2} ${W} ${h}`,
    preserveAspectRatio: 'none',
    width: '100%',
    height: h,
    focusable: 'false',
  });
  svg.append(
    svgEl('path', {
      d: wavyLine(W, seed, amplitude, steps),
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': strokeWidth,
      'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke',
    }),
  );
  el.replaceChildren(svg);
  return { destroy: () => svg.remove() };
}

/**
 * OrganicLink: a text link underlined with the pen's own wavy stroke (a crest
 * every ~4.5 px along the link's measured width) instead of the browser's
 * straight rule, sitting just under the letters.
 */
export function organicLink(a, { seed = seedFromString(a.getAttribute('href') || '') } = {}) {
  a.classList.add('o-link');
  const text = document.createElement('span');
  text.className = 'o-link-text';
  text.append(...a.childNodes);
  const svg = svgEl('svg', { class: 'o-link-line', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
  const line = svgEl('path', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': INK,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'vector-effect': 'non-scaling-stroke',
  });
  svg.append(line);
  a.append(text, svg);
  const stop = measured(text, (w) => {
    const width = w || 120;
    svg.setAttribute('viewBox', `0 -3 ${width} 6`);
    line.setAttribute('d', penWave(width, seed));
  });
  return {
    destroy() {
      stop();
      svg.remove();
      a.append(...text.childNodes);
      text.remove();
      a.classList.remove('o-link');
    },
  };
}

/**
 * The site's toast (molecules/Toast on atoms/InkPill, size md): a word over the foot of the window that
 * something happened, made as a card is — the accent's light wash inside one hand-drawn pen line of the
 * accent, a card's corners (16), flat, no shadow — centred clear of the home indicator, 4 s, scaling in
 * over 180 ms and fading out over 140. One live region, there from the start, speaks it; the face is
 * silent. Returns show(message): a new word replaces the one showing.
 */
export function organicToast({ seed = 41, ms = 4000 } = {}) {
  const region = document.createElement('p');
  region.className = 'o-toast-region';
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  const host = document.createElement('div');
  host.className = 'o-toast-host';
  host.hidden = true;
  document.body.append(region, host);
  let stop = null;
  let timer = 0;
  let leave = 0;
  return function show(message) {
    clearTimeout(timer);
    clearTimeout(leave);
    stop?.();
    const face = document.createElement('div');
    face.className = 'o-toast';
    face.dataset.shapePending = '';
    face.setAttribute('aria-hidden', 'true');
    const svg = svgEl('svg', { class: 'o-face', 'aria-hidden': 'true', focusable: 'false' });
    const path = svgEl('path', { class: 'o-toast-pen', 'stroke-width': INK, 'stroke-linejoin': 'round' });
    svg.append(path);
    const label = document.createElement('span');
    label.className = 'o-toast-label';
    label.textContent = message;
    face.append(svg, label);
    host.replaceChildren(face);
    delete host.dataset.leaving;
    host.hidden = false;
    stop = measured(face, (w, h) => {
      if (!w || !h) return;
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      path.setAttribute('d', wobRect(w, h, 16, seed, 1.2, { segmentsH: 2, segmentsV: 1, curve: 1.4 }));
      delete face.dataset.shapePending;
    });
    // Said again even when the words are the same, so a second copy is heard too.
    region.textContent = '';
    requestAnimationFrame(() => (region.textContent = message));
    timer = setTimeout(() => {
      host.dataset.leaving = '';
      leave = setTimeout(() => {
        host.hidden = true;
        stop?.();
        stop = null;
        host.replaceChildren();
      }, 140);
    }, ms);
  };
}
