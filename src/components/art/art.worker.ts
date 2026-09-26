/// <reference lib="webworker" />
// Renders the living artwork off the main thread via OffscreenCanvas, so the
// animation never blocks input handling or page work.

import { createRenderer, type SceneOptions, type View } from "./engine";

type InitMessage = { type: "init"; canvas: OffscreenCanvas; opts: SceneOptions; view: View };
type ConfigMessage = { type: "config"; opts: SceneOptions; view: View };
type ViewMessage = { type: "view"; view: Partial<View> };
type RunMessage = { type: "run"; running: boolean };
type Message = InitMessage | ConfigMessage | ViewMessage | RunMessage;

const scope = self as unknown as DedicatedWorkerGlobalScope;
const FRAME_MS = 1000 / 40;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let view: View | null = null;
let opts: SceneOptions | null = null;
let renderer: ReturnType<typeof createRenderer> | null = null;
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

function configure(nextOpts: SceneOptions, nextView: View) {
  if (!ctx) return;
  opts = nextOpts;
  view = nextView;
  applySize();
  renderer = createRenderer(ctx, opts, view);
  if (!opts.animated) renderer.frame(0);
}

scope.onmessage = (e: MessageEvent<Message>) => {
  const msg = e.data;
  if (msg.type === "init") {
    canvas = msg.canvas;
    ctx = canvas.getContext("2d");
    configure(msg.opts, msg.view);
  } else if (msg.type === "config") {
    configure(msg.opts, msg.view);
  } else if (msg.type === "view" && view) {
    Object.assign(view, msg.view);
    if (msg.view.width !== undefined || msg.view.height !== undefined || msg.view.dpr !== undefined) {
      applySize();
      // Resizing clears the canvas; animated canvases repaint on their next tick.
      if (!opts?.animated) renderer?.frame(0);
    }
  } else if (msg.type === "run") {
    running = msg.running && !!opts?.animated;
    if (running && timer === undefined) tick();
    if (!running && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  }
};
