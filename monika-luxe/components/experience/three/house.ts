import * as THREE from "three";
import { clamp, easeInOutCubic, easeOutCubic, range } from "@/lib/utils";
import { PHASE } from "../chapters";
import { PLAN, type Rect } from "../plan";
import { box, cyl, place, rbox, type MatKey, type Materials } from "./kit";
import { TILE } from "./textures";

/**
 * Procedural contemporary Indian villa (G+1): plinth and steps, stone-clad entry
 * block, double-glazed living pavilion, cantilevered first floor with timber
 * louvres and glass balustrade, roof parapet, pool, driveway, compound wall,
 * coconut palms and garden. Every structural part carries a reveal window so the
 * scroll timeline can build it; a clipping-plane sweep turns the white clay model
 * into finished materials.
 */

type Mode = "grow" | "drop" | "pop" | "static";

interface Part {
  group: THREE.Group;
  baseY: number;
  reveal: [number, number];
  mode: Mode;
  scale: number;
}

export interface HouseRig {
  root: THREE.Group;
  living: THREE.Group;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  exteriorLights: THREE.PointLight[];
  livingLights: THREE.Light[];
  update: (p: number) => void;
  dispose: () => void;
}

const S = PHASE.structure;
const st = (a: number, b: number): [number, number] => [S[0] + (S[1] - S[0]) * a, S[0] + (S[1] - S[0]) * b];
const M = PHASE.materials;
const mt = (a: number, b: number): [number, number] => [M[0] + (M[1] - M[0]) * a, M[0] + (M[1] - M[0]) * b];

const TILE_FOR: Partial<Record<MatKey, number>> = {
  plaster: TILE.plaster,
  plasterInt: TILE.plaster,
  stone: TILE.stone,
  teak: TILE.teak,
  oak: TILE.oak,
  concrete: TILE.concrete,
  marble: TILE.marble,
  pavers: TILE.pavers,
  hedge: TILE.grass,
};

