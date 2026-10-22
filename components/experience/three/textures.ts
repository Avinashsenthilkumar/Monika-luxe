import * as THREE from "three";

/**
 * Procedural material textures, painted on <canvas> at runtime so the 3D film
 * ships with zero texture downloads. Each factory can later be swapped for a
 * photographed / KTX2 texture without touching the scene code (docs/ASSETS.md).
 */

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void;

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function make(w: number, h: number, seed: number, draw: Draw, anisotropy: number, repeat = true) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx, w, h, seeded(seed));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  count: number,
  alpha: number,
  light = false,
) {
  const v = light ? 255 : 0;
  for (let i = 0; i < count; i++) {
    const s = rand() * 1.8 + 0.3;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * rand()})`;
    ctx.fillRect(rand() * w, rand() * h, s, s);
  }
}

function blotches(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  count: number,
  dark: string,
  light: string,
) {
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 10 + rand() * w * 0.2;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rand() > 0.5 ? dark : light);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/** Vertical teak slats (cladding, louvers, feature walls). */
const teak: Draw = (ctx, w, h, rand) => {
  const slats = 8;
  const sw = w / slats;
  for (let i = 0; i < slats; i++) {
    const t = 0.82 + rand() * 0.22;
    ctx.fillStyle = `rgb(${Math.round(150 * t)},${Math.round(98 * t)},${Math.round(58 * t)})`;
    ctx.fillRect(i * sw, 0, sw, h);
    for (let k = 0; k < 30; k++) {
      const x = i * sw + rand() * sw;
      ctx.strokeStyle = `rgba(70,38,18,${0.05 + rand() * 0.13})`;
      ctx.lineWidth = 0.6 + rand() * 1.4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y <= h; y += h / 20) ctx.lineTo(x + Math.sin(y * 0.018 + k) * (1 + rand() * 2.5), y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(28,15,8,0.8)";
    ctx.fillRect(i * sw + sw - Math.max(2, sw * 0.05), 0, Math.max(2, sw * 0.05), h);
  }
};

/** Light oak floor planks, staggered joints. */
const oak: Draw = (ctx, w, h, rand) => {
  const rows = 8;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * w * 0.5;
    while (x < w) {
      const len = w * (0.45 + rand() * 0.5);
      const t = 0.86 + rand() * 0.18;
      ctx.fillStyle = `rgb(${Math.round(196 * t)},${Math.round(152 * t)},${Math.round(104 * t)})`;
      ctx.fillRect(x, r * rh, len, rh);
      for (let k = 0; k < 14; k++) {
        const y = r * rh + rand() * rh;
        ctx.strokeStyle = `rgba(110,70,35,${0.05 + rand() * 0.1})`;
        ctx.lineWidth = 0.5 + rand();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + len * 0.3, y + rand() * 3 - 1.5, x + len * 0.6, y + rand() * 3 - 1.5, x + len, y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(60,36,16,0.55)";
      ctx.fillRect(x, r * rh, 1.5, rh);
      x += len;
    }
    ctx.fillStyle = "rgba(60,36,16,0.5)";
    ctx.fillRect(0, r * rh, w, 1.5);
  }
};

/** Stacked slate-grey stone cladding. */
const stone: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#4b4842";
  ctx.fillRect(0, 0, w, h);
  const rows = 14;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * 40;
    while (x < w) {
      const len = rh * (2 + rand() * 4);
      const t = 0.75 + rand() * 0.4;
      const warm = rand() * 14;
      ctx.fillStyle = `rgb(${Math.round(150 * t + warm)},${Math.round(142 * t + warm * 0.6)},${Math.round(128 * t)})`;
      const gap = Math.max(1.5, w / 500);
      ctx.fillRect(x + gap, r * rh + gap, len - gap * 2, rh - gap * 2);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x + gap, r * rh + gap, len - gap * 2, 2);
      x += len;
    }
  }
  speckle(ctx, w, h, rand, w * 30, 0.15);
};

/** Board-formed concrete. */
const concrete: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#bdbab3";
  ctx.fillRect(0, 0, w, h);
  blotches(ctx, w, h, rand, 60, "rgba(90,88,84,0.10)", "rgba(240,238,232,0.10)");
  ctx.strokeStyle = "rgba(70,66,60,0.14)";
  ctx.lineWidth = Math.max(1, w / 512);
  for (let y = h / 4; y < h; y += h / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  speckle(ctx, w, h, rand, w * 25, 0.1);
};

/** Smooth exterior plaster, softly mottled. */
const plaster: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#f3f1ec";
  ctx.fillRect(0, 0, w, h);
  blotches(ctx, w, h, rand, 80, "rgba(150,145,135,0.07)", "rgba(255,255,255,0.08)");
  speckle(ctx, w, h, rand, w * 20, 0.06);
};

/** Book-matched white marble tiles. */
const marble: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#efebe4";
  ctx.fillRect(0, 0, w, h);
  blotches(ctx, w, h, rand, 30, "rgba(180,170,155,0.10)", "rgba(255,255,255,0.12)");
  for (let v = 0; v < 12; v++) {
    ctx.strokeStyle = `rgba(140,128,112,${0.08 + rand() * 0.22})`;
    ctx.lineWidth = 0.6 + rand() * 2.4;
    ctx.beginPath();
    let x = rand() * w;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < h) {
      x += (rand() - 0.5) * w * 0.07;
      y += h * 0.035;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(150,140,128,0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0, 0, w, h);
};

/** Mown lawn. */
const grass: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#4d6b2f";
  ctx.fillRect(0, 0, w, h);
  blotches(ctx, w, h, rand, 70, "rgba(30,50,15,0.18)", "rgba(140,170,70,0.14)");
  for (let i = 0; i < w * 26; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const g = 80 + rand() * 80;
    ctx.strokeStyle = `rgba(${Math.round(g * 0.55)},${Math.round(g)},${Math.round(g * 0.35)},0.5)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 3, y - 2 - rand() * 4);
    ctx.stroke();
  }
};

