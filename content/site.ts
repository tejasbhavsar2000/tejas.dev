export const SITE = {
  name: "Tejas Bhavsar",
  role: "Design Engineer",
  url: "https://tejas.dev",
  email: "tejasb.dev@gmail.com",
  twitterHandle: "@_tejas_bhavsar",
  description:
    "Design engineer building direct-manipulation interfaces — editors, canvases, and the rendering runtimes underneath them.",
  // The one line the whole site is arguing for.
  tagline: "I build interfaces you can grab.",
  intro:
    "Editors, canvases, and the rendering runtimes underneath them. Most recently on the founding engineering team at Alai (YC W24), where I replaced a canvas renderer with a DOM-first architecture and made editing a slide feel like editing a document.",
  links: {
    github: "https://github.com/tejasbhavsar2000",
    twitter: "https://twitter.com/_tejas_bhavsar",
    linkedin: "https://www.linkedin.com/in/tejas-bhavsar-8a425b188/",
    email: "mailto:tejasb.dev@gmail.com",
    // Google Drive so it can be updated without a redeploy.
    resume:
      "https://drive.google.com/file/d/1KCguIZDSsOyj8b1aKIFovvqWxJpmIbJ7/view?usp=sharing",
  },
} as const;

export const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;
