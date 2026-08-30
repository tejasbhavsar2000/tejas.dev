export type Project = {
  slug: string;
  name: string;
  year: string;
  blurb: string;
  /** Why it belongs here rather than in a list of repositories. */
  note: string;
  tags: string[];
  live?: string;
  source?: string;
  /**
   * `demo` shows a clip on the card and runs the real thing in a dialog.
   * `video` is a clip only. `none` gets a plain panel.
   */
  media:
    | { kind: "demo"; preview: string; src: string; hint: string }
    | { kind: "video"; preview: string }
    | { kind: "none" };
};

export const PROJECTS: Project[] = [
  {
    slug: "character-controller",
    name: "Character Controller",
    year: "2024",
    blurb:
      "A third person character controller with acceleration based movement, so input eases into motion instead of snapping to it.",
    note: "Direct manipulation with a physics body attached.",
    tags: ["Three.js", "React", "Vite", "cannon-es"],
    live: "https://tejasbhavsar2000.github.io/character-controller-example/",
    source: "https://github.com/tejasbhavsar2000/character-controller-example",
    media: {
      kind: "demo",
      preview: "/projects/character-controller.webm",
      src: "https://tejasbhavsar2000.github.io/character-controller-example/",
      hint: "Click to focus, then WASD to move",
    },
  },
  {
    slug: "block-coder",
    name: "Block Coder",
    year: "2023",
    blurb:
      "A visual programming interface that lets non programmers assemble working code out of blocks, with the generated source rendered live beside the canvas.",
    note: "An editor where the blocks are the source of truth and the code is the output.",
    tags: ["React", "Blockly", "PrismJS"],
    live: "https://block-code.vercel.app/",
    media: {
      kind: "demo",
      preview: "/projects/block-coder.webm",
      src: "https://block-code.vercel.app/",
      hint: "Drag blocks and the code updates as you build",
    },
  },
  {
    slug: "wire-inventory",
    name: "Wire Inventory",
    year: "2025",
    blurb:
      "An inventory system for a wire manufacturer that talks to the hardware on the floor: label printers over WebUSB, weighing machines over the Web Serial API.",
    note: "The browser as a hardware client, with no installed agent and no desktop shim.",
    tags: ["Next.js", "TypeScript", "Prisma", "Supabase", "WebUSB"],
    media: { kind: "none" },
  },
  {
    slug: "art-by-drishti",
    name: "Art By Drishti",
    year: "2024",
    blurb:
      "An artist's portfolio built from Figma designs, with the asset pipeline tuned so a gallery heavy site still loads fast.",
    note: "Design handoff executed faithfully, then made quick.",
    tags: ["Next.js", "Tailwind", "Figma"],
    live: "https://www.artbydrishti.com/",
    media: { kind: "video", preview: "/projects/art-by-drishti.webm" },
  },
];
