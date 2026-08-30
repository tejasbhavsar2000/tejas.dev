export type StackGroup = {
  id: string;
  label: string;
  items: { name: string; note?: string; href?: string }[];
};

export const STACK: StackGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: [
      { name: "TypeScript", href: "https://www.typescriptlang.org/" },
      { name: "JavaScript" },
      { name: "Python", href: "https://www.python.org/" },
      { name: "HTML" },
      { name: "CSS" },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    items: [
      { name: "React", href: "https://react.dev/" },
      { name: "Next.js", href: "https://nextjs.org/" },
      { name: "FastAPI", href: "https://fastapi.tiangolo.com/" },
      { name: "Tauri", href: "https://v2.tauri.app/" },
    ],
  },
  {
    id: "interface",
    label: "Interface",
    items: [
      { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
      { name: "Motion", href: "https://motion.dev/" },
      { name: "Three.js", href: "https://threejs.org/" },
      { name: "Blockly", href: "https://developers.google.com/blockly" },
      { name: "React Flow", href: "https://reactflow.dev/" },
      { name: "Figma", href: "https://figma.com/" },
    ],
  },
  {
    id: "data",
    label: "Data & backend",
    items: [
      { name: "PostgreSQL", href: "https://www.postgresql.org/" },
      { name: "Prisma", href: "https://www.prisma.io/" },
      { name: "Supabase", href: "https://supabase.com/" },
      { name: "MongoDB", href: "https://www.mongodb.com/" },
      { name: "Firebase", href: "https://firebase.google.com/" },
      { name: "Zod", href: "https://zod.dev/" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    items: [
      { name: "Git" },
      { name: "Docker", href: "https://www.docker.com/" },
      { name: "AWS S3" },
      { name: "Azure" },
    ],
  },
];
