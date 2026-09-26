/** Form scenes: falling petals, a skin-glow orb, a nail-swatch fan and gold dust. */

import { clamp, easeInOut, easeOut, repel, rgba, type Ctx2D, type SceneFactory } from "../core";

// ---------------------------------------------------------------------------
// petals — gold and blush petals drifting down, turning over in 3D, with glints.
// ---------------------------------------------------------------------------
export const petals: SceneFactory = ({ opts, pal, rand }) => {
  const colors = [pal.goldPale, pal.gold, pal.rose, pal.sand, pal.goldPale, pal.taupe];
  const items = Array.from({ length: Math.round(46 * opts.density) }, () => {
    const depth = 0.5 + rand() * 0.5;
    return {
      x: rand(),
      y: rand(),
      size: (11 + rand() * 15) * depth,
      color: colors[Math.floor(rand() * colors.length)],
      alpha: 0.6 + rand() * 0.4,
      speed: (12 + rand() * 16) * depth,
      swayAmp: 10 + rand() * 22,
      swayFreq: 0.25 + rand() * 0.45,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 1.1,
      flip: 0.5 + rand() * 1.2,
      phase: rand() * Math.PI * 2,
      ox: 0,
      oy: 0,
    };
  });
  const glints = Array.from({ length: 14 }, () => ({
    x: rand(),
    y: rand(),
    size: 3 + rand() * 4,
    speed: 0.6 + rand() * 1.2,
    phase: rand() * Math.PI * 2,
  }));

  return ({ ctx, time, intro, w, h, dpr, pointer }) => {
    for (const p of items) {
      const span = h + 40;
      const y = ((p.y * span + time * p.speed) % span) - 20;
      const x = p.x * w + p.swayAmp * Math.sin(time * p.swayFreq + p.phase);
      // Petals ease away from the cursor and drift back.
      const [rx, ry] = repel(x + p.ox, y + p.oy, pointer, 110, 1);
      p.ox = (p.ox + rx * 3) * 0.94;
      p.oy = (p.oy + ry * 3) * 0.94;
      const a = p.rot + time * p.spin;
      // Turning over in the air: the petal's width shrinks and grows.
      const squash = Math.abs(Math.cos(time * p.flip + p.phase)) * 0.8 + 0.2;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      ctx.setTransform(
        dpr * cos * squash,
        dpr * sin * squash,
        -dpr * sin,
        dpr * cos,
        dpr * (x + p.ox),
        dpr * (y + p.oy),
      );
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.62, s * 0.72, 0, s);
      ctx.bezierCurveTo(-s * 0.62, s * 0.72, -s * 0.95, -s * 0.55, 0, -s);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * intro;
      ctx.fill();
      // A soft centre vein.
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(s * 0.12, 0, 0, s * 0.8);
      ctx.strokeStyle = "#FFFFFF";
      ctx.globalAlpha = 0.35 * intro;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.strokeStyle = pal.gold;
    ctx.lineWidth = 1;
    for (const g of glints) {
      const tw = 0.5 + 0.5 * Math.sin(time * g.speed + g.phase);
      const s = g.size * (0.4 + 0.6 * tw);
      const x = g.x * w;
      const y = g.y * h;
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s);
      ctx.lineTo(x, y + s);
      ctx.globalAlpha = 0.8 * tw * intro;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// glow — a soft, breathing orb of light with slow orbit rings and dew.
// ---------------------------------------------------------------------------
export const glow: SceneFactory = ({ opts, pal, rand }) => {
  const dew = Array.from({ length: Math.round(40 * opts.density) }, () => {
    const a = rand() * Math.PI * 2;
    const r = 0.6 + rand() * 0.95;
    return { a, r, size: 0.9 + rand() * 1.1, speed: 0.6 + rand() * 1.4, phase: rand() * 6, gold: rand() < 0.35 };
  });
  const rings = [
    { k: 1.25, tilt: -0.32, dir: 1, dot: pal.ink },
    { k: 1.5, tilt: 0.08, dir: -1, dot: pal.gold },
    { k: 1.78, tilt: 0.42, dir: 1, dot: pal.charcoal },
  ];

  return ({ ctx, time, intro, w, h, pointer }) => {
    const cx = w * 0.56 + pointer.nx * 16;
    const cy = h * 0.48 + pointer.ny * 12;
    const R = Math.min(w * 0.3, h * 0.3, 240) * (1 + 0.035 * Math.sin(time * 0.9)) * (0.6 + 0.4 * intro);

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
    g.addColorStop(0, rgba(pal.goldPale, 0.95 * intro));
    g.addColorStop(0.3, rgba(pal.rose, 0.5 * intro));
    g.addColorStop(0.65, rgba(pal.sand, 0.2 * intro));
    g.addColorStop(1, rgba(pal.sand, 0));
    ctx.fillStyle = g;
    ctx.fillRect(cx - R * 1.6, cy - R * 1.6, R * 3.2, R * 3.2);

    for (const [i, ring] of rings.entries()) {
      const rx = R * ring.k;
      const ry = rx * 0.3;
      const rot = ring.tilt + time * 0.04 * ring.dir;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
      ctx.strokeStyle = pal.charcoal;
      ctx.globalAlpha = 0.3 * intro;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const a = time * (0.35 + i * 0.1) * ring.dir + i * 2;
      const ex = rx * Math.cos(a);
      const ey = ry * Math.sin(a);
      const x = cx + ex * Math.cos(rot) - ey * Math.sin(rot);
      const y = cy + ex * Math.sin(rot) + ey * Math.cos(rot);
      const behind = Math.sin(a) < 0;
      ctx.beginPath();
      ctx.arc(x, y, behind ? 2 : 3, 0, Math.PI * 2);
      ctx.fillStyle = ring.dot;
      ctx.globalAlpha = (behind ? 0.35 : 0.9) * intro;
      ctx.fill();
    }

    for (const d of dew) {
      const tw = 0.5 + 0.5 * Math.sin(time * d.speed + d.phase);
      const x = cx + Math.cos(d.a) * R * d.r * 1.15;
      const y = cy + Math.sin(d.a) * R * d.r * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = d.gold ? pal.gold : pal.charcoal;
      ctx.globalAlpha = (0.12 + 0.5 * tw) * intro;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// fan — a nail-colour swatch fan that opens, breathes, and spreads under the cursor.
// ---------------------------------------------------------------------------
function roundedRect(ctx: Ctx2D, x: number, y: number, w: number, h: number, r: [number, number, number, number]) {
  if ("roundRect" in ctx) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    (ctx as CanvasRenderingContext2D).rect(x, y, w, h);
  }
}

export const fan: SceneFactory = ({ pal }) => {
  const colors = [pal.charcoal, pal.olive, pal.taupe, pal.rose, pal.sand, pal.goldPale, pal.gold, pal.grey, pal.ink];

  return ({ ctx, time, w, h, dpr, pointer, intro }) => {
    const n = colors.length;
    const px = w * 0.56 + pointer.nx * 8;
    const py = h * 0.92 + Math.sin(time * 0.8) * 3;
    const L = Math.min(h * 0.72, w * 0.62, 560);
    const cw = L * 0.19;
    const open = easeInOut(intro);
    const spreadDeg = 8 + 1.6 * Math.sin(time * 0.6) + 3.5 * pointer.force;
    const spread = (spreadDeg * Math.PI) / 180;

    for (let i = 0; i < n; i++) {
      const a = ((i - (n - 1) / 2) * spread - 0.12) * open;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin, dpr * cos, dpr * px, dpr * py);

      ctx.shadowColor = "rgba(35,31,32,0.14)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      roundedRect(ctx, -cw / 2, -L, cw, L, [cw / 2, cw / 2, 6, 6]);
      ctx.fillStyle = colors[i];
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.shadowColor = "transparent";

      // A soft highlight down one side, like lacquer catching the light.
      ctx.beginPath();
      roundedRect(ctx, -cw / 2 + cw * 0.16, -L + cw * 0.55, cw * 0.1, L * 0.5, [cw, cw, cw, cw]);
      ctx.fillStyle = "#FFFFFF";
      ctx.globalAlpha = 0.18;
      ctx.fill();
    }

    // The rivet the swatches turn on.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = clamp(intro * 2);
    ctx.beginPath();
    ctx.arc(px, py - cw * 0.45, cw * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = pal.gold;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.charcoal;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
};

// ---------------------------------------------------------------------------
// dust — fine gold dust rising slowly through a dark field, with soft bokeh.
// ---------------------------------------------------------------------------
export const dust: SceneFactory = ({ opts, pal, rand }) => {
  const motes = Array.from({ length: Math.round(120 * opts.density) }, () => {
    const r = rand();
    return {
      x: rand(),
      y: rand(),
      size: 0.5 + rand() * 1.5,
      speed: 5 + rand() * 12,
      sway: 4 + rand() * 12,
      tw: 0.5 + rand() * 1.5,
      phase: rand() * Math.PI * 2,
      alpha: 0.35 + rand() * 0.6,
      color: r < 0.6 ? pal.goldPale : r < 0.85 ? pal.sand : pal.ink,
    };
  });
  const bokeh = Array.from({ length: 7 }, () => ({
    x: rand(),
    y: rand(),
    r: 40 + rand() * 80,
    speed: 2 + rand() * 4,
    alpha: 0.05 + rand() * 0.06,
  }));

  return ({ ctx, time, intro, w, h }) => {
    for (const b of bokeh) {
      const span = h + b.r * 2;
      const y = ((((b.y * span - time * b.speed) % span) + span) % span) - b.r;
      const g = ctx.createRadialGradient(b.x * w, y, 0, b.x * w, y, b.r);
      g.addColorStop(0, rgba(pal.goldPale, b.alpha * intro));
      g.addColorStop(1, rgba(pal.goldPale, 0));
      ctx.fillStyle = g;
      ctx.globalAlpha = 1;
      ctx.fillRect(b.x * w - b.r, y - b.r, b.r * 2, b.r * 2);
    }
    for (const m of motes) {
      const span = h + 20;
      const y = ((((m.y * span - time * m.speed) % span) + span) % span) - 10;
      const x = m.x * w + Math.sin(time * 0.3 + m.phase) * m.sway;
      const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * m.tw + m.phase));
      ctx.globalAlpha = m.alpha * tw * easeOut(intro * 1.2);
      ctx.fillStyle = m.color;
      if (m.size < 1.1) {
        ctx.fillRect(x, y, m.size, m.size);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };
};
