# tejas.dev

Personal site. One page, plus a route per post.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** with a CSS-first token layer in `app/globals.css`
- **Motion** for animation and drag, **three.js** for the background
- **MDX** via `next-mdx-remote`, highlighted at build time with **Shiki**
- **Playwright** for a browser smoke test

## The theme system

`lib/theme.ts` is the single source of truth for the colour mode, accent, type
pairing, radius, density, motion, and the five background controls. Everything
the dock changes is one CSS custom property write on `<html>`, so no React
re-render is involved.

- `lib/theme-script.ts` is serialised into a blocking `<head>` script, so the
  stored theme applies before first paint and nothing flashes.
- Theme state round-trips through the URL hash (`#t=light.ember.grotesk…`), so a
  visitor can share the version of the site they built. The first six fields are
  positionally frozen, and anything after them is optional, so older links still
  decode.

## The background

`components/canvas/terrain.tsx` is a noise field displaced in a **vertex
shader**, drawn as one `LineSegments` in a single draw call. It is loaded only
once the browser is idle, so three.js never touches the critical path, and it
stops rendering entirely when the tab is hidden.

The dock controls its visibility, height, flow, grid density, and how it reacts
to the cursor. Setting `Show: off` means the chunk is never fetched at all.

## Interaction

- **The hero** blocks move freely, as a transform offset on top of normal flow,
  so the untouched layout stays responsive at every width.
- **Projects and contact links** reorder by dragging a grip, which appears on
  hover. Every row keeps its own click.
- Both are pointer-only, at `sm` and up. Touch gets the static layout, and no
  gesture ever captures the page scroll.

## Layout

```
app/          routes, plus robots, sitemap and the OG image
components/
  canvas/     terrain background and the hero free move
  layout/     scroll provider
  sections/   hero, experience, projects, writing, contact
  theme/      provider and the theme dock
  ui/         section, header, footer, reveal, sortable, dialog
  mdx/        MDX renderer and in-post interactive demos
content/      site copy, projects, experience, posts (.mdx)
lib/          theme engine, post loading
scripts/      smoke test
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run smoke      # needs a server running, see below
```

`npm run smoke` drives a real browser against a running server and checks the
things that are easy to break without noticing: long tasks while scrolling,
horizontal overflow at three widths, the scroll progress bar, the theme toggle
surviving a skipped view transition, the cursor preview tracking the pointer
across a scroll, and that three.js is not in the initial bundle.

```bash
npm run build && npx next start -p 3000
BASE_URL=http://localhost:3000 npm run smoke
```

It launches Chromium with the hardware GPU on purpose. Headless defaults to
SwiftShader, which rasterises in software and would make the performance
assertions meaningless.

Opening the dev server from a phone on the same network works: `next.config.ts`
derives this machine's LAN addresses into `allowedDevOrigins`, because Next
otherwise blocks cross origin requests to dev assets and the page arrives with
no JavaScript.
