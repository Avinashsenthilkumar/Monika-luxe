# Monika Luxe — Interiors & Construction

The redesigned website for **Monika Luxe Construction & Interiors**, Thanjavur. It uses the Next.js App Router with TypeScript, Tailwind CSS v4, GSAP ScrollTrigger, Lenis and Three.js (React Three Fiber and Drei).

The home page opens with **"From Blueprint to Extraordinary Living"**, a pinned film driven by your scroll position:

| Scroll range | What happens                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 0–14%        | A floor plan draws itself on an ivory drafting sheet (title block, north arrow, dimensions)                                               |
| 14–34%       | The plinth, columns and walls grow, the slabs drop into place, then the cantilevered upper volume and the roof                            |
| 34–50%       | A clipping-plane sweep turns the clay model into stone, teak, concrete, glass and landscape; the sky moves to dusk and the lights come on |
| 50–62%       | The camera crosses the pool and passes through the glass into a furnished living room                                                     |
| 62–90%       | The interior chapters (kitchen, bedroom, living room, workspace) use the company's own portfolio photos with clip-path camera wipes       |
| 90–100%      | A final exterior hero shot: **"Your Vision. Our Craft."** with working CTAs                                                               |

All timings live in `components/experience/chapters.ts`.

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in enquiry delivery (see below)
npm run assets:fetch           # copy images from the current WordPress site into /public — do this BEFORE the old site goes offline
npm run dev
```

Checks:

```bash
npm run typecheck
npm run lint
npm run build && npm start
```

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel. The framework is detected automatically.
2. Add these environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL`, for example `https://monikaluxeinteriors.com`
   - Option A: `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL` (verify the sending domain in Resend first)
   - Option B: `ENQUIRY_WEBHOOK_URL`, optionally with `ENQUIRY_WEBHOOK_SECRET`
3. Deploy. `prebuild` runs `scripts/fetch-assets.mjs --soft`, which downloads any images missing from `/public`. If an image can't be downloaded, the page falls back to the original URL, so nothing renders broken.
4. **Before switching DNS away from WordPress,** run `npm run assets:fetch` locally and commit `public/images/`. Once WordPress is gone, the fallback URLs stop working.
5. The legacy WordPress URLs (`/about-2`, `/home-2`, `/testimonials`, `/teams`) are permanently redirected in `next.config.ts`.

## Enquiry form

- Validation runs on both sides with the same Zod schema (`lib/validation.ts`): React Hook Form in the browser, and the route handler `app/api/enquiries/route.ts` on the server.
- Spam protection: a honeypot field, a minimum fill time and a per-IP rate limit (in memory, per instance; add Upstash or Redis if you need a global limit).
- **The form never shows a fake success.** If no delivery method is configured, the API returns `503 not_configured` and the form tells the visitor to call or use WhatsApp.
- Secrets are only read on the server.

## Project structure

```
app/                     routes (/, /about, /services, /services/[slug], /projects, /projects/[slug], /contact, /api/enquiries)
components/experience/   the scroll film — ArchitecturalJourney (GSAP timeline), HouseConstructionScene (R3F canvas),
                         three/buildHouse.ts (procedural residence), three/cameraPath.ts, overlays, fallback
components/home/         home page sections
components/projects/     grid, card, gallery + lightbox, before/after slider
components/forms/        ConsultationForm
lib/content.ts           all company content (verified from the live site) — services, projects, team, testimonials
lib/assets.ts            image manifest (local path + original URL + provenance)
docs/                    content audit, asset list
```

## Performance and accessibility

- Three.js is in its own chunk (`next/dynamic`, `ssr:false`). It loads only when the film section is near the viewport and the main thread is idle. Other pages never ship it.
- The canvas renders **on demand**: only when scroll progress changes, and not at all while the interior photos cover it.
- Textures are generated procedurally at runtime (0 KB of downloads). Mobile and low-memory devices get a lower DPR, 512px textures and a 1024 shadow map.
- `prefers-reduced-motion`, no WebGL, a WebGL error or a lost GPU context all switch to `ExperienceFallback`, a static version of the same story.
- The intro overlay is CSS-only and never blocks content.
- GSAP is scoped with `useGSAP` / `gsap.matchMedia`, so it reverts on unmount and works under Strict Mode. Lenis drives ScrollTrigger through the GSAP ticker.
- The site has a skip link, a focus-trapped mobile menu and lightbox, a keyboard-operable before/after slider, a "Skip the film" link, visible focus styles and semantic landmarks.

## Upgrading the visuals

See `docs/ASSETS.md` for how to swap in a licensed GLB house, KTX2 textures or a rendered image sequence without touching the rest of the site.