/** Granite pavers for drive and deck. */
const pavers: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#5c5a57";
  ctx.fillRect(0, 0, w, h);
  const n = 4;
  const s = w / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const t = 0.85 + rand() * 0.2;
      ctx.fillStyle = `rgb(${Math.round(176 * t)},${Math.round(172 * t)},${Math.round(164 * t)})`;
      ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
    }
  }
  speckle(ctx, w, h, rand, w * 40, 0.25);
  speckle(ctx, w, h, rand, w * 15, 0.2, true);
};

/** Fine woven fabric (used with a tint colour). */
const fabric: Draw = (ctx, w, h, rand) => {
  ctx.fillStyle = "#e9e6e1";
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = `rgba(0,0,0,${0.03 + rand() * 0.03})`;
    ctx.fillRect(0, y, w, 1);
  }
  for (let x = 0; x < w; x += 3) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + rand() * 0.04})`;
    ctx.fillRect(x, 0, 1, h);
  }
  speckle(ctx, w, h, rand, w * 10, 0.05);
};

/** Coconut palm frond with leaflets, on a transparent background. */
const frond: Draw = (ctx, w, h, rand) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  ctx.strokeStyle = "#6f6a2e";
  ctx.lineWidth = w * 0.025;
  ctx.beginPath();
  ctx.moveTo(cx, h);
  ctx.lineTo(cx, 0);
  ctx.stroke();
  const count = 46;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const y = h * (1 - t) - 4;
    const len = w * 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.08)) * (0.85 + rand() * 0.2);
    for (const side of [-1, 1]) {
      const g = 70 + rand() * 50;
      ctx.strokeStyle = `rgb(${Math.round(g * 0.55)},${Math.round(g * 1.05)},${Math.round(g * 0.3)})`;
      ctx.lineWidth = Math.max(2, h / 140);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.quadraticCurveTo(cx + side * len * 0.5, y - h * 0.01, cx + side * len, y - h * 0.035 - rand() * h * 0.01);
      ctx.stroke();
    }
  }
};

/** Garden view at dusk, seen through interior windows. */
const view: Draw = (ctx, w, h, rand) => {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  sky.addColorStop(0, "#14284d");
  sky.addColorStop(0.55, "#4a5f86");
  sky.addColorStop(1, "#e7b47a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1c2a1c";
  for (let i = 0; i < 14; i++) {
    const x = rand() * w;
    const r = h * (0.08 + rand() * 0.12);
    ctx.beginPath();
    ctx.ellipse(x, h * 0.68, r * 1.2, r, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // palms
  for (let i = 0; i < 3; i++) {
    const x = w * (0.15 + i * 0.33 + rand() * 0.1);
    ctx.strokeStyle = "#1a2418";
    ctx.lineWidth = w * 0.008;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.75);
    ctx.quadraticCurveTo(x + w * 0.02, h * 0.45, x + w * 0.01, h * 0.25);
    ctx.stroke();
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.01, h * 0.25);
      ctx.quadraticCurveTo(
        x + Math.cos(a) * w * 0.06,
        h * 0.2,
        x + Math.cos(a) * w * 0.09,
        h * 0.25 + Math.abs(Math.sin(a)) * h * 0.08,
      );
      ctx.stroke();
    }
  }
  const lawn = ctx.createLinearGradient(0, h * 0.68, 0, h);
  lawn.addColorStop(0, "#2a3a1f");
  lawn.addColorStop(1, "#141d10");
  ctx.fillStyle = lawn;
  ctx.fillRect(0, h * 0.68, w, h * 0.32);
};

export interface MaterialTextures {
  teak: THREE.CanvasTexture;
  oak: THREE.CanvasTexture;
  stone: THREE.CanvasTexture;
  concrete: THREE.CanvasTexture;
  plaster: THREE.CanvasTexture;
  marble: THREE.CanvasTexture;
  grass: THREE.CanvasTexture;
  pavers: THREE.CanvasTexture;
  fabric: THREE.CanvasTexture;
  frond: THREE.CanvasTexture;
  view: THREE.CanvasTexture;
  dispose: () => void;
}

export function createTextures(quality: "high" | "low"): MaterialTextures {
  const s = quality === "high" ? 1024 : 768;
  const a = quality === "high" ? 8 : 4;
  const t = {
    teak: make(s, s, 11, teak, a),
    oak: make(s, s, 13, oak, a),
    stone: make(s, s, 23, stone, a),
    concrete: make(s, s, 37, concrete, a),
    plaster: make(s / 2, s / 2, 41, plaster, a),
    marble: make(s, s, 51, marble, a),
    grass: make(s, s, 61, grass, a),
    pavers: make(s / 2, s / 2, 71, pavers, a),
    fabric: make(256, 256, 81, fabric, a),
    frond: make(256, 1024, 91, frond, a, false),
    view: make(1024, 512, 97, view, a, false),
  };
  return { ...t, dispose: () => Object.values(t).forEach((x) => x.dispose()) };
}

/** World-space size (metres) that one texture tile covers. */
export const TILE = {
  teak: 1.6,
  oak: 2.4,
  stone: 2.2,
  concrete: 4,
  plaster: 3,
  marble: 1.2,
  grass: 6,
  pavers: 1.2,
  fabric: 0.5,
} as const;
