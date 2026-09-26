"use client";

import { useEffect, useRef } from "react";
import { createRenderer, type SceneName, type SceneOptions, type Tone, type View } from "./engine";

/**
 * Living generative artwork. Every page has its own scene — the signature lock
 * of hair on the home page, a braid on the services menu, a precision cut,
 * balayage, ripples, petals and more — see `./scenes`.
 *
 * Rendering happens in a Web Worker through OffscreenCanvas wherever it's
 * supported, so the animation never occupies the main thread. It only runs
 * while on screen, and renders a single still frame for reduced-motion users.
 */

type ArtCanvasProps = {
  scene: SceneName;
  seed?: number;
  tone?: Tone;
  /** Scene-specific element and accent counts (used by the lock). */
  count?: number;
  accent?: number;
  /** "flow" animates continuously; "still" renders one frame. */
  motion?: "flow" | "still";
  /** Responds to the pointer (fine pointers only). */
  interactive?: boolean;
  /** Play the entrance when the artwork first comes into view. */
  drawIn?: boolean;
  /** Fraction of the height to fade out at the top edge. */
  fadeTop?: number;
  className?: string;
  /** Short description for assistive tech; decorative when omitted. */
  label?: string;
};

type Config = { opts: SceneOptions; view: View };

type Transport = {
  configure(config: Config): void;
  setView(view: Partial<View>): void;
  setRunning(running: boolean): void;
  dispose(): void;
};

const FRAME_MS = 1000 / 40;

function workerTransport(canvas: HTMLCanvasElement, config: Config): Transport | null {
  if (typeof Worker === "undefined" || !("transferControlToOffscreen" in canvas)) return null;
  try {
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL("./art.worker.ts", import.meta.url), { type: "module" });
    worker.postMessage({ type: "init", canvas: offscreen, ...config }, [offscreen]);
    return {
      configure: (c) => worker.postMessage({ type: "config", ...c }),
      setView: (view) => worker.postMessage({ type: "view", view }),
      setRunning: (running) => worker.postMessage({ type: "run", running }),
      dispose: () => worker.terminate(),
    };
  } catch {
    return null;
  }
}

function mainThreadTransport(canvas: HTMLCanvasElement, initial: Config): Transport | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let config = initial;
  let renderer = createRenderer(ctx, config.opts, config.view);
  let raf = 0;
  let last = 0;

  const applySize = () => {
    canvas.width = Math.max(1, Math.round(config.view.width * config.view.dpr));
    canvas.height = Math.max(1, Math.round(config.view.height * config.view.dpr));
  };
  const loop = (now: number) => {
    if (now - last >= FRAME_MS - 2) {
      last = now;
      renderer.frame(now);
    }
    raf = requestAnimationFrame(loop);
  };

  applySize();
  if (!config.opts.animated) renderer.frame(0);

  return {
    configure(c) {
      config = c;
      renderer = createRenderer(ctx, c.opts, c.view);
      applySize();
      if (!c.opts.animated) renderer.frame(0);
    },
    setView(view) {
      Object.assign(config.view, view);
      if (view.width !== undefined || view.height !== undefined || view.dpr !== undefined) {
        applySize();
        if (!config.opts.animated) renderer.frame(0);
      }
    },
    setRunning(running) {
      if (running && config.opts.animated && !raf) raf = requestAnimationFrame(loop);
      if (!running && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
    },
  };
}

// A canvas can hand its control to a worker only once. React's development
// Strict Mode mounts effects twice, so transports outlive a cleanup by a tick
// and are picked up again if the same canvas re-mounts.
const transports = new WeakMap<HTMLCanvasElement, { transport: Transport; kill?: ReturnType<typeof setTimeout> }>();

export function ArtCanvas({
  scene,
  seed = 7,
  tone = "dark",
  count,
  accent,
  motion = "flow",
  interactive = false,
  drawIn = true,
  fadeTop = 0,
  className,
  label,
}: ArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const animated = motion === "flow" && !reduced;
    const rect = canvas.getBoundingClientRect();
    const small = rect.width < 640;

    const config: Config = {
      opts: {
        scene,
        seed,
        tone,
        count,
        accent,
        // Fewer elements on small canvases keeps phones light.
        density: small ? 0.7 : 1,
        animated,
        drawIn,
        interactive: animated && interactive && finePointer,
      },
      view: {
        width: rect.width,
        height: rect.height,
        dpr: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2),
        pointerX: -9999,
        pointerY: -9999,
        pointerInside: false,
        fadeTop,
      },
    };

    let entry = transports.get(canvas);
    if (entry) {
      clearTimeout(entry.kill);
      entry.transport.configure(config);
    } else {
      const transport = workerTransport(canvas, config) ?? mainThreadTransport(canvas, config);
      if (!transport) return;
      entry = { transport };
      transports.set(canvas, entry);
    }
    const { transport } = entry;

    let visible = false;
    const sync = () => transport.setRunning(visible && !document.hidden);

    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      transport.setView({ width, height });
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      transport.setView({
        pointerX: e.clientX - r.left,
        pointerY: e.clientY - r.top,
        pointerInside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom,
      });
    };
    const onLeave = () => transport.setView({ pointerInside: false });
    if (config.opts.interactive) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      transport.setRunning(false);
      const current = transports.get(canvas);
      if (current) {
        current.kill = setTimeout(() => {
          current.transport.dispose();
          transports.delete(canvas);
        }, 0);
      }
    };
  }, [scene, seed, tone, count, accent, motion, interactive, drawIn, fadeTop]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
