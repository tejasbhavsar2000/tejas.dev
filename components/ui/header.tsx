"use client";

import { useEffect, useState } from "react";
import { SECTIONS, SITE } from "@/content/site";

export function Header() {
  const [active, setActive] = useState<string>("top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[72rem] items-center justify-between gap-6 px-6 py-3 sm:px-8">
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-tight"
        >
          {SITE.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </a>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-1">
            {SECTIONS.filter((s) => s.id !== "top").map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className={`rounded-xs px-2.5 py-1.5 font-mono text-2xs uppercase tracking-wider transition-colors ${
                    active === s.id
                      ? "text-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
