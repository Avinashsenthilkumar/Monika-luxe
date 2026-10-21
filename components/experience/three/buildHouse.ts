import * as THREE from "three";
import { clamp, easeInOutCubic, easeOutCubic, range } from "@/lib/utils";
import { PHASE } from "../chapters";
import { createTextures, TEXTURE_WORLD_SIZE } from "./textures";

/**
 * Procedural contemporary residence, built imperatively (no React re-renders
 * during scroll). One call to `update(progress)` per frame drives:
 *   - blueprint line drawing
 *   - structural parts growing / dropping into place
 *   - a clipping-plane "material sweep" from clay model → finished materials
 *   - day → dusk lighting, interior lights, sky and fog
 *
 * To replace this with a licensed GLB later, keep the same `HouseRig`
 * interface (see docs/ASSETS.md).
 */

type MatKey =
  | "concrete"
  | "stone"
  | "wood"
  | "plaster"
  | "glass"
  | "glassWarm"
  | "bronze"
  | "marble"
  | "water"
  | "lawn"
  | "foliage"
  | "trunk"
  | "fabric"
  | "fabricDark"
  | "rug"
  | "led"
  | "deck"
  | "poolFloor"
  | "path";

type Mode = "grow" | "drop" | "pop" | "static";

interface PartDef {
  size: [number, number, number];
  /** x, base y, z */
  at: [number, number, number];
  mat: MatKey;
  reveal: [number, number];
  mode: Mode;
  shadow?: boolean;
}

interface Part {
  group: THREE.Group;
  baseY: number;
  reveal: [number, number];
  mode: Mode;
}

export interface HouseRig {
  root: THREE.Group;
  update: (p: number, scene: THREE.Scene) => void;
  dispose: () => void;
}

const COLORS = {
  paper: new THREE.Color("#f7f8fa"),
  duskTop: new THREE.Color("#0a1630"),
  duskHorizon: new THREE.Color("#c79a55"),
  duskBottom: new THREE.Color("#0b1528"),
  fogDusk: new THREE.Color("#16233d"),
};

/* ---------------- geometry helpers ---------------- */

const TILE: Partial<Record<MatKey, number>> = {
  wood: TEXTURE_WORLD_SIZE.wood,
  stone: TEXTURE_WORLD_SIZE.stone,
  concrete: TEXTURE_WORLD_SIZE.concrete,
  deck: TEXTURE_WORLD_SIZE.stone,
  path: TEXTURE_WORLD_SIZE.stone,
  marble: TEXTURE_WORLD_SIZE.marble,
};

