import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { easeInOutCubic, easeOutCubic, range } from "@/lib/utils";
import { PHASE, ROOM_WINDOWS } from "../chapters";
import { buildHouse } from "./house";
import { buildRooms, type RoomId } from "./rooms";
import { createCameraPath } from "./cameraPath";
import { createMaterials } from "./kit";
import { createSky } from "./sky";
import { createTextures } from "./textures";

/**
 * Framework-agnostic renderer for the architectural film. React (or any page)
 * only calls request(progress) when the scroll position changes; the engine
 * renders on demand — never in a continuous loop.
 */
export interface Engine {
  request: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
}

export function createEngine(container: HTMLElement, quality: "high" | "low", onError?: () => void): Engine {
  const high = quality === "high";
  const renderer = new THREE.WebGLRenderer({
    antialias: high,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
  });
  const cores = navigator.hardwareConcurrency || 4;
  const maxDpr = high ? (cores >= 8 ? 1.5 : 1.25) : 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // The scene is static most of the time: shadows are re-rendered only while things move or lights change.
  renderer.shadowMap.autoUpdate = false;
  renderer.localClippingEnabled = true;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.appendChild(canvas);
  const onLost = (e: Event) => {
    e.preventDefault();
    onError?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 600);

  // image-based lighting for reflections and soft fill
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envTex = pmrem.fromScene(roomEnv, 0.04).texture;
  scene.environment = envTex;
  pmrem.dispose();
  (roomEnv as unknown as { dispose?: () => void }).dispose?.();

  const textures = createTextures(quality);
  const finishPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
  const clayPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
  const mats = createMaterials(textures, finishPlane);
  const house = buildHouse({ mats, clayPlane, quality });
  const rooms = buildRooms(mats);
  const path = createCameraPath(rooms);
  const sky = createSky();
  scene.add(house.root);
  for (const set of Object.values(rooms.sets)) scene.add(set.group);
  scene.background = sky.texture;

  const fog = new THREE.Fog("#f7f8fa", 90, 240);
  scene.fog = fog;
  const fogPaper = new THREE.Color("#f7f8fa");
  const fogDay = new THREE.Color("#dfe8f0");
  const fogDusk = new THREE.Color("#16233d");

  const sunDay = new THREE.Vector3(-18, 30, 16);
  const sunDusk = new THREE.Vector3(-34, 7, 8);
  const sunColDay = new THREE.Color("#fff4e2");
  const sunColDusk = new THREE.Color("#ff9a58");
  const hemiSkyDay = new THREE.Color("#eaf2ff");
  const hemiSkyDusk = new THREE.Color("#3d4c72");
  const hemiGrDay = new THREE.Color("#b9b4a8");
  const hemiGrDusk = new THREE.Color("#241f1a");
  const sunDir = new THREE.Vector3();
  const roomIds: RoomId[] = ["kitchen", "bedroom", "office"];
  const extBase = [14, 14, 6, 10, 10, 4];
  const livingBase = [32, 6, 5, 3];

  let width = 1;
  let height = 1;
  const resize = () => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    renderer.shadowMap.needsUpdate = true;
    request(progress, true);
  };

  let progress = 0;
  let lastShadowKey = "";
  let frame = 0;
  let lastRendered = -1;

  const update = (p: number) => {
    house.update(p);

    const dayMix = range(p, 0.3, 0.4);
    const dusk = easeInOutCubic(range(p, PHASE.dusk[0], PHASE.dusk[1]));
    const lights = easeOutCubic(range(p, PHASE.dusk[0] + 0.04, PHASE.dusk[1] + 0.02));
    const inside = range(p, 0.56, 0.62);
    const active = roomIds.find((id) => p >= ROOM_WINDOWS[id][0] && p < ROOM_WINDOWS[id][1]) ?? null;

    house.root.visible = active === null;
    for (const id of roomIds) rooms.sets[id].group.visible = id === active;

    // clay → finished sweep
    const sweep = easeInOutCubic(range(p, PHASE.materials[0], PHASE.materials[1]));
    const h = -0.6 + sweep * 15;
    finishPlane.constant = h;
    clayPlane.constant = -h;

    // sun, sky, fog
    sunDir.lerpVectors(sunDay, sunDusk, dusk);
    house.sun.position.copy(sunDir);
    house.sun.color.copy(sunColDay).lerp(sunColDusk, dusk);
    house.sun.intensity = 2.8 - dusk * 1.9;
    house.hemi.color.copy(hemiSkyDay).lerp(hemiSkyDusk, dusk);
    house.hemi.groundColor.copy(hemiGrDay).lerp(hemiGrDusk, dusk);
    house.hemi.intensity = 1.4 - dusk * 1.05;
    sky.paint(dayMix, dusk, sunDir.clone().normalize());
    scene.backgroundIntensity = 1;

    if (active) {
      fog.near = 1e4;
      fog.far = 1e4 + 1;
    } else {
      fog.color.copy(fogPaper).lerp(fogDay, dayMix).lerp(fogDusk, dusk);
      fog.near = 90 - dusk * 30;
      fog.far = 240 - dusk * 60;
    }
    scene.environmentIntensity = active ? 0.45 : 0.55 - dusk * 0.25;
    renderer.toneMappingExposure = active ? 1.08 : 1;

    // artificial lighting
    house.exteriorLights.forEach((l, i) => (l.intensity = extBase[i] * lights));
    house.livingLights.forEach((l, i) => (l.intensity = livingBase[i] * lights * (0.45 + 0.55 * inside)));
    const interiorGlow = active ? 1 : lights;
    for (const e of mats.emissive) e.mat.emissiveIntensity = e.max * (e.group === "interior" ? interiorGlow : lights);

    // shadows: refresh only while geometry or lighting is changing, or when the room changes
    const shadowKey =
      active ?? (p < PHASE.structure[0] || p > PHASE.dusk[1] + 0.03 ? `still-${p < 0.5 ? "a" : "b"}` : `live-${p}`);
    if (shadowKey !== lastShadowKey) {
      lastShadowKey = shadowKey;
      renderer.shadowMap.needsUpdate = true;
    }

    path.apply(camera, p, width / height);
  };

  const render = () => {
    frame = 0;
    if (progress === lastRendered) return;
    lastRendered = progress;
    update(progress);
    renderer.render(scene, camera);
  };

  function request(p: number, force = false) {
    progress = p;
    if (force) lastRendered = -1;
    if (!frame) frame = requestAnimationFrame(render);
  }

  resize();

  const dispose = () => {
    if (frame) cancelAnimationFrame(frame);
    canvas.removeEventListener("webglcontextlost", onLost);
    house.dispose();
    rooms.dispose();
    mats.dispose();
    textures.dispose();
    sky.dispose();
    envTex.dispose();
    scene.clear();
    renderer.dispose();
    canvas.remove();
  };

  return { request, resize, dispose };
}
