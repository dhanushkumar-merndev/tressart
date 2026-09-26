/** Hair-strand scenes: the signature lock, a precision cut, balayage, a braid, a ringlet and a stray. */

import { clamp, comb, easeOut, smoothPath, type Ctx2D, type Palette, type SceneFactory } from "../core";

function inkPick(rand: () => number, inks: string[]) {
  return inks[Math.floor(rand() ** 1.8 * inks.length)];
}

// ---------------------------------------------------------------------------
// Realistic hair rendering, shared by the lock, cut and colour scenes.
// Hair reads as hair when strands clump into locks, sit on a soft mass of
// colour, catch light in a band, and thin out into separated ends.
// ---------------------------------------------------------------------------

type Shades = [CanvasGradient, CanvasGradient, CanvasGradient];

/** Gaussian-ish random in roughly -1…1. */
const gauss = (rand: () => number) => (rand() + rand() + rand() - 1.5) / 1.5;

/** Vertical gradients for back, middle and front strands, with a shine band at `band` (0…1 of y0→y1). */
function hairShades(ctx: Ctx2D, pal: Palette, y0: number, y1: number, band: number, ends = pal.gold): Shades {
  const mk = (stops: [number, string][]) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    for (const [o, c] of stops) g.addColorStop(clamp(o), c);
    return g;
  };
  const b = band;
  return [
    mk([
      [0, pal.ink],
      [b - 0.06, pal.ink],
      [b, pal.charcoal],
      [b + 0.08, pal.ink],
      [0.85, pal.ink],
      [1, pal.charcoal],
    ]),
    mk([
      [0, pal.ink],
      [b - 0.09, pal.charcoal],
      [b - 0.01, pal.taupe],
      [b + 0.09, pal.charcoal],
      [0.8, pal.charcoal],
      [1, pal.taupe],
    ]),
    mk([
      [0, pal.charcoal],
      [b - 0.09, pal.taupe],
      [b - 0.025, pal.goldPale],
      [b + 0.025, pal.goldPale],
      [b + 0.1, pal.taupe],
      [b + 0.2, pal.charcoal],
      [0.86, pal.charcoal],
      [1, ends],
    ]),
  ];
}

