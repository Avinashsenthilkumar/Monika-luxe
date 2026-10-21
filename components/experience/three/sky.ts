import * as THREE from "three";

/**
 * Equirectangular sky painted on a small canvas: drafting paper → clear day →
 * navy dusk with a warm horizon and sun glow. Used as scene.background so it
 * stays out of depth-based post-processing.
 */
export function createSky() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const paper = new THREE.Color("#f7f8fa");
  const day = { top: new THREE.Color("#5f8fc4"), mid: new THREE.Color("#a9c7e4"), horizon: new THREE.Color("#e9eef3") };
  const dusk = { top: new THREE.Color("#0a1630"), mid: new THREE.Color("#33466e"), horizon: new THREE.Color("#e9a565") };
  const ground = new THREE.Color("#3a4a2c");
  const groundDusk = new THREE.Color("#121a14");
  const tmp = [new THREE.Color(), new THREE.Color(), new THREE.Color(), new THREE.Color()];
  const css = (c: THREE.Color) => `#${c.getHexString()}`;

  let lastKey = "";

  /**
   * @param dayMix   0 = paper, 1 = sky
   * @param duskMix  0 = day,   1 = dusk
   * @param sunDir   world direction to the sun (for the glow)
   */
  const paint = (dayMix: number, duskMix: number, sunDir: THREE.Vector3) => {
    const key = `${Math.round(dayMix * 64)}-${Math.round(duskMix * 64)}`;
    if (key === lastKey) return;
    lastKey = key;
    const [top, mid, hor, gr] = tmp;
    top
      .copy(day.top)
      .lerp(dusk.top, duskMix)
      .lerp(paper, 1 - dayMix);
    mid
      .copy(day.mid)
      .lerp(dusk.mid, duskMix)
      .lerp(paper, 1 - dayMix);
    hor
      .copy(day.horizon)
      .lerp(dusk.horizon, duskMix)
      .lerp(paper, 1 - dayMix);
    gr.copy(ground)
      .lerp(groundDusk, duskMix)
      .lerp(paper, 1 - dayMix);

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, css(top));
    g.addColorStop(0.32, css(mid));
    g.addColorStop(0.495, css(hor));
    g.addColorStop(0.52, css(gr));
    g.addColorStop(1, css(gr));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // sun glow (equirect: u = atan2(z, x)/2π + .5, v = asin(y)/π + .5)
    const glow = dayMix * (0.35 + duskMix * 0.65);
    if (glow > 0.01) {
      const u = Math.atan2(sunDir.z, sunDir.x) / (Math.PI * 2) + 0.5;
      const v = Math.asin(Math.max(-1, Math.min(1, sunDir.y))) / Math.PI + 0.5;
      const cx = u * w;
      const cy = (1 - v) * h;
      for (const ox of [-w, 0, w]) {
        const rg = ctx.createRadialGradient(cx + ox, cy, 0, cx + ox, cy, h * 0.45);
        rg.addColorStop(0, `rgba(255,214,150,${0.85 * glow})`);
        rg.addColorStop(0.15, `rgba(255,190,120,${0.45 * glow})`);
        rg.addColorStop(1, "rgba(255,170,100,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }
    }
    // Free the cached cube conversion so the renderer rebuilds the background from the new pixels.
    texture.dispose();
    texture.needsUpdate = true;
  };

  return { texture, paint, dispose: () => texture.dispose() };
}
