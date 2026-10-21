# Content audit — monikaluxeinteriors.com (checked 21 Oct 2026)

All content in `lib/content.ts` was taken from the live WordPress site. No projects, testimonials, ratings, statistics or credentials were invented.

## Verified and used

| Item                                                                                                  | Source page             |
| ----------------------------------------------------------------------------------------------------- | ----------------------- |
| Company name, tagline, Thanjavur location, service list, turnkey positioning                          | Home, `/home-2` (About) |
| Address: Opp. New Bus Stand, Trichy Main Road, Thanjavur – 613005                                     | `/contact`              |
| Phone and WhatsApp: +91 73055 20648                                                                   | Home, `/contact`        |
| Founder Er. V. Monika: Founder · Interior Designer · Civil Engineer, B.E. Civil, 10 years' experience | `/home-2`, `/teams`     |
| Team of six with roles, qualifications, focus areas and portraits                                     | `/teams`                |
| Three testimonials (Priya R., Karthik S., Arun Kumar)                                                 | Home                    |
| Four portfolio galleries (Living Room, Kitchen, Office Space, Bedroom) with their descriptions        | `/about-2`              |
| Map links                                                                                             | `/contact`              |

## ⚠️ Needs confirmation from the client before launch

1. **Email address.** The live site hides it behind Cloudflare email protection. The brief lists `info@monikaluxeinteriors.com`; it is used on the site but **could not be verified**. It is not included in the structured data.
2. **Portfolio image ownership.** The kitchen, bedroom and office images sit in a `wp-content/uploads/2020/08/` folder that pre-dates the 2026 site, and their filenames (`kitchen-1-1.jpg`, …) look like WordPress theme demo content. Please confirm they are genuine Monika Luxe projects, or supply real project photos. Until then they are presented only as portfolio collections, never as named client projects.
3. **Living room images** are only 600 × 600 px, which is too small for full-screen use. Please supply higher-resolution originals.
4. **Statistics not used.** The About page shows "352 projects, 120+ happy customers, 12 awards, 15 years". These conflict with each other (352 projects vs 120 customers) and with the founder's "10 years of experience", so the site shows no counters until they are confirmed.
5. **Testimonials** were shortened to the excerpts that could be read. Paste the full approved wording into `lib/content.ts` if the client wants it.
6. **Named projects.** The live site has no named projects with locations. Add real projects (name, location, images, highlights) to `projects` in `lib/content.ts`, and `/projects/[slug]` pages are generated automatically.
7. **Social profiles.** All social links on the live site point to `#`, so none are linked.
8. **Free Consultation** service. The live description is placeholder text, so it isn't listed as a service (the site's CTAs already offer a consultation).
9. **Logo.** The header uses a text wordmark. An official logo file exists on the old site (`image-removebg-preview.png`); swap it in if it is approved.
10. **Placeholder text on the live About page** ("Keith Keller" in the meta description, "A descriptive paragraph…" in Projects) was ignored.
11. **Before/after pairs.** None exist. `lib/before-after.ts` is empty, so the slider stays hidden until genuine pairs of the same space are added.
