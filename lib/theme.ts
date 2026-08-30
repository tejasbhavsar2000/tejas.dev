/**
 * The theme system that the dock drives.
 *
 * Every option is a plain CSS custom property write on <html>, which is why the
 * whole page can restyle in one frame without React re-rendering anything.
 */

export type Mode = "light" | "dark";

export const ACCENTS = {
  ember: { label: "Ember", h: 45, c: 0.15 },
  rose: { label: "Rose", h: 12, c: 0.16 },
  iris: { label: "Iris", h: 292, c: 0.16 },
  azure: { label: "Azure", h: 250, c: 0.14 },
  lime: { label: "Lime", h: 140, c: 0.15 },
} as const;

export const FONTS = {
  grotesk: {
    label: "Grotesk",
    display: "var(--font-space-grotesk)",
    body: "var(--font-inter)",
  },
  neue: {
    label: "Neue",
    display: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  editorial: {
    label: "Editorial",
    display: "var(--font-instrument-serif)",
    body: "var(--font-inter)",
  },
  terminal: {
    label: "Terminal",
    display: "var(--font-jetbrains-mono)",
    body: "var(--font-jetbrains-mono)",
  },
} as const;

export const RADII = {
  sharp: { label: "Sharp", value: "0rem" },
  soft: { label: "Soft", value: "0.5rem" },
  round: { label: "Round", value: "0.875rem" },
  pill: { label: "Pill", value: "1.5rem" },
} as const;

export const DENSITIES = {
  compact: { label: "Compact", value: "0.215rem" },
  normal: { label: "Normal", value: "0.25rem" },
  airy: { label: "Airy", value: "0.295rem" },
} as const;

export const MOTIONS = {
  none: { label: "None", value: "0" },
  subtle: { label: "Subtle", value: "0.55" },
  full: { label: "Full", value: "1" },
} as const;

export type AccentId = keyof typeof ACCENTS;
export type FontId = keyof typeof FONTS;
export type RadiusId = keyof typeof RADII;
export type DensityId = keyof typeof DENSITIES;
export type MotionId = keyof typeof MOTIONS;

export type ThemeState = {
  mode: Mode;
  accent: AccentId;
  font: FontId;
  radius: RadiusId;
  density: DensityId;
  motion: MotionId;
};

export const DEFAULT_THEME: ThemeState = {
  mode: "dark",
  accent: "ember",
  font: "grotesk",
  radius: "round",
  density: "normal",
  motion: "full",
};

export const STORAGE_KEY = "tejas.theme";

/** Applies a theme to the document. Pure DOM writes — no React involved. */
export function applyTheme(theme: ThemeState, root: HTMLElement) {
  const accent = ACCENTS[theme.accent] ?? ACCENTS[DEFAULT_THEME.accent];
  const font = FONTS[theme.font] ?? FONTS[DEFAULT_THEME.font];
  const radius = RADII[theme.radius] ?? RADII[DEFAULT_THEME.radius];
  const density = DENSITIES[theme.density] ?? DENSITIES[DEFAULT_THEME.density];
  const motion = MOTIONS[theme.motion] ?? MOTIONS[DEFAULT_THEME.motion];

  const s = root.style;
  s.setProperty("--accent-h", String(accent.h));
  s.setProperty("--accent-c", String(accent.c));
  s.setProperty("--font-display-active", font.display);
  s.setProperty("--font-body-active", font.body);
  s.setProperty("--font-mono-active", "var(--font-jetbrains-mono)");
  s.setProperty("--radius-base", radius.value);
  s.setProperty("--spacing", density.value);
  s.setProperty("--motion", motion.value);

  root.dataset.mode = theme.mode;
  root.dataset.motion = theme.motion;
  root.style.colorScheme = theme.mode;
}

/* -------------------------------------------------------------------------
   Sharing: the theme round-trips through the URL hash so a visitor can send
   someone their version of the site.
   ------------------------------------------------------------------------- */

const ORDER = ["mode", "accent", "font", "radius", "density", "motion"] as const;

export function encodeTheme(theme: ThemeState): string {
  return ORDER.map((k) => theme[k]).join(".");
}

export function decodeTheme(raw: string | null | undefined): ThemeState | null {
  if (!raw) return null;
  const parts = raw.split(".");
  // Links shared before the layout grid was removed carry a seventh field.
  if (parts.length !== ORDER.length && parts.length !== ORDER.length + 1)
    return null;

  const [mode, accent, font, radius, density, motion] = parts;
  const valid =
    (mode === "light" || mode === "dark") &&
    accent in ACCENTS &&
    font in FONTS &&
    radius in RADII &&
    density in DENSITIES &&
    motion in MOTIONS;

  if (!valid) return null;

  return {
    mode: mode as Mode,
    accent: accent as AccentId,
    font: font as FontId,
    radius: radius as RadiusId,
    density: density as DensityId,
    motion: motion as MotionId,
  };
}

export function randomTheme(current: ThemeState): ThemeState {
  const pick = <T extends string>(obj: Record<T, unknown>, avoid?: T): T => {
    const keys = (Object.keys(obj) as T[]).filter((k) => k !== avoid);
    return keys[Math.floor(Math.random() * keys.length)];
  };
  return {
    ...current,
    accent: pick(ACCENTS, current.accent),
    font: pick(FONTS, current.font),
    radius: pick(RADII, current.radius),
    density: pick(DENSITIES, current.density),
  };
}

/** Mirrors the pre-paint init script, for React to pick up after hydration. */
export function resolveInitialTheme(): ThemeState {
  if (typeof window === "undefined") return DEFAULT_THEME;

  const fromHash = decodeTheme(
    window.location.hash.match(/(?:^#|&)t=([^&]+)/)?.[1] &&
      decodeURIComponent(window.location.hash.match(/(?:^#|&)t=([^&]+)/)![1]),
  );
  if (fromHash) return fromHash;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = { ...DEFAULT_THEME, ...JSON.parse(stored) } as ThemeState;
      if (parsed.accent in ACCENTS && parsed.font in FONTS) return parsed;
    }
  } catch {
    /* storage can throw in private windows — fall through to the default */
  }

  return {
    ...DEFAULT_THEME,
    mode: window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  };
}
