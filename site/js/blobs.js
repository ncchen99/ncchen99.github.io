/**
 * Metaball blobs for a business card — the landing hero's shapes, made to
 * sit still on paper or move on a screen.
 *
 * Ported from the Resonance repo's src/lib/design/driftingBlobs.ts: each
 * blob is a core and four lobes that orbit and sway slowly, and the card
 * draws the union of every lobe's field as one outline (marching squares),
 * so two blobs that come close grow a neck between them on their own and
 * their colours blend across it. What differs from the hero: nothing
 * drifts by itself here. A card says where each blob is (x, y, R, colour)
 * for every frame it draws, so a design can stage the meeting of two blobs
 * however it likes, and the same frame can be drawn on a canvas (on screen)
 * or as an SVG path (for print, where it stays vector).
 *
 * Units: whatever the caller's design space is. The cards use 0.1 mm
 * (a 90 × 54 mm card is 900 × 540). Time is seconds.
 */

// ── constants (the hero's) ─────────────────────────────────────────────

/** The field value the outline is drawn at. */
export const ISO = 0.25;
/** How far a lobe's field reaches, in multiples of its own radius. */
const REACH = 1 / Math.sqrt(1 - Math.sqrt(ISO));
const TAU = Math.PI * 2;

/** The site's seeded PRNG (src/lib/design/prng.ts). */
export function makePrng(seed) {
  let s = (Math.abs(Math.round(seed)) * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── lobes ──────────────────────────────────────────────────────────────

const lobeCache = new Map();

/**
 * A blob's lobes, relative to its size R (so a blob can grow while it
 * keeps its character): the hero's layout(), deterministic per seed.
 */
function lobesOf(seed) {
  let lobes = lobeCache.get(seed);
  if (lobes) return lobes;
  const rand = makePrng(seed);
  lobes = [{ dist: 0, angle: 0, spin: 0, sway: 0, swayPeriod: 20, phase: rand() * TAU, r: 0.81 }];
  const base = rand() * TAU;
  const turn = (rand() < 0.5 ? -1 : 1) * (0.025 + rand() * 0.03);
  for (let k = 0; k < 4; k++) {
    lobes.push({
      dist: 0.39 + rand() * 0.07,
      angle: base + (k * TAU) / 4 + (rand() - 0.5) * 0.6,
      spin: turn * (0.6 + rand() * 0.8),
      sway: 0.12 + rand() * 0.12,
      swayPeriod: 16 + rand() * 14,
      phase: rand() * TAU,
      r: 0.53 + rand() * 0.09,
    });
  }
  lobeCache.set(seed, lobes);
  return lobes;
}

/**
 * Where each of a blob's lobes is at time t.
 * A blob: { x, y, R, seed, color, alpha?, pace?, w? }
 *   pace — how fast it lives (1 = the hero's slow pace; 0 = frozen at t)
 *   w    — 0–1, how much of it there is (fading in or out)
 *   stretch — optional [sx, sy] squash of its lobe layout (a reaching blob)
 */
export function lobesAt(blob, t) {
  const pace = blob.pace ?? 1;
  const tt = t * pace;
  const R = blob.R;
  const w = blob.w ?? 1;
  const ww = w * w * (3 - 2 * w);
  const sx = blob.stretch?.[0] ?? 1;
  const sy = blob.stretch?.[1] ?? 1;
  return lobesOf(blob.seed ?? 1).map((l) => {
    const a = l.angle + l.spin * tt;
    const d = R * l.dist * (1 + l.sway * Math.sin((TAU * tt) / l.swayPeriod + l.phase));
    const r = R * l.r * (1 + 0.035 * Math.sin((TAU * tt) / (l.swayPeriod * 1.3) + l.phase * 1.7));
    return { x: blob.x + Math.cos(a) * d * sx, y: blob.y + Math.sin(a) * d * sy, r, w: ww };
  });
}

// ── the field and its outline ──────────────────────────────────────────

/** A sample grid over a box of the design space, one cell outside it all round. */
export function makeGrid(box, cell) {
  const nx = Math.ceil((box.w + 2 * cell) / cell) + 1;
  const ny = Math.ceil((box.h + 2 * cell) / cell) + 1;
  return { cell, x0: box.x - cell, y0: box.y - cell, nx, ny, v: new Float32Array(nx * ny) };
}

/** Sums every lobe's field into the grid; the outer ring of samples stays 0, so outlines close. */
export function sampleField(blobs, t, g) {
  const { v, nx, ny, cell, x0, y0 } = g;
  v.fill(0);
  for (const b of blobs) {
    if ((b.w ?? 1) <= 0 || b.R <= 0) continue;
    for (const p of lobesAt(b, t)) {
      if (p.w <= 0) continue;
      const rho = p.r * REACH;
      const i0 = Math.max(1, Math.ceil((p.x - rho - x0) / cell));
      const i1 = Math.min(nx - 2, Math.floor((p.x + rho - x0) / cell));
      const j0 = Math.max(1, Math.ceil((p.y - rho - y0) / cell));
      const j1 = Math.min(ny - 2, Math.floor((p.y + rho - y0) / cell));
      const inv = 1 / (rho * rho);
      for (let j = j0; j <= j1; j++) {
        const dy = y0 + j * cell - p.y;
        const dy2 = dy * dy;
        const row = j * nx;
        for (let i = i0; i <= i1; i++) {
          const dx = x0 + i * cell - p.x;
          const u = (dx * dx + dy2) * inv;
          if (u < 1) v[row + i] += p.w * (1 - u) * (1 - u);
        }
      }
    }
  }
}

/** The outline at `iso` as closed loops of points [x0, y0, x1, y1, …] (marching squares). */
export function traceContours(g, iso = ISO) {
  const { v, nx, ny, cell, x0, y0 } = g;
  const links = new Int32Array(nx * ny * 4).fill(-1);
  const link = (a, b) => {
    links[a * 2 + (links[a * 2] === -1 ? 0 : 1)] = b;
    links[b * 2 + (links[b * 2] === -1 ? 0 : 1)] = a;
  };
  let any = false;
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const tl = v[j * nx + i];
      const tr = v[j * nx + i + 1];
      const br = v[(j + 1) * nx + i + 1];
      const bl = v[(j + 1) * nx + i];
      const code = (tl >= iso ? 1 : 0) | (tr >= iso ? 2 : 0) | (br >= iso ? 4 : 0) | (bl >= iso ? 8 : 0);
      if (code === 0 || code === 15) continue;
      any = true;
      const T = (j * nx + i) * 2;
      const B = ((j + 1) * nx + i) * 2;
      const L = (j * nx + i) * 2 + 1;
      const R = (j * nx + i + 1) * 2 + 1;
      switch (code) {
        case 1: case 14: link(L, T); break;
        case 2: case 13: link(T, R); break;
        case 3: case 12: link(L, R); break;
        case 4: case 11: link(R, B); break;
        case 6: case 9: link(T, B); break;
        case 7: case 8: link(L, B); break;
        case 5:
          if ((tl + tr + br + bl) / 4 >= iso) { link(T, R); link(B, L); } else { link(L, T); link(R, B); }
          break;
        case 10:
          if ((tl + tr + br + bl) / 4 >= iso) { link(L, T); link(R, B); } else { link(T, R); link(B, L); }
          break;
      }
    }
  }
  if (!any) return [];
  const point = (e, out) => {
    const s = e >> 1;
    const i = s % nx;
    const j = (s - i) / nx;
    const a = v[s];
    const down = e & 1;
    const b = down ? v[s + nx] : v[s + 1];
    const f = b === a ? 0.5 : (iso - a) / (b - a);
    out.push(x0 + (i + (down ? 0 : f)) * cell, y0 + (j + (down ? f : 0)) * cell);
  };
  const seen = new Uint8Array(nx * ny * 2);
  const loops = [];
  for (let e = 0; e < nx * ny * 2; e++) {
    if (links[e * 2] === -1 || seen[e]) continue;
    const loop = [];
    let prev = -1;
    let cur = e;
    while (cur !== -1 && !seen[cur]) {
      seen[cur] = 1;
      point(cur, loop);
      const n0 = links[cur * 2];
      const next = n0 !== prev ? n0 : links[cur * 2 + 1];
      prev = cur;
      cur = next;
    }
    if (loop.length >= 6) loops.push(loop);
  }
  return loops;
}

