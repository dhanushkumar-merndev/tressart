/**
 * Scene engine for the site's living artwork. Each page gets its own motif
 * (a braid, a precision cut, water ripples, falling petals …) drawn on a
 * canvas. Pure and DOM-free so it runs in a Web Worker via OffscreenCanvas,
 * or on the main thread as a fallback.
 */

import {
  easeOut,
  mulberry32,
  clamp,
  type Ctx2D,
  type Palette,
  type Pointer,
  type SceneFactory,
  type SceneOptions,
  type Tone,
  type View,
} from "./core";
import { contour, fade, ripple, silk } from "./scenes/lines";
import { dust, fan, glow, petals } from "./scenes/forms";
import { braid, colour, curl, cut, lock, stray } from "./scenes/strands";

export type { SceneOptions, Tone, View } from "./core";

export const scenes = {
  lock,
  cut,
  colour,
  stray,
  braid,
  curl,
  ripple,
  silk,
  contour,
  fade,
  dust,
  petals,
  glow,
  fan,
} satisfies Record<string, SceneFactory>;

export type SceneName = keyof typeof scenes;

// Brand Standards v1.0 colour system. "light" is for drawing on dark fields.
const palettes: Record<Tone, Palette> = {
  dark: {
    ink: "#231F20",
    charcoal: "#33302F",
    grey: "#7D7D7D",
    taupe: "#A99A8B",
    sand: "#D8C7B2",
    rose: "#B7A09A",
    olive: "#8D8A72",
    gold: "#B08A57",
    goldPale: "#D9C09A",
  },
  light: {
    ink: "#F7F5F1",
    charcoal: "#E9E6E2",
    grey: "#A99A8B",
    taupe: "#D8C7B2",
    sand: "#D8C7B2",
    rose: "#B7A09A",
    olive: "#8D8A72",
    gold: "#D9C09A",
    goldPale: "#E9D8BC",
  },
};

/** Creates a stateful renderer for one canvas. Call `frame(now)` per animation frame. */
export function createRenderer(ctx: Ctx2D, opts: SceneOptions, view: View) {
  const scene = scenes[opts.scene as SceneName]({ opts, pal: palettes[opts.tone], rand: mulberry32(opts.seed) });
  const pointer: Pointer = { x: -9999, y: -9999, force: 0, nx: 0, ny: 0 };
  let startedAt = -1;

  function frame(now: number) {
    if (startedAt < 0) startedAt = now;
    const elapsed = opts.animated ? (now - startedAt) / 1000 : 999;
    const time = opts.animated ? now / 1000 : 0;
    const intro = opts.animated && opts.drawIn ? easeOut(elapsed / 2.4) : 1;

    if (opts.interactive) {
      if (pointer.x < -9000 && view.pointerInside) {
        pointer.x = view.pointerX;
        pointer.y = view.pointerY;
      }
      pointer.x += (view.pointerX - pointer.x) * 0.12;
      pointer.y += (view.pointerY - pointer.y) * 0.12;
      pointer.force += ((view.pointerInside ? 1 : 0) - pointer.force) * 0.07;
      const nx = clamp((view.pointerX / Math.max(1, view.width)) * 2 - 1, -1, 1);
      const ny = clamp((view.pointerY / Math.max(1, view.height)) * 2 - 1, -1, 1);
      pointer.nx += ((view.pointerInside ? nx : 0) - pointer.nx) * 0.05;
      pointer.ny += ((view.pointerInside ? ny : 0) - pointer.ny) * 0.05;
    }

    const { dpr } = view;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    scene({ ctx, time, elapsed, intro, w: view.width, h: view.height, dpr, pointer });

    if (view.fadeTop > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
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
