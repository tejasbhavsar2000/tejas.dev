"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SECTIONS } from "@/content/site";

/**
 * The single owner of scroll for the whole page.
 *
 * The previous version installed one listener per consumer, and each read
 * `document.body.scrollHeight` inside the handler, forcing a full page reflow on
 * every scroll event and then re-rendering through setState. Two consumers made
 * that two reflows and two renders per event, which is what froze the page.
 *
 * Here there is exactly one listener, it does no layout reads, and scroll
 * progress is written straight to a registered element rather than through
 * React, so scrolling causes zero re-renders.
 */

type Ctx = {
  active: string;
  /** Registers the progress bar. The rAF loop writes to it directly. */
  registerProgress: (el: HTMLElement | null) => void;
};

const ScrollContext = createContext<Ctx | null>(null);

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used inside <ScrollProvider>");
  return ctx;
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>(SECTIONS[0]?.id ?? "");

  const progressEl = useRef<HTMLElement | null>(null);
  const registerProgress = useCallback((el: HTMLElement | null) => {
    progressEl.current = el;
  }, []);

  useEffect(() => {
    let ticking = false;
    let raf = 0;

    // Page metrics are cached and refreshed on resize, never read during scroll.
    let maxScroll = 1;
    const measure = () => {
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };

    const update = () => {
      ticking = false;
      const el = progressEl.current;
      if (!el) return;
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      el.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });

    // Content height changes when accordions open or sections reorder.
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // Active section is driven by IntersectionObserver, which costs nothing on
  // the scroll path, and only sets state when the id genuinely changes.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActive((prev) =>
          prev === visible.target.id ? prev : visible.target.id,
        );
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({ active, registerProgress }),
    [active, registerProgress],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}
