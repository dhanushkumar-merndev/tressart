/** Line scenes: water ripples, a silk ribbon, map contours and a barber's fade. */

import { clamp, easeOut, type SceneFactory } from "../core";

// ---------------------------------------------------------------------------
// ripple — drops landing on still water; the pointer leaves its own ripples.
// ---------------------------------------------------------------------------
export const ripple: SceneFactory = ({ pal, rand }) => {
  type Drop = { x: number; y: number; born: number; gold: boolean };
  // Pre-seeded so the scene is already alive in its first (or only) frame.
  const drops: Drop[] = [
    { x: 0.58, y: 0.42, born: -1.4, gold: true },
    { x: 0.78, y: 0.68, born: -2.6, gold: false },
    { x: 0.4, y: 0.76, born: -3.6, gold: false },
  ];
  let nextDrop = 0;
  let lastPointerDrop = -10;
  let lastPx = -9999;
  let lastPy = -9999;
  const LIFE = 5.5;

  return ({ ctx, time, intro, w, h, pointer }) => {
    if (time > 0 && nextDrop === 0) nextDrop = time + 0.8;
    if (time > 0 && time >= nextDrop) {
      drops.push({ x: 0.3 + rand() * 0.6, y: 0.3 + rand() * 0.55, born: time, gold: rand() < 0.3 });
      nextDrop = time + 1.6 + rand() * 1.1;
    }
    if (
      pointer.force > 0.5 &&
      time - lastPointerDrop > 0.45 &&
      Math.hypot(pointer.x - lastPx, pointer.y - lastPy) > 50
    ) {
      drops.push({ x: pointer.x / w, y: pointer.y / h, born: time, gold: false });
      lastPointerDrop = time;
      lastPx = pointer.x;
      lastPy = pointer.y;
    }
    while (drops.length && time - drops[0].born > LIFE && time > 0) drops.shift();

    // Still surface: perspective lines, closer together towards the horizon.
    const lines = 20;
    for (let i = 0; i < lines; i++) {
      const k = i / (lines - 1);
      const y = h * (0.16 + 0.84 * k ** 1.4);
      ctx.beginPath();
      for (let s = 0; s <= 24; s++) {
        const x = (w * s) / 24;
        const yy = y + Math.sin(x * 0.012 + time * 0.7 + i) * (0.6 + 1.2 * k);
        if (s === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = pal.taupe;
      ctx.globalAlpha = (0.18 + 0.35 * k) * intro;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    const scale = Math.min(w, h) / 520;
    for (const d of drops) {
      const age = time - d.born;
      if (age < 0) continue;
      const fadeOut = clamp(1 - age / LIFE) ** 0.7;
      for (let r = 0; r < 5; r++) {
        const radius = (age * 62 - r * 18) * scale;
        if (radius <= 0) continue;
        ctx.beginPath();
        ctx.ellipse(d.x * w, d.y * h, radius, radius * 0.34, 0, 0, Math.PI * 2);
        ctx.strokeStyle = d.gold && r === 0 ? pal.gold : pal.charcoal;
        ctx.globalAlpha = fadeOut * (1 - r * 0.17) * 0.9 * intro;
        ctx.lineWidth = d.gold && r === 0 ? 1.6 : 1;
        ctx.stroke();
      }
      // The drop itself, for its first moment.
      if (age < 0.5) {
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, 3 * (1 - age / 0.5) + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = pal.gold;
        ctx.globalAlpha = 0.9 * intro;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// silk — a ribbon of fine lines that twists slowly across the width.
// ---------------------------------------------------------------------------
export const silk: SceneFactory = ({ opts, pal, rand }) => {
  const n = Math.round(46 * opts.density);
  const goldLines = new Set([Math.floor(n * 0.18), Math.floor(n * 0.7)]);
  const jitter = Array.from({ length: n }, () => rand() * Math.PI * 2);
  const SEG = 48;

  return ({ ctx, time, intro, w, h }) => {
    const cy = h * 0.52;
    const reach = w * intro;
    for (let i = 0; i < n; i++) {
      const v = i / (n - 1) - 0.5;
      ctx.beginPath();
      for (let s = 0; s <= SEG; s++) {
        const u = s / SEG;
        const x = w * u;
        if (x > reach) break;
        const twist = Math.cos(2 * Math.PI * (u * 0.85) + time * 0.22);
        const spread = h * 0.38 * (0.14 + 0.86 * Math.abs(twist));
        const yc = cy + h * 0.13 * Math.sin(2 * Math.PI * u * 0.75 + time * 0.28);
        const y = yc + v * spread + 1.6 * Math.sin(u * 14 + time * 0.9 + jitter[i]);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const edge = Math.abs(v) * 2;
      ctx.strokeStyle = goldLines.has(i) ? pal.gold : pal.ink;
      ctx.globalAlpha = goldLines.has(i) ? 0.9 : 0.1 + 0.4 * edge ** 2;
      ctx.lineWidth = goldLines.has(i) ? 1.1 : 0.7;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// contour — topographic rings around a pulsing gold pin: "find us here".
// ---------------------------------------------------------------------------
export const contour: SceneFactory = ({ opts, pal, rand }) => {
  const rings = 18;
  const seedPhase = rand() * Math.PI * 2;
  const SEG = 96;

  return ({ ctx, time, intro, w, h, pointer }) => {
    const cx = w * 0.74 + pointer.nx * 10;
    const cy = h * 0.5 + pointer.ny * 8;
    const gap = Math.max(w, h) * 0.042;
    const shown = rings * intro;

    for (let i = 0; i < rings; i++) {
      if (i > shown) break;
      const r0 = gap * (i + 1.2);
      ctx.beginPath();
      for (let s = 0; s <= SEG; s++) {
        const th = (2 * Math.PI * s) / SEG;
        const r =
          r0 *
          (1 +
            0.07 * Math.sin(3 * th + i * 0.45 + time * 0.12) +
            0.045 * Math.sin(5 * th - i * 0.3 - time * 0.09) +
            0.03 * Math.sin(2 * th + seedPhase));
        const x = cx + r * Math.cos(th);
        const y = cy + r * Math.sin(th) * 0.82;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const index = i % 5 === 4;
      ctx.strokeStyle = index ? pal.charcoal : pal.taupe;
      ctx.globalAlpha = (index ? 0.55 : 0.4) * (1 - i / rings) + 0.08;
      ctx.lineWidth = index ? 1.1 : 0.7;
      ctx.stroke();
    }

    // The pin, with a slow pulse.
    const pinIn = clamp(intro * 1.4 - 0.2);
    for (const offset of [0, 1.2]) {
      const k = ((time + offset) % 2.4) / 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, 7 + 38 * k, 0, Math.PI * 2);
      ctx.strokeStyle = pal.gold;
      ctx.globalAlpha = 0.7 * (1 - k) * pinIn;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.globalAlpha = pinIn;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = pal.gold;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = opts.tone === "dark" ? "#F7F5F1" : "#231F20";
    ctx.fill();
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// fade — a barber's skin fade in close-up: bare at the base, short stubble,
// then longer hair towards the top, with a gold clipper-guard line.
// ---------------------------------------------------------------------------
export const fade: SceneFactory = ({ opts, pal, rand }) => {
  const COLS = Math.round(84 * Math.max(0.7, opts.density));
  const ROWS = 60;
  const hairs = Array.from({ length: COLS * ROWS }, (_, i) => ({
    col: i % COLS,
    row: Math.floor(i / COLS),
    jx: rand() - 0.5,
    jy: rand() - 0.5,
    lean: (rand() - 0.5) * 0.5,
    len: 0.7 + rand() * 0.6,
    phase: rand() * Math.PI * 2,
    shade: rand(),
  }));
  const buckets = [pal.grey, pal.charcoal, pal.ink];

  return ({ ctx, time, elapsed, w, h, pointer }) => {
    const shown = opts.animated && opts.drawIn ? easeOut(elapsed / 2.4) : 1;
    const cw = w / COLS;
    const rh = h / ROWS;
    // Where the clipper guard sits: below it the hair is taken right down.
    const guard = 0.4 + 0.05 * Math.sin(time * 0.35);

    for (let b = 0; b < buckets.length; b++) {
      ctx.beginPath();
      for (const hair of hairs) {
        if (Math.floor(hair.shade * buckets.length) !== b) continue;
        // 0 at the base (skin) → 1 at the top (full length).
        const yn = 1 - (hair.row + 0.5) / ROWS;
        if (yn > shown) continue;
        const grow = clamp((yn - 0.04) / 0.96) ** 1.7;
        const length = (1.2 + 30 * grow) * hair.len;
        const x = (hair.col + 0.5 + hair.jx * 0.8) * cw;
        const y = (hair.row + 0.5 + hair.jy * 0.8) * rh;
        let lean = hair.lean + Math.sin(time * 0.7 + hair.phase + x * 0.01) * 0.12 * grow;
        if (pointer.force > 0.01) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) lean += (dx > 0 ? 1 : -1) * pointer.force * (1 - Math.sqrt(d2) / 120) * 0.9;
        }
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(lean) * length, y - Math.cos(lean) * length);
      }
      ctx.strokeStyle = buckets[b];
      ctx.globalAlpha = 0.28 + b * 0.16;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    const lineIn = opts.animated && opts.drawIn ? easeOut((elapsed - 1.6) / 1.2) : 1;
    if (lineIn > 0) {
      const gy = h * (1 - guard);
      ctx.beginPath();
      // Starts clear of the page heading, which sits over the left of the canvas.
      const x0 = w * 0.34;
      const x1 = x0 + (w - x0) * lineIn;
      ctx.moveTo(x0, gy);
      ctx.lineTo(x1, gy);
      for (let x = x0 + 16; x < x1; x += 32) {
        ctx.moveTo(x, gy - 5);
        ctx.lineTo(x, gy + 5);
      }
      ctx.strokeStyle = pal.gold;
      ctx.globalAlpha = 0.95;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};