export function buildHouse(opts: { mats: Materials; clayPlane: THREE.Plane; quality: "high" | "low" }): HouseRig {
  const { mats, clayPlane, quality } = opts;
  const root = new THREE.Group();
  root.name = "villa";
  const geos: THREE.BufferGeometry[] = [];
  const parts: Part[] = [];
  const rand = (() => {
    let s = 1234567;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  })();

  const clay = new THREE.MeshStandardMaterial({ color: "#f2f3f5", roughness: 0.9, clippingPlanes: [clayPlane] });
  const clayGlass = new THREE.MeshStandardMaterial({
    color: "#f4f6f9",
    roughness: 0.3,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    clippingPlanes: [clayPlane],
  });

  /** Adds a structural part: a clay mesh + a finished mesh sharing one geometry. */
  const add = (
    geo: THREE.BufferGeometry,
    mat: MatKey,
    x: number,
    y: number,
    z: number,
    reveal: [number, number],
    mode: Mode,
    o: { ry?: number; shadow?: boolean; finishedOnly?: boolean; scale?: number; parent?: THREE.Object3D } = {},
  ) => {
    geos.push(geo);
    const group = new THREE.Group();
    group.position.set(x, y, z);
    if (o.ry) group.rotation.y = o.ry;
    const isGlass = mat === "glass" || mat === "glassWarm";
    const shadow = o.shadow ?? !isGlass;
    const fin = new THREE.Mesh(geo, mats[mat]);
    fin.castShadow = shadow;
    fin.receiveShadow = true;
    group.add(fin);
    if (!o.finishedOnly) {
      const c = new THREE.Mesh(geo, isGlass ? clayGlass : clay);
      c.castShadow = shadow;
      c.receiveShadow = true;
      group.add(c);
    }
    (o.parent ?? root).add(group);
    parts.push({ group, baseY: y, reveal, mode, scale: o.scale ?? 1 });
    return group;
  };
  const b = (w: number, h: number, d: number, mat: MatKey) => box(w, h, d, TILE_FOR[mat] ?? 1);

  /* ---------- glazing helpers ---------- */
  const glazingX = (
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    z: number,
    reveal: [number, number],
    warm = false,
    bay = 2.2,
  ) => {
    const len = x1 - x0;
    const h = y1 - y0;
    const cx = (x0 + x1) / 2;
    add(b(len, h, 0.03, "glass"), warm ? "glassWarm" : "glass", cx, y0, z, reveal, "grow");
    add(b(len + 0.08, 0.07, 0.12, "bronze"), "bronze", cx, y0 - 0.02, z, reveal, "grow");
    add(b(len + 0.08, 0.07, 0.12, "bronze"), "bronze", cx, y1 - 0.05, z, reveal, "drop");
    const n = Math.max(1, Math.round(len / bay));
    for (let i = 0; i <= n; i++) add(b(0.06, h, 0.1, "bronze"), "bronze", x0 + (len * i) / n, y0, z, reveal, "grow");
    if (!warm && h > 2.6) add(b(len, 0.05, 0.08, "bronze"), "bronze", cx, y0 + 2.45, z, reveal, "grow");
  };
  const glazingZ = (
    z0: number,
    z1: number,
    y0: number,
    y1: number,
    x: number,
    reveal: [number, number],
    warm = false,
    bay = 2.2,
  ) => {
    const len = z1 - z0;
    const h = y1 - y0;
    const cz = (z0 + z1) / 2;
    add(b(0.03, h, len, "glass"), warm ? "glassWarm" : "glass", x, y0, cz, reveal, "grow");
    add(b(0.12, 0.07, len + 0.08, "bronze"), "bronze", x, y0 - 0.02, cz, reveal, "grow");
    add(b(0.12, 0.07, len + 0.08, "bronze"), "bronze", x, y1 - 0.05, cz, reveal, "drop");
    const n = Math.max(1, Math.round(len / bay));
    for (let i = 0; i <= n; i++) add(b(0.1, h, 0.06, "bronze"), "bronze", x, y0, z0 + (len * i) / n, reveal, "grow");
    if (!warm && h > 2.6) add(b(0.08, 0.05, len, "bronze"), "bronze", x, y0 + 2.45, cz, reveal, "grow");
  };

  /* =========================== STRUCTURE =========================== */
  const G = 0.6; // ground floor level
  const F1 = 4.25; // first floor level

  // plinth + entrance steps
  add(b(22, G, 15, "concrete"), "concrete", 0, 0, -0.5, st(0, 0.1), "grow");
  add(b(3.4, 0.2, 1.2, "stone"), "stone", -5.5, 0, 7.6, st(0.05, 0.12), "grow");
  add(b(3.4, 0.4, 0.8, "stone"), "stone", -5.5, 0, 7.4, st(0.06, 0.13), "grow");

  // living pavilion floor (marble) and columns
  add(b(11, 0.02, 11, "marble"), "marble", 4.5, G, -0.5, st(0.08, 0.14), "static", { shadow: false });
  for (const [x, z] of PLAN.columns) add(b(0.22, 3.3, 0.22, "bronze"), "bronze", x, G, z, st(0.12, 0.3), "grow");

  // kitchen & entry block (solid volume) with stone cladding panel
  add(b(9, 3.3, 11, "plaster"), "plaster", -5.5, G, -1.5, st(0.12, 0.34), "grow");
  add(b(3.6, 3.3, 0.14, "stone"), "stone", -8.1, G, 4.07, st(0.28, 0.42), "grow");
  // pivot door + canopy
  add(b(1.5, 2.8, 0.08, "teak"), "teak", -5.2, G, 4.05, st(0.38, 0.48), "grow");
  add(b(0.03, 0.9, 0.04, "brass"), "brass", -4.6, G + 1.0, 4.11, st(0.44, 0.5), "grow");
  add(b(3.2, 0.18, 2.2, "plaster"), "plaster", -5.0, 3.35, 5.1, st(0.4, 0.5), "drop");
  // kitchen window on the block
  glazingX(-3.7, -1.4, G + 1.0, G + 2.9, 4.03, st(0.45, 0.6), true, 1.2);
  glazingZ(-5, -1, G + 1.0, G + 2.9, -10.03, st(0.45, 0.6), true, 2);

  // living pavilion: back wall + full-height glazing
  add(b(11, 3.3, 0.3, "plaster"), "plaster", 4.5, G, -6.15, st(0.22, 0.4), "grow");
  glazingX(-0.9, 9.9, G, 3.9, 5, st(0.5, 0.68));
  glazingZ(-5.9, 4.9, G, 3.9, 10, st(0.5, 0.68));

  // first-floor slab (cantilevers over the terrace) + soffit light
  add(b(21, 0.35, 14.5, "plaster"), "plaster", 0, 3.9, -0.25, st(0.4, 0.55), "drop");
  add(b(10.6, 0.03, 0.08, "concrete"), "led", 4.5, 3.86, 6.7, st(0.55, 0.6), "grow", { shadow: false });

  // bedroom wing (white plaster) with picture window, chajja and teak louvres
  add(b(12.5, 3.2, 11.5, "plaster"), "plaster", -3.25, F1, -1.25, st(0.55, 0.72), "grow");
  glazingX(-8.6, -3.0, F1 + 0.55, F1 + 2.75, 4.53, st(0.72, 0.84), true, 1.4);
  add(b(6.2, 0.12, 0.8, "plaster"), "plaster", -5.8, F1 + 2.85, 4.9, st(0.8, 0.88), "drop");
  for (let x = -8.4; x <= -6.1; x += 0.3) add(b(0.06, 2.6, 0.22, "teak"), "teak", x, F1 + 0.3, 4.75, st(0.84, 0.94), "grow");
  glazingX(-1.8, 1.8, F1 + 0.55, F1 + 2.75, 4.53, st(0.74, 0.86), true, 1.2);

  // study wing (teak-clad) with glazing
  add(b(7, 3.2, 9, "teak"), "teak", 6.5, F1, -2.5, st(0.58, 0.76), "grow");
  glazingX(3.6, 9.4, F1 + 0.5, F1 + 2.8, 2.03, st(0.76, 0.88), true, 1.45);

  // balcony glass balustrade + handrail
  add(b(20.6, 1.05, 0.03, "glass"), "glass", 0, F1, 6.95, st(0.86, 0.96), "grow");
  add(b(20.7, 0.06, 0.08, "bronze"), "bronze", 0, F1 + 1.05, 6.95, st(0.88, 0.97), "grow");
  add(b(0.03, 1.05, 4.9, "glass"), "glass", 10.45, F1, 4.5, st(0.86, 0.96), "grow");
  add(b(0.08, 0.06, 4.9, "bronze"), "bronze", 10.45, F1 + 1.05, 4.5, st(0.88, 0.97), "grow");

  // roof slab with deep overhang + parapet
  const R = F1 + 3.2;
  add(b(20.6, 0.3, 12.8, "plaster"), "plaster", 0.25, R, -1.2, st(0.86, 1), "drop");
  add(b(20.6, 0.75, 0.2, "plaster"), "plaster", 0.25, R + 0.3, 5.1, st(0.92, 1), "grow");
  add(b(20.6, 0.75, 0.2, "plaster"), "plaster", 0.25, R + 0.3, -7.5, st(0.92, 1), "grow");
  add(b(0.2, 0.75, 12.8, "plaster"), "plaster", -10.05, R + 0.3, -1.2, st(0.92, 1), "grow");
  add(b(0.2, 0.75, 12.8, "plaster"), "plaster", 10.55, R + 0.3, -1.2, st(0.92, 1), "grow");
  // roof pergola
  for (let x = 4; x <= 9.5; x += 0.55) add(b(0.08, 0.16, 4.5, "teak"), "teak", x, R + 2.4, -3, st(0.95, 1), "drop");
  add(b(0.16, 2.4, 0.16, "bronze"), "bronze", 4, R + 0.3, -0.9, st(0.94, 1), "grow");
  add(b(0.16, 2.4, 0.16, "bronze"), "bronze", 9.5, R + 0.3, -0.9, st(0.94, 1), "grow");
  add(b(0.16, 2.4, 0.16, "bronze"), "bronze", 4, R + 0.3, -5.1, st(0.94, 1), "grow");
  add(b(0.16, 2.4, 0.16, "bronze"), "bronze", 9.5, R + 0.3, -5.1, st(0.94, 1), "grow");

  /* =========================== SITE =========================== */
  // pool: water surface set just below the deck coping
  add(b(11.5, 0.05, 4.5, "pavers"), "water", 4.75, 0.02, 10.75, mt(0.25, 0.5), "pop", { shadow: false, finishedOnly: true });
  add(b(15.5, 0.12, 1.5, "pavers"), "pavers", 4.75, 0, 7.75, st(0.05, 0.14), "grow");
  add(b(15.5, 0.12, 1.5, "pavers"), "pavers", 4.75, 0, 13.75, st(0.05, 0.14), "grow");
  add(b(2, 0.12, 4.5, "pavers"), "pavers", -2, 0, 10.75, st(0.05, 0.14), "grow");
  add(b(2, 0.12, 4.5, "pavers"), "pavers", 11.5, 0, 10.75, st(0.05, 0.14), "grow");
  // driveway
  add(b(5, 0.06, 10.8, "pavers"), "pavers", -6.5, 0, 13.6, st(0.04, 0.12), "grow");

  // compound wall with stone gate pillars
  const wallH = 1.5;
  add(b(8.4, wallH, 0.25, "plaster"), "plaster", -13.8, 0, 19, st(0.1, 0.3), "grow");
  add(b(21.4, wallH, 0.25, "plaster"), "plaster", 7.3, 0, 19, st(0.1, 0.3), "grow");
  add(b(36, wallH, 0.25, "plaster"), "plaster", 0, 0, -14, st(0.1, 0.3), "grow");
  add(b(0.25, wallH, 33, "plaster"), "plaster", -18, 0, 2.5, st(0.1, 0.3), "grow");
  add(b(0.25, wallH, 33, "plaster"), "plaster", 18, 0, 2.5, st(0.1, 0.3), "grow");
  add(b(0.7, 2.1, 0.7, "stone"), "stone", -9.6, 0, 19, st(0.2, 0.35), "grow");
  add(b(0.7, 2.1, 0.7, "stone"), "stone", -3.4, 0, 19, st(0.2, 0.35), "grow");

  // garden bollards along the drive
  for (const z of [10, 13, 16]) {
    for (const x of [-9.3, -3.7]) {
      add(cyl(0.06, 0.06, 0.6, 12), "bronze", x, 0, z, mt(0.3, 0.6), "pop", { finishedOnly: true });
      add(cyl(0.065, 0.065, 0.08, 12), "led", x, 0.6, z, mt(0.3, 0.6), "pop", { finishedOnly: true, shadow: false });
    }
  }

  // hedges
  add(b(34, 1.0, 0.9, "hedge"), "hedge", 0, 0, -13.2, mt(0.15, 0.4), "grow", { finishedOnly: true });
  add(b(0.9, 1.0, 20, "hedge"), "hedge", 17.2, 0, 5, mt(0.15, 0.4), "grow", { finishedOnly: true });
  add(b(0.9, 1.0, 20, "hedge"), "hedge", -17.2, 0, 5, mt(0.15, 0.4), "grow", { finishedOnly: true });

  /* ---------- coconut palms ---------- */
  const frondGeo = (() => {
    const g = new THREE.PlaneGeometry(1.0, 3.8, 6, 14);
    g.translate(0, 1.9, 0);
    g.rotateX(Math.PI / 2); // length along +z, face down
    const p = g.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, 0.5 * z - 0.17 * z * z - 0.35 * Math.abs(x));
    }
    g.computeVertexNormals();
    return g;
  })();
  geos.push(frondGeo);

  const palm = (x: number, z: number, height: number, lean: number, dir: number, reveal: [number, number]) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      pts.push(new THREE.Vector3(Math.cos(dir) * lean * t * t, height * t, Math.sin(dir) * lean * t * t));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const trunk = new THREE.TubeGeometry(curve, 24, 0.17, 8, false);
    const top = pts[pts.length - 1];
    const group = add(trunk, "trunk", x, 0, z, reveal, "grow", { finishedOnly: true });
    const crown = new THREE.Group();
    crown.position.copy(top);
    const n = 13;
    for (let k = 0; k < n; k++) {
      const f = new THREE.Mesh(frondGeo, mats.frond);
      f.rotation.order = "YXZ";
      f.rotation.y = (k / n) * Math.PI * 2 + rand() * 0.3;
      f.rotation.x = -0.35 + rand() * 0.75;
      f.scale.setScalar(0.85 + rand() * 0.35);
      f.castShadow = true;
      crown.add(f);
    }
    const nuts = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), mats.trunk);
    geos.push(nuts.geometry);
    nuts.position.y = -0.25;
    crown.add(nuts);
    group.add(crown);
  };
  palm(-15, 11, 8.5, 1.4, 0.4, mt(0.1, 0.4));
  palm(-14.2, 14.8, 7.2, 1.0, -0.6, mt(0.14, 0.44));
  palm(15.5, 10, 9, 1.6, 2.9, mt(0.12, 0.42));
  palm(14, -10, 8.2, 1.2, 2.2, mt(0.16, 0.46));
  palm(-13.5, -9.5, 9.2, 1.5, 0.9, mt(0.18, 0.48));
  palm(13.5, 15.5, 7.6, 1.1, 3.6, mt(0.15, 0.45));

  /* ---------- broadleaf trees (organic displaced canopy) ---------- */
  const canopyGeo = (() => {
    const g = new THREE.IcosahedronGeometry(1, 3);
    const p = g.getAttribute("position") as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n =
        1 + 0.16 * Math.sin(v.x * 5.1 + v.y * 3.3) * Math.cos(v.z * 4.7 - v.y * 2.1) + 0.08 * Math.sin(v.x * 11 + v.z * 9);
      v.multiplyScalar(n);
      p.setXYZ(i, v.x, v.y * 0.8, v.z);
    }
    g.computeVertexNormals();
    return g;
  })();
  geos.push(canopyGeo);
  const tree = (x: number, z: number, s: number, reveal: [number, number]) => {
    const g = add(cyl(0.14, 0.22, 2.6, 10), "trunk", x, 0, z, reveal, "pop", { finishedOnly: true, scale: s });
    for (const [cx, cy, cz, r] of [
      [0, 3.3, 0, 1.7],
      [0.9, 3.8, 0.4, 1.2],
      [-0.8, 3.9, -0.5, 1.25],
      [0.2, 4.6, -0.2, 1.0],
    ]) {
      const c = new THREE.Mesh(canopyGeo, mats.foliage);
      c.position.set(cx, cy, cz);
      c.scale.setScalar(r);
      c.rotation.y = rand() * 6;
      c.castShadow = true;
      c.receiveShadow = true;
      g.add(c);
    }
  };
  tree(-6, -11.5, 1.1, mt(0.2, 0.5));
  tree(6.5, -11.8, 1.25, mt(0.22, 0.52));
  tree(15.4, 1.5, 0.95, mt(0.24, 0.54));
  tree(-15.6, 3.5, 1.0, mt(0.2, 0.5));

  /* ---------- ground ---------- */
  const groundGeo = new THREE.PlaneGeometry(420, 420);
  groundGeo.rotateX(-Math.PI / 2);
  const guv = groundGeo.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < guv.count; i++) guv.setXY(i, (guv.getX(i) * 420) / TILE.grass, (guv.getY(i) * 420) / TILE.grass);
  geos.push(groundGeo);
  const groundClayMat = new THREE.MeshStandardMaterial({
    color: "#f7f8fa",
    roughness: 1,
    emissive: new THREE.Color("#f7f8fa"),
    emissiveIntensity: 0.5,
    clippingPlanes: [clayPlane],
  });
  const groundClay = new THREE.Mesh(groundGeo, groundClayMat);
  const groundLawn = new THREE.Mesh(groundGeo, mats.lawn);
  groundClay.receiveShadow = groundLawn.receiveShadow = true;
  groundClay.position.y = groundLawn.position.y = -0.002;
  root.add(groundClay, groundLawn);

  /* =========================== LIVING ROOM INTERIOR =========================== */
  const living = new THREE.Group();
  living.name = "living-interior";
  root.add(living);
  const L = (
    geo: THREE.BufferGeometry,
    mat: MatKey,
    x: number,
    y: number,
    z: number,
    o: { ry?: number; cast?: boolean } = {},
  ) => {
    geos.push(geo);
    const m = place(geo, mats[mat], x, y, z, { ry: o.ry, cast: o.cast ?? true });
    living.add(m);
    return m;
  };
  const Y = G + 0.02;
  // stone TV wall, console, TV, LED
  L(box(7, 3.28, 0.15, TILE.stone), "stone", 5, Y, -5.92);
  L(rbox(3.4, 0.36, 0.45, 0.02), "teak", 5, Y + 0.3, -5.6);
  L(box(3.3, 0.02, 0.06), "led", 5, Y + 0.27, -5.42, { cast: false });
  L(rbox(2.1, 1.2, 0.05, 0.01), "blackGloss", 5, Y + 1.15, -5.8);
  // false ceiling with LED cove
  L(box(10, 0.08, 10, TILE.plaster), "plasterInt", 4.5, 3.7, -0.5, { cast: false });
  L(box(10, 0.03, 0.05), "led", 4.5, 3.68, 4.45, { cast: false });
  L(box(10, 0.03, 0.05), "led", 4.5, 3.68, -5.45, { cast: false });
  L(box(0.05, 0.03, 9.9), "led", 9.45, 3.68, -0.5, { cast: false });
  // rug
  L(rbox(4.6, 0.025, 3.4, 0.01), "rug", 5, Y, -1.4, { cast: false });
  // L-shaped sofa facing the TV
  const sx = 5;
  const sz = -0.2;
  L(rbox(3.6, 0.42, 1.0, 0.05), "fabricBeige", sx, Y, sz);
  L(rbox(3.6, 0.5, 0.26, 0.06), "fabricBeige", sx, Y + 0.38, sz + 0.37);
  L(rbox(0.24, 0.62, 1.0, 0.06), "fabricBeige", sx - 1.92, Y, sz);
  L(rbox(1.0, 0.42, 1.3, 0.05), "fabricBeige", sx + 1.3, Y, sz - 1.15);
  for (const dx of [-0.88, 0.0, 0.88]) L(rbox(0.86, 0.15, 0.78, 0.06), "fabricCream", sx + dx - 0.2, Y + 0.42, sz - 0.08);
  L(rbox(0.96, 0.15, 1.2, 0.06), "fabricCream", sx + 1.3, Y + 0.42, sz - 1.2);
  for (const dx of [-1.2, -0.3, 0.6]) L(rbox(0.85, 0.48, 0.18, 0.08), "fabricCream", sx + dx, Y + 0.56, sz + 0.2);
  L(rbox(0.45, 0.42, 0.14, 0.07), "fabricNavy", sx - 1.5, Y + 0.6, sz + 0.05, { ry: 0.3 });
  L(rbox(0.45, 0.42, 0.14, 0.07), "fabricNavy", sx + 1.45, Y + 0.6, sz + 0.05, { ry: -0.25 });
  // round marble coffee table
  L(cyl(0.62, 0.62, 0.05), "marble", sx - 0.3, Y + 0.36, -1.85);
  L(cyl(0.32, 0.4, 0.36), "bronze", sx - 0.3, Y, -1.85);
  // armchair
  L(rbox(0.9, 0.42, 0.9, 0.06), "fabricNavy", 1.9, Y, -2.2, { ry: Math.PI / 2 });
  L(rbox(0.9, 0.52, 0.2, 0.07), "fabricNavy", 1.55, Y + 0.38, -2.2, { ry: Math.PI / 2 });
  // arc floor lamp
  L(cyl(0.015, 0.015, 1.75, 8), "brass", 7.4, Y, 0.5);
  L(cyl(0.12, 0.24, 0.28, 24), "lampShade", 7.4, Y + 1.7, 0.5, { cast: false });
  // plant
  L(cyl(0.26, 0.2, 0.55, 20), "pot", 9.2, Y, -5.2);
  for (let k = 0; k < 9; k++) {
    const f = L(frondGeo, "frond", 9.2, Y + 0.5, -5.2, { ry: (k / 9) * Math.PI * 2 });
    f.rotation.order = "YXZ";
    f.rotation.x = -0.9 + rand() * 0.35;
    f.scale.setScalar(0.32);
  }
  // dining
  L(rbox(2.2, 0.05, 1.0, 0.015), "teak", 0.8, Y + 0.73, 2.6);
  L(box(0.08, 0.73, 0.8), "bronze", -0.1, Y, 2.6);
  L(box(0.08, 0.73, 0.8), "bronze", 1.7, Y, 2.6);
  for (const [dx, dz, ry] of [
    [-0.25, -0.7, 0],
    [0.8, -0.7, 0],
    [1.85, -0.7, 0],
    [-0.25, 0.7, Math.PI],
    [0.8, 0.7, Math.PI],
    [1.85, 0.7, Math.PI],
  ]) {
    L(rbox(0.46, 0.46, 0.46, 0.04), "fabricCharcoal", dx, Y, 2.6 + dz, { ry });
    L(rbox(0.46, 0.5, 0.07, 0.03), "fabricCharcoal", dx, Y + 0.46, 2.6 + dz + (ry === 0 ? -0.2 : 0.2), { ry });
  }
  for (const dx of [-0.1, 0.8, 1.7]) {
    L(new THREE.SphereGeometry(0.14, 24, 16), "lampShade", dx, 2.85, 2.6, { cast: false });
    L(cyl(0.004, 0.004, 0.8, 4), "bronze", dx, 2.95, 2.6, { cast: false });
  }

  /* =========================== BLUEPRINT =========================== */
  const segs = (rects: Rect[], out: number[]) => {
    for (const [x0, z0, x1, z1] of rects) {
      const y = 0.03;
      out.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
    }
  };
  const primary: number[] = [];
  const secondary: number[] = [];
  segs(PLAN.solid, primary);
  for (const [x, z] of PLAN.columns) segs([[x - 0.12, z - 0.12, x + 0.12, z + 0.12]], primary);
  // door swing
  for (let a = 0; a < 12; a++) {
    const t0 = (a / 12) * (Math.PI / 2);
    const t1 = ((a + 1) / 12) * (Math.PI / 2);
    primary.push(
      -4.45 - Math.cos(t0) * 1.5,
      0.03,
      4.0 + Math.sin(t0) * 1.5,
      -4.45 - Math.cos(t1) * 1.5,
      0.03,
      4.0 + Math.sin(t1) * 1.5,
    );
  }
  segs(PLAN.light, secondary);
  const dim = (x0: number, z0: number, x1: number, z1: number) => {
    secondary.push(x0, 0.03, z0, x1, 0.03, z1);
    const t = 0.5;
    if (z0 === z1) secondary.push(x0, 0.03, z0 - t, x0, 0.03, z0 + t, x1, 0.03, z1 - t, x1, 0.03, z1 + t);
    else secondary.push(x0 - t, 0.03, z0, x0 + t, 0.03, z0, x1 - t, 0.03, z1, x1 + t, 0.03, z1);
  };
  dim(-11, 21, 11, 21);
  dim(-20, -8, -20, 7);
  for (const x of [-1, 10]) secondary.push(x, 0.03, -16, x, 0.03, 21);
  for (const z of [-6, 5]) secondary.push(-20, 0.03, z, 20, 0.03, z);
  const lineGeo = (arr: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    geos.push(g);
    return g;
  };
  const bpPrimaryGeo = lineGeo(primary);
  const bpSecondaryGeo = lineGeo(secondary);
  const minor: number[] = [];
  const major: number[] = [];
  for (let v = -80; v <= 80; v += 2)
    (v % 10 === 0 ? major : minor).push(v, 0.012, -80, v, 0.012, 80, -80, 0.012, v, 80, 0.012, v);
  const ink = new THREE.LineBasicMaterial({ color: "#13294f", transparent: true, opacity: 0.9, depthWrite: false });
  const inkLight = new THREE.LineBasicMaterial({ color: "#13294f", transparent: true, opacity: 0.4, depthWrite: false });
  const gridMinorMat = new THREE.LineBasicMaterial({ color: "#0c1d3a", transparent: true, opacity: 0.06, depthWrite: false });
  const gridMajorMat = new THREE.LineBasicMaterial({ color: "#0c1d3a", transparent: true, opacity: 0.12, depthWrite: false });
  const bpPrimary = new THREE.LineSegments(bpPrimaryGeo, ink);
  const bpSecondary = new THREE.LineSegments(bpSecondaryGeo, inkLight);
  const gridMinor = new THREE.LineSegments(lineGeo(minor), gridMinorMat);
  const gridMajor = new THREE.LineSegments(lineGeo(major), gridMajorMat);
  for (const l of [bpPrimary, bpSecondary, gridMinor, gridMajor]) {
    l.renderOrder = 2;
    root.add(l);
  }
  const primaryCount = primary.length / 3;
  const secondaryCount = secondary.length / 3;

  /* =========================== LIGHTS =========================== */
  const hemi = new THREE.HemisphereLight("#fffaf0", "#b9b4a8", 1.4);
  const sun = new THREE.DirectionalLight("#fff6e8", 2.8);
  sun.castShadow = true;
  const sm = quality === "high" ? 4096 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 3;
  sun.target.position.set(0, 0, 2);
  root.add(hemi, sun, sun.target);

  const pl = (color: string, distance: number, x: number, y: number, z: number, parent: THREE.Object3D = root) => {
    const l = new THREE.PointLight(color, 0, distance, 2);
    l.position.set(x, y, z);
    parent.add(l);
    return l;
  };
  const exteriorLights = [
    pl("#ffbf86", 14, 1.5, 3.6, 6.3),
    pl("#ffbf86", 14, 7.5, 3.6, 6.3),
    pl("#59cbd8", 10, 4.75, -0.4, 10.75),
    pl("#ffb46b", 12, -5.8, 5.8, 5.2),
    pl("#ffb46b", 12, 6.5, 5.8, 3.2),
    pl("#ffc68f", 9, -6.5, 1.0, 13),
  ];
  const livingSpot = new THREE.SpotLight("#ffd7a8", 0, 12, 0.85, 0.7, 2);
  livingSpot.position.set(5, 3.6, 1.5);
  livingSpot.target.position.set(5, 0.6, -2);
  livingSpot.castShadow = true;
  livingSpot.shadow.mapSize.set(1024, 1024);
  livingSpot.shadow.bias = -0.0005;
  living.add(livingSpot, livingSpot.target);
  const livingLights: THREE.Light[] = [
    livingSpot,
    pl("#ffc890", 9, 5, 2.9, -2.2, living),
    pl("#ffc890", 8, 0.8, 2.7, 2.6, living),
    pl("#ffc68f", 5, 7.4, 2.2, 0.5, living),
  ];

  /* =========================== UPDATE =========================== */
  let last = -1;
  const update = (p: number) => {
    if (p === last) return;
    last = p;

    const draw = easeInOutCubic(range(p, 0.005, PHASE.blueprint[1] * 0.92));
    bpPrimaryGeo.setDrawRange(0, Math.floor((primaryCount * draw) / 2) * 2);
    bpSecondaryGeo.setDrawRange(0, Math.floor((secondaryCount * clamp(draw * 1.15 - 0.15)) / 2) * 2);
    const bpFade = 1 - range(p, PHASE.blueprintFade[0], PHASE.blueprintFade[1]);
    ink.opacity = 0.9 * bpFade;
    inkLight.opacity = 0.4 * bpFade;
    bpPrimary.visible = bpSecondary.visible = bpFade > 0.001;
    const gridFade = 1 - range(p, M[0] - 0.02, M[0] + 0.06);
    gridMinorMat.opacity = 0.06 * gridFade;
    gridMajorMat.opacity = 0.12 * gridFade;
    gridMinor.visible = gridMajor.visible = gridFade > 0.001;

    for (const part of parts) {
      const raw = range(p, part.reveal[0], part.reveal[1]);
      const t = easeOutCubic(raw);
      const g = part.group;
      g.visible = raw > 0;
      if (!g.visible) continue;
      if (part.mode === "grow") g.scale.set(part.scale, Math.max(t, 0.0001) * part.scale, part.scale);
      else if (part.mode === "drop") g.position.y = part.baseY + (1 - t) * 5;
      else if (part.mode === "pop") g.scale.setScalar(Math.max(t, 0.0001) * part.scale);
    }

    living.visible = p > M[0] + 0.07;
    groundClayMat.emissiveIntensity = 0.5 * (1 - range(p, M[0], M[0] + 0.05));
  };

  const dispose = () => {
    geos.forEach((g) => g.dispose());
    [clay, clayGlass, groundClayMat, ink, inkLight, gridMinorMat, gridMajorMat].forEach((m) => m.dispose());
    sun.shadow.map?.dispose();
    livingSpot.shadow.map?.dispose();
    root.clear();
  };

  return { root, living, sun, hemi, exteriorLights, livingLights, update, dispose };
}
