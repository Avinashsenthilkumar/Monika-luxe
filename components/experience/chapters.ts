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
