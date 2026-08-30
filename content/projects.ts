export type Project = {
  slug: string;
  name: string;
  year: string;
  blurb: string;
  /** The reason it belongs on a design engineer's site. */
  note: string;
  tags: string[];
  live?: string;
  source?: string;
  /** `embed` renders the real thing in an iframe; `video` falls back to a clip. */
  media:
    | { kind: "embed"; src: string; label: string }
    | { kind: "video"; src: string }
    | { kind: "none" };
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "character-controller",
    name: "Character Controller",
    year: "2024",
    blurb:
      "A third-person character controller with acceleration-based movement, so input eases into motion instead of snapping to it.",
    note: "Direct manipulation with a physics body attached. Click in and use WASD.",
    tags: ["Three.js", "React", "Vite", "cannon-es"],
    live: "https://tejasbhavsar2000.github.io/character-controller-example/",
    source: "https://github.com/tejasbhavsar2000/character-controller-example",
    media: {
      kind: "embed",
      src: "https://tejasbhavsar2000.github.io/character-controller-example/",
      label: "Click to focus, then WASD to move",
    },
    featured: true,
  },
  {
    slug: "block-coder",
    name: "Block Coder",
    year: "2023",
    blurb:
      "A visual programming interface that lets non-programmers assemble working code out of blocks, with the generated source rendered live beside the canvas.",
    note: "An editor where the blocks are the source of truth and the code is the output.",
    tags: ["React", "Blockly", "PrismJS"],
    live: "https://block-code.vercel.app/",
    media: {
      kind: "embed",
      src: "https://block-code.vercel.app/",
      label: "Drag blocks — the code updates as you build",
    },
    featured: true,
  },
  {
    slug: "wire-inventory",
    name: "Wire Inventory",
    year: "2025",
    blurb:
      "An inventory system for a wire manufacturer that talks to the hardware on the floor — label printers over WebUSB, weighing machines over the Web Serial API.",
    note: "The browser as a hardware client. No installed agent, no desktop shim.",
    tags: ["Next.js", "TypeScript", "Prisma", "Supabase", "WebUSB"],
    media: { kind: "none" },
    featured: true,
  },
  {
    slug: "art-by-drishti",
    name: "Art By Drishti",
    year: "2024",
    blurb:
      "An artist's portfolio built from Figma designs, with the asset pipeline tuned so a gallery-heavy site still loads fast.",
    note: "Design handoff executed faithfully, then made quick.",
    tags: ["Next.js", "Tailwind", "Figma"],
    live: "https://www.artbydrishti.com/",
    media: { kind: "video", src: "/projects/art-by-drishti.webm" },
  },
  {
    slug: "discussion-forum",
    name: "Discussion Forum",
    year: "2022",
    blurb:
      "A threaded discussion board with an Express API and an embedded document store.",
    note: "Early work — kept here because the thread rendering still holds up.",
    tags: ["React", "Express", "NeDB"],
    source: "https://github.com/tejasbhavsar2000/Discussion_Forum",
    media: { kind: "video", src: "/projects/discussion-forum.webm" },
  },
];
