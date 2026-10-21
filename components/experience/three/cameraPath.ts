import * as THREE from "three";
import { clamp, easeInOutCubic, range } from "@/lib/utils";

/**
 * Camera choreography: two Catmull-Rom splines (position + look-at target).
 * Path A runs from the overhead blueprint view into the living room.
 * Path B is the final exterior hero shot. The cut between them happens
 * while the interior photo chapters cover the canvas, so it is never seen.
 */

type Key = { p: number; pos: [number, number, number]; target: [number, number, number] };

const PATH_A: Key[] = [
  { p: 0.0, pos: [0.8, 46, 9.5], target: [0.6, 0, 2] },
  { p: 0.12, pos: [5, 40, 20], target: [0.6, 0, 2] },
  { p: 0.22, pos: [23, 24, 31], target: [0.6, 1.8, 1.5] },
  { p: 0.34, pos: [31, 12, 29], target: [0.8, 3, 1.5] },
  { p: 0.44, pos: [-11, 4.6, 35], target: [2.2, 3.2, 2] },
  { p: 0.52, pos: [4.6, 2.5, 19], target: [4.2, 2.2, 0] },
  { p: 0.585, pos: [4.6, 2.0, 7.4], target: [4.2, 1.8, -2] },
  { p: 0.63, pos: [5.6, 1.75, 2.7], target: [2.6, 1.35, -4] },
  { p: 0.895, pos: [6.0, 1.75, 2.4], target: [2.2, 1.35, -4] },
];

const PATH_B: Key[] = [
  { p: 0.9, pos: [-19, 7.2, 31], target: [2, 3.1, 1.5] },
  { p: 0.95, pos: [-15, 5.6, 28], target: [2.2, 3.3, 1.5] },
  { p: 1.0, pos: [-11, 4.4, 25], target: [2.5, 3.5, 1.5] },
];

function build(keys: Key[]) {
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
    if (p >= a && p <= b) {
      // gentle easing at the very start/end of the whole path only
      const local = (p - a) / (b - a);
      return (i + local) / (n - 1);
    }
  }
  return 1;
}

export function createCameraPath() {
  const a = build(PATH_A);
  const b = build(PATH_B);
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const offset = new THREE.Vector3();

  return {
    apply(camera: THREE.PerspectiveCamera, progress: number, aspect: number) {
      const p = clamp(progress);
      const useB = p >= 0.9;
      const path = useB ? b : a;
      let u = paramFor(path.keys, p);
      if (!useB) u = easeInOutCubic(clamp(u * 1.0)) * 0.08 + u * 0.92; // soften the first move
      path.pos.getPoint(clamp(u), pos);
      path.target.getPoint(clamp(u), target);

      // Pull exterior shots back on portrait screens so the house fits.
      const exterior = useB ? 1 : 1 - range(p, 0.48, 0.56);
      if (aspect < 1.25 && exterior > 0) {
        const extra = (1.25 - aspect) * 1.15 * exterior;
        offset.subVectors(pos, target).multiplyScalar(1 + extra);
        pos.copy(target).add(offset);
      }

      camera.position.copy(pos);
      camera.lookAt(target);
      const fov = aspect < 1 ? 42 : 35;
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    },
  };
}
