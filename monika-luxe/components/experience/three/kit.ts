import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { MaterialTextures } from "./textures";
import { TILE } from "./textures";

/* ------------------------------------------------------------------
 * Small modelling kit shared by the house and the interior rooms.
 * All geometry helpers put the origin at the BASE of the object so
 * "grow" animations scale up from the floor.
 * ------------------------------------------------------------------ */

/** Box with base origin and UVs scaled to world metres (textures tile consistently). */
export function box(w: number, h: number, d: number, tile = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  const uv = g.getAttribute("uv") as THREE.BufferAttribute;
  // face order: +x, -x, +y, -y, +z, -z (4 verts each)
  const dims: Array<[number, number]> = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    for (let i = 0; i < 4; i++) {
      const idx = f * 4 + i;
      uv.setXY(idx, (uv.getX(idx) * dims[f][0]) / tile, (uv.getY(idx) * dims[f][1]) / tile);
    }
  }
  uv.needsUpdate = true;
  return g;
}

/** Soft-edged box (furniture, cushions, cabinetry). */
export function rbox(w: number, h: number, d: number, r = 0.03, segments = 3) {
  const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
  const g = new RoundedBoxGeometry(w, h, d, segments, Math.max(radius, 0.001));
  g.translate(0, h / 2, 0);
  return g;
}

export function cyl(rTop: number, rBottom: number, h: number, segments = 28) {
  const g = new THREE.CylinderGeometry(rTop, rBottom, h, segments);
  g.translate(0, h / 2, 0);
  return g;
}

export interface Place {
  rx?: number;
  ry?: number;
  rz?: number;
  cast?: boolean;
  receive?: boolean;
}

export function place(geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, o: Place = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (o.rx) m.rotation.x = o.rx;
  if (o.ry) m.rotation.y = o.ry;
  if (o.rz) m.rotation.z = o.rz;
  m.castShadow = o.cast ?? true;
  m.receiveShadow = o.receive ?? true;
  return m;
}

/* ------------------------------------------------------------------ */

export type MatKey =
  | "plaster"
  | "plasterInt"
  | "stone"
  | "teak"
  | "oak"
  | "concrete"
  | "marble"
  | "quartz"
  | "bronze"
  | "steel"
  | "brass"
  | "glass"
  | "glassWarm"
  | "blackGloss"
  | "navyMatte"
  | "fabricBeige"
  | "fabricCream"
  | "fabricWhite"
  | "fabricNavy"
  | "fabricSage"
  | "fabricCharcoal"
  | "rug"
  | "led"
  | "lampShade"
  | "screen"
  | "water"
  | "poolTile"
  | "lawn"
  | "pavers"
  | "foliage"
  | "hedge"
  | "trunk"
  | "frond"
  | "pot"
  | "view"
  | "sheer";

export type Materials = Record<MatKey, THREE.Material> & {
  /** emissive materials whose brightness follows the lighting state */
  emissive: Array<{ mat: THREE.MeshStandardMaterial; max: number; group: "exterior" | "interior" }>;
  dispose: () => void;
};

