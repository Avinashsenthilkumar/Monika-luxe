import type { AssetId } from "./assets";

/* ------------------------------------------------------------------
 * Company — every fact below was taken from monikaluxeinteriors.com
 * (home, /home-2 "About", /teams, /contact) on 21 Oct 2026.
 * Items that could not be verified are marked `verify` and listed in
 * docs/CONTENT-AUDIT.md.
 * ------------------------------------------------------------------ */

export const company = {
  name: "Monika Luxe Construction & Interiors",
  shortName: "Monika Luxe",
  wordmark: "MONIKA LUXE",
  descriptor: "Interiors & Construction",
  tagline: "Crafting Elegant Spaces With Timeless Luxury",
  intro:
    "Monika Luxe Construction & Interiors creates elegant, modern and customised spaces in Thanjavur — premium interior design and construction shaped around each client's lifestyle and vision.",
  philosophy: "Every space should reflect elegance, comfort, and individuality.",
  values: ["Quality craftsmanship", "Innovative design", "Timely execution"],
  address: {
    line1: "Opp. New Bus Stand, Trichy Main Road",
    city: "Thanjavur",
    postalCode: "613005",
    region: "Tamil Nadu",
    country: "IN",
    full: "Opp. New Bus Stand, Trichy Main Road, Thanjavur – 613005, Tamil Nadu",
  },
  phone: { display: "+91 73055 20648", e164: "+917305520648" },
  /** verify: the live site hides its email behind Cloudflare obfuscation. */
  email: { address: "info@monikaluxeinteriors.com", verify: true },
  whatsapp: "917305520648",
  mapsDirections: "https://www.google.com/maps/dir/?api=1&destination=Opp+New+Bus+Stand+Trichy+Main+Road+Thanjavur",
  mapsEmbed:
    "https://maps.google.com/maps?q=Opp%20New%20Bus%20Stand%2C%20Trichy%20Main%20Road%2C%20Thanjavur%2C%20Tamil%20Nadu&t=m&z=16&output=embed&iwloc=near",
  serviceArea: "Thanjavur and across Tamil Nadu",
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://monikaluxeinteriors.com").replace(/\/$/, "");

export function whatsappLink(message = "Hello Monika Luxe, I'd like to discuss a project.") {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ */

export type MotifVariant = "elevation" | "plan" | "texture" | "garden" | "section";

export interface Service {
  slug: string;
  index: string;
  title: string;
  eyebrow: string;
  /** Wording published on the current website, where one exists. */
  sourceLine?: string;
  summary: string;
  body: string[];
  scope: string[];
  images: AssetId[];
  motif: MotifVariant;
  seo: { title: string; description: string };
}

export const services: Service[] = [
  {
    slug: "interior-design",
    index: "01",
    title: "Luxury Interior Design",
    eyebrow: "Interiors",
    sourceLine: "Elegant and customized interiors crafted with modern aesthetics and premium finishing.",
    summary: "Customised interiors shaped around how you live — modern aesthetics, considered materials and premium finishing.",
    body: [
      "A well-designed interior starts with understanding the people who will live in it. We study how you use each room, the light it receives and the mood you want it to hold, then design a space that feels personal rather than staged.",
      "Layouts, materials, lighting, furniture and storage are planned together so the finished room reads as one calm, coherent composition.",
    ],
    scope: ["Space planning", "Material & finish selection", "Lighting layout", "Furniture & storage design"],
    images: ["living1", "living2", "living3", "living4"],
    motif: "plan",
    seo: {
      title: "Interior Designers in Thanjavur — Luxury Interior Design",
      description:
        "Customised luxury interior design in Thanjavur by Monika Luxe — modern aesthetics, premium finishing and spaces planned around your lifestyle.",
    },
  },
  {
    slug: "modular-kitchens",
    index: "02",
    title: "Modular Kitchen Design",
    eyebrow: "Kitchens",
    sourceLine:
      "We design modern modular kitchens that combine elegance, functionality, and smart space utilization with premium finishes.",
    summary:
      "Modern modular kitchens that combine elegance, functionality and smart use of space, finished to a premium standard.",
    body: [
      "The kitchen is the hardest-working room in the home. We plan it around how you cook — workflow, storage, appliances and lighting — before choosing finishes.",
      "The result is a kitchen that looks composed and stays easy to use every day.",
    ],
    scope: ["Workflow & layout planning", "Cabinetry & storage", "Counter & finish selection", "Task and ambient lighting"],
    images: ["kitchen1", "kitchen2", "kitchen3", "kitchen4", "kitchen5"],
    motif: "plan",
    seo: {
      title: "Modular Kitchen Design in Thanjavur",
      description:
        "Modern modular kitchens in Thanjavur designed for elegance, functionality and smart space utilisation with premium finishes.",
    },
  },
  {
    slug: "construction",
    index: "03",
    title: "Complete Construction",
    eyebrow: "Construction",
    sourceLine: "End-to-end residential and commercial construction solutions with expert execution.",
    summary: "End-to-end residential and commercial construction, led by qualified civil and structural engineers.",
    body: [
      "Our construction work is led by our founder, Er. V. Monika, a civil engineer, and supported by our structural engineer, architect and on-site supervision team.",
      "From planning and structure through to finishing, design intent and engineering are coordinated by one team.",
    ],
    scope: ["Project planning", "Structural engineering", "Site execution & supervision", "Quality control"],
    images: [],
    motif: "elevation",
    seo: {
      title: "Construction Company in Thanjavur — Residential & Commercial",
      description:
        "End-to-end residential and commercial construction in Thanjavur, led by qualified civil and structural engineers at Monika Luxe.",
    },
  },
  {
    slug: "renovation",
    index: "04",
    title: "Renovation Solutions",
    eyebrow: "Renovation",
    sourceLine: "Transforming old spaces into stylish, modern, and functional environments.",
    summary: "Transforming older spaces into stylish, modern and functional environments.",
    body: [
      "Renovation is about keeping what works and rethinking what doesn't. We assess the existing structure, understand what you want to change, and plan the work so the result feels new without losing its character.",
    ],
    scope: ["Site assessment", "Layout re-planning", "Upgraded finishes", "Coordinated execution"],
    images: [],
    motif: "section",
    seo: {
      title: "Home Renovation in Thanjavur",
      description:
        "Home and office renovation in Thanjavur — transforming older spaces into stylish, modern and functional environments.",
    },
  },
  {
    slug: "commercial-spaces",
    index: "05",
    title: "Residential & Commercial Spaces",
    eyebrow: "Commercial",
    sourceLine: "We design sophisticated office interiors that combine functionality, comfort, and modern aesthetics.",
    summary: "Office and commercial interiors that combine functionality, comfort and modern aesthetics.",
    body: [
      "Commercial spaces have to work hard and still make the right impression. We plan offices and commercial interiors around the people who use them and the way the business runs.",
    ],
    scope: ["Workspace planning", "Reception & client areas", "Meeting rooms", "Lighting & finishes"],
    images: ["office1", "office2", "office3", "office4"],
    motif: "plan",
    seo: {
      title: "Commercial & Office Interior Design in Thanjavur",
      description: "Office and commercial interior design in Thanjavur combining functionality, comfort and modern aesthetics.",
    },
  },
  {
    slug: "painting-finishes",
    index: "06",
    title: "Premium Painting & Wall Finishes",
    eyebrow: "Finishes",
    sourceLine: "High-quality painting and wall finishes designed for a flawless luxury look.",
    summary: "High-quality painting and wall finishes for a flawless, polished look.",
    body: [
      "Surfaces are what you touch and see every day. We help choose colours, textures and finishes that suit the light and character of each room, and apply them with care.",
    ],
    scope: ["Colour consultation", "Interior & exterior painting", "Textured wall finishes", "Surface preparation"],
    images: [],
    motif: "texture",
    seo: {
      title: "Premium Painting & Wall Finishes in Thanjavur",
      description: "High-quality interior and exterior painting and wall finishes in Thanjavur for a polished, luxury look.",
    },
  },
  {
    slug: "rooftop-gardening",
    index: "07",
    title: "Rooftop Gardening",
    eyebrow: "Landscape",
    sourceLine: "Professional guidance and customized planning to bring your dream space to life.",
    summary: "Professional guidance and customised planning for rooftop gardens.",
    body: [
      "A rooftop can become the most peaceful room in the house. We offer guidance and planning for rooftop gardens that suit your terrace, your climate and the time you want to spend caring for them.",
    ],
    scope: ["Terrace assessment", "Planting layout", "Seating & shade planning", "Ongoing guidance"],
    images: [],
    motif: "garden",
    seo: {
      title: "Rooftop Gardening in Thanjavur",
      description: "Rooftop garden guidance and customised planning in Thanjavur from Monika Luxe.",
    },
  },
  {
    slug: "turnkey",
    index: "08",
    title: "Turnkey Interior & Construction",
    eyebrow: "Turnkey",
    sourceLine: "End-to-end turnkey solutions crafted with luxury and perfection.",
    summary: "One team from the first drawing to the final finishing detail.",
    body: [
      "For clients who want a single point of responsibility, we coordinate design, construction and interiors together — so decisions made on paper carry through to site.",
    ],
    scope: ["Design & engineering", "Construction", "Interiors", "Coordinated handover"],
    images: [],
    motif: "section",
    seo: {
      title: "Turnkey Interior & Construction in Thanjavur",
      description:
        "End-to-end turnkey interior design and construction in Thanjavur — one team from the first drawing to final finishing.",
    },
  },
];

/** Routes that the brief requires as dedicated pages are served by /services/[slug]. */
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */

export type ProjectCategory = "Living Room" | "Kitchen" | "Bedroom" | "Commercial";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  sector: "Residential" | "Commercial";
  /** Published description from the live portfolio page. */
  description: string;
  highlights: string[];
  images: AssetId[];
  location?: string;
}

/**
 * The live site's portfolio (/about-2) contains four galleries, not named
 * client projects. They are presented honestly as portfolio collections.
 * Add real, named projects here as the company supplies them.
 */
export const projects: Project[] = [
  {
    slug: "living-rooms",
    title: "Living Rooms",
    category: "Living Room",
    sector: "Residential",
    description:
      "We create sophisticated living room interiors designed with modern aesthetics, premium materials, and elegant detailing.",
    highlights: ["Modern aesthetics", "Premium materials", "Elegant detailing"],
    images: ["living1", "living2", "living3", "living4"],
  },
  {
    slug: "kitchens",
    title: "Modular Kitchens",
    category: "Kitchen",
    sector: "Residential",
    description:
      "We design modern modular kitchens that combine elegance, functionality, and smart space utilization with premium finishes.",
    highlights: ["Smart space utilisation", "Functional layouts", "Premium finishes"],
    images: ["kitchen1", "kitchen2", "kitchen3", "kitchen4", "kitchen5"],
  },
  {
    slug: "bedrooms",
    title: "Bedrooms",
    category: "Bedroom",
    sector: "Residential",
    description:
      "We create elegant bedroom interiors designed for comfort, relaxation, and timeless luxury with premium materials.",
    highlights: ["Comfort & relaxation", "Timeless luxury", "Premium materials"],
    images: ["bedroom1", "bedroom2", "bedroom3", "bedroom4", "bedroom5"],
  },
  {
    slug: "office-spaces",
    title: "Office Spaces",
    category: "Commercial",
    sector: "Commercial",
    description:
      "We design sophisticated office interiors that combine functionality, comfort, and modern aesthetics to create productive spaces.",
    highlights: ["Functionality", "Comfort", "Modern aesthetics"],
    images: ["office1", "office2", "office3", "office4"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */

export interface TeamMember {
  name: string;
  role: string;
  qualifications: string;
  bio?: string;
  focus: string[];
  image: AssetId;
  credentials?: string[];
}

export const team: TeamMember[] = [
  {
    name: "Er. V. Monika",
    role: "Founder · Interior Designer · Civil Engineer",
    qualifications: "B.E. Civil Engineering · 10 years of experience",
    bio: "Leads all construction management, site execution, and client delivery with a decade of field-proven expertise.",
    focus: ["Project Planning", "Site Execution", "Quality Control", "Cost Monitoring"],
    image: "teamMonika",
  },
  {
    name: "Er. V. Lenin",
    role: "Structural Engineer",
    qualifications: "B.E., F.I.V., M.I.E., C.E.(I) · Grade-1 Licensed Surveyor No. 169",
    focus: ["Stability Certificate", "Structural Engineering", "Approved Valuer", "DTCP Registered"],
    credentials: [
      "Panel Engineer Class 1A (Stability Certificate)",
      "Govt. Reg. Panel Engineer Class 1A",
      "Chartered Engineer",
      "Structural Engineer Grade-1, Thanjavur Corporation",
      "Registered Engineer Grade-1, DTCP",
      "Chartered President, Civil Engineer Association, Thanjavur",
    ],
    image: "teamLenin",
  },
  {
    name: "P. Manuneethicholan",
    role: "Architect & Design Consultant",
    qualifications: "Bachelor of Architecture · Design Lead",
    bio: "Brings creative precision to every project — from concept sketches to construction-ready drawings.",
    focus: ["Architectural Design", "Space Planning", "Building Drawings", "3D Visualization"],
    image: "teamManuneethicholan",
  },
  {
    name: "Nadimuthu",
    role: "Site Supervisor & Execution Coordinator",
    qualifications: "B.E. Civil Engineering · Field Expert",
    bio: "Ensures site discipline — labour coordination, material checks, quality inspection on every active project.",
    focus: ["Daily Site Monitoring", "Labour Coordination", "Material Verification", "Safety Monitoring"],
    image: "teamNadimuthu",
  },
  {
    name: "S. Anandan",
    role: "Client Relationship Manager & Technical Coordinator",
    qualifications: "B.E. Marine Engineering · CRO",
    bio: "Bridges clients and the technical team — communication, follow-ups, documentation, and coordination.",
    focus: ["Client Communication", "Business Development", "Project Follow-up", "Documentation"],
    image: "teamAnandan",
  },
  {
    name: "P. Madhavan",
    role: "Accounts & Project Coordinator",
    qualifications: "M.Sc. Statistics · Finance & Operations",
    bio: "Manages project financials, tracks budgets, and keeps site teams and management coordinated.",
    focus: ["Accounts Management", "Project Coordination", "Budget Tracking", "Financial Reporting"],
    image: "teamMadhavan",
  },
];

/* ------------------------------------------------------------------ */

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  context: string;
}

/** Excerpts of the three reviews published on the live home page. */
export const testimonials: Testimonial[] = [
  {
    quote: "Monika Luxe Interiors transformed our home beyond our expectations.",
    name: "Priya R.",
    location: "Thanjavur",
    context: "Home interiors",
  },
  {
    quote: "The final outcome perfectly reflected our vision.",
    name: "Karthik S.",
    location: "Trichy",
    context: "Office renovation",
  },
  {
    quote: "Their commitment to quality and customer satisfaction truly sets them apart.",
    name: "Arun Kumar",
    location: "Thanjavur",
    context: "Modular kitchen & interiors",
  },
];

/* ------------------------------------------------------------------ */

export const philosophy = [
  {
    title: "Understanding your lifestyle",
    text: "Every brief begins with how you live, work and gather — not with a catalogue.",
  },
  {
    title: "Intelligent spatial planning",
    text: "Circulation, light and proportion are resolved before a single finish is chosen.",
  },
  {
    title: "Material & finish selection",
    text: "Stone, timber, metal and paint are chosen for how they age, feel and catch the light.",
  },
  { title: "Functional elegance", text: "Beauty that does not get in the way of everyday use." },
  { title: "Construction detail", text: "Engineering-led site execution, so what is drawn is what gets built." },
  { title: "Design and execution, together", text: "One team carries the idea from drawing board to handover." },
];

export const processSteps = [
  { index: "01", title: "Consultation", text: "We understand your needs, preferences, site and project goals." },
  { index: "02", title: "Planning & Design", text: "We develop the concept, layouts and a suitable design direction." },
  { index: "03", title: "Material Selection", text: "We choose suitable materials, finishes and design elements with you." },
  { index: "04", title: "Execution", text: "We coordinate the agreed construction or interior work on site." },
  {
    index: "05",
    title: "Finishing & Handover",
    text: "We complete the finishing details and review the delivered work with you.",
  },
];

export const projectTypes = [
  "Interior design",
  "Modular kitchen",
  "Construction",
  "Renovation",
  "Commercial space",
  "Painting & finishes",
  "Rooftop gardening",
  "Turnkey project",
  "Other",
] as const;

export const budgetRanges = [
  "Prefer not to say",
  "Under ₹5 lakh",
  "₹5 – 15 lakh",
  "₹15 – 40 lakh",
  "₹40 lakh – 1 crore",
  "Above ₹1 crore",
] as const;

export const contactMethods = ["Phone call", "WhatsApp", "Email"] as const;

/** Maps a service slug (e.g. from /contact?service=…) to the form's project type. */
export const serviceToProjectType: Record<string, (typeof projectTypes)[number]> = {
  "interior-design": "Interior design",
  "modular-kitchens": "Modular kitchen",
  construction: "Construction",
  renovation: "Renovation",
  "commercial-spaces": "Commercial space",
  "painting-finishes": "Painting & finishes",
  "rooftop-gardening": "Rooftop gardening",
  turnkey: "Turnkey project",
};
