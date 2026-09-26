/** Hair-strand scenes: the signature lock, a precision cut, balayage, a braid, a ringlet and a stray. */

import { clamp, comb, easeOut, smoothPath, type Ctx2D, type SceneFactory } from "../core";

type Pt = [number, number];

function inkPick(rand: () => number, inks: string[]) {
  return inks[Math.floor(rand() ** 1.8 * inks.length)];
}

// ---------------------------------------------------------------------------
// lock — the home page's signature: a lock of hair flowing along an S-curve.
// ---------------------------------------------------------------------------
export const lock: SceneFactory = ({ opts, pal, rand }) => {
  const VW = 800;
  const VH = 1000;
  const STEPS = 20;
  const count = Math.round((opts.count ?? 96) * opts.density);
  const goldCount = opts.accent ?? 5;
  const j = (n: number) => (rand() - 0.5) * n;
  const spine0: Pt[] = [
    [470 + j(60), -60],
    [700 + j(80), 260 + j(60)],
    [130 + j(80), 600 + j(60)],
    [430 + j(80), 1080],
  ];
  const waveFreq = 1.4 + rand() * 0.6;
  const wavePhase = rand();
  const golds = new Set<number>();
  while (golds.size < Math.min(goldCount, count)) golds.add(Math.floor(rand() * count));
  const inks = [pal.ink, pal.charcoal, pal.grey, pal.taupe];

  const strands = Array.from({ length: count }, (_, i) => {
    const r = count > 1 ? (i / (count - 1)) * 2 - 1 : 0;
    const isGold = golds.has(i);
    const depth = rand();
    return {
      u: Math.sign(r) * Math.abs(r) ** 1.25 + j(0.06),
      phase: wavePhase + j(0.14),
      amp: 16 + rand() * 18,
      tStart: rand() * 0.06,
      tEnd: 0.8 + rand() * 0.2,
      color: isGold ? pal.gold : inkPick(rand, inks),
      width: isGold ? 1.3 + rand() * 0.6 : 0.4 + depth * 0.8 + rand() * 0.3,
      alpha: isGold ? 0.95 : 0.2 + depth * 0.45 + rand() * 0.15,
      depth,
      delay: (i / count) * 1.1 + rand() * 0.25,
    };
  });

  const bez = (p: Pt[], t: number) => {
    const [p0, p1, p2, p3] = p;
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;
    const dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
    const dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
      y: a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
      nx: -dy / len,
      ny: dx / len,
    };
  };
  const pts: number[] = new Array((STEPS + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, w, h, dpr, pointer }) => {
    const scale = Math.max(w / VW, h / VH);
    const offX = (w - VW * scale) / 2;
    const offY = (h - VH * scale) / 2;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
    // Pointer in artwork units.
    const p = { ...pointer, x: (pointer.x - offX) / scale, y: (pointer.y - offY) / scale };

    const sway = Math.sin(time * 0.32) * 18;
    const lift = Math.sin(time * 0.21 + 1.3) * 10;
    const spine: Pt[] = [
      spine0[0],
      [spine0[1][0] + sway, spine0[1][1] + lift],
      [spine0[2][0] - sway * 0.8, spine0[2][1] - lift],
      [spine0[3][0] + sway * 1.4, spine0[3][1]],
    ];

    for (const s of strands) {
      let grow = 1;
      if (opts.animated && opts.drawIn) {
        grow = clamp((elapsed - s.delay) / 1.6);
        if (grow <= 0) continue;
        grow = easeOut(grow);
      }
      const px = pointer.nx * (s.depth - 0.4) * 34;
      const py = pointer.ny * (s.depth - 0.4) * 16;
      for (let k = 0; k <= STEPS; k++) {
        const t = s.tStart + ((s.tEnd - s.tStart) * k * grow) / STEPS;
        const b = bez(spine, t);
        const spread = 26 + 210 * Math.sin(Math.PI * Math.min(t, 0.92)) ** 0.8 + 90 * t;
        const wave = s.amp * Math.sin(2 * Math.PI * (waveFreq * t + s.phase - time * 0.11)) * (0.25 + 0.75 * t);
        const off = s.u * spread + wave;
        const x = b.x + b.nx * off + px;
        const y = b.y + b.ny * off + py;
        pts[k * 2] = x + comb(x, y, p, 120, 34) * (0.6 + s.depth * 0.6);
        pts[k * 2 + 1] = y;
      }
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width / scale;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// cut — straight strands falling to a crisp, angled bob line; trimmed ends drift below.
// ---------------------------------------------------------------------------
export const cut: SceneFactory = ({ opts, pal, rand }) => {
  const n = Math.round(110 * opts.density);
  const inks = [pal.ink, pal.charcoal, pal.grey, pal.taupe];
  const golds = new Set([Math.floor(n * 0.3), Math.floor(n * 0.55), Math.floor(n * 0.8)]);
  const strands = Array.from({ length: n }, (_, i) => {
    const u = clamp(i / (n - 1) + (rand() - 0.5) * 0.008);
    const gold = golds.has(i);
    return {
      u,
      color: gold ? pal.gold : inkPick(rand, inks),
      width: gold ? 1.4 : 0.5 + rand() * 0.8,
      alpha: gold ? 0.95 : 0.3 + rand() * 0.5,
      phase: rand() * Math.PI * 2,
      delay: u * 0.7 + rand() * 0.25,
    };
  });
  const snippets = Array.from({ length: Math.round(18 * opts.density) }, () => ({
    u: 0.12 + rand() * 0.84,
    y0: rand(),
    len: 5 + rand() * 9,
    rot: rand() * Math.PI,
    spin: (rand() - 0.5) * 1.2,
    speed: 0.035 + rand() * 0.05,
    color: rand() < 0.2 ? pal.gold : pal.charcoal,
  }));
  const STEPS = 14;
  const pts: number[] = new Array((STEPS + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, intro, w, h, pointer }) => {
    const x0 = w * 0.12;
    const x1 = w * 0.97;
    // Angled bob: shorter at the back (left), longer towards the face (right).
    const hem = (u: number) => h * (0.46 + 0.3 * u ** 1.15);

    for (const s of strands) {
      let grow = 1;
      if (opts.animated && opts.drawIn) {
        grow = easeOut((elapsed - s.delay) / 1.3);
        if (grow <= 0) continue;
      }
      const base = x0 + (x1 - x0) * s.u;
      const end = hem(s.u);
      for (let k = 0; k <= STEPS; k++) {
        const t = (k / STEPS) * grow;
        let x = base + Math.sin(time * 0.6 + s.u * 5) * 5 * t * t + Math.sin(time * 1.2 + s.phase) * 1.1 * t;
        // Ends turn under slightly, like a blow-dried bob.
        x -= 7 * t ** 7;
        const y = -12 + (end + 12) * t;
        x += comb(x, y, pointer, 90, 26) * t;
        pts[k * 2] = x;
        pts[k * 2 + 1] = y;
      }
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width;
      ctx.stroke();
    }

    // The cut line itself, in gold, once the strands have fallen.
    const lineIn = opts.animated && opts.drawIn ? easeOut((elapsed - 1.6) / 1) : 1;
    if (lineIn > 0) {
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) {
        const u = (k / 24) * lineIn;
        const x = x0 + (x1 - x0) * u;
        const y = hem(u) + 10;
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
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = 0.5 * intro * Math.sin(Math.PI * k);
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// colour — a full curtain of waves, painted root-to-tip from charcoal into gold.
// ---------------------------------------------------------------------------
export const colour: SceneFactory = ({ opts, pal, rand }) => {
  const n = Math.round(120 * opts.density);
  const strands = Array.from({ length: n }, (_, i) => ({
    u: -0.05 + (1.1 * i) / (n - 1) + (rand() - 0.5) * 0.01,
    amp: 18 + rand() * 26,
    freq: 0.8 + rand() * 0.5,
    phase: rand() * 0.25,
    lean: (rand() - 0.5) * 0.06,
    alpha: 0.55 + rand() * 0.45,
    width: 0.7 + rand() * 1.3,
    highlight: rand() < 0.3,
    delay: rand() * 0.9,
  }));
  let cachedH = -1;
  let gradBase: CanvasGradient | null = null;
  let gradLight: CanvasGradient | null = null;
  const STEPS = 18;
  const pts: number[] = new Array((STEPS + 1) * 2).fill(0);

  return ({ ctx, time, elapsed, w, h, pointer }) => {
    if (h !== cachedH || !gradBase || !gradLight) {
      cachedH = h;
      gradBase = ctx.createLinearGradient(0, 0, 0, h);
      gradBase.addColorStop(0, pal.charcoal);
      gradBase.addColorStop(0.42, pal.taupe);
      gradBase.addColorStop(0.78, pal.gold);
      gradBase.addColorStop(1, pal.goldPale);
      gradLight = ctx.createLinearGradient(0, 0, 0, h);
      gradLight.addColorStop(0, pal.taupe);
      gradLight.addColorStop(0.35, pal.gold);
      gradLight.addColorStop(0.7, pal.goldPale);
      gradLight.addColorStop(1, pal.sand);
    }
    for (const s of strands) {
      let grow = 1;
      if (opts.animated && opts.drawIn) {
        grow = easeOut((elapsed - s.delay) / 1.8);
        if (grow <= 0) continue;
      }
      for (let k = 0; k <= STEPS; k++) {
        const t = (k / STEPS) * grow;
        let x =
          s.u * w + s.lean * w * t + s.amp * Math.sin(2 * Math.PI * (s.freq * t + s.phase) - time * 0.45) * (0.3 + t);
        const y = -20 + (h + 40) * t;
        x += comb(x, y, pointer, 110, 30);
        pts[k * 2] = x;
        pts[k * 2 + 1] = y;
      }
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.strokeStyle = s.highlight ? gradLight : gradBase;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width;
      ctx.stroke();
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