export function createMaterials(t: MaterialTextures, clip: THREE.Plane): Materials {
  const planes = [clip];
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ clippingPlanes: planes, ...p });
  const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial({ clippingPlanes: planes, ...p });

  t.fabric.repeat.set(3, 3);

  const m = {
    plaster: std({ map: t.plaster, bumpMap: t.plaster, bumpScale: 0.6, roughness: 0.92, color: "#ffffff" }),
    plasterInt: std({ map: t.plaster, roughness: 0.95, color: "#f6f2ea" }),
    stone: std({ map: t.stone, bumpMap: t.stone, bumpScale: 2.2, roughness: 0.82, color: "#ffffff" }),
    teak: std({ map: t.teak, bumpMap: t.teak, bumpScale: 0.8, roughness: 0.55, color: "#ffffff" }),
    oak: std({ map: t.oak, roughness: 0.42, color: "#ffffff" }),
    concrete: std({ map: t.concrete, roughness: 0.88, color: "#ffffff" }),
    marble: std({ map: t.marble, roughness: 0.12, color: "#ffffff" }),
    quartz: std({ color: "#f4f3f0", roughness: 0.22 }),
    bronze: std({ color: "#2f2a25", metalness: 0.8, roughness: 0.36 }),
    steel: std({ color: "#c9ccd0", metalness: 1, roughness: 0.28 }),
    brass: std({ color: "#c9a24d", metalness: 1, roughness: 0.3 }),
    glass: phys({
      color: "#a7bcc2",
      roughness: 0.03,
      metalness: 0.15,
      transparent: true,
      opacity: 0.22,
      envMapIntensity: 2.2,
      depthWrite: false,
    }),
    glassWarm: phys({
      color: "#7d8b8e",
      roughness: 0.05,
      metalness: 0.25,
      emissive: new THREE.Color("#ffb768"),
      emissiveIntensity: 0,
    }),
    blackGloss: std({ color: "#0b0c0e", roughness: 0.12, metalness: 0.2 }),
    navyMatte: std({ color: "#14284a", roughness: 0.55 }),
    fabricBeige: std({ map: t.fabric, color: "#d6c8b0", roughness: 0.97 }),
    fabricCream: std({ map: t.fabric, color: "#efe7da", roughness: 0.97 }),
    fabricWhite: std({ map: t.fabric, color: "#f7f5f1", roughness: 0.95 }),
    fabricNavy: std({ map: t.fabric, color: "#1d3157", roughness: 0.9 }),
    fabricSage: std({ map: t.fabric, color: "#8f9a82", roughness: 0.95 }),
    fabricCharcoal: std({ map: t.fabric, color: "#46464a", roughness: 0.85 }),
    rug: std({ map: t.fabric, color: "#b9aa90", roughness: 1 }),
    led: std({ color: "#fff3e0", emissive: new THREE.Color("#ffd29a"), emissiveIntensity: 0, roughness: 0.5 }),
    lampShade: std({ color: "#f6ead6", emissive: new THREE.Color("#ffc983"), emissiveIntensity: 0, roughness: 0.8 }),
    screen: std({ color: "#0d1420", emissive: new THREE.Color("#7f9cc4"), emissiveIntensity: 0, roughness: 0.2 }),
    water: phys({
      color: "#1e6f7c",
      roughness: 0.02,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 1.6,
      emissive: new THREE.Color("#167f8f"),
      emissiveIntensity: 0,
    }),
    poolTile: std({ color: "#5fb7c2", roughness: 0.5 }),
    lawn: std({ map: t.grass, roughness: 1, color: "#ffffff" }),
    pavers: std({ map: t.pavers, roughness: 0.85, color: "#ffffff" }),
    foliage: std({ color: "#3d5a2a", roughness: 0.9 }),
    hedge: std({ map: t.grass, color: "#7f9a5e", roughness: 1 }),
    trunk: std({ map: t.concrete, color: "#8b765b", roughness: 1 }),
    frond: std({ map: t.frond, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75, color: "#ffffff" }),
    pot: std({ color: "#d9d2c5", roughness: 0.75 }),
    view: new THREE.MeshBasicMaterial({ map: t.view, toneMapped: false, fog: false }),
    sheer: std({
      map: t.fabric,
      color: "#f8f4ec",
      roughness: 1,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  } satisfies Record<MatKey, THREE.Material>;

  const emissive: Materials["emissive"] = [
    { mat: m.glassWarm, max: 0.9, group: "exterior" },
    { mat: m.led, max: 3.2, group: "interior" },
    { mat: m.lampShade, max: 2.2, group: "interior" },
    { mat: m.screen, max: 0.7, group: "interior" },
    { mat: m.water, max: 0.6, group: "exterior" },
  ];

  return {
    ...m,
    emissive,
    dispose: () => Object.values(m).forEach((x) => x.dispose()),
  };
}

export const TILES = TILE;
