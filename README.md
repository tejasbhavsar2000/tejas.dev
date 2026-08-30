# tejas.dev

Personal site. Single page, plus a route per post.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — tokens are declared CSS-first in `app/globals.css` with
  `@theme inline`, so every one of them stays a live custom property
- **Motion** for animation, **React Flow** for the stack graph
- **MDX** via `next-mdx-remote`, highlighted at build time with **Shiki**

## The theme system

`lib/theme.ts` is the single source of truth for accent, type pairing, radius,
density, motion, and the grid overlay. Everything the dock changes is one CSS
custom property write on `<html>` — no React re-render, no stylesheet swap.

- `lib/theme-script.ts` is serialised into a blocking `<head>` script so the
  stored theme applies before first paint.
- Theme state round-trips through the URL hash (`#t=dark.ember.grotesk…`), so a
  visitor can share the version of the site they built.

## Layout

```
app/          routes — the single page, post pages, 404
components/
  canvas/     the editor-canvas hero
  theme/      provider + theme builder dock
  sections/   work, experience, stack, writing, contact
  mdx/        MDX renderer and in-post interactive demos
content/      site copy, projects, experience, stack, posts (.mdx)
lib/          theme engine, post loading
```

## Development

```bash
npm install
npm run dev        # http://localhost:5000
npm run build
npm run typecheck
```
