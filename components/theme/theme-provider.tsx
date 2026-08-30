"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  ThemeState,
  applyTheme,
  randomTheme,
  resolveInitialTheme,
} from "@/lib/theme";

type Origin = { x: number; y: number };

type ThemeContextValue = {
  theme: ThemeState;
  ready: boolean;
  set: <K extends keyof ThemeState>(
    key: K,
    value: ThemeState[K],
    origin?: Origin,
  ) => void;
  randomize: () => void;
  reset: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The pre-paint script has already styled the document; React catches up on
  // mount so the dock's selected states match what is actually applied.
  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    setTheme(resolveInitialTheme());
    setReady(true);
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    applyTheme(theme, document.documentElement);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      /* non-fatal */
    }
  }, [theme]);

  const commit = useCallback((next: ThemeState, origin?: Origin) => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canWipe =
      !reduced &&
      next.motion !== "none" &&
      typeof document.startViewTransition === "function";

    if (!canWipe) {
      setTheme(next);
      return;
    }

    if (origin) {
      root.style.setProperty("--wipe-x", `${origin.x}px`);
      root.style.setProperty("--wipe-y", `${origin.y}px`);
    }
    root.dataset.wipe = "active";

    const transition = document.startViewTransition!(() => {
      applyTheme(next, root);
      setTheme(next);
    });
    void transition.finished.finally(() => {
      delete root.dataset.wipe;
    });
  }, []);

  const set = useCallback<ThemeContextValue["set"]>(
    (key, value, origin) => {
      setTheme((prev) => {
        const next = { ...prev, [key]: value };
        // Only the light/dark swap gets the circular wipe; the rest are instant.
        if (key === "mode") {
          queueMicrotask(() => commit(next, origin));
          return prev;
        }
        return next;
      });
    },
    [commit],
  );

  const randomize = useCallback(() => setTheme((p) => randomTheme(p)), []);
  const reset = useCallback(
    () => setTheme((p) => ({ ...DEFAULT_THEME, mode: p.mode })),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, ready, set, randomize, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}