/** Quadratic curves through the midpoints of each traced polygon (the hero's smoothing). */
function eachSmoothLoop(loops, moveTo, quadTo, close) {
  for (const l of loops) {
    const n = l.length / 2;
    const mx = (i) => (l[2 * i] + l[2 * ((i + 1) % n)]) / 2;
    const my = (i) => (l[2 * i + 1] + l[2 * ((i + 1) % n) + 1]) / 2;
    moveTo(mx(n - 1), my(n - 1));
    for (let i = 0; i < n; i++) quadTo(l[2 * i], l[2 * i + 1], mx(i), my(i));
    close();
  }
}

/** The outline as SVG path data (fill-rule evenodd). */
export function outlinePath(blobs, t, box, cell = 3) {
  const g = makeGrid(box, cell);
  sampleField(blobs, t, g);
  const loops = traceContours(g);
  const f = (n) => Math.round(n * 10) / 10;
  let d = '';
  eachSmoothLoop(
    loops,
    (x, y) => (d += `M${f(x)} ${f(y)}`),
    (cx, cy, x, y) => (d += `Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`),
    () => (d += 'Z'),
  );
  return d;
}

/** The field's value at a point (≥ ISO is inside a blob). */
export function fieldAt(blobs, t, x, y) {
  let f = 0;
  for (const b of blobs) {
    for (const p of lobesAt(b, t)) {
      const rho = p.r * REACH;
      const u = ((x - p.x) ** 2 + (y - p.y) ** 2) / (rho * rho);
      if (u < 1) f += p.w * (1 - u) * (1 - u);
    }
  }
  return f;
}

