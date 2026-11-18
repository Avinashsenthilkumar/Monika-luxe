/**
 * Scroll choreography for the architectural journey.
 * Every number is a fraction (0 → 1) of the pinned section's scroll distance.
 * 3D geometry, materials, camera, captions and overlays all read from here,
 * so re-timing the film only ever happens in this file.
 */
export const PHASE = {
  blueprint: [0, 0.14],
  blueprintFade: [0.15, 0.26],
  structure: [0.14, 0.34],
  materials: [0.34, 0.48],
  dusk: [0.4, 0.52],
  enter: [0.5, 0.62],
  interiors: [0.62, 0.9],
  final: [0.895, 1],
} as const satisfies Record<string, readonly [number, number]>;

/** Interior chapter: the camera stays in the villa's living room, then cuts to each furnished room. */
export const ROOM_WINDOWS = {
  living: [0.62, 0.69],
  kitchen: [0.69, 0.76],
  bedroom: [0.76, 0.83],
  office: [0.83, 0.895],
} as const satisfies Record<string, readonly [number, number]>;

export interface Chapter {
  id: string;
  index: string;
  label: string;
  title: string;
  text: string;
  /** progress window in which this chapter's caption is shown */
  at: readonly [number, number];
  tone: "ink" | "ivory";
}

export const chapters: Chapter[] = [
  {
    id: "blueprint",
    index: "01",
    label: "Blueprint",
    title: "Every home begins with a single line.",
    text: "Site, orientation, light and the way you live are drawn before anything is built.",
    at: [0, 0.15],
    tone: "ink",
  },
  {
    id: "structure",
    index: "02",
    label: "Structure",
    title: "Foundation, columns, volumes.",
    text: "Engineering gives the idea its bones — plinth, frame, walls and slabs rise into place.",
    at: [0.15, 0.34],
    tone: "ink",
  },
  {
    id: "materials",
    index: "03",
    label: "Materials",
    title: "Stone, timber, glass and light.",
    text: "Natural materials and warm lighting give the structure its character.",
    at: [0.34, 0.46],
    tone: "ink",
  },
  {
    id: "enter",
    index: "04",
    label: "Enter",
    title: "Lights on. Step inside.",
    text: "Dusk falls, the lights come on — and we step through the glass into the living room.",
    at: [0.46, 0.62],
    tone: "ivory",
  },
  {
    id: "interiors",
    index: "05",
    label: "Interiors",
    title: "Room by room.",
    text: "",
    at: [0.62, 0.895],
    tone: "ivory",
  },
  {
    id: "final",
    index: "06",
    label: "Reveal",
    title: "Your Vision. Our Craft.",
    text: "",
    at: [0.895, 1.0001],
    tone: "ivory",
  },
];

/**
 * Chapters for the rendered walkthrough (public/sequences/house): construction
 * time-lapse of the exterior (first 10 s) followed by the interior walk-through
 * (next 10 s). `at` is the share of the film / scroll
 * distance. Re-time these if the video changes.
 */
export const SEQUENCE_CHAPTERS: Chapter[] = [
  {
    id: "site",
    index: "01",
    label: "Site",
    title: "Every home begins with the ground.",
    text: "The site is cleared, the plinth is cast and the column steel stands ready.",
    at: [0, 0.075],
    tone: "ink",
  },
  {
    id: "structure",
    index: "02",
    label: "Structure",
    title: "Columns and walls rise.",
    text: "Frame, slabs and brickwork go up floor by floor, supervised on site every day.",
    at: [0.075, 0.175],
    tone: "ink",
  },
  {
    id: "facade",
    index: "03",
    label: "Facade",
    title: "The facade takes shape.",
    text: "Wood-finish cladding, white plaster, arched windows and wide glazing.",
    at: [0.175, 0.325],
    tone: "ink",
  },
  {
    id: "finished",
    index: "04",
    label: "Finished",
    title: "The finished home.",
    text: "Landscaped, lit and ready to move in.",
    at: [0.325, 0.5],
    tone: "ivory",
  },
  {
    id: "enter",
    index: "05",
    label: "Welcome",
    title: "Welcome home.",
    text: "The lit facade, the gate and the front door — and in we go.",
    at: [0.5, 0.585],
    tone: "ivory",
  },
  {
    id: "living",
    index: "06",
    label: "Living",
    title: "The living room.",
    text: "A double-height feature wall, marble floors and soft cove lighting.",
    at: [0.585, 0.72],
    tone: "ivory",
  },
  {
    id: "kitchen",
    index: "07",
    label: "Kitchen",
    title: "Dining & modular kitchen.",
    text: "Warm wood, stone counters and smart storage, made for everyday family life.",
    at: [0.72, 0.78],
    tone: "ivory",
  },
  {
    id: "bedroom",
    index: "08",
    label: "Bedroom",
    title: "The master bedroom.",
    text: "A panelled headboard wall, a glass-front wardrobe and quiet, warm light.",
    at: [0.78, 0.85],
    tone: "ivory",
  },
  {
    id: "bath",
    index: "09",
    label: "Stairs",
    title: "Bath & a lit staircase.",
    text: "A glass shower and backlit mirror, then warm-lit steps rising upstairs.",
    at: [0.85, 0.895],
    tone: "ivory",
  },
  {
    id: "terrace",
    index: "10",
    label: "Upstairs",
    title: "The upper floor.",
    text: "A gallery over the double-height living room, opening onto the terrace deck.",
    at: [0.895, 0.95],
    tone: "ivory",
  },
  {
    id: "final",
    index: "11",
    label: "Reveal",
    title: "Your Vision. Our Craft.",
    text: "",
    at: [0.95, 1.0001],
    tone: "ivory",
  },
];
