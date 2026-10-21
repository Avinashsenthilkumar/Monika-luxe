import * as THREE from "three";

/**
 * Procedural material textures, generated on a <canvas> at runtime so the
 * experience ships with zero texture downloads. Replace with photographed /
 * KTX2 textures later by swapping these factories (see docs/ASSETS.md).
 */

type Draw = (ctx: CanvasRenderingContext2D, size: number, rand: () => number) => void;

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function make(size: number, seed: number, draw: Draw, anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx, size, seeded(seed));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function noise(ctx: CanvasRenderingContext2D, size: number, rand: () => number, count: number, alpha: number, light = false) {
  for (let i = 0; i < count; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = rand() * 1.6 + 0.2;
    const v = light ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * rand()})`;
    ctx.fillRect(x, y, r, r);
  }
}

/** Vertical teak slats with grain. */
const wood: Draw = (ctx, size, rand) => {
  const slats = 10;
  const w = size / slats;
  for (let i = 0; i < slats; i++) {
    const tone = 0.82 + rand() * 0.22;
    const r = Math.round(138 * tone);
    const g = Math.round(90 * tone);
    const b = Math.round(54 * tone);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(i * w, 0, w, size);
    // grain
    for (let k = 0; k < 26; k++) {
      const x = i * w + rand() * w;
      ctx.strokeStyle = `rgba(60,34,18,${0.05 + rand() * 0.12})`;
      ctx.lineWidth = 0.5 + rand() * 1.2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y <= size; y += size / 16) {
        ctx.lineTo(x + Math.sin(y * 0.02 + k) * (1 + rand() * 2), y);
      }
      ctx.stroke();
    }
    // shadow gap between slats
    ctx.fillStyle = "rgba(25,14,8,0.85)";
    ctx.fillRect(i * w + w - Math.max(2, w * 0.06), 0, Math.max(2, w * 0.06), size);
    ctx.fillStyle = "rgba(255,230,200,0.08)";
    ctx.fillRect(i * w, 0, Math.max(1, w * 0.04), size);
  }
};

/** Warm sandstone ashlar cladding. */
const stone: Draw = (ctx, size, rand) => {
  ctx.fillStyle = "#8f8270";
  ctx.fillRect(0, 0, size, size);
  const rows = 8;
  const h = size / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * h * 2;
    while (x < size) {
      const w = h * (1.4 + rand() * 1.8);
      const tone = 0.86 + rand() * 0.2;
      ctx.fillStyle = `rgb(${Math.round(205 * tone)},${Math.round(186 * tone)},${Math.round(156 * tone)})`;
      const gap = Math.max(1.5, size / 400);
      ctx.fillRect(x + gap, r * h + gap, w - gap * 2, h - gap * 2);
      x += w;
    }
  }
  noise(ctx, size, rand, size * 40, 0.12);
  noise(ctx, size, rand, size * 20, 0.1, true);
};

/** Board-formed concrete with tie holes. */
const concrete: Draw = (ctx, size, rand) => {
  ctx.fillStyle = "#b9b4aa";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 60; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 20 + rand() * size * 0.18;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const dark = rand() > 0.5;
    g.addColorStop(0, dark ? "rgba(90,86,80,0.10)" : "rgba(235,232,226,0.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.strokeStyle = "rgba(70,66,60,0.16)";
  ctx.lineWidth = Math.max(1, size / 512);
  for (let y = size / 4; y < size; y += size / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(60,56,50,0.35)";
  for (let y = size / 8; y < size; y += size / 4) {
    for (let x = size / 8; x < size; x += size / 4) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(2, size / 220), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  noise(ctx, size, rand, size * 30, 0.1);
};

/** Soft-veined marble for interior floors. */
const marble: Draw = (ctx, size, rand) => {
  ctx.fillStyle = "#ece6dc";
  ctx.fillRect(0, 0, size, size);
  for (let v = 0; v < 9; v++) {
    ctx.strokeStyle = `rgba(150,136,118,${0.08 + rand() * 0.18})`;
    ctx.lineWidth = 0.6 + rand() * 2.2;
    ctx.beginPath();
    let x = rand() * size;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < size) {
      x += (rand() - 0.5) * size * 0.08;
      y += size * 0.04;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // tile joints
  ctx.strokeStyle = "rgba(160,150,135,0.25)";
  ctx.lineWidth = Math.max(1, size / 600);
  ctx.strokeRect(0, 0, size, size);
  noise(ctx, size, rand, size * 10, 0.05);
};

export interface MaterialTextures {
  wood: THREE.CanvasTexture;
  stone: THREE.CanvasTexture;
  concrete: THREE.CanvasTexture;
  marble: THREE.CanvasTexture;
  dispose: () => void;
}

export function createTextures(quality: "high" | "low"): MaterialTextures {
  const size = quality === "high" ? 1024 : 512;
  const aniso = quality === "high" ? 8 : 4;
  const t = {
    wood: make(size, 11, wood, aniso),
    stone: make(size, 23, stone, aniso),
    concrete: make(size, 37, concrete, aniso),
    marble: make(size, 51, marble, aniso),
  };
  return {
    ...t,
    dispose: () => Object.values(t).forEach((tex) => tex.dispose()),
  };
}

/** World-space size (metres) that one texture tile covers. */
export const TEXTURE_WORLD_SIZE = {
  wood: 1.8,
  stone: 3.2,
  concrete: 4,
  marble: 2.4,
  none: 1,
} as const;
