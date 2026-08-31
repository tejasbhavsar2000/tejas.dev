export type Role = {
  company: string;
  badge?: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  highlights: { text: string; metric?: string }[];
  stack: string[];
};

export const EXPERIENCE: Role[] = [
  {
    company: "Alai",
    badge: "YC W24",
    title: "Software Engineer · Founding Engineering Team",
    start: "Oct 2025",
    end: "Aug 2026",
    summary:
      "An AI presentation platform that turns a prompt into a deck you can actually edit. I worked on the editor itself: how slides render, how you select things, and how it all survives a resize.",
    highlights: [
      {
        text: "Replaced TLDraw's renderer and the Yoga layout engine with a DOM-first architecture, so slide content lays out with the browser instead of fighting it.",
        metric: "80% faster manual editing",
      },
      {
        text: "Built a custom theme builder that lets users create and edit their own deck themes, with colour, type, and layout tokens resolved at render time.",
      },
      {
        text: "Designed reusable runtime patterns for complex slide components: nested editing, precise selection, responsive resizing, and reliable export.",
      },
      {
        text: "Worked directly with the founders and designers on frontend architecture and UI/UX decisions.",
      },
    ],
    stack: ["React", "TypeScript", "Next.js", "Tailwind"],
  },
  {
    company: "Alai",
    badge: "YC W24",
    title: "Software Engineer, Intern",
    start: "Apr 2025",
    end: "Sep 2025",
    summary:
      "Started on the component layer: the charts, diagrams, and data blocks that make up a slide.",
    highlights: [
      {
        text: "Shipped interactive data-representation components for the presentation editor.",
        metric: "20+ components",
      },
      {
        text: "Introduced SVG-based scalable rendering, holding visual quality, alignment, and content sizing steady through resize interactions.",
      },
      {
        text: "Optimized sidebar-driven slide editing workflows for faster component updates.",
      },
    ],
    stack: ["React", "TypeScript", "SVG", "D3"],
  },
  {
    company: "Freelance",
    title: "Full-stack & Frontend",
    start: "2023",
    end: "2025",
    summary:
      "Client work, mostly where a real interface was the point, such as a hardware-connected inventory system and an artist's portfolio built from Figma.",
    highlights: [
      {
        text: "Built Wire Inventory: an inventory management app talking to label printers over WebUSB and weighing machines over the Web Serial API.",
      },
      {
        text: "Built an artist portfolio from Figma designs, optimizing assets for page load performance.",
      },
    ],
    stack: ["Next.js", "Prisma", "Supabase", "TypeScript"],
  },
];
