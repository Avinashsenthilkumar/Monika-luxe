# Assets

## Current state

| Asset                             | Status                                                                                                                                                                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3D residence                      | **Procedural** (`components/experience/three/buildHouse.ts`): an original concept house built from boxes with canvas-generated stone, teak, concrete and marble textures. It is labelled on the page as "Illustrative concept · not a client project". |
| Portfolio photography (18 images) | Taken from the live site and listed in `lib/assets.ts`. Copied to `/public/images/portfolio` by `npm run assets:fetch`. Ownership still to be confirmed (see CONTENT-AUDIT).                                                                           |
| Team portraits (6)                | From `/teams`, copied to `/public/images/team`.                                                                                                                                                                                                        |
| Hero                              | An original SVG elevation drawing; no photography needed.                                                                                                                                                                                              |
| Fonts                             | Instrument Serif, Manrope and IBM Plex Mono, self-hosted via `@fontsource` (OFL).                                                                                                                                                                      |

## Assets needed to reach final visual quality

1. **A high-quality exterior render** of a contemporary Indian residence, or photography of a completed Monika Luxe home, for social cards and the final reveal.
2. **A staged house model (GLB)** with separate meshes for plinth, frame, walls, slabs, glazing, roof and landscape, ideally Draco or Meshopt compressed with KTX2 textures and under 6 MB.
3. **Interior photography at 2400 px or larger** of a living room, modular kitchen, master bedroom, bathroom and dining area. There is currently no bathroom or dining imagery, so those chapters are not shown.
4. **Real project photography** with project names and locations.
5. **Approved founder and team portraits** at high resolution.
6. **Authentic before/after pairs** of the same spaces.

## Swapping in a licensed GLB

`buildHouse()` returns `{ root, update(progress, scene), dispose }`. To use a GLB:

1. Put the file in `public/models/house.glb`. Record its source and licence here.
2. Write `buildHouseFromGLTF(gltf)` returning the same interface. Map named meshes to the `PartDef` reveal windows (grow / drop / pop) and give every material the `finishPlane` / `clayPlane` clipping planes, so the material sweep keeps working.
3. Load it in `HouseConstructionScene` with Drei's `useGLTF` inside a `<Suspense>`.

Camera keyframes live in `three/cameraPath.ts` and chapter timings in `chapters.ts`.

## Rendered image sequence (alternative)

If you'd rather have an offline-rendered film, export WebP frames to `public/sequences/house/0001.webp…`. Then replace the canvas with a 2D-canvas frame player driven by `bridge.current.progress`. Preload the first ~20 frames and stream the rest progressively. `ArchitecturalJourney` and the overlays don't need to change.
