import * as THREE from "three";
import { clamp, easeInOutCubic, range } from "@/lib/utils";
import { ROOM_WINDOWS } from "../chapters";
import type { RoomsRig } from "./rooms";

/**
 * Camera choreography.
 *  A — overhead blueprint → orbit while the villa is built → front at dusk → through the glass → living room.
 *  Rooms — a slow dolly in each interior set (kitchen, bedroom, office).
 *  B — final exterior hero shot from the street.
 * Cuts between segments happen under a dip-to-black in the DOM overlay.
 */

type V3 = [number, number, number];
type Key = { p: number; pos: V3; target: V3 };

const PATH_A: Key[] = [
  { p: 0.0, pos: [1, 54, 11], target: [0.5, 0, 2.5] },
  { p: 0.12, pos: [7, 46, 24], target: [0.5, 0, 2.5] },
  { p: 0.22, pos: [28, 27, 36], target: [0.5, 2.5, 1.5] },
  { p: 0.34, pos: [36, 14, 33], target: [0.5, 3.6, 1] },
  { p: 0.44, pos: [-15, 4.4, 38], target: [1.5, 3.8, 2] },
  { p: 0.52, pos: [4.5, 2.6, 21], target: [4.6, 2.2, 0] },
  { p: 0.585, pos: [4.5, 2.0, 8.6], target: [4.8, 1.7, -2] },
  { p: 0.62, pos: [4.6, 1.6, 3.6], target: [5, 1.3, -5] },
  { p: ROOM_WINDOWS.living[1], pos: [8.2, 1.55, 2.6], target: [3.2, 1.15, -4] },
];

const PATH_B: Key[] = [
  { p: ROOM_WINDOWS.office[1], pos: [-24, 7.6, 38], target: [1.5, 3.6, 1.5] },
  { p: 0.95, pos: [-19, 6.2, 34], target: [2, 3.8, 1.5] },
  { p: 1.0, pos: [-13.5, 4.8, 30], target: [2.5, 4.0, 1.5] },
];

function spline(keys: Key[]) {
  const pos = new THREE.CatmullRomCurve3(
    keys.map((k) => new THREE.Vector3(...k.pos)),
    false,
    "centripetal",
  );
  const target = new THREE.CatmullRomCurve3(
    keys.map((k) => new THREE.Vector3(...k.target)),
    false,
    "centripetal",
  );
  return { keys, pos, target };
}

function paramFor(keys: Key[], p: number) {
  const n = keys.length;
  if (p <= keys[0].p) return 0;
  if (p >= keys[n - 1].p) return 1;
  for (let i = 0; i < n - 1; i++) {
    const a = keys[i].p;
    const b = keys[i + 1].p;
    if (p >= a && p <= b) return (i + (p - a) / (b - a)) / (n - 1);
  }
  return 1;
}

export function createCameraPath(rooms: RoomsRig) {
  const a = spline(PATH_A);
  const b = spline(PATH_B);
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();

  const roomOrder = [
    ["kitchen", ROOM_WINDOWS.kitchen],
    ["bedroom", ROOM_WINDOWS.bedroom],
    ["office", ROOM_WINDOWS.office],
  ] as const;

  return {
    apply(camera: THREE.PerspectiveCamera, progress: number, aspect: number) {
      const p = clamp(progress);
      let exterior = 0;
      let fov = 35;

      const room = roomOrder.find(([, w]) => p >= w[0] && p < w[1]);
      if (room) {
        const set = rooms.sets[room[0]];
        const t = easeInOutCubic(range(p, room[1][0], room[1][1]));
        const o = set.group.position;
        pos
          .copy(v1.set(...set.move.from))
          .lerp(v2.set(...set.move.to), t)
          .add(o);
        target
          .copy(v1.set(...set.move.lookFrom))
          .lerp(v2.set(...set.move.lookTo), t)
          .add(o);
        fov = 44;
      } else if (p >= ROOM_WINDOWS.office[1]) {
        const u = paramFor(b.keys, p);
        b.pos.getPoint(u, pos);
        b.target.getPoint(u, target);
        exterior = 1;
      } else {
        const u = paramFor(a.keys, p);
        a.pos.getPoint(u, pos);
        a.target.getPoint(u, target);
        exterior = 1 - range(p, 0.48, 0.56);
        if (p > 0.6) fov = 40;
      }

      // Portrait screens: pull exterior shots back and widen interiors.
      if (aspect < 1.25 && exterior > 0) {
        offset.subVectors(pos, target).multiplyScalar(1 + (1.25 - aspect) * 0.35 * exterior);
        pos.copy(target).add(offset);
      }
      if (aspect < 1) fov += 12;

      camera.position.copy(pos);
      camera.lookAt(target);
      if (camera.fov !== fov || camera.aspect !== aspect) {
        camera.fov = fov;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
    },
  };
}
