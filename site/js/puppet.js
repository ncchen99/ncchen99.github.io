/**
 * The Resonance paper puppets on a card face: drawn from their parts (js/cast.js, assets/mascots/) the way the
 * site's landing engine draws them (the Resonance repo's src/lib/mascots/puppet.ts): arms turn about their
 * brads, the body leans about its seat, the face slides toward where it looks. A pose is still; the screen adds
 * a blink and a wave with CSS (the classes below), which print never shows.
 *
 * Lengths are millimetres of the printed card: a puppet is placed inside a layer whose origin is the trim's
 * top left and whose `--mm` is one millimetre (every face has it).
 */
import { CAST } from './cast.js';

const BASE = new URL('../assets/mascots/', import.meta.url);

export const NAMES = {
  tuck: { zh: '摺摺', en: 'Tuck' },
  tag: { zh: '牽牽', en: 'Twine' },
  card: { zh: '聆聆', en: 'Nod' },
  dot: { zh: '點點', en: 'Pip' },
  night: { zh: '悄悄', en: 'Hush' },
};

/** Tuck's body (the series' unit) is 420 rig units from the ground to the top of its paper. */
const UNIT = 420;

/**
 * Millimetres per rig unit, for a pose whose Tuck would be `heightMm` tall. The others keep the series' order of
 * sizes, closer together (the square root of their ratio to Tuck), so the smallest still reads on a card.
 */
export function mmPerUnit(slug, heightMm) {
  const h = CAST[slug].height;
  return (heightMm * Math.sqrt(h / UNIT)) / h;
}

/** Millimetres per rig unit for a pose: `bodyMm` is this puppet's own body height, else see mmPerUnit. */
const scaleOf = (slug, o) => (o.bodyMm ? o.bodyMm / CAST[slug].height : mmPerUnit(slug, o.heightMm));

const turned = ([x, y], [cx, cy], deg) => {
  const a = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
};

/** How far each arm turns from the angle it is drawn at, for a pose's arms ({ l?, r? } in degrees). */
function turnsOf(R, arms = {}) {
  const t = {};
  for (const p of R.parts) if (p.name === 'arm-l' || p.name === 'arm-r') t[p.name] = arms[p.name.slice(-1)] != null ? arms[p.name.slice(-1)] - p.angle : 0;
  return t;
}

/**
 * Where a pose puts the puppet, in mm: its horizontal extent [left, right] (the arms by what they draw, at both
 * ends of a wave; the rest by their pictures' boxes) and the raised mitten's centre `hand` (mid-wave).
 *
 * o: { at: [x, y] the ground point, heightMm, arms, wave: { arm, to }, tilt }
 */
export function reach(slug, o) {
  const R = CAST[slug];
  const k = scaleOf(slug, o);
  const [ax, ay] = R.ground;
  const torso = R.parts.find((p) => p.name === 'torso');
  const toMm = ([x, y]) => [o.at[0] + (x - ax) * k, o.at[1] + (y - ay) * k];
  const lean = (pt, parent) => (parent === 'root' ? pt : turned(pt, torso.pivot, o.tilt ?? 0));
  let left = Infinity;
  let right = -Infinity;
  const take = ([x]) => {
    left = Math.min(left, x);
    right = Math.max(right, x);
  };
  const poses = [turnsOf(R, o.arms)];
  if (o.wave) {
    const arm = R.parts.find((p) => p.name === `arm-${o.wave.arm}`);
    poses.push({ ...poses[0], [arm.name]: o.wave.to - arm.angle });
  }
  let hand = null;
  for (const p of R.parts) {
    if (p.variantOf || p.only || p.name === 'shadow' || p.parent === 'face') continue;
    if (p.hull) {
      for (const t of poses) for (const q of p.hull) take(toMm(lean(turned(q, p.pivot, t[p.name]), p.parent)));
      if (o.wave?.arm === p.name.slice(-1)) {
        // The mitten: the far end of the arm's outline, at the middle of the wave.
        const mid = (poses[0][p.name] + poses[1][p.name]) / 2;
        const far = p.hull.reduce((a, q) => (Math.hypot(q[0] - p.pivot[0], q[1] - p.pivot[1]) > Math.hypot(a[0] - p.pivot[0], a[1] - p.pivot[1]) ? q : a));
        hand = toMm(lean(turned(far, p.pivot, mid), p.parent));
      }
      continue;
    }
    for (const c of [
      [p.x, p.y],
      [p.x + p.w, p.y],
      [p.x, p.y + p.h],
      [p.x + p.w, p.y + p.h],
    ])
      take(toMm(lean(c, p.parent)));
  }
  return { left, right, hand };
}

