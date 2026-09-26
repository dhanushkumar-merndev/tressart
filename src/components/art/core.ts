/** Shared types and helpers for the artwork engine and its scenes. */

export type Tone = "dark" | "light";
export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export type SceneOptions = {
  scene: string;
  seed: number;
  tone: Tone;
  /** Multiplier on element counts; lower on small screens. */
  density: number;
  /** Optional scene-specific element count and accent count. */
  count?: number;
  accent?: number;
  animated: boolean;
  drawIn: boolean;
  interactive: boolean;
};

/** Size and pointer state shared between the page and the renderer (CSS pixels). */
export type View = {
  width: number;
  height: number;
  dpr: number;
  pointerX: number;
  pointerY: number;
  pointerInside: boolean;
  /** Fraction of the height faded out at the top edge. */
  fadeTop: number;
};

export type Palette = {
  ink: string;
  charcoal: string;
  grey: string;
  taupe: string;
  sand: string;
  rose: string;
  olive: string;
  gold: string;
  goldPale: string;
};

export type Pointer = {
  /** Eased pointer position in CSS px relative to the canvas. */
  x: number;
  y: number;
  /** 0 when the pointer is away, easing to 1 while it's over the canvas. */
  force: number;
  /** Eased position normalised to -1…1 across the canvas, for parallax. */
  nx: number;
  ny: number;
};

export type Frame = {
  ctx: Ctx2D;
  /** Seconds; frozen at 0 when not animated. */
  time: number;
  /** Seconds since the scene first became visible. */
  elapsed: number;
  /** Eased 0→1 entrance progress. */
  intro: number;
  w: number;
  h: number;
  dpr: number;
  pointer: Pointer;
};

export type SceneSetup = { opts: SceneOptions; pal: Palette; rand: () => number };
export type Scene = (f: Frame) => void;
export type SceneFactory = (setup: SceneSetup) => Scene;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const easeInOut = (x: number) => {
  const k = clamp(x);
  return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
};

/** "#RRGGBB" + alpha → rgba(). */
export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Pushes a point away from the pointer; returns the displacement. */
export function repel(x: number, y: number, p: Pointer, radius: number, strength: number): [number, number] {
  if (p.force < 0.01) return [0, 0];
  const dx = x - p.x;
  const dy = y - p.y;
  const d = Math.hypot(dx, dy);
  if (d >= radius || d < 0.001) return [0, 0];
  const f = (1 - d / radius) ** 2 * p.force * strength;
  return [(dx / d) * f, (dy / d) * f];
}

/**
 * Sideways parting for hanging strands, like fingers running through hair:
 * smooth either side of the pointer, and carried on down the strand below it
 * rather than dented in a circle. Returns the horizontal offset.
 */
export function comb(x: number, y: number, p: Pointer, reach = 110, strength = 36) {
  if (p.force < 0.01) return 0;
  const dx = x - p.x;
  const dy = y - p.y;
  const across = Math.exp(-(dx * dx) / (2 * reach * reach));
  const along = dy > 0 ? Math.exp(-dy / (reach * 4)) : Math.exp(-(dy * dy) / (2 * reach * reach));
  return Math.tanh(dx / (reach * 0.5)) * strength * across * along * p.force;
}

/** Adds a smooth (Catmull-Rom) curve through flat [x0, y0, x1, y1, …] points to the current path. */
export function smoothPath(ctx: Ctx2D, pts: number[], count = pts.length / 2) {
  if (count < 2) return;
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 0; i < count - 1; i++) {
    const i0 = Math.max(0, i - 1) * 2;
    const i1 = i * 2;
    const i2 = (i + 1) * 2;
    const i3 = Math.min(count - 1, i + 2) * 2;
    ctx.bezierCurveTo(
      pts[i1] + (pts[i2] - pts[i0]) / 6,
      pts[i1 + 1] + (pts[i2 + 1] - pts[i0 + 1]) / 6,
      pts[i2] - (pts[i3] - pts[i1]) / 6,
      pts[i2 + 1] - (pts[i3 + 1] - pts[i1 + 1]) / 6,
      pts[i2],
      pts[i2 + 1],
    );
  }
}