// ── colour ─────────────────────────────────────────────────────────────

/** `oklch(78% 0.07 140)` → Oklab [L, a, b], or null. */
export function parseOklch(css) {
  const m = /oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/.exec(css || '');
  if (!m) return null;
  const L = Number(m[1]) / (m[2] ? 100 : 1);
  const C = Number(m[3]);
  const h = (Number(m[4]) * Math.PI) / 180;
  return [L, C * Math.cos(h), C * Math.sin(h)];
}

/** Oklab → sRGB 0–255 (clamped). */
export function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) => {
    const x = Math.min(1, Math.max(0, c));
    return Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055));
  });
}

export function rgbHex([r, g, b]) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

function mixLab(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * Blends colours keeping their chroma: lightness and chroma averaged, the
 * hue as a direction — so lavender and sage pass round the hue circle
 * instead of cancelling to grey (the hero's blend()).
 */
export function blend(colours, weights) {
  let sw = 0, L = 0, C = 0, a = 0, b = 0;
  for (let i = 0; i < colours.length; i++) {
    const w = weights[i];
    const [l, ca, cb] = colours[i];
    const c = Math.hypot(ca, cb);
    sw += w;
    L += w * l;
    C += w * c;
    if (c > 1e-6) {
      a += (w * ca) / c;
      b += (w * cb) / c;
    }
  }
  if (sw <= 0) return colours[0];
  const len = Math.hypot(a, b);
  if (len < 1e-9) return [L / sw, 0, 0];
  const chroma = C / sw;
  return [L / sw, (a / len) * chroma, (b / len) * chroma];
}

const FALLBACK = [0.88, 0.04, 0.06];

/** Each blob's colour as laid on the paper: its ink at its alpha. */
function inksOf(blobs, paper) {
  const p = parseOklch(paper) ?? [0.975, 0, 0.01];
  return blobs.map((b) => mixLab(p, parseOklch(b.color) ?? FALLBACK, Math.min(1, b.alpha ?? 1)));
}

/** The paint at a point: every blob's colour weighted by how near it is (the hero's paintColours). */
function paintAt(list, cs, x, y) {
  if (list.length === 1) return cs[0];
  const ws = list.map((b) => {
    const q = (b.R * b.R) / ((x - b.x) ** 2 + (y - b.y) ** 2 + 1e-3 * b.R * b.R);
    return q * q * q;
  });
  return blend(cs, ws);
}

// ── grain (screen only) ────────────────────────────────────────────────

let grainTile = null;
/**
 * Sand: crisp one-pixel grains, half a shade darker and half lighter than
 * the colour under them, mostly faint, a few strong (the hero's recipe).
 */
function grainCanvas() {
  if (grainTile) return grainTile;
  const size = 160;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const d = img.data;
  const rand = makePrng(4242);
  for (let i = 0; i < d.length; i += 4) {
    const light = rand() < 0.5;
    d[i] = light ? 255 : 84;
    d[i + 1] = light ? 252 : 58;
    d[i + 2] = light ? 244 : 38;
    d[i + 3] = 255 * rand() ** 3 * (light ? 1 : 0.3);
  }
  g.putImageData(img, 0, 0);
  grainTile = c;
  return c;
}

// ── layers ─────────────────────────────────────────────────────────────

/**
 * A canvas that draws blobs over `box` (design units) and fills its host.
 *
 *   const layer = canvasLayer(host, { box, paper, grain: 0.2 });
 *   layer.draw(blobs, t);
 *
 * `cell` is the field's resolution in design units (smaller = finer and
 * slower); colours are sampled every `colourCell`.
 */
export function canvasLayer(host, { box, paper, grain = 0, cell = 5, colourCell = 18 }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'blob-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const field = makeGrid(box, cell);
  const colours = makeGrid(box, colourCell);
  const colourCanvas = document.createElement('canvas');
  colourCanvas.width = colours.nx;
  colourCanvas.height = colours.ny;
  const colourCtx = colourCanvas.getContext('2d');
  const colourData = colourCtx.createImageData(colours.nx, colours.ny);
  let cssW = 0, cssH = 0, dpr = 1;
  let grainStrength = grain;
  let pattern = null;

  const fit = () => {
    // The layout size, not getBoundingClientRect(): inside a turning 3D card that is the projected box.
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    if (!w || !h) return false;
    const nextDpr = Math.min(2.5, window.devicePixelRatio || 1);
    if (Math.abs(w - cssW) < 0.5 && Math.abs(h - cssH) < 0.5 && nextDpr === dpr) return true;
    cssW = w;
    cssH = h;
    dpr = nextDpr;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    return true;
  };

  function draw(blobs, t = 0) {
    if (!fit()) return;
    const sx = (cssW * dpr) / box.w;
    const sy = (cssH * dpr) / box.h;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const live = blobs.filter((b) => (b.w ?? 1) > 0 && b.R > 0);
    if (!live.length) return;
    sampleField(live, t, field);
    const loops = traceContours(field);
    if (!loops.length) return;
    ctx.setTransform(sx, 0, 0, sy, -box.x * sx, -box.y * sy);
    const outline = new Path2D();
    eachSmoothLoop(
      loops,
      (x, y) => outline.moveTo(x, y),
      (cx, cy, x, y) => outline.quadraticCurveTo(cx, cy, x, y),
      () => outline.closePath(),
    );
    ctx.save();
    ctx.clip(outline, 'evenodd');
    // Colour: a coarse grid of the blended paint, drawn smoothed under the clip.
    const cs = inksOf(live, paper);
    const d = colourData.data;
    for (let j = 0; j < colours.ny; j++) {
      const y = colours.y0 + j * colours.cell;
      for (let i = 0; i < colours.nx; i++) {
        const x = colours.x0 + i * colours.cell;
        const [r, g, b] = oklabToRgb(paintAt(live, cs, x, y));
        const o = (j * colours.nx + i) * 4;
        d[o] = r;
        d[o + 1] = g;
        d[o + 2] = b;
        d[o + 3] = 255;
      }
    }
    colourCtx.putImageData(colourData, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const c = colours.cell;
    ctx.drawImage(colourCanvas, colours.x0 - c / 2, colours.y0 - c / 2, colours.nx * c, colours.ny * c);
    if (grainStrength > 0) {
      // One grain per CSS pixel, unsmoothed: sharp specks, not blotches.
      pattern = pattern || ctx.createPattern(grainCanvas(), 'repeat');
      const px = Math.max(1, Math.round(dpr));
      ctx.setTransform(px, 0, 0, px, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = grainStrength;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width / px, canvas.height / px);
    }
    ctx.restore();
  }

  return {
    canvas,
    draw,
    setGrain(g) {
      grainStrength = g;
    },
    destroy() {
      canvas.remove();
    },
  };
}

let svgIds = 0;

/**
 * The same blobs as an SVG string (vector, for the static card and print).
 * One blob is one flat colour; two are a gradient along the line between
 * them (the blend across their neck); more fall back to an embedded image
 * of the colour field, clipped by the vector outline.
 *
 * `grain` (0–1) adds an SVG noise filter for screen; print leaves it 0.
 */
export function blobSvg(blobs, t, { box, paper, cell = 3, grain = 0, className = 'blob-svg' } = {}) {
  const live = blobs.filter((b) => (b.w ?? 1) > 0 && b.R > 0);
  const vb = `${box.x} ${box.y} ${box.w} ${box.h}`;
  const open = `<svg class="${className}" viewBox="${vb}" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`;
  if (!live.length) return open + '</svg>';
  const d = outlinePath(live, t, box, cell);
  const id = `bs${++svgIds}`;
  const cs = inksOf(live, paper);
  let defs = '';
  let fill;
  if (live.length === 1) {
    fill = rgbHex(oklabToRgb(cs[0]));
  } else if (live.length === 2) {
    const [A, B] = live;
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    if (len < 1) {
      fill = rgbHex(oklabToRgb(blend(cs, [A.R * A.R, B.R * B.R])));
    } else {
      const stops = [];
      for (let k = 0; k <= 24; k++) {
        const s = k / 24;
        const c = paintAt(live, cs, A.x + (B.x - A.x) * s, A.y + (B.y - A.y) * s);
        stops.push(`<stop offset="${s.toFixed(3)}" stop-color="${rgbHex(oklabToRgb(c))}"/>`);
      }
      defs += `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}">${stops.join('')}</linearGradient>`;
      fill = `url(#${id}g)`;
    }
  } else {
    const W = Math.round(box.w / 2);
    const H = Math.round(box.h / 2);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    const img = g.createImageData(W, H);
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const [r, gg, b] = oklabToRgb(paintAt(live, cs, box.x + (i + 0.5) * 2, box.y + (j + 0.5) * 2));
        const o = (j * W + i) * 4;
        img.data[o] = r;
        img.data[o + 1] = gg;
        img.data[o + 2] = b;
        img.data[o + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    defs += `<clipPath id="${id}c"><path d="${d}" clip-rule="evenodd"/></clipPath>`;
    const body = `<image href="${c.toDataURL('image/png')}" x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" preserveAspectRatio="none" clip-path="url(#${id}c)"/>`;
    return open + `<defs>${defs}</defs>` + body + grainPath(d, grain, id) + '</svg>';
  }
  return open + (defs ? `<defs>${defs}</defs>` : '') + `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>` + grainPath(d, grain, id) + '</svg>';
}

function grainPath(d, grain, id) {
  if (!grain) return '';
  return (
    `<filter id="${id}n" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="3"/>` +
    `<feColorMatrix type="saturate" values="0"/>` +
    `<feComponentTransfer><feFuncA type="linear" slope="${grain}"/></feComponentTransfer>` +
    `<feComposite in2="SourceGraphic" operator="in"/></filter>` +
    `<path d="${d}" fill="#000" fill-rule="evenodd" filter="url(#${id}n)"/>`
  );
}

// ── small helpers for staging a meeting ────────────────────────────────

export function smoothstep(x) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Two blobs A and B whose centres close in as `k` goes 0 → 1: apart, then
 * touching (a neck grows), then one blob of both their areas at the
 * weighted centre. A design picks `k` per frame (a breath, a flip, a hover).
 */
export function meeting(A, B, k) {
  const s = smoothstep(k);
  const mA = A.R * A.R;
  const mB = B.R * B.R;
  const cx = (A.x * mA + B.x * mB) / (mA + mB);
  const cy = (A.y * mA + B.y * mB) / (mA + mB);
  const R = Math.sqrt(mA + mB);
  // Each grows toward the fused size as they close, so the union keeps both areas.
  const grow = (r) => lerp(r, R * 0.82, smoothstep((k - 0.55) / 0.45));
  return [
    { ...A, x: lerp(A.x, cx, s), y: lerp(A.y, cy, s), R: grow(A.R) },
    { ...B, x: lerp(B.x, cx, s), y: lerp(B.y, cy, s), R: grow(B.R) },
  ];
}
