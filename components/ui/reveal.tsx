"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Fade and rise as content enters the viewport, once.
 *
 * Motion state comes from the theme provider, which already holds it. The
 * previous version gave every instance its own MutationObserver on
 * documentElement plus a getComputedStyle call, roughly sixteen of each on a
 * full page, for a value React already knew.
 *
 * `as` exists so a row inside a list renders an <li> rather than a <div>
 * wrapping one, which was invalid nesting.
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: React.ReactNode;
  /** Seconds. Stagger siblings by roughly 0.05. */
  delay?: number;
  as?: "div" | "li";
  className?: string;
}) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const enabled = theme.motion !== "none" && !reduced;

  const Motion = as === "li" ? motion.li : motion.div;

  // The element type must not depend on `enabled`. The theme resolves after the
  // first render, so swapping between `motion.div` and a plain `div` remounts
  // the entire subtree: state resets, and any observer watching a child is left
  // holding a detached node. Disabling the animation keeps the tree stable.
  return (
    <Motion
      className={className}
      initial={enabled ? { opacity: 0, y: 14 } : false}
      whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </Motion>
  );
}