const u = (n) => `calc(var(--u) * ${+n.toFixed(2)})`;

/**
 * A posed puppet as an element (absolutely placed in a layer whose origin is the trim's top left).
 *
 * o: { at: [x, y] mm, the ground point (sitting: the hips); heightMm (see mmPerUnit) or bodyMm; stance: 'sit' (on
 *      an edge, the legs over its front) or standing; arms: { l?, r? } degrees (0 = pointing right,
 *      90 = down; the rest pose where left out); wave: { arm: 'l' | 'r', to }: on screen that arm swings
 *      between its angle and `to`; face: [dx, dy] rig units the face slides; tilt: degrees the body leans
 *      (+ clockwise); blinkDelay: seconds (so two puppets don't blink together) }
 */
export function puppetEl(slug, o) {
  const R = CAST[slug];
  const k = scaleOf(slug, o);
  const [W, H] = R.viewBox;
  const torso = R.parts.find((p) => p.name === 'torso');
  // The point placed at `at`: the ground, or (sitting on an edge) the hips, as the landing's engine seats them.
  const sit = o.stance === 'sit';
  const [ax, ay] = sit ? [R.ground[0], torso.pivot[1] + 3] : R.ground;
  const turns = turnsOf(R, o.arms);

  const el = document.createElement('div');
  el.className = `pup pup--${slug}`;
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--u', `calc(var(--mm) * ${k})`);
  if (o.blinkDelay) el.style.setProperty('--blink-delay', `${o.blinkDelay}s`);
  Object.assign(el.style, {
    left: `calc(var(--mm) * ${o.at[0]} - ${u(ax)})`,
    top: `calc(var(--mm) * ${o.at[1]} - ${u(ay)})`,
    width: u(W),
    height: u(H),
  });

  const group = (cls, pivot, transform) => {
    const g = document.createElement('div');
    g.className = cls;
    g.style.transformOrigin = `${u(pivot[0])} ${u(pivot[1])}`;
    if (transform) g.style.transform = transform;
    return g;
  };
  const body = group('pup__body', torso.pivot, o.tilt ? `rotate(${o.tilt}deg)` : '');
  const face = group('pup__face', [0, 0], o.face ? `translate(${u(o.face[0])}, ${u(o.face[1])})` : '');
  let faceIn = false;

  for (const p of [...R.parts].sort((a, b) => a.z - b.z)) {
    if (p.only === 'dark' || (sit && p.name === 'shadow')) continue;
    const img = document.createElement('img');
    img.src = new URL(`${slug}/${p.img}`, BASE).href;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.className = `pup__part pup__part--${p.name}`;
    // The open eyes and the shut ones are both there; the screen's blink swaps them, still and print show them open.
    if (/^eye-[lr]$/.test(p.name)) img.classList.add('pup__eye-open');
    if (/^eye-[lr]-shut$/.test(p.name)) img.classList.add('pup__eye-shut');
    Object.assign(img.style, {
      left: u(p.x),
      top: u(p.y),
      width: u(p.w),
      height: u(p.h),
      transformOrigin: `${u(p.pivot[0] - p.x)} ${u(p.pivot[1] - p.y)}`,
    });
    const turn = turns[p.name] ?? 0;
    if (turn) img.style.transform = `rotate(${turn}deg)`;
    // Sitting: the legs hang over the edge's front, a little shorter and splayed.
    if (sit && (p.name === 'leg-l' || p.name === 'leg-r')) img.style.transform = `rotate(${p.name === 'leg-l' ? 7 : -7}deg) scaleY(0.86)`;
    if (o.wave && p.name === `arm-${o.wave.arm}`) {
      img.classList.add('pup__wave');
      img.style.setProperty('--from', `${turn}deg`);
      img.style.setProperty('--to', `${o.wave.to - p.angle}deg`);
    }
    if (p.parent === 'root') el.appendChild(img);
    else if (p.parent === 'face') {
      if (!faceIn) {
        body.appendChild(face);
        faceIn = true;
      }
      face.appendChild(img);
    } else body.appendChild(img);
  }
  el.appendChild(body);
  return el;
}
