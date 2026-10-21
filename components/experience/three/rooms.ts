import * as THREE from "three";
import { box, cyl, place, rbox, type MatKey, type Materials } from "./kit";
import { TILE } from "./textures";

/**
 * Furnished interior sets for the "room by room" chapter: a modular kitchen,
 * a master bedroom and a home office. Each set is a complete room shell with
 * a garden window, built far from the villa so the camera can cut between them.
 */

export type RoomId = "kitchen" | "bedroom" | "office";

export interface CameraMove {
  from: [number, number, number];
  to: [number, number, number];
  lookFrom: [number, number, number];
  lookTo: [number, number, number];
}

export interface RoomSet {
  id: RoomId;
  group: THREE.Group;
  lights: THREE.Light[];
  move: CameraMove;
}

export interface RoomsRig {
  sets: Record<RoomId, RoomSet>;
  dispose: () => void;
}

const W = 7;
const D = 6;
const H = 3.1;

export function buildRooms(mats: Materials): RoomsRig {
  const geos: THREE.BufferGeometry[] = [];
  const extraMats: THREE.Material[] = [];
  const shadowLights: THREE.SpotLight[] = [];
  let seed = 98765;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const make = (id: RoomId, origin: [number, number, number], windowSide: "left" | "right") => {
    const group = new THREE.Group();
    group.name = `room-${id}`;
    group.position.set(...origin);
    group.visible = false;
    const lights: THREE.Light[] = [];

    const put = (
      geo: THREE.BufferGeometry,
      mat: MatKey,
      x: number,
      y: number,
      z: number,
      o: { ry?: number; rx?: number; cast?: boolean } = {},
    ) => {
      geos.push(geo);
      const m = place(geo, mats[mat], x, y, z, { ry: o.ry, rx: o.rx, cast: o.cast ?? true });
      group.add(m);
      return m;
    };

    // ---- shell ----
    put(box(W, 0.02, D, TILE.oak), "oak", 0, 0, 0, { cast: false });
    put(box(W + 0.3, 0.08, D, TILE.plaster), "plasterInt", 0, H, 0, { cast: false });
    put(box(W + 0.3, H, 0.15, TILE.plaster), "plasterInt", 0, 0, -D / 2 - 0.075);
    const solidX = windowSide === "left" ? W / 2 + 0.075 : -W / 2 - 0.075;
    put(box(0.15, H, D, TILE.plaster), "plasterInt", solidX, 0, 0);
    const wx = windowSide === "left" ? -W / 2 - 0.075 : W / 2 + 0.075;
    const [z0, z1, y0, y1] = [-1.6, 1.4, 0.75, 2.75];
    put(box(0.15, y0, D, TILE.plaster), "plasterInt", wx, 0, 0);
    put(box(0.15, H - y1, D, TILE.plaster), "plasterInt", wx, y1, 0);
    put(box(0.15, y1 - y0, z0 + D / 2, TILE.plaster), "plasterInt", wx, y0, (-D / 2 + z0) / 2);
    put(box(0.15, y1 - y0, D / 2 - z1, TILE.plaster), "plasterInt", wx, y0, (z1 + D / 2) / 2);
    put(box(0.02, y1 - y0, z1 - z0), "glass", wx, y0, (z0 + z1) / 2, { cast: false });
    put(box(0.08, 0.05, z1 - z0), "bronze", wx, y0, (z0 + z1) / 2);
    put(box(0.08, 0.05, z1 - z0), "bronze", wx, y1 - 0.05, (z0 + z1) / 2);
    put(box(0.08, y1 - y0, 0.05), "bronze", wx, y0, (z0 + z1) / 2);
    const viewGeo = new THREE.PlaneGeometry(16, 8);
    const view = put(viewGeo, "view", wx + (windowSide === "left" ? -4 : 4), 1.8, 0, {
      ry: windowSide === "left" ? Math.PI / 2 : -Math.PI / 2,
      cast: false,
    });
    view.receiveShadow = false;
    // skirting
    put(box(W, 0.08, 0.02), "plasterInt", 0, 0, -D / 2 + 0.01, { cast: false });
    // recessed downlights
    for (const [dx, dz] of [
      [-2, -1.5],
      [2, -1.5],
      [-2, 1.5],
      [2, 1.5],
    ]) {
      put(cyl(0.06, 0.06, 0.01, 16), "led", dx, H - 0.011, dz, { cast: false });
    }

    const point = (color: string, intensity: number, distance: number, x: number, y: number, z: number) => {
      const l = new THREE.PointLight(color, intensity, distance, 2);
      l.position.set(x, y, z);
      l.userData.base = intensity;
      group.add(l);
      lights.push(l);
      return l;
    };
    const spot = (intensity: number, from: [number, number, number], to: [number, number, number]) => {
      const s = new THREE.SpotLight("#ffe2bd", intensity, 12, 0.95, 0.75, 2);
      s.position.set(...from);
      s.target.position.set(...to);
      s.castShadow = true;
      s.shadow.mapSize.set(768, 768);
      s.shadow.bias = -0.0005;
      s.shadow.normalBias = 0.02;
      s.userData.base = intensity;
      group.add(s, s.target);
      lights.push(s);
      shadowLights.push(s);
      return s;
    };
    const hemi = new THREE.HemisphereLight("#ffe9d2", "#3b3027", 0.35);
    hemi.userData.base = 0.35;
    group.add(hemi);
    lights.push(hemi);

    return { group, lights, put, point, spot };
  };

  /* =========================== KITCHEN =========================== */
  const kitchen = (() => {
    const r = make("kitchen", [300, 0, 0], "left");
    const { put } = r;
    const backZ = -D / 2 + 0.3;
    // base run
    put(box(4.9, 0.1, 0.55), "blackGloss", -0.75, 0, backZ + 0.02, { cast: false });
    put(rbox(4.9, 0.76, 0.6, 0.008), "navyMatte", -0.75, 0.1, backZ);
    for (let i = 0; i <= 8; i++)
      put(box(0.006, 0.74, 0.01), "blackGloss", -3.2 + i * 0.6125, 0.11, backZ + 0.302, { cast: false });
    for (let i = 0; i < 8; i++) put(box(0.32, 0.016, 0.025), "brass", -2.9 + i * 0.6125, 0.78, backZ + 0.31);
    put(box(4.96, 0.04, 0.66), "quartz", -0.75, 0.86, backZ + 0.02);
    put(box(4.9, 0.68, 0.02), "marble", -0.75, 0.9, -D / 2 + 0.01, { cast: false });
    // hob + sink
    put(box(0.7, 0.012, 0.5), "blackGloss", -0.9, 0.9, backZ, { cast: false });
    put(box(0.62, 0.012, 0.42), "steel", 0.9, 0.9, backZ, { cast: false });
    put(cyl(0.012, 0.012, 0.35, 8), "steel", 0.9, 0.9, backZ - 0.2);
    // wall units with LED under-glow, hood in between
    put(rbox(1.95, 0.72, 0.35, 0.008), "oak", -2.25, 1.62, -D / 2 + 0.18);
    put(rbox(1.95, 0.72, 0.35, 0.008), "oak", 0.75, 1.62, -D / 2 + 0.18);
    put(box(1.95, 0.015, 0.04), "led", -2.25, 1.6, -D / 2 + 0.32, { cast: false });
    put(box(1.95, 0.015, 0.04), "led", 0.75, 1.6, -D / 2 + 0.32, { cast: false });
    put(rbox(0.9, 0.18, 0.5, 0.01), "steel", -0.75, 1.62, -D / 2 + 0.25);
    put(box(0.32, H - 1.8, 0.3), "steel", -0.75, 1.8, -D / 2 + 0.17);
    // tall units with oven + microwave
    put(rbox(1.5, 2.35, 0.62, 0.008), "navyMatte", 2.45, 0.1, backZ);
    put(box(0.6, 0.6, 0.02), "blackGloss", 2.1, 0.95, backZ + 0.31, { cast: false });
    put(box(0.6, 0.38, 0.02), "blackGloss", 2.1, 1.65, backZ + 0.31, { cast: false });
    put(box(0.008, 2.3, 0.01), "blackGloss", 2.45, 0.12, backZ + 0.315, { cast: false });
    put(box(0.02, 0.9, 0.025), "brass", 2.75, 1.0, backZ + 0.33);
    // island with waterfall quartz top
    put(rbox(2.7, 0.86, 1.0, 0.01), "navyMatte", 0, 0, 0.3);
    put(box(2.86, 0.05, 1.12, TILE.marble), "quartz", 0, 0.86, 0.3);
    put(box(0.05, 0.86, 1.12), "quartz", -1.43, 0, 0.3);
    put(box(0.05, 0.86, 1.12), "quartz", 1.43, 0, 0.3);
    put(cyl(0.18, 0.18, 0.04, 24), "brass", 0.6, 0.91, 0.25);
    // stools
    for (const x of [-0.8, 0, 0.8]) {
      put(cyl(0.2, 0.2, 0.025, 24), "bronze", x, 0, 1.2);
      put(cyl(0.025, 0.025, 0.65, 10), "bronze", x, 0.02, 1.2);
      put(rbox(0.42, 0.07, 0.42, 0.03), "fabricCharcoal", x, 0.66, 1.2);
      put(rbox(0.42, 0.25, 0.05, 0.02), "fabricCharcoal", x, 0.73, 1.42);
    }
    // pendants
    for (const x of [-0.75, 0, 0.75]) {
      put(new THREE.SphereGeometry(0.13, 24, 16), "lampShade", x, 2.15, 0.3, { cast: false });
      put(cyl(0.004, 0.004, H - 2.15, 4), "bronze", x, 2.15, 0.3, { cast: false });
      r.point("#ffcf93", 3.5, 6, x, 2.0, 0.3);
    }
    // plant + bowls
    put(cyl(0.12, 0.09, 0.22, 16), "pot", -2.6, 0.9, backZ);
    put(new THREE.SphereGeometry(0.2, 16, 12), "foliage", -2.6, 1.22, backZ);
    r.point("#ffd2a0", 3, 5, -0.75, 1.5, -2.2);
    r.spot(22, [0.6, H - 0.05, 2.2], [-0.2, 0.6, -0.8]);
    return {
      ...r,
      move: { from: [2.7, 1.7, 2.9], to: [1.5, 1.55, 2.2], lookFrom: [-0.6, 1.0, -1.4], lookTo: [-1.0, 1.0, -1.7] } as CameraMove,
    };
  })();

  /* =========================== BEDROOM =========================== */
  const bedroom = (() => {
    const r = make("bedroom", [340, 0, 0], "left");
    const { put } = r;
    const wall = -D / 2;
    // teak slat feature wall + upholstered headboard + cove
    for (let x = -2.3; x <= 2.3; x += 0.12) put(box(0.07, H - 0.02, 0.05, TILE.teak), "teak", x, 0, wall + 0.03);
    for (const x of [-0.72, 0, 0.72]) put(rbox(0.68, 1.15, 0.12, 0.05), "fabricNavy", x, 0.45, wall + 0.12);
    put(box(4.7, 0.02, 0.05), "led", 0, H - 0.08, wall + 0.12, { cast: false });
    // bed
    const bz = wall + 0.2 + 1.15;
    put(rbox(2.15, 0.3, 2.3, 0.04), "teak", 0, 0, bz);
    put(rbox(2.0, 0.26, 2.1, 0.08), "fabricWhite", 0, 0.3, bz + 0.05);
    put(rbox(2.1, 0.08, 1.55, 0.06), "fabricCream", 0, 0.54, bz + 0.32);
    put(rbox(2.14, 0.04, 0.55, 0.03), "fabricNavy", 0, 0.6, bz + 0.78);
    put(box(2.14, 0.012, 0.04), "brass", 0, 0.63, bz + 0.62, { cast: false });
    for (const x of [-0.5, 0.5]) put(rbox(0.75, 0.2, 0.42, 0.09), "fabricWhite", x, 0.54, bz - 0.78, { rx: -0.25 });
    for (const x of [-0.42, 0.42]) put(rbox(0.5, 0.16, 0.3, 0.07), "fabricSage", x, 0.56, bz - 0.5, { rx: -0.2 });
    // side tables + lamps
    for (const s of [-1, 1]) {
      put(rbox(0.5, 0.5, 0.42, 0.02), "teak", s * 1.45, 0, wall + 0.4);
      put(cyl(0.05, 0.08, 0.3, 16), "brass", s * 1.45, 0.5, wall + 0.4);
      put(cyl(0.15, 0.18, 0.25, 28), "lampShade", s * 1.45, 0.78, wall + 0.4, { cast: false });
      r.point("#ffc884", 2.6, 4, s * 1.45, 0.95, wall + 0.55);
    }
    // bench + rug
    put(rbox(1.5, 0.42, 0.45, 0.05), "fabricSage", 0, 0, bz + 1.5);
    put(rbox(3.4, 0.02, 3.2, 0.01), "rug", 0, 0.02, bz + 0.6, { cast: false });
    // wardrobe
    put(rbox(0.62, 2.7, 3.4, 0.01), "oak", W / 2 - 0.33, 0, -0.9);
    for (let i = 1; i < 4; i++) put(box(0.01, 2.6, 0.006), "blackGloss", W / 2 - 0.64, 0.05, -2.6 + i * 0.85, { cast: false });
    for (let i = 0; i < 4; i++) put(box(0.02, 0.6, 0.02), "brass", W / 2 - 0.66, 1.0, -2.6 + i * 0.85 + (i % 2 ? 0.08 : 0.77));
    // sheer curtain beside the window
    const cg = new THREE.PlaneGeometry(1.5, 2.9, 48, 1);
    const cp = cg.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < cp.count; i++) cp.setZ(i, Math.sin(cp.getX(i) * 14) * 0.05);
    cg.computeVertexNormals();
    cg.translate(0, 1.45, 0);
    put(cg, "sheer", -W / 2 + 0.2, 0.1, -2.1, { ry: Math.PI / 2, cast: false });
    // pendant + plant
    put(cyl(0.2, 0.2, 0.25, 24), "lampShade", 1.9, H - 0.75, 1.6, { cast: false });
    put(cyl(0.005, 0.005, 0.5, 4), "bronze", 1.9, H - 0.5, 1.6, { cast: false });
    put(cyl(0.22, 0.18, 0.5, 20), "pot", -2.9, 0, 1.6);
    put(new THREE.SphereGeometry(0.42, 20, 14), "foliage", -2.9, 0.95, 1.6);
    r.spot(18, [0.4, H - 0.05, 1.8], [0, 0.4, -1.4]);
    r.point("#ffd4a8", 2, 6, 1.9, 2.1, 1.6);
    return {
      ...r,
      move: {
        from: [2.5, 1.6, 2.7],
        to: [1.4, 1.45, 1.9],
        lookFrom: [-0.3, 0.7, -1.6],
        lookTo: [-0.1, 0.75, -1.8],
      } as CameraMove,
    };
  })();

  /* =========================== OFFICE =========================== */
  const office = (() => {
    const r = make("office", [380, 0, 0], "right");
    const { put } = r;
    const wall = -D / 2;
    // bookshelf wall
    const bays = 6;
    const bw = 1.05;
    const x0 = -(bays * bw) / 2;
    put(box(bays * bw + 0.06, H - 0.1, 0.03, TILE.teak), "teak", 0, 0, wall + 0.02, { cast: false });
    for (let i = 0; i <= bays; i++) put(box(0.03, H - 0.1, 0.34), "teak", x0 + i * bw, 0, wall + 0.19);
    const shelfY = [0.08, 0.6, 1.1, 1.6, 2.1, 2.6];
    for (const y of shelfY) put(box(bays * bw, 0.03, 0.34), "teak", 0, y, wall + 0.19);
    // books (instanced)
    const bookGeo = box(1, 1, 1);
    geos.push(bookGeo);
    const bookMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
    extraMats.push(bookMat);
    const palette = ["#1d3157", "#efe7da", "#8a3b2a", "#5b6b48", "#c9a24d", "#3c3c40", "#b9aa90", "#2b4a6f"];
    const books = new THREE.InstancedMesh(bookGeo, bookMat, 600);
    const mtx = new THREE.Matrix4();
    const col = new THREE.Color();
    let n = 0;
    for (let bay = 0; bay < bays; bay++) {
      for (let s = 0; s < shelfY.length - 1; s++) {
        if ((bay + s) % 4 === 3) continue; // leave room for objects
        let x = x0 + bay * bw + 0.05;
        const end = x0 + (bay + 1) * bw - 0.05 - rand() * 0.35;
        while (x < end && n < 600) {
          const w = 0.025 + rand() * 0.035;
          const h = 0.24 + rand() * 0.14;
          mtx.compose(
            new THREE.Vector3(x + w / 2, shelfY[s] + 0.03, wall + 0.2),
            new THREE.Quaternion(),
            new THREE.Vector3(w, h, 0.2 + rand() * 0.05),
          );
          books.setMatrixAt(n, mtx);
          books.setColorAt(n, col.set(palette[Math.floor(rand() * palette.length)]));
          n++;
          x += w + 0.003;
        }
      }
    }
    books.count = n;
    books.castShadow = books.receiveShadow = true;
    r.group.add(books);
    for (const [bx, s] of [
      [3, 3],
      [0, 3],
      [4, 2],
    ]) {
      put(cyl(0.08, 0.1, 0.22, 16), "brass", x0 + bx * bw + 0.5, shelfY[s] + 0.03, wall + 0.2);
    }
    // desk
    put(rbox(2.0, 0.05, 0.85, 0.01), "teak", 0, 0.72, -0.6);
    put(box(0.05, 0.72, 0.75), "bronze", -0.9, 0, -0.6);
    put(box(0.05, 0.72, 0.75), "bronze", 0.9, 0, -0.6);
    put(rbox(0.8, 0.46, 0.03, 0.01), "blackGloss", 0.1, 0.98, -0.85, { ry: Math.PI });
    put(box(0.76, 0.42, 0.005), "screen", 0.1, 1.0, -0.87, { cast: false });
    put(box(0.06, 0.22, 0.04), "steel", 0.1, 0.77, -0.83);
    put(rbox(0.34, 0.012, 0.24, 0.005), "steel", -0.55, 0.77, -0.6);
    put(rbox(0.34, 0.22, 0.01, 0.005), "steel", -0.55, 0.78, -0.72, { rx: 0.25 });
    put(cyl(0.07, 0.07, 0.015, 16), "brass", 0.75, 0.77, -0.85);
    put(cyl(0.008, 0.008, 0.4, 6), "brass", 0.75, 0.78, -0.85);
    put(cyl(0.05, 0.09, 0.12, 20), "lampShade", 0.75, 1.15, -0.75, { cast: false });
    // chair
    put(cyl(0.3, 0.3, 0.03, 5), "bronze", 0, 0.02, -1.45);
    put(cyl(0.03, 0.03, 0.4, 10), "steel", 0, 0.05, -1.45);
    put(rbox(0.56, 0.09, 0.54, 0.04), "fabricCharcoal", 0, 0.45, -1.45);
    put(rbox(0.54, 0.62, 0.08, 0.05), "fabricCharcoal", 0, 0.55, -1.75, { rx: 0.1 });
    // lounge corner
    put(rbox(0.85, 0.4, 0.85, 0.07), "fabricSage", 2.4, 0, 1.4, { ry: -0.6 });
    put(rbox(0.85, 0.5, 0.18, 0.07), "fabricSage", 2.62, 0.36, 1.68, { ry: -0.6 });
    put(cyl(0.25, 0.25, 0.03, 24), "marble", 1.6, 0.5, 1.9);
    put(cyl(0.04, 0.12, 0.5, 12), "bronze", 1.6, 0, 1.9);
    put(cyl(0.012, 0.012, 1.6, 6), "brass", 3.1, 0, 0.6);
    put(cyl(0.12, 0.2, 0.26, 24), "lampShade", 3.1, 1.55, 0.6, { cast: false });
    put(cyl(0.24, 0.2, 0.55, 20), "pot", -2.9, 0, 0.8);
    put(new THREE.SphereGeometry(0.45, 20, 14), "foliage", -2.9, 1.05, 0.8);
    put(rbox(2.6, 0.02, 1.9, 0.01), "rug", 0, 0.02, -0.9, { cast: false });
    // linear pendant above desk
    put(box(1.4, 0.04, 0.12), "led", 0, 2.3, -0.6, { cast: false });
    put(cyl(0.004, 0.004, H - 2.34, 4), "bronze", -0.6, 2.34, -0.6, { cast: false });
    put(cyl(0.004, 0.004, H - 2.34, 4), "bronze", 0.6, 2.34, -0.6, { cast: false });
    r.point("#ffd6a6", 3.5, 6, 0, 2.15, -0.6);
    r.point("#ffc884", 2.2, 4, 3.1, 1.6, 0.7);
    r.spot(16, [0.5, H - 0.05, 1.6], [0, 0.5, -1.6]);
    return {
      ...r,
      move: {
        from: [2.6, 1.65, 2.8],
        to: [1.5, 1.45, 2.0],
        lookFrom: [-0.4, 1.1, -1.6],
        lookTo: [-0.2, 1.0, -1.9],
      } as CameraMove,
    };
  })();

  const sets: Record<RoomId, RoomSet> = {
    kitchen: { id: "kitchen", group: kitchen.group, lights: kitchen.lights, move: kitchen.move },
    bedroom: { id: "bedroom", group: bedroom.group, lights: bedroom.lights, move: bedroom.move },
    office: { id: "office", group: office.group, lights: office.lights, move: office.move },
  };

  return {
    sets,
    dispose: () => {
      geos.forEach((g) => g.dispose());
      extraMats.forEach((m) => m.dispose());
      shadowLights.forEach((s) => s.shadow.map?.dispose());
    },
  };
}
