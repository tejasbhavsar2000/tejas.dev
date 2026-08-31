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

/* -------------------------------------------------------------------------
   The background terrain. These feed shader uniforms rather than CSS, so the
   values here are numbers the scene consumes directly.
   ------------------------------------------------------------------------- */

export const FLOWS = {
  still: { label: "Still", speed: 0 },
  slow: { label: "Slow", speed: 0.11 },
  drifting: { label: "Drifting", speed: 0.3 },
} as const;

export const TERRAINS = {
  flat: { label: "Flat", amplitude: 7, scale: 0.012 },
  gentle: { label: "Gentle", amplitude: 16, scale: 0.011 },
  dramatic: { label: "Dramatic", amplitude: 26, scale: 0.009 },
} as const;

/** The performance lever: lines scale at roughly two per cell. */
export const GRIDS = {
  coarse: { label: "Coarse", segments: 56 },
  medium: { label: "Medium", segments: 88 },
  fine: { label: "Fine", segments: 128 },
} as const;

export const SHOWS = {
  off: { label: "Off", opacity: 0 },
  subtle: { label: "Subtle", opacity: 0.5 },
  visible: { label: "Visible", opacity: 1 },
} as const;

export const CURSORS = {
  off: { label: "Off", lift: 0, glow: 0 },
  glow: { label: "Glow", lift: 0, glow: 1 },
  swell: { label: "Swell", lift: 1, glow: 0.8 },
} as const;

export type AccentId = keyof typeof ACCENTS;
export type FontId = keyof typeof FONTS;
export type RadiusId = keyof typeof RADII;
export type DensityId = keyof typeof DENSITIES;
export type MotionId = keyof typeof MOTIONS;
export type FlowId = keyof typeof FLOWS;
export type TerrainId = keyof typeof TERRAINS;
export type GridId = keyof typeof GRIDS;
export type ShowId = keyof typeof SHOWS;
export type CursorId = keyof typeof CURSORS;

export type ThemeState = {
  mode: Mode;
  accent: AccentId;
  font: FontId;
  radius: RadiusId;
  density: DensityId;
  motion: MotionId;
  flow: FlowId;
  terrain: TerrainId;
  grid: GridId;
  show: ShowId;
  cursor: CursorId;
};

export const DEFAULT_THEME: ThemeState = {
  mode: "light",
  accent: "ember",
  font: "grotesk",
  radius: "round",
  density: "normal",
  motion: "full",
  flow: "slow",
  terrain: "gentle",
  grid: "coarse",
  show: "visible",
  cursor: "swell",
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

  // The page no longer follows the OS scheme, so a media query driven
  // theme-color would disagree with what is on screen. Keep it in step instead.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme.mode === "dark" ? "#191716" : "#fbfaf9");
  }
}

/* -------------------------------------------------------------------------
   Sharing: the theme round-trips through the URL hash so a visitor can send
   someone their version of the site.
   ------------------------------------------------------------------------- */

/**
 * The first six are the original core and their positions are frozen: links
 * copied before the background existed still decode against them. Anything
 * after is optional and falls back to the default when absent.
 */
const CORE = ["mode", "accent", "font", "radius", "density", "motion"] as const;
const EXTRA = ["flow", "terrain", "grid", "show", "cursor"] as const;

export function encodeTheme(theme: ThemeState): string {
  return [...CORE, ...EXTRA].map((k) => theme[k]).join(".");
}

export function decodeTheme(raw: string | null | undefined): ThemeState | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length < CORE.length) return null;

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
    // Older links stop at the core six, and a stray legacy field (the removed
    // layout grid) simply fails its lookup and falls back.
    flow: pickOr(parts[6], FLOWS, DEFAULT_THEME.flow),
    terrain: pickOr(parts[7], TERRAINS, DEFAULT_THEME.terrain),
    grid: pickOr(parts[8], GRIDS, DEFAULT_THEME.grid),
    show: pickOr(parts[9], SHOWS, DEFAULT_THEME.show),
    cursor: pickOr(parts[10], CURSORS, DEFAULT_THEME.cursor),
  };
}

function pickOr<T extends string>(
  value: string | undefined,
  table: Record<string, unknown>,
  fallback: T,
): T {
  return value && value in table ? (value as T) : fallback;
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

  // Deliberately not consulting `prefers-color-scheme`: the site opens light for
  // everyone. A visitor who wants dark toggles once and it is remembered.
  return DEFAULT_THEME;
}