/** Strokes a strand through flat points: full body, then a thinner, fainter tip. */
function strokeStrand(ctx: Ctx2D, pts: number[], count: number, width: number, alpha: number) {
  const tipFrom = Math.max(1, count - 4);
  ctx.beginPath();
  smoothPath(ctx, pts, tipFrom + 1);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.beginPath();
  smoothPath(ctx, pts.slice(tipFrom * 2, count * 2), count - tipFrom);
  ctx.globalAlpha = alpha * 0.55;
  ctx.lineWidth = width * 0.45;
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// lock — the home page's signature: long, straight, glossy dark hair seen from
// behind. A dense mass of fine strands with streaks of shine and ragged ends.
// ---------------------------------------------------------------------------
export const lock: SceneFactory = ({ opts, rand }) => {
  const VW = 800;
  const VH = 1000;
  const STEPS = 22;
  const n = (k: number) => Math.round(k * opts.density);
  const dark = Array.from({ length: n(560) }, () => ({
    u: rand() * 2 - 1,
    len: 0.9 + rand() * 0.12,
    ph: rand() * 6.28,
    a: rand(),
  }));
  const gloss = Array.from({ length: n(320) }, () => ({
    u: clamp(gauss(rand) * 0.85, -0.95, 0.95),
    len: 0.5 + rand() * 0.48,
    ph: rand() * 6.28,
    a: rand(),
  }));
  const fly = Array.from({ length: 10 }, () => ({
    u: rand() < 0.5 ? -1.0 - rand() * 0.04 : 1.0 + rand() * 0.04,
    ph: rand() * 6.28,
    len: 0.35 + rand() * 0.5,
    amp: 6 + rand() * 12,
  }));
  const EDGE = 48;
  const ragged = Array.from({ length: EDGE + 1 }, () => 0.9 + rand() * 0.1);
  const endAt = (u: number) => ragged[Math.round(((clamp(u, -1, 1) + 1) / 2) * EDGE)];

  return ({ ctx, time, elapsed, w, h, dpr, pointer }) => {
    const scale = Math.max(w / VW, h / VH);
    const offX = (w - VW * scale) / 2;
    const offY = (h - VH * scale) / 2;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
    const p = { ...pointer, x: (pointer.x - offX) / scale, y: (pointer.y - offY) / scale };

    const grow = opts.animated && opts.drawIn ? easeOut(elapsed / 2.2) : 1;
    const cx = 440;
    const top = 120;
    const length = 920 * grow;
    // Rounded crown, then a straight fall that widens a little towards the ends.
    const half = (t: number) => 8 + 187 * Math.sqrt(Math.min(t, 0.18) / 0.18) + 55 * Math.max(0, t - 0.18);
    const sway = (t: number) => Math.sin(time * 0.5) * 7 * t * t + Math.sin(time * 0.8 + 1) * 3 * t;
    const X = (u: number, t: number, ph: number) =>
      cx + u * half(t) * (1 + 0.015 * Math.sin(t * 9 + ph)) + sway(t) + pointer.nx * 10 * t;
    const Y = (t: number) => top + length * t;

    // 1. The body of the hair: a filled dark mass, deeper at the edges.
    const body = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0);
    body.addColorStop(0, "#0d0a0a");
    body.addColorStop(0.5, "#282223");
    body.addColorStop(1, "#0d0a0a");
    ctx.beginPath();
    // Sample densely near the crown, where the outline curves most.
    for (let k = 0; k <= 48; k++) {
      const t = (k / 48) ** 2 * endAt(-1);
      ctx.lineTo(X(-1, t, 0), Y(t));
    }
    for (let e = 0; e <= EDGE; e++) {
      const u = (e / EDGE) * 2 - 1;
      const t = ragged[e] * 0.97;
      ctx.lineTo(X(u, t, 0), Y(t));
    }
    for (let k = 48; k >= 0; k--) {
      const t = (k / 48) ** 2 * endAt(1);
      ctx.lineTo(X(1, t, 0), Y(t));
    }
    ctx.closePath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = body;
    ctx.fill();

    const strand = (u: number, len: number, ph: number, from = 0) => {
      for (let k = 0; k <= STEPS; k++) {
        const t = from + (len - from) * (k / STEPS) ** 1.6;
        const x = X(u, t, ph);
        const y = Y(t);
        const px = x + comb(x, y, p, 110, 30) * Math.min(1, t * 3);
        if (k === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
    };

    // 2. Fine dark strands give the mass its texture and ragged ends.
    ctx.strokeStyle = "#0a0808";
    ctx.lineWidth = 0.7 / scale;
    for (const [lo, hi, a] of [
      [0, 0.5, 0.35],
      [0.5, 1, 0.6],
    ] as const) {
      ctx.beginPath();
      for (const s of dark) if (s.a >= lo && s.a < hi) strand(s.u, s.len * endAt(s.u) * 1.03, s.ph);
      ctx.globalAlpha = a;
      ctx.stroke();
    }

    // 3. Gloss: soft light streaks, brightest near the crown and fading down the length.
    const shine = ctx.createLinearGradient(0, top, 0, top + 920);
    shine.addColorStop(0, "rgba(236,230,222,0)");
    shine.addColorStop(0.07, "rgba(236,230,222,0.15)");
    shine.addColorStop(0.2, "rgba(240,234,226,0.75)");
    shine.addColorStop(0.38, "rgba(205,196,186,0.55)");
    shine.addColorStop(0.65, "rgba(160,150,144,0.28)");
    shine.addColorStop(1, "rgba(130,120,115,0.08)");
    ctx.strokeStyle = shine;
    for (const [lo, hi, a, lw] of [
      [0, 0.45, 0.18, 0.6],
      [0.45, 0.8, 0.32, 0.8],
      [0.8, 1, 0.55, 1.1],
    ] as const) {
      ctx.beginPath();
      for (const s of gloss) if (s.a >= lo && s.a < hi) strand(s.u, s.len * endAt(s.u) * 0.9, s.ph, 0.03);
      ctx.globalAlpha = a;
      ctx.lineWidth = lw / scale;
      ctx.stroke();
    }

    // 4. A few flyaways at the edges.
    ctx.strokeStyle = "#1a1516";
    ctx.lineWidth = 0.5 / scale;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    for (const f of fly) {
      for (let k = 0; k <= STEPS; k++) {
        const t = 0.15 + ((f.len - 0.15) * k) / STEPS;
        const x = X(f.u, t, f.ph) + Math.sin(t * 12 + f.ph + time * 0.6) * f.amp * t;
        if (k === 0) ctx.moveTo(x, Y(t));
        else ctx.lineTo(x, Y(t));
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// cut — hair falling straight to a crisp, angled bob line; trimmed ends drift below.
// ---------------------------------------------------------------------------
export const cut: SceneFactory = ({ opts, pal, rand }) => {
  const CLUMPS = Math.round(30 * opts.density);
  const clumps = Array.from({ length: CLUMPS }, (_, c) => ({
    u: (c + 0.5) / CLUMPS + (rand() - 0.5) * 0.008,
    endJ: (rand() - 0.5) * 6,
    phase: rand() * Math.PI * 2,
    delay: (c / CLUMPS) * 0.7 + rand() * 0.2,
  }));
  const strands = Array.from({ length: CLUMPS * 10 }, (_, i) => {
    const c = clumps[i % CLUMPS];
    const depth = rand();
    return {
      c,
      off: clamp(gauss(rand), -1, 1) * (0.8 / CLUMPS),
      end: rand() * 3,
      jPhase: rand() * Math.PI * 2,
      width: 0.35 + rand() * 0.45 + depth * 0.3,
      alpha: 0.4 + rand() * 0.3 + depth * 0.25,
      shade: (depth < 0.35 ? 0 : depth < 0.75 ? 1 : 2) as 0 | 1 | 2,
    };
  }).sort((a, b) => a.shade - b.shade);
  const snippets = Array.from({ length: Math.round(18 * opts.density) }, () => ({
    u: 0.12 + rand() * 0.84,
    y0: rand(),
    len: 5 + rand() * 9,
    rot: rand() * Math.PI,
    spin: (rand() - 0.5) * 1.2,
    speed: 0.035 + rand() * 0.05,
  }));
  const STEPS = 14;
  const pts: number[] = new Array((STEPS + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, intro, w, h, pointer }) => {
    const x0 = w * 0.12;
    const x1 = w * 0.97;
    // Angled bob: shorter at the back (left), longer towards the face (right).
    const hem = (u: number) => h * (0.46 + 0.3 * u ** 1.15);
    const shades = hairShades(ctx, pal, 0, h * 0.8, 0.3 + 0.03 * Math.sin(time * 0.4), pal.charcoal);
    const growOf = (d: number) => (opts.animated && opts.drawIn ? easeOut((elapsed - d) / 1.3) : 1);

    const place = (u0: number, off: number, end: number, t: number, jPhase: number, i: number) => {
      const u = u0 + off * (1 - 0.5 * t ** 4);
      let x = x0 + (x1 - x0) * u + Math.sin(time * 0.6 + u0 * 5) * 5 * t * t + Math.sin(t * 13 + jPhase) * 0.8;
      // Ends turn under slightly, like a blow-dried bob.
      x -= 7 * t ** 7;
      const y = -12 + (end + 12) * t;
      pts[i * 2] = x + comb(x, y, pointer, 90, 26) * t;
      pts[i * 2 + 1] = y;
    };

    ctx.strokeStyle = pal.charcoal;
    for (const c of clumps) {
      const grow = growOf(c.delay);
      if (grow <= 0) continue;
      for (let k = 0; k <= STEPS; k++) place(c.u, 0, hem(c.u) + c.endJ - 4, (k / STEPS) * grow, 0, k);
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = ((x1 - x0) / CLUMPS) * 1.4;
      ctx.stroke();
    }

    for (const s of strands) {
      const grow = growOf(s.c.delay);
      if (grow <= 0) continue;
      const end = hem(s.c.u + s.off) + s.c.endJ - s.end;
      for (let k = 0; k <= STEPS; k++) place(s.c.u, s.off, end, (k / STEPS) * grow, s.jPhase, k);
      ctx.strokeStyle = shades[s.shade];
      strokeStrand(ctx, pts, STEPS, s.width, s.alpha);
    }

    // The cut line itself, in gold, once the hair has fallen.
    const lineIn = opts.animated && opts.drawIn ? easeOut((elapsed - 1.6) / 1) : 1;
    if (lineIn > 0) {
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) {
        const u = (k / 24) * lineIn;
        const x = x0 + (x1 - x0) * u;
        const y = hem(u) + 12;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = pal.gold;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Trimmed ends, drifting down beneath the line.
    for (const s of snippets) {
      const x = x0 + (x1 - x0) * s.u + Math.sin(time * 0.8 + s.rot * 3) * 6;
      const top = hem(s.u) + 22;
      const range = Math.max(20, h - top);
      const k = (s.y0 + time * s.speed) % 1;
      const y = top + range * k;
      const a = s.rot + time * s.spin;
      const dx = (Math.cos(a) * s.len) / 2;
      const dy = (Math.sin(a) * s.len) / 2;
      ctx.beginPath();
      ctx.moveTo(x - dx, y - dy);
      ctx.lineTo(x + dx, y + dy);
      ctx.strokeStyle = pal.charcoal;
      ctx.globalAlpha = 0.5 * intro * Math.sin(Math.PI * k);
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// colour — long waves of hair, painted root-to-tip from dark brunette into gold (balayage).
// ---------------------------------------------------------------------------
export const colour: SceneFactory = ({ opts, pal, rand }) => {
  const CLUMPS = Math.round(26 * opts.density);
  const clumps = Array.from({ length: CLUMPS }, (_, c) => ({
    u: -0.05 + (1.1 * c) / (CLUMPS - 1) + (rand() - 0.5) * 0.01,
    amp: 20 + rand() * 22,
    freq: 0.85 + rand() * 0.35,
    phase: rand() * 0.2,
    lean: (rand() - 0.5) * 0.05,
    delay: rand() * 0.9,
  }));
  const strands = Array.from({ length: CLUMPS * 10 }, (_, i) => {
    const c = clumps[i % CLUMPS];
    const depth = rand();
    return {
      c,
      off: clamp(gauss(rand), -1, 1) * (0.7 / CLUMPS),
      jPhase: rand() * Math.PI * 2,
      tEnd: 0.9 + rand() * 0.1,
      width: 0.4 + rand() * 0.45 + depth * 0.35,
      alpha: 0.4 + rand() * 0.3 + depth * 0.25,
      shade: (depth < 0.35 ? 0 : depth < 0.75 ? 1 : 2) as 0 | 1 | 2,
    };
  }).sort((a, b) => a.shade - b.shade);
  const STEPS = 18;
  const pts: number[] = new Array((STEPS + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, w, h, pointer }) => {
    const mk = (stops: [number, string][]) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      for (const [o, c] of stops) g.addColorStop(o, c);
      return g;
    };
    // Balayage: dark roots melting into gold, with a band of shine.
    const shades = [
      mk([
        [0, pal.ink],
        [0.4, pal.charcoal],
        [0.75, pal.taupe],
        [1, pal.gold],
      ]),
      mk([
        [0, pal.ink],
        [0.3, pal.charcoal],
        [0.55, pal.taupe],
        [0.8, pal.gold],
        [1, pal.goldPale],
      ]),
      mk([
        [0, pal.charcoal],
        [0.22, pal.taupe],
        [0.28, pal.goldPale],
        [0.35, pal.taupe],
        [0.6, pal.gold],
        [1, pal.goldPale],
      ]),
    ];
    const growOf = (d: number) => (opts.animated && opts.drawIn ? easeOut((elapsed - d) / 1.8) : 1);
    const place = (c: (typeof clumps)[number], off: number, t: number, jPhase: number, i: number) => {
      const pinch = 1 - 0.45 * t * t;
      const x =
        (c.u + off * pinch) * w +
        c.lean * w * t +
        c.amp * Math.sin(2 * Math.PI * (c.freq * t + c.phase) - time * 0.45) * (0.3 + t) +
        Math.sin(t * 15 + jPhase) * 0.9;
      const y = -20 + (h + 40) * t;
      pts[i * 2] = x + comb(x, y, pointer, 110, 30);
      pts[i * 2 + 1] = y;
    };

    ctx.strokeStyle = pal.taupe;
    for (const c of clumps) {
      const grow = growOf(c.delay);
      if (grow <= 0) continue;
      for (let k = 0; k <= STEPS; k++) place(c, 0, (k / STEPS) * grow, 0, k);
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.globalAlpha = 0.07;
      ctx.lineWidth = (w / CLUMPS) * 1.2;
      ctx.stroke();
    }

    for (const s of strands) {
      const grow = growOf(s.c.delay);
      if (grow <= 0) continue;
      for (let k = 0; k <= STEPS; k++) place(s.c, s.off, (k / STEPS) * s.tEnd * grow, s.jPhase, k);
      ctx.strokeStyle = shades[s.shade];
      strokeStrand(ctx, pts, STEPS, s.width, s.alpha);
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// stray — neat, straight strands and one gold curl that won't stay in line (404).
// ---------------------------------------------------------------------------
export const stray: SceneFactory = ({ opts, pal, rand }) => {
  const n = Math.round(58 * opts.density);
  const strands = Array.from({ length: n }, (_, i) => ({
    u: i / (n - 1),
    alpha: 0.25 + rand() * 0.4,
    width: 0.5 + rand() * 0.7,
    delay: rand() * 0.8,
  }));
  const LOOP = 240;
  const pts: number[] = new Array((LOOP + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, intro, w, h, pointer }) => {
    const x0 = w * 0.3;
    const x1 = w * 0.96;
    ctx.strokeStyle = pal.ink;
    for (const s of strands) {
      const grow = opts.animated && opts.drawIn ? easeOut((elapsed - s.delay) / 1.2) : 1;
      if (grow <= 0) continue;
      const x = x0 + (x1 - x0) * s.u;
      ctx.beginPath();
      ctx.moveTo(x, -10);
      ctx.quadraticCurveTo(x + Math.sin(time * 0.5 + s.u * 6) * 3, h * 0.5 * grow, x, -10 + (h + 20) * grow);
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width;
      ctx.stroke();
    }

    const drawn = opts.animated && opts.drawIn ? easeOut((elapsed - 1.2) / 2.2) : 1;
    if (drawn > 0) {
      const cx = x0 + (x1 - x0) * 0.52 + pointer.nx * 14;
      const count = Math.max(2, Math.round(LOOP * drawn));
      for (let k = 0; k <= count; k++) {
        const t = k / LOOP;
        const a = 2 * Math.PI * 7 * t + time * 0.9;
        const r = 16 + 16 * t;
        pts[k * 2] = cx + r * Math.sin(a) + Math.sin(time * 0.4) * 10 * t;
        pts[k * 2 + 1] = -10 + (h + 20) * t - r * 1.9 * Math.cos(a) * 0.5;
      }
      ctx.beginPath();
      smoothPath(ctx, pts, count + 1);
      ctx.strokeStyle = pal.gold;
      ctx.globalAlpha = 0.95 * intro;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// braid — three bundles twisting down a plait, with real over-and-under depth.
// ---------------------------------------------------------------------------
export const braid: SceneFactory = ({ opts, pal, rand }) => {
  const m = Math.max(12, Math.round(18 * opts.density));
  const colors = [pal.ink, pal.taupe, pal.gold];
  const bundles = colors.map((color, k) => ({
    color,
    phase: (2 * Math.PI * k) / 3,
    strands: Array.from({ length: m }, (_, i) => ({
      o: (i / (m - 1) - 0.5) * (0.85 + rand() * 0.3),
      wob: rand() * Math.PI * 2,
      alpha: 0.45 + rand() * 0.45,
    })),
  }));
  const BANDS = 64;
  const SUB = 3;

  return ({ ctx, time, intro, w, h, pointer }) => {
    const cx = w * 0.56 + pointer.nx * 12;
    const A = Math.min(w * 0.13, 104);
    const lambda = Math.min(h * 0.3, 260);
    const top = h * 0.05;
    const bottom = h * 1.02;
    const span = bottom - top;
    const visible = top + span * intro;

    const theta = (y: number) => (2 * Math.PI * (y - top)) / lambda - time * 0.4;
    // Gathered at the top, loosening into free ends at the bottom.
    const taper = (yn: number) => clamp(yn / 0.08) * (1 + 0.45 * clamp((yn - 0.88) / 0.12));
    const posAt = (b: (typeof bundles)[number], y: number) => {
      const th = theta(y) + b.phase;
      const yn = (y - top) / span;
      const gather = clamp(yn / 0.1);
      return { x: cx + A * Math.sin(th) * gather, z: Math.cos(th), width: A * 1.15 * taper(yn) + 3 };
    };

    const order = [0, 1, 2];
    for (let bi = 0; bi < BANDS; bi++) {
      const y0 = top + (span * bi) / BANDS;
      if (y0 > visible) break;
      const y1 = Math.min(visible, top + (span * (bi + 1)) / BANDS);
      const ym = (y0 + y1) / 2;
      order.sort((a, b) => posAt(bundles[a], ym).z - posAt(bundles[b], ym).z);

      for (const k of order) {
        const b = bundles[k];
        const p0 = posAt(b, y0);
        const p1 = posAt(b, y1);
        const pm = posAt(b, ym);

        // Hide whatever lies beneath the bundle in front, so the plait reads over-and-under.
        if (pm.z > -0.3) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(p0.x - p0.width / 2, y0);
          ctx.lineTo(p0.x + p0.width / 2, y0);
          ctx.lineTo(p1.x + p1.width / 2, y1 + 0.6);
          ctx.lineTo(p1.x - p1.width / 2, y1 + 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }

        ctx.beginPath();
        for (const s of b.strands) {
          for (let q = 0; q <= SUB; q++) {
            const y = y0 + ((y1 - y0) * q) / SUB;
            const p = posAt(b, y);
            const x = p.x + s.o * p.width + Math.sin(y * 0.02 + s.wob + time * 0.3) * 0.8;
            if (q === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = b.color;
        ctx.globalAlpha = (0.35 + 0.45 * ((pm.z + 1) / 2)) * (b.color === pal.gold ? 1.1 : 1);
        ctx.lineWidth = 0.6 + 0.45 * ((pm.z + 1) / 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// curl — a ringlet: a helix of strands turning slowly in 3D.
// ---------------------------------------------------------------------------
export const curl: SceneFactory = ({ opts, pal, rand }) => {
  const m = Math.round(26 * opts.density);
  const inks = [pal.ink, pal.charcoal, pal.grey, pal.taupe];
  const golds = new Set([3, Math.floor(m / 2), m - 4]);
  const strands = Array.from({ length: m }, (_, i) => ({
    dTheta: (rand() - 0.5) * 0.7,
    dR: (rand() - 0.5) * 0.22,
    color: golds.has(i) ? pal.gold : inkPick(rand, inks),
    width: golds.has(i) ? 1.4 : 0.6 + rand() * 0.8,
    alpha: golds.has(i) ? 0.95 : 0.4 + rand() * 0.45,
  }));
  const N = 170;
  const xs = new Float32Array(N + 1);
  const ys = new Float32Array(N + 1);
  const zs = new Float32Array(N + 1);

  const drawRuns = (ctx: Ctx2D, count: number, front: boolean) => {
    ctx.beginPath();
    let open = false;
    for (let k = 0; k <= count; k++) {
      const isFront = zs[k] >= 0;
      if (isFront === front) {
        if (!open) {
          ctx.moveTo(xs[Math.max(0, k - 1)], ys[Math.max(0, k - 1)]);
          open = true;
        }
        ctx.lineTo(xs[k], ys[k]);
      } else if (open) {
        ctx.lineTo(xs[k], ys[k]);
        open = false;
      }
    }
  };

  return ({ ctx, time, intro, w, h, pointer }) => {
    const cx = w * 0.56;
    const top = h * 0.06;
    const bottom = h * 0.98;
    const turns = 5.5;
    const count = Math.max(2, Math.round(N * intro));

    for (const pass of [false, true]) {
      for (const s of strands) {
        for (let k = 0; k <= count; k++) {
          const t = k / N;
          const th = 2 * Math.PI * turns * t + time * 0.8 + s.dTheta;
          const R = Math.min(w * 0.13, 120) * (0.28 + 0.72 * t ** 0.8) * (1 + s.dR);
          xs[k] = cx + R * Math.cos(th) + pointer.nx * 26 * t;
          ys[k] = top + (bottom - top) * t + R * 0.2 * Math.sin(th);
          zs[k] = Math.sin(th);
        }
        drawRuns(ctx, count, pass);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = pass ? s.alpha : s.alpha * 0.3;
        ctx.lineWidth = pass ? s.width : s.width * 0.7;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  };
};
