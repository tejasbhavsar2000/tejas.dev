"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { ACCENTS } from "@/lib/theme";

/**
 * A dot matrix that drifts on its own and pushes away from the cursor.
 *
 * Written to be cheap by construction, because the first version was not:
 *
 * - The colour comes from theme state, not `getComputedStyle` per frame, which
 *   was forcing a root style recalc sixty times a second.
 * - `fillStyle` is set once per frame rather than once per dot, which was
 *   re-parsing an oklch string about 68,000 times a second.
 * - Every dot goes into a single path with one `fill()`, instead of 1,100
 *   separate `beginPath`/`arc`/`fill` calls. That needs a constant alpha, so
 *   cursor proximity is expressed as radius rather than opacity.
 * - The canvas rect is cached, so `pointermove` does no layout work.
 */

const SPACING = 32;
const DOT = 1.3;
const DOT_ACTIVE = 2.8;
const PUSH_RADIUS = 130;
const PUSH_STRENGTH = 22;
const MAX_DOTS = 900;

export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Resolved here so the draw loop never touches the DOM for a colour.
  const accent = ACCENTS[theme.accent] ?? ACCENTS.ember;
  const lightness = theme.mode === "dark" ? 0.76 : 0.6;
  const fill = `oklch(${lightness} ${accent.c} ${accent.h} / 0.34)`;
  const motionOff = theme.motion === "none";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = motionOff || reduced;

    let width = 0;
    let height = 0;
    let stepX = SPACING;
    let stepY = SPACING;
    let raf = 0;
    let visible = true;

    // Pointer is kept in client coordinates, converted with a cached rect, so
    // no handler ever forces layout.
    let rectLeft = 0;
    let rectTop = 0;
    const pointer = { x: -9999, y: -9999 };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop = rect.top;
      return rect;
    };

    const resize = () => {
      const rect = measure();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Widen the grid rather than draw an unbounded number of dots.
      stepX = SPACING;
      stepY = SPACING;
      let count = Math.ceil(width / stepX) * Math.ceil(height / stepY);
      while (count > MAX_DOTS) {
        stepX += 4;
        stepY += 4;
        count = Math.ceil(width / stepX) * Math.ceil(height / stepY);
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fill;

      const px = pointer.x;
      const py = pointer.y;

      // One path for the small dots, one for those near the cursor. Two fills
      // per frame in total, rather than one per dot.
      ctx.beginPath();
      const active: number[] = [];

      for (let x = stepX / 2; x < width; x += stepX) {
        for (let y = stepY / 2; y < height; y += stepY) {
          let dx = x;
          let dy = y;

          if (!still) {
            dx += Math.sin(t * 0.0006 + y * 0.02) * 1.6;
            dy += Math.cos(t * 0.0005 + x * 0.02) * 1.6;
          }

          const ox = dx - px;
          const oy = dy - py;
          const distSq = ox * ox + oy * oy;

          if (distSq < PUSH_RADIUS * PUSH_RADIUS) {
            const dist = Math.sqrt(distSq) || 1;
            const force = (1 - dist / PUSH_RADIUS) ** 2;
            active.push(
              dx + (ox / dist) * force * PUSH_STRENGTH,
              dy + (oy / dist) * force * PUSH_STRENGTH,
              DOT + force * (DOT_ACTIVE - DOT),
            );
            continue;
          }

          ctx.moveTo(dx + DOT, dy);
          ctx.arc(dx, dy, DOT, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      if (active.length) {
        ctx.beginPath();
        for (let i = 0; i < active.length; i += 3) {
          const ax = active[i];
          const ay = active[i + 1];
          const ar = active[i + 2];
          ctx.moveTo(ax + ar, ay);
          ctx.arc(ax, ay, ar, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      draw(now);
      if (visible && !still) raf = requestAnimationFrame(frame);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (still) {
        draw(0);
        return;
      }
      if (!visible) return;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX - rectLeft;
      pointer.y = e.clientY - rectTop;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    // The rect moves as the page scrolls; refresh it there, not per pointermove.
    const onScroll = () => measure();

    resize();
    run();

    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
    // Re-running on colour or motion change repaints with the new theme.
  }, [fill, motionOff]);

  // The canvas is wrapped rather than positioned directly. An absolutely
  // positioned replaced element with `width: auto` takes its *intrinsic* size,
  // so insets alone left it at the default 300x150. The wrapper takes the
  // positioning and the canvas fills it with an explicit 100%.
  return (
    <div
      aria-hidden
      className={className}
      // Fade the field out toward the text so it never competes with reading.
      style={{
        maskImage:
          "radial-gradient(115% 95% at 70% 45%, black 25%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(115% 95% at 70% 45%, black 25%, transparent 75%)",
      }}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
