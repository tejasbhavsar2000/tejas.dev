export const SITE = {
  name: "Tejas Bhavsar",
  role: "Software Engineer",
  url: "https://tejas-dev.vercel.app",
  email: "tejasb.dev@gmail.com",
  twitterHandle: "@_tejas_bhavsar",
  description:
    "Software engineer with a frontend lean, building for the web. Previously @ Alai (YC W24).",
  // The frontend lean is carried by the sentence, never by the job title.
  intro: "I build for the web, mostly the parts people see and touch.",
  previously: {
    company: "Alai",
    badge: "YC W24",
    href: "https://getalai.com/",
  },
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

/**
 * Source of truth for section order. Section numerals and the header nav both
 * derive from position here, so adding one renumbers the rest automatically.
 */
export const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
