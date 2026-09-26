/// <reference lib="webworker" />
// Renders the tress artwork off the main thread via OffscreenCanvas, so the
// animation never blocks input handling or page work.

import { buildLock, createRenderer, type LockOptions, type RendererOptions, type View } from "./tress-engine";

type InitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
  lock: LockOptions;
  options: RendererOptions;
  view: View;
};
type ConfigMessage = { type: "config"; lock: LockOptions; options: RendererOptions; view: View };
type ViewMessage = { type: "view"; view: Partial<View> };
type RunMessage = { type: "run"; running: boolean };
type Message = InitMessage | ConfigMessage | ViewMessage | RunMessage;

const scope = self as unknown as DedicatedWorkerGlobalScope;
const FRAME_MS = 1000 / 40;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let view: View | null = null;
let renderer: ReturnType<typeof createRenderer> | null = null;
let options: RendererOptions | null = null;
let running = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function applySize() {
  if (!canvas || !view) return;
  const w = Math.max(1, Math.round(view.width * view.dpr));
  const h = Math.max(1, Math.round(view.height * view.dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
}

function tick() {
  timer = undefined;
  if (!running || !renderer) return;
  const started = performance.now();
  renderer.frame(started);
  timer = setTimeout(tick, Math.max(0, FRAME_MS - (performance.now() - started)));
}

function drawStill() {
  renderer?.frame(0);
}

function configure(lock: LockOptions, nextOptions: RendererOptions, nextView: View) {
  if (!ctx) return;
  view = nextView;
  options = nextOptions;
  applySize();
  renderer = createRenderer(ctx, buildLock(lock), view, options);
  if (!options.animated) drawStill();
}

scope.onmessage = (e: MessageEvent<Message>) => {
  const msg = e.data;
  if (msg.type === "init") {
    canvas = msg.canvas;
    ctx = canvas.getContext("2d");
    configure(msg.lock, msg.options, msg.view);
  } else if (msg.type === "config") {
    configure(msg.lock, msg.options, msg.view);
  } else if (msg.type === "view" && view) {
    Object.assign(view, msg.view);
    if (msg.view.width !== undefined || msg.view.height !== undefined || msg.view.dpr !== undefined) {
      applySize();
      // Resizing clears the canvas; animated canvases repaint on their next tick.
      if (!options?.animated) drawStill();
    }
  } else if (msg.type === "run") {
    running = msg.running && !!options?.animated;
    if (running && timer === undefined) tick();
    if (!running && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  }
};