/** Box whose origin sits on its base, with UVs scaled to world size. */
function box(w: number, h: number, d: number, tile = 1) {
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

/* ---------------- the residence ---------------- */

const S = PHASE.structure;
const st = (a: number, b: number): [number, number] => [S[0] + (S[1] - S[0]) * a, S[0] + (S[1] - S[0]) * b];

function residence(): PartDef[] {
  const parts: PartDef[] = [];
  const add = (p: PartDef) => parts.push(p);

  // Plinth & foundation
  add({ size: [20, 0.45, 14], at: [0, 0, 0], mat: "concrete", reveal: st(0, 0.14), mode: "grow" });

  // Ground floor — solid stone service block (left)
  add({ size: [8, 3.6, 10], at: [-5, 0.45, -1], mat: "stone", reveal: st(0.3, 0.52), mode: "grow" });
  // entrance door + slit window on the stone block
  add({ size: [1.4, 2.8, 0.08], at: [-2.6, 0.45, 4.03], mat: "wood", reveal: st(0.48, 0.6), mode: "grow" });
  add({ size: [4.2, 0.55, 0.06], at: [-6.2, 2.7, 4.03], mat: "glassWarm", reveal: st(0.5, 0.62), mode: "grow", shadow: false });

  // Living pavilion: back wall, interior floor
  add({ size: [10, 3.6, 0.3], at: [4, 0.45, -4.85], mat: "plaster", reveal: st(0.3, 0.5), mode: "grow" });
  add({ size: [10, 0.03, 10], at: [4, 0.45, 0], mat: "marble", reveal: st(0.12, 0.2), mode: "static" });

  // Columns (structure frame) — placed to keep the camera path clear
  for (const [x, z] of [
    [-0.85, 6.7],
    [3, 6.7],
    [8.7, 6.7],
    [8.7, -4.6],
    [-0.85, -4.6],
  ] as Array<[number, number]>) {
    add({ size: [0.28, 3.6, 0.28], at: [x, 0.45, z], mat: "concrete", reveal: st(0.16, 0.36), mode: "grow" });
  }

  // Glass + bronze mullions — front (z = 5) and side (x = 9)
  add({ size: [10, 3.6, 0.04], at: [4, 0.45, 4.98], mat: "glass", reveal: st(0.6, 0.78), mode: "grow", shadow: false });
  add({ size: [0.04, 3.6, 10], at: [8.98, 0.45, 0], mat: "glass", reveal: st(0.6, 0.78), mode: "grow", shadow: false });
  for (const x of [-0.95, 1.5, 6.5, 8.95]) {
    add({ size: [0.08, 3.6, 0.12], at: [x, 0.45, 4.98], mat: "bronze", reveal: st(0.55, 0.7), mode: "grow" });
  }
  for (const z of [-2.5, 0, 2.5]) {
    add({ size: [0.12, 3.6, 0.08], at: [8.98, 0.45, z], mat: "bronze", reveal: st(0.55, 0.7), mode: "grow" });
  }

  // First-floor slab (drops in), cantilevered timber volume, roof
  add({ size: [16, 0.3, 12], at: [0.5, 4.05, 1], mat: "concrete", reveal: st(0.5, 0.66), mode: "drop" });
  add({ size: [14.5, 3.2, 11], at: [0.25, 4.35, 1], mat: "wood", reveal: st(0.64, 0.84), mode: "grow" });
  add({ size: [10, 1.8, 0.06], at: [1.5, 5.0, 6.53], mat: "glassWarm", reveal: st(0.78, 0.9), mode: "grow", shadow: false });
  add({ size: [0.06, 1.8, 6], at: [7.53, 5.0, 2.2], mat: "glassWarm", reveal: st(0.78, 0.9), mode: "grow", shadow: false });
  add({ size: [3.2, 1.8, 0.06], at: [-4.6, 5.0, 6.53], mat: "glassWarm", reveal: st(0.8, 0.92), mode: "grow", shadow: false });
  add({ size: [17.5, 0.35, 13.5], at: [0.5, 7.55, 1], mat: "concrete", reveal: st(0.84, 1), mode: "drop" });

  // Soffit light strip under the cantilever
  add({ size: [14, 0.04, 0.12], at: [0.5, 4.0, 6.75], mat: "led", reveal: st(0.7, 0.8), mode: "grow", shadow: false });

  // Pool deck (four strips around the pool) + water + pool floor
  const M = PHASE.materials;
  const mt = (a: number, b: number): [number, number] => [M[0] + (M[1] - M[0]) * a, M[0] + (M[1] - M[0]) * b];
  add({ size: [14, 0.3, 1.5], at: [4.5, 0, 7.75], mat: "deck", reveal: st(0.06, 0.16), mode: "grow" });
  add({ size: [14, 0.3, 1.2], at: [4.5, 0, 13.6], mat: "deck", reveal: st(0.06, 0.16), mode: "grow" });
  add({ size: [1.5, 0.3, 4.5], at: [-1.75, 0, 10.75], mat: "deck", reveal: st(0.06, 0.16), mode: "grow" });
  add({ size: [1.5, 0.3, 4.5], at: [10.75, 0, 10.75], mat: "deck", reveal: st(0.06, 0.16), mode: "grow" });
  add({ size: [11, 0.02, 4.5], at: [4.5, -0.6, 10.75], mat: "poolFloor", reveal: st(0, 0.1), mode: "static" });
  add({ size: [11, 0.04, 4.5], at: [4.5, 0.2, 10.75], mat: "water", reveal: mt(0.3, 0.6), mode: "pop", shadow: false });

  // Entry path
  add({ size: [2.4, 0.06, 9], at: [-2.6, 0, 11.6], mat: "path", reveal: st(0.08, 0.18), mode: "grow" });

  // ---------- Interior: living room ----------
  const I = st(0.86, 1);
  add({ size: [4.6, 0.02, 3.3], at: [4.2, 0.48, 0.6], mat: "rug", reveal: I, mode: "pop" });
  add({ size: [3.8, 0.42, 1.0], at: [4.2, 0.48, -1.25], mat: "fabric", reveal: I, mode: "pop" });
  add({ size: [3.8, 0.5, 0.26], at: [4.2, 0.9, -1.62], mat: "fabric", reveal: I, mode: "pop" });
  add({ size: [1.0, 0.42, 2.2], at: [6.6, 0.48, -0.25], mat: "fabric", reveal: I, mode: "pop" });
  add({ size: [1.5, 0.34, 0.85], at: [4.2, 0.48, 0.75], mat: "stone", reveal: I, mode: "pop" });
  add({ size: [0.9, 0.78, 0.9], at: [1.5, 0.48, 0.9], mat: "fabricDark", reveal: I, mode: "pop" });
  add({ size: [2.4, 0.06, 1.0], at: [0.6, 1.2, -3.0], mat: "wood", reveal: I, mode: "pop" });
  add({ size: [0.1, 0.72, 0.8], at: [-0.4, 0.48, -3.0], mat: "bronze", reveal: I, mode: "pop" });
  add({ size: [0.1, 0.72, 0.8], at: [1.6, 0.48, -3.0], mat: "bronze", reveal: I, mode: "pop" });
  // timber feature wall + LED cove
  add({ size: [6.6, 3.2, 0.06], at: [4.3, 0.48, -4.67], mat: "wood", reveal: I, mode: "grow" });
  add({ size: [6.6, 0.04, 0.1], at: [4.3, 3.72, -4.6], mat: "led", reveal: I, mode: "grow", shadow: false });
  // linear pendant
  add({ size: [3.0, 0.05, 0.14], at: [4.2, 3.2, 0.5], mat: "led", reveal: I, mode: "pop", shadow: false });
  add({ size: [0.01, 0.8, 0.01], at: [3.0, 3.25, 0.5], mat: "bronze", reveal: I, mode: "pop" });
  add({ size: [0.01, 0.8, 0.01], at: [5.4, 3.25, 0.5], mat: "bronze", reveal: I, mode: "pop" });

  return parts;
}

/* ---------------- blueprint lines ---------------- */

type Rect = [number, number, number, number]; // x0, z0, x1, z1

function rectSegments(r: Rect, out: number[], y = 0.03) {
  const [x0, z0, x1, z1] = r;
  out.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
}

function blueprintGeometry() {
  const primary: number[] = [];
  const secondary: number[] = [];
  const rects: Rect[] = [
    [-10, -7, 10, 7], // plinth
    [-9, -6, -1, 4], // service block
    [-1, -5, 9, 5], // living pavilion
    [-0.85, -4.85, 8.85, -4.55], // back wall
    [-1, 8.5, 10, 13], // pool
    [-2.5, 7, 11.5, 14.2], // deck
    [-3.8, 7, -1.4, 16.1], // path
    [2.0, -1.75, 7.1, -0.75], // sofa
    [3.45, 0.32, 4.95, 1.17], // table
    [1.9, -2.3, 3.3, 3.5], // living zone
    [-7, -4.5, 7.5, 6.5], // upper volume (dashed in drawings)
  ];
  rects.forEach((r, i) => rectSegments(r, i === rects.length - 1 ? secondary : primary));

  // columns
  for (const [x, z] of [
    [-0.85, 6.7],
    [3, 6.7],
    [8.7, 6.7],
    [8.7, -4.6],
    [-0.85, -4.6],
  ] as Array<[number, number]>) {
    rectSegments([x - 0.14, z - 0.14, x + 0.14, z + 0.14], primary);
  }

  // door swing
  const cx = -1.9;
  const cz = 4.0;
  for (let a = 0; a < 12; a++) {
    const t0 = (a / 12) * (Math.PI / 2);
    const t1 = ((a + 1) / 12) * (Math.PI / 2);
    primary.push(cx - Math.cos(t0) * 1.4, 0.03, cz + Math.sin(t0) * 1.4, cx - Math.cos(t1) * 1.4, 0.03, cz + Math.sin(t1) * 1.4);
  }

  // dimension lines with ticks
  const dim = (x0: number, z0: number, x1: number, z1: number) => {
    secondary.push(x0, 0.03, z0, x1, 0.03, z1);
    const horizontal = z0 === z1;
    const t = 0.45;
    if (horizontal) {
      secondary.push(x0, 0.03, z0 - t, x0, 0.03, z0 + t, x1, 0.03, z1 - t, x1, 0.03, z1 + t);
    } else {
      secondary.push(x0 - t, 0.03, z0, x0 + t, 0.03, z0, x1 - t, 0.03, z1, x1 + t, 0.03, z1);
    }
  };
  dim(-10, 17.5, 10, 17.5);
  dim(-10, 18.8, 11.5, 18.8);
  dim(-13, -7, -13, 7);
  dim(-14.3, -7, -14.3, 14.2);

  // structural grid axes
  for (const x of [-0.85, 3, 8.7]) secondary.push(x, 0.03, -10, x, 0.03, 16);
  for (const z of [-4.6, 6.7]) secondary.push(-13, 0.03, z, 14, 0.03, z);

  const make = (arr: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  };
  return { primary: make(primary), secondary: make(secondary) };
}

function paperGrid() {
  const minor: number[] = [];
  const major: number[] = [];
  const extent = 70;
  for (let v = -extent; v <= extent; v += 2) {
    const arr = v % 10 === 0 ? major : minor;
    arr.push(v, 0.012, -extent, v, 0.012, extent, -extent, 0.012, v, extent, 0.012, v);
  }
  const make = (arr: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  };
  return { minor: make(minor), major: make(major) };
}

/* ---------------- sky ---------------- */

function createSky() {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    uniforms: {
      uPaper: { value: COLORS.paper.clone() },
      uTop: { value: COLORS.duskTop.clone() },
      uHorizon: { value: COLORS.duskHorizon.clone() },
      uBottom: { value: COLORS.duskBottom.clone() },
      uMix: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uPaper; uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uBottom; uniform float uMix;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 sky = mix(uHorizon, uTop, smoothstep(0.0, 0.42, h));
        sky = mix(sky, uBottom, smoothstep(0.0, -0.08, h));
        gl_FragColor = vec4(mix(uPaper, sky, uMix), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(190, 32, 16), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return { mesh, material };
}

/* ---------------- trees ---------------- */

function treeGeometries() {
  const trunk = new THREE.CylinderGeometry(0.1, 0.16, 2.4, 7);
  trunk.translate(0, 1.2, 0);
  const canopy = new THREE.IcosahedronGeometry(1, 1);
  return { trunk, canopy };
}

const TREES: Array<{ x: number; z: number; s: number; tall?: boolean }> = [
  { x: -15, z: -3, s: 1.25 },
  { x: -13.5, z: 7.5, s: 1.0 },
  { x: -17, z: 3, s: 0.9, tall: true },
  { x: 14.5, z: -5, s: 1.3 },
  { x: 15.5, z: 4, s: 1.0, tall: true },
  { x: -6, z: -11, s: 1.15 },
  { x: 5, z: -12, s: 1.35 },
  { x: 14, z: 13, s: 0.95 },
  { x: -9, z: 15, s: 0.85, tall: true },
];

/* ---------------- build ---------------- */

export function buildHouse(quality: "high" | "low"): HouseRig {
  const root = new THREE.Group();
  root.name = "residence";
  const textures = createTextures(quality);

  // Clipping planes for the clay → finished material sweep.
  const finishPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
  const clayPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);

  const std = (params: THREE.MeshStandardMaterialParameters) =>
    new THREE.MeshStandardMaterial({ ...params, clippingPlanes: [finishPlane] });

  const finished: Record<MatKey, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial> = {
    concrete: std({ map: textures.concrete, roughness: 0.88, color: "#ffffff" }),
    stone: std({ map: textures.stone, roughness: 0.82, color: "#ffffff" }),
    wood: std({ map: textures.wood, roughness: 0.62, color: "#ffffff" }),
    plaster: std({ color: "#eef0f3", roughness: 0.92 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#a9bcc0",
      roughness: 0.04,
      metalness: 0.1,
      transparent: true,
      opacity: 0.26,
      envMapIntensity: 1.6,
      clippingPlanes: [finishPlane],
      depthWrite: false,
    }),
    glassWarm: new THREE.MeshPhysicalMaterial({
      color: "#8d9a9c",
      roughness: 0.06,
      metalness: 0.2,
      emissive: new THREE.Color("#ffb46b"),
      emissiveIntensity: 0,
      envMapIntensity: 1.4,
      clippingPlanes: [finishPlane],
    }),
    bronze: std({ color: "#3a3129", metalness: 0.75, roughness: 0.38 }),
    marble: std({ map: textures.marble, roughness: 0.22, color: "#ffffff" }),
    water: std({
      color: "#2c6a73",
      roughness: 0.04,
      metalness: 0.35,
      emissive: new THREE.Color("#1a7684"),
      emissiveIntensity: 0,
    }),
    lawn: std({ color: "#5d6a43", roughness: 1 }),
    foliage: std({ color: "#3f5636", roughness: 0.95, flatShading: true }),
    trunk: std({ color: "#4a3a2c", roughness: 1 }),
    fabric: std({ color: "#d8cdbb", roughness: 0.96 }),
    fabricDark: std({ color: "#7b6a58", roughness: 0.9 }),
    rug: std({ color: "#b5a387", roughness: 1 }),
    led: std({ color: "#fff1dc", emissive: new THREE.Color("#ffcf95"), emissiveIntensity: 0, roughness: 0.5 }),
    deck: std({ map: textures.stone, color: "#efe7da", roughness: 0.85 }),
    poolFloor: std({ color: "#3d8d96", roughness: 0.6 }),
    path: std({ map: textures.stone, color: "#f3ece1", roughness: 0.9 }),
  };

  const clay = new THREE.MeshStandardMaterial({ color: "#f1f2f4", roughness: 0.92, clippingPlanes: [clayPlane] });
  const clayGlass = new THREE.MeshStandardMaterial({
    color: "#f5f7fa",
    roughness: 0.3,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    clippingPlanes: [clayPlane],
  });

  const geometries: THREE.BufferGeometry[] = [];
  const parts: Part[] = [];

  const pair = (group: THREE.Group, geo: THREE.BufferGeometry, mat: MatKey, shadow: boolean) => {
    const isGlass = mat === "glass" || mat === "glassWarm";
    const clayMesh = new THREE.Mesh(geo, isGlass ? clayGlass : clay);
    const finalMesh = new THREE.Mesh(geo, finished[mat]);
    for (const m of [clayMesh, finalMesh]) {
      m.castShadow = shadow;
      m.receiveShadow = true;
      group.add(m);
    }
  };

  for (const def of residence()) {
    const [w, h, d] = def.size;
    const geo = box(w, h, d, TILE[def.mat] ?? 1);
    geometries.push(geo);
    const group = new THREE.Group();
    group.position.set(def.at[0], def.at[1], def.at[2]);
    pair(group, geo, def.mat, def.shadow ?? true);
    root.add(group);
    parts.push({ group, baseY: def.at[1], reveal: def.reveal, mode: def.mode });
  }

  // Trees — appear with the landscape during the material phase.
  const { trunk, canopy } = treeGeometries();
  geometries.push(trunk, canopy);
  const M = PHASE.materials;
  TREES.forEach((t, i) => {
    const group = new THREE.Group();
    group.position.set(t.x, 0, t.z);
    pair(group, trunk, "trunk", true);
    const blobs = t.tall
      ? [
          [0, 3.0, 0, 0.9, 1.8],
          [0, 4.6, 0, 0.7, 1.4],
        ]
      : [
          [0, 3.1, 0, 1.6, 1.15],
          [0.8, 3.6, 0.3, 1.1, 0.9],
          [-0.7, 3.8, -0.4, 1.2, 0.95],
        ];
    for (const [x, y, z, r, sy] of blobs) {
      const sub = new THREE.Group();
      sub.position.set(x, y, z);
      sub.scale.set(r, r * sy, r);
      pair(sub, canopy, "foliage", true);
      group.add(sub);
    }
    group.scale.setScalar(t.s);
    group.rotation.y = i * 1.7;
    root.add(group);
    const s0 = M[0] + (M[1] - M[0]) * (0.05 + (i % 5) * 0.06);
    parts.push({ group, baseY: 0, reveal: [s0, s0 + 0.06], mode: "pop" });
    group.userData.targetScale = t.s;
  });

  // Ground — paper in the drawing phase, lawn once finished.
  const groundGeo = new THREE.PlaneGeometry(400, 400);
  groundGeo.rotateX(-Math.PI / 2);
  geometries.push(groundGeo);
  const groundClayMat = new THREE.MeshStandardMaterial({
    color: "#f7f8fa",
    roughness: 1,
    emissive: new THREE.Color("#f7f8fa"),
    emissiveIntensity: 0.35,
    clippingPlanes: [clayPlane],
  });
  const groundClay = new THREE.Mesh(groundGeo, groundClayMat);
  const groundLawn = new THREE.Mesh(groundGeo, finished.lawn);
  groundClay.receiveShadow = groundLawn.receiveShadow = true;
  groundClay.position.y = groundLawn.position.y = -0.001;
  root.add(groundClay, groundLawn);

  // Blueprint lines + paper grid
  const bp = blueprintGeometry();
  const grid = paperGrid();
  geometries.push(bp.primary, bp.secondary, grid.minor, grid.major);
  const ink = new THREE.LineBasicMaterial({ color: "#13294f", transparent: true, opacity: 0.9, depthWrite: false });
  const inkLight = new THREE.LineBasicMaterial({ color: "#13294f", transparent: true, opacity: 0.4, depthWrite: false });
  const gridMinorMat = new THREE.LineBasicMaterial({ color: "#0c1d3a", transparent: true, opacity: 0.06, depthWrite: false });
  const gridMajorMat = new THREE.LineBasicMaterial({ color: "#0c1d3a", transparent: true, opacity: 0.12, depthWrite: false });
  const bpPrimary = new THREE.LineSegments(bp.primary, ink);
  const bpSecondary = new THREE.LineSegments(bp.secondary, inkLight);
  const gridMinor = new THREE.LineSegments(grid.minor, gridMinorMat);
  const gridMajor = new THREE.LineSegments(grid.major, gridMajorMat);
  for (const l of [bpPrimary, bpSecondary, gridMinor, gridMajor]) {
    l.renderOrder = 2;
    root.add(l);
  }
  const primaryCount = bp.primary.getAttribute("position").count;
  const secondaryCount = bp.secondary.getAttribute("position").count;

  // Sky
  const sky = createSky();
  root.add(sky.mesh);

  // Lights
  const hemi = new THREE.HemisphereLight("#fffaf0", "#bdb3a2", 1.5);
  const sun = new THREE.DirectionalLight("#fff6e8", 2.6);
  sun.position.set(-18, 30, 16);
  sun.castShadow = true;
  const shadowSize = quality === "high" ? 2048 : 1024;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.left = -26;
  sun.shadow.camera.right = 26;
  sun.shadow.camera.top = 26;
  sun.shadow.camera.bottom = -26;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 110;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.target.position.set(1, 0, 2);
  root.add(hemi, sun, sun.target);

  const warmA = new THREE.PointLight("#ffbf80", 0, 14, 2);
  warmA.position.set(4.2, 3.0, 0.4);
  const warmB = new THREE.PointLight("#ffc890", 0, 12, 2);
  warmB.position.set(1.0, 2.8, -2.8);
  const warmC = new THREE.PointLight("#ffc890", 0, 12, 2);
  warmC.position.set(6.5, 2.6, -3.6);
  const soffit = new THREE.PointLight("#ffbf86", 0, 16, 2);
  soffit.position.set(3, 3.6, 6.3);
  const pool = new THREE.PointLight("#5fd0de", 0, 10, 2);
  pool.position.set(4.5, -0.2, 10.7);
  const upper = new THREE.PointLight("#ffb46b", 0, 12, 2);
  upper.position.set(1.5, 5.8, 4.8);
  root.add(warmA, warmB, warmC, soffit, pool, upper);

  const sunDay = new THREE.Vector3(-18, 30, 16);
  const sunDusk = new THREE.Vector3(-34, 8, 6);
  const sunColorDay = new THREE.Color("#fff6e8");
  const sunColorDusk = new THREE.Color("#ff9d5c");
  const hemiSkyDay = new THREE.Color("#fffaf0");
  const hemiSkyDusk = new THREE.Color("#47506a");
  const hemiGroundDay = new THREE.Color("#bdb3a2");
  const hemiGroundDusk = new THREE.Color("#2a241d");
  const tmpColor = new THREE.Color();
  const fogColor = new THREE.Color();
  const fog = new THREE.Fog(COLORS.paper.clone(), 70, 185);

  let lastP = -1;

  const update = (p: number, scene: THREE.Scene) => {
    if (scene.fog !== fog) scene.fog = fog;
    if (p === lastP) return;
    lastP = p;

    // --- blueprint drawing + fade ---
    const draw = easeInOutCubic(range(p, 0.005, PHASE.blueprint[1] * 0.92));
    bp.primary.setDrawRange(0, Math.floor((primaryCount * draw) / 2) * 2);
    bp.secondary.setDrawRange(0, Math.floor((secondaryCount * clamp(draw * 1.15 - 0.15)) / 2) * 2);
    const bpFade = 1 - range(p, PHASE.blueprintFade[0], PHASE.blueprintFade[1]);
    ink.opacity = 0.9 * bpFade;
    inkLight.opacity = 0.4 * bpFade;
    const gridFade = 1 - range(p, PHASE.materials[0] - 0.02, PHASE.materials[0] + 0.06);
    gridMinorMat.opacity = 0.06 * gridFade;
    gridMajorMat.opacity = 0.12 * gridFade;
    bpPrimary.visible = bpSecondary.visible = bpFade > 0.001;
    gridMinor.visible = gridMajor.visible = gridFade > 0.001;

    // --- parts ---
    for (const part of parts) {
      const raw = range(p, part.reveal[0], part.reveal[1]);
      const t = easeOutCubic(raw);
      const g = part.group;
      g.visible = raw > 0;
      if (!g.visible) continue;
      switch (part.mode) {
        case "grow":
          g.scale.y = Math.max(t, 0.0001);
          break;
        case "drop":
          g.position.y = part.baseY + (1 - t) * 5;
          break;
        case "pop": {
          const target = (g.userData.targetScale as number | undefined) ?? 1;
          g.scale.setScalar(Math.max(t, 0.0001) * target);
          break;
        }
        default:
          break;
      }
    }

    // --- material sweep (clipping height rises through the building) ---
    const sweep = easeInOutCubic(range(p, PHASE.materials[0], PHASE.materials[1]));
    const h = -0.6 + sweep * 9.4;
    finishPlane.constant = h;
    clayPlane.constant = -h;

    // --- day → dusk ---
    const dusk = easeInOutCubic(range(p, PHASE.dusk[0], PHASE.dusk[1]));
    sky.material.uniforms.uMix.value = dusk;
    fogColor.copy(COLORS.paper).lerp(COLORS.fogDusk, dusk);
    fog.color.copy(fogColor);
    fog.near = 70 - dusk * 20;
    sun.position.lerpVectors(sunDay, sunDusk, dusk);
    sun.color.copy(sunColorDay).lerp(sunColorDusk, dusk);
    sun.intensity = 2.6 - dusk * 1.75;
    hemi.color.copy(hemiSkyDay).lerp(hemiSkyDusk, dusk);
    hemi.groundColor.copy(hemiGroundDay).lerp(hemiGroundDusk, dusk);
    hemi.intensity = 1.5 - dusk * 1.05;
    groundClayMat.emissiveIntensity = 0.35 * (1 - dusk);

    // interior + exterior lights switch on as dusk falls
    const lights = easeOutCubic(range(p, PHASE.dusk[0] + 0.04, PHASE.dusk[1] + 0.02));
    const inside = range(p, PHASE.enter[0] + 0.04, PHASE.enter[1]);
    (finished.led as THREE.MeshStandardMaterial).emissiveIntensity = lights * 3.2;
    (finished.glassWarm as THREE.MeshPhysicalMaterial).emissiveIntensity = lights * 0.85;
    (finished.water as THREE.MeshStandardMaterial).emissiveIntensity = lights * 0.7;
    warmA.intensity = lights * (14 + inside * 10);
    warmB.intensity = lights * (8 + inside * 6);
    warmC.intensity = lights * (8 + inside * 6);
    soffit.intensity = lights * 16;
    pool.intensity = lights * 6;
    upper.intensity = lights * 10;

    tmpColor.set(0, 0, 0); // keep allocation-free
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    sky.mesh.geometry.dispose();
    sky.material.dispose();
    Object.values(finished).forEach((m) => m.dispose());
    clay.dispose();
    clayGlass.dispose();
    groundClayMat.dispose();
    [ink, inkLight, gridMinorMat, gridMajorMat].forEach((m) => m.dispose());
    textures.dispose();
    sun.shadow.map?.dispose();
    root.clear();
  };

  return { root, update, dispose };
}
