/**
 * Asset manifest — the single place every image path lives.
 *
 * `local`  → path inside /public. scripts/fetch-assets.mjs copies each source
 *            image here (it runs automatically before `next build`).
 * `remote` → the original file on the current WordPress site. Used only as a
 *            fallback when the local copy is missing (see lib/assets.server.ts).
 *
 * `status` documents provenance so nobody mistakes placeholder or unverified
 * imagery for genuine company work:
 *   "live-site"  – published on monikaluxeinteriors.com; ownership still to be
 *                  confirmed by the client before launch (several files sit in a
 *                  2020/08 upload folder, which suggests theme demo content).
 */

export type AssetStatus = "live-site";

export interface ResolvedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImageAsset {
  id: string;
  local: string;
  remote: string;
  alt: string;
  width: number;
  height: number;
  status: AssetStatus;
}

const WP = "https://i0.wp.com/monikaluxeinteriors.com/wp-content/uploads";

function img(id: string, local: string, remotePath: string, alt: string, width = 1200, height = 900): ImageAsset {
  return { id, local, remote: `${WP}/${remotePath}`, alt, width, height, status: "live-site" };
}

export const assets = {
  // ---------- Portfolio: living rooms ----------
  living1: img(
    "living1",
    "/images/portfolio/living-01.jpg",
    "2026/06/image_05_600x600.jpg",
    "Living room interior with warm lighting and premium finishes",
    600,
    600,
  ),
  living2: img(
    "living2",
    "/images/portfolio/living-02.jpg",
    "2026/06/image_01_600x600.jpg",
    "Living room interior with layered textures and modern furniture",
    600,
    600,
  ),
  living3: img(
    "living3",
    "/images/portfolio/living-03.jpg",
    "2026/06/image_03_600x600.jpg",
    "Living room seating area with elegant detailing",
    600,
    600,
  ),
  living4: img(
    "living4",
    "/images/portfolio/living-04.jpg",
    "2026/06/image_09_600x600.jpg",
    "Contemporary living space with refined material palette",
    600,
    600,
  ),

  // ---------- Portfolio: kitchens ----------
  kitchen1: img(
    "kitchen1",
    "/images/portfolio/kitchen-01.jpg",
    "2020/08/kitchen-1-1.jpg",
    "Modular kitchen with premium cabinetry and finishes",
  ),
  kitchen2: img(
    "kitchen2",
    "/images/portfolio/kitchen-02.jpg",
    "2020/08/kitchen-2-1.jpg",
    "Modern modular kitchen with smart storage",
  ),
  kitchen3: img(
    "kitchen3",
    "/images/portfolio/kitchen-03.jpg",
    "2020/08/kitchen-3-1.jpg",
    "Kitchen counter and cabinetry detail",
  ),
  kitchen4: img(
    "kitchen4",
    "/images/portfolio/kitchen-04.jpg",
    "2020/08/kitchen-4-1.jpg",
    "Open kitchen layout with clean lines",
  ),
  kitchen5: img(
    "kitchen5",
    "/images/portfolio/kitchen-05.jpg",
    "2020/08/kitchen-5-1.jpg",
    "Kitchen interior with integrated appliances",
  ),

  // ---------- Portfolio: office spaces ----------
  office1: img(
    "office1",
    "/images/portfolio/office-01.jpg",
    "2020/08/office-1-1.jpg",
    "Office interior designed for focus and comfort",
  ),
  office2: img(
    "office2",
    "/images/portfolio/office-02.jpg",
    "2020/08/office-2-1.jpg",
    "Contemporary workspace with functional layout",
  ),
  office3: img(
    "office3",
    "/images/portfolio/office-03.jpg",
    "2020/08/office-3-1.jpg",
    "Office meeting area with modern finishes",
  ),
  office4: img(
    "office4",
    "/images/portfolio/office-04.jpg",
    "2020/08/office-4-1.jpg",
    "Office interior detail with considered lighting",
  ),

  // ---------- Portfolio: bedrooms ----------
  bedroom1: img(
    "bedroom1",
    "/images/portfolio/bedroom-01.jpg",
    "2020/08/bedroom-1-1.jpg",
    "Bedroom interior designed for rest and quiet luxury",
  ),
  bedroom2: img(
    "bedroom2",
    "/images/portfolio/bedroom-02.jpg",
    "2020/08/bedroom-2-1.jpg",
    "Bedroom with soft textiles and warm wood tones",
  ),
  bedroom3: img(
    "bedroom3",
    "/images/portfolio/bedroom-03.jpg",
    "2020/08/bedroom-3-1.jpg",
    "Bedroom headboard wall and lighting detail",
  ),
  bedroom4: img(
    "bedroom4",
    "/images/portfolio/bedroom-04.jpg",
    "2020/08/bedroom-4-1-1.jpg",
    "Master bedroom with elegant finishes",
  ),
  bedroom5: img(
    "bedroom5",
    "/images/portfolio/bedroom-05.jpg",
    "2020/08/bedroom-5-1.jpg",
    "Bedroom seating corner and wardrobe detail",
  ),

  // ---------- Team portraits (from /teams) ----------
  teamMonika: img(
    "teamMonika",
    "/images/team/monika.jpg",
    "2026/06/WhatsApp-Image-2026-06-17-at-2.46.09-PM.jpeg",
    "Portrait of Er. V. Monika, Founder and Civil Engineer",
    900,
    1200,
  ),
  teamLenin: img(
    "teamLenin",
    "/images/team/lenin.jpg",
    "2026/06/WhatsApp-Image-2026-06-16-at-4.54.48-PM-1.jpeg",
    "Portrait of Er. V. Lenin, Structural Engineer",
    900,
    1200,
  ),
  teamManuneethicholan: img(
    "teamManuneethicholan",
    "/images/team/manuneethicholan.jpg",
    "2026/06/WhatsApp-Image-2026-06-16-at-4.54.48-PM.jpeg",
    "Portrait of P. Manuneethicholan, Architect and Design Consultant",
    900,
    1200,
  ),
  teamNadimuthu: img(
    "teamNadimuthu",
    "/images/team/nadimuthu.jpg",
    "2026/06/WhatsApp-Image-2026-06-14-at-9.51.14-PM.jpeg",
    "Portrait of Nadimuthu, Site Supervisor and Execution Coordinator",
    900,
    1200,
  ),
  teamAnandan: img(
    "teamAnandan",
    "/images/team/anandan.jpg",
    "2026/06/WhatsApp-Image-2026-06-14-at-10.02.34-PM.jpeg",
    "Portrait of S. Anandan, Client Relationship Manager",
    900,
    1200,
  ),
  teamMadhavan: img(
    "teamMadhavan",
    "/images/team/madhavan.jpg",
    "2026/06/WhatsApp-Image-2026-06-14-at-9.21.19-PM.jpeg",
    "Portrait of P. Madhavan, Accounts and Project Coordinator",
    900,
    1200,
  ),
} satisfies Record<string, ImageAsset>;

export type AssetId = keyof typeof assets;

/** Source logo on the current website (not used in the UI — the header uses a text wordmark). */
export const legacyLogo = `${WP}/2026/06/image-removebg-preview.png`;
