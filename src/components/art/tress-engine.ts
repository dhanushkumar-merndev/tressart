/**
 * Drawing engine for the generative "tress" artwork — a lock of hair rendered
 * as fine strands flowing along an S-curve. Pure and DOM-free so the same code
 * runs in a Web Worker (via OffscreenCanvas) or on the main thread as a fallback.
 */

export type Tone = "dark" | "light";
type Pt = [number, number];
type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export type LockOptions = { seed: number; strands: number; gold: number; tone: Tone };

type Strand = {
  u: number;
  phase: number;
  amp: number;
  tStart: number;
  tEnd: number;
  color: string;
  width: number;
  alpha: number;
  depth: number;
  delay: number;
};

export type Lock = { spine: Pt[]; waveFreq: number; strands: Strand[] };

/** Size and pointer state shared between the page and the renderer. */
export type View = {
  width: number;
  height: number;
  dpr: number;
  /** Pointer target in CSS pixels relative to the canvas, and whether it's over the canvas. */
  pointerX: number;
  pointerY: number;
  pointerInside: boolean;
  /** Fade the top edge into the background (replaces a CSS mask, which is costly to composite). */
  fadeTop: number;
};

export const VW = 800;
export const VH = 1000;
const STEPS = 12;

const palettes: Record<Tone, { ink: string[]; gold: string }> = {
  dark: { ink: ["#231F20", "#33302F", "#7D7D7D", "#A99A8B"], gold: "#B08A57" },
  light: { ink: ["#F7F5F1", "#E9E6E2", "#D8C7B2", "#A99A8B"], gold: "#D9C09A" },
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildLock({ seed, strands: count, gold: goldCount, tone }: LockOptions): Lock {
  const rand = mulberry32(seed);
  const j = (n: number) => (rand() - 0.5) * n;
  const spine: Pt[] = [
    [470 + j(60), -60],
    [700 + j(80), 260 + j(60)],
    [130 + j(80), 600 + j(60)],
    [430 + j(80), 1080],
  ];
  const waveFreq = 1.4 + rand() * 0.6;
  const wavePhase = rand();

  const golds = new Set<number>();
  while (golds.size < Math.min(goldCount, count)) golds.add(Math.floor(rand() * count));

  const { ink, gold } = palettes[tone];
  const strands: Strand[] = [];
  for (let i = 0; i < count; i++) {
    const r = count > 1 ? (i / (count - 1)) * 2 - 1 : 0;
    const isGold = golds.has(i);
    const depth = rand();
    strands.push({
      u: Math.sign(r) * Math.abs(r) ** 1.25 + j(0.06),
      phase: wavePhase + j(0.14),
      amp: 16 + rand() * 18,
      tStart: rand() * 0.06,
      tEnd: 0.8 + rand() * 0.2,
      color: isGold ? gold : ink[Math.floor(rand() ** 1.8 * ink.length)],
      // Nearer strands (higher depth) read thicker and stronger.
      width: isGold ? 1.3 + rand() * 0.6 : 0.4 + depth * 0.8 + rand() * 0.3,
      alpha: isGold ? 0.95 : 0.2 + depth * 0.45 + rand() * 0.15,
      depth,
      delay: (i / count) * 1.1 + rand() * 0.25,
    });
  }
  return { spine, waveFreq, strands };
}

function bezier(p: Pt[], t: number) {
  const [p0, p1, p2, p3] = p;
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  const x = a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0];
  const y = a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1];
  const dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / len, ny: dx / len };
}

const easeOut = (x: number) => 1 - (1 - x) ** 3;

export type RendererOptions = {
  animated: boolean;
  drawIn: boolean;
  interactive: boolean;
};

/** Creates a stateful renderer. Call `frame(now)` once per animation frame. */
export function createRenderer(ctx: Ctx2D, lock: Lock, view: View, opts: RendererOptions) {
  const ptr = { x: VW / 2, y: VH / 2, force: 0, px: 0, py: 0 };
  const pts: Pt[] = Array.from({ length: STEPS + 1 }, () => [0, 0]);
  let startedAt = -1;

  function frame(now: number) {
    if (startedAt < 0) startedAt = now;
    const elapsed = (now - startedAt) / 1000;
    const time = opts.animated ? now / 1000 : 0;

    const scale = Math.max(view.width / VW, view.height / VH);
    const offX = (view.width - VW * scale) / 2;
    const offY = (view.height - VH * scale) / 2;

    // Ease the pointer so the strands respond softly.
    if (opts.interactive) {
      const tx = (view.pointerX - offX) / scale;
      const ty = (view.pointerY - offY) / scale;
      ptr.x += (tx - ptr.x) * 0.08;
      ptr.y += (ty - ptr.y) * 0.08;
      ptr.force += ((view.pointerInside ? 1 : 0) - ptr.force) * 0.06;
      const npx = Math.max(-1, Math.min(1, (view.pointerX / Math.max(1, view.width)) * 2 - 1));
      const npy = Math.max(-1, Math.min(1, (view.pointerY / Math.max(1, view.height)) * 2 - 1));
      ptr.px += (npx - ptr.px) * 0.05;
      ptr.py += (npy - ptr.py) * 0.05;
    }

    // The whole lock sways gently, as if in a slow breeze.
    const sway = Math.sin(time * 0.32) * 18;
    const lift = Math.sin(time * 0.21 + 1.3) * 10;
    const s0 = lock.spine;
    const spine: Pt[] = [
      s0[0],
      [s0[1][0] + sway, s0[1][1] + lift],
      [s0[2][0] - sway * 0.8, s0[2][1] - lift],
      [s0[3][0] + sway * 1.4, s0[3][1]],
    ];

    const { dpr } = view;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const radius = 190;

    for (const s of lock.strands) {
      let grow = 1;
      if (opts.animated && opts.drawIn) {
        grow = Math.min(1, Math.max(0, (elapsed - s.delay) / 1.6));
        if (grow <= 0) continue;
        grow = easeOut(grow);
      }

      const parallaxX = ptr.px * (s.depth - 0.4) * 34;
      const parallaxY = ptr.py * (s.depth - 0.4) * 16;

      for (let k = 0; k <= STEPS; k++) {
        const t = s.tStart + ((s.tEnd - s.tStart) * k * grow) / STEPS;
        const b = bezier(spine, t);
        const spread = 26 + 210 * Math.sin(Math.PI * Math.min(t, 0.92)) ** 0.8 + 90 * t;
        const wave = s.amp * Math.sin(2 * Math.PI * (lock.waveFreq * t + s.phase - time * 0.11)) * (0.25 + 0.75 * t);
        const off = s.u * spread + wave;
        let x = b.x + b.nx * off + parallaxX;
        let y = b.y + b.ny * off + parallaxY;

        if (ptr.force > 0.01) {
          const dx = x - ptr.x;
          const dy = y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < radius && d > 0.001) {
            const f = (1 - d / radius) ** 2 * ptr.force * (0.6 + s.depth * 0.8);
            x += (dx / d) * f * 46;
            y += (dy / d) * f * 14;
          }
        }
        pts[k][0] = x;
        pts[k][1] = y;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < STEPS; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        ctx.bezierCurveTo(
          p1[0] + (p2[0] - p0[0]) / 6,
          p1[1] + (p2[1] - p0[1]) / 6,
          p2[0] - (p3[0] - p1[0]) / 6,
          p2[1] - (p3[1] - p1[1]) / 6,
          p2[0],
          p2[1],
        );
      }
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width / scale;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (view.fadeTop > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const h = ctx.canvas.height * view.fadeTop;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, ctx.canvas.width, h);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  return { frame };
}
