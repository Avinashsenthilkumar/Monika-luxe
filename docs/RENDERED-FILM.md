# Photoreal home-page film (rendered walkthrough)

The real-time 3D house is built in code, so it can never look like a real photographed home. For the realism in the
reference videos, render the walkthrough once (photoreal) and let the site play it frame by frame as visitors scroll.
Scrolling stays smooth on every phone because the browser only draws images; it never renders 3D.

## 1 · Get a rendered video (16:9, 1920×1080, 15–25 s, no cuts or fades needed)

The team's architect (3D visualisation) can produce it in Lumion, D5 Render, Twinmotion, Enscape or Blender from an
actual Monika Luxe project. An AI video tool can also produce it from the client's own photos, as long as the client
approves the result. Follow this shot list. The percentages are the scroll positions where the on-screen captions
appear (`components/experience/chapters.ts`).

| Video time   | Scroll      | Shot                                                                                    |
| ------------ | ----------- | --------------------------------------------------------------------------------------- |
| 0 – 14 %     | Blueprint   | Top-down white drafting sheet; navy floor-plan lines draw on                            |
| 14 – 34 %    | Structure   | Camera tilts to 3/4 view while plinth, columns, walls and slabs rise (clay/white model) |
| 34 – 48 %    | Materials   | Stone, wood, glass, landscape appear; daylight                                          |
| 46 – 62 %    | Enter       | Sun sets, interior lights come on, camera glides to the glass and steps inside          |
| 62 – 69 %    | Living room | Slow dolly across the living room                                                       |
| 69 – 76 %    | Kitchen     | Modular kitchen                                                                         |
| 76 – 83 %    | Bedroom     | Master bedroom                                                                          |
| 83 – 89.5 %  | Workspace   | Office / study                                                                          |
| 89.5 – 100 % | Reveal      | Wide exterior hero shot at dusk ("Your Vision. Our Craft.")                             |

## 2 · Convert it (one command)

```bash
npm run sequence -- path/to/walkthrough.mp4            # 24 fps by default
npm run sequence -- path/to/walkthrough.mp4 --fps 20   # lighter
npm run sequence -- walkthrough.mp4 --blueprint        # keep the drafting-sheet overlay for the first chapter
```

This needs ffmpeg (`winget install ffmpeg` on Windows). It writes `public/sequences/house/` with desktop (1600 px) and
mobile (800 px) WebP frames plus `manifest.json`. A 20-second video at 24 fps is roughly 480 frames, about 25 MB for
desktop and 8 MB for mobile. Frames stream in progressively, so the film can be scrubbed within a second.

## 3 · Commit and deploy

```bash
git add public/sequences
git commit -m "Add rendered home-page film"
git push origin main
```

To return to the real-time 3D model, delete `public/sequences/house`.
