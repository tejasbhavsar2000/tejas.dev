"use client";

import { useScroll } from "@/components/layout/scroll-provider";
import { SECTIONS, SITE } from "@/content/site";

export function Header() {
  const { active, registerProgress } = useScroll();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[64rem] items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
        <a
          href="#top"
          className="font-display text-base font-semibold tracking-tight"
        >
          {SITE.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </a>

        {/* Below sm the section links crowd the bar, and scrolling is the
            faster way to move around a page this short anyway. */}
        <nav aria-label="Sections" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? "true" : undefined}
                  className={`rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                    active === section.id
                      ? "text-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/*
        Written to directly by the scroll loop, so scrolling never re-renders.
        The initial state is inline rather than a `scale-x-0` class: Tailwind v4
        compiles that to the `scale` property, which composes on top of the
        `transform` written here and pins the bar at zero width.
      */}
      <div
        ref={registerProgress}
        aria-hidden
        style={{ transform: "scaleX(0)" }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
      />
    </header>
  );
}
