"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Mounts the terrain behind the whole page, but never before the content.
 *
 * three.js is roughly 130 KB gzipped and this background sits above the fold, so
 * loading it normally would put it on the critical path of every visit. Instead
 * nothing renders on first paint, the chunk is fetched once the browser is idle,
 * and the result fades in. The fade is what turns the delay into something
 * nobody notices.
 */
const Terrain = dynamic(
  () => import("@/components/canvas/terrain").then((m) => m.Terrain),
  { ssr: false },
);

export function Backdrop() {
  const { theme, ready } = useTheme();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    // `requestIdleCallback` is not in Safari until recently, so fall back.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const w = window as IdleWindow;

    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const t = window.setTimeout(() => setIdle(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  // `Show: off` means the chunk is never requested at all, not merely hidden.
  const enabled = ready && idle && theme.show !== "off";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{ opacity: enabled ? 1 : 0 }}
    >
      {enabled && <Terrain />}
    </div>
  );
}
