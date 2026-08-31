"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Dices,
  Link2,
  Moon,
  RotateCcw,
  Sliders,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import {
  ACCENTS,
  AccentId,
  CURSORS,
  CursorId,
  FLOWS,
  FlowId,
  GRIDS,
  GridId,
  SHOWS,
  ShowId,
  TERRAINS,
  TerrainId,
  DENSITIES,
  DensityId,
  FONTS,
  FontId,
  MOTIONS,
  MotionId,
  RADII,
  RadiusId,
  encodeTheme,
} from "@/lib/theme";

export function ThemeDock() {
  const { theme, ready, set, randomize, reset } = useTheme();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#t=${encodeTheme(theme)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked, so the toggle just won't confirm */
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    set("mode", theme.mode === "dark" ? "light" : "dark", {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <div
      ref={panelRef}
      className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-surface/85 shadow-2xl backdrop-blur-xl"
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="font-display text-sm font-semibold">
                  Theme builder
                </p>
                <p className="text-xs text-muted">
                  Every control writes one CSS variable.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close theme builder"
                className="rounded-xs p-1 text-muted hover:bg-surface-2 hover:text-text"
              >
                <X size={15} />
              </button>
            </header>

            <div className="max-h-[min(60vh,28rem)] space-y-4 overflow-y-auto px-4 py-4">
              <Row label="Accent">
                <div className="flex gap-1.5">
                  {(Object.keys(ACCENTS) as AccentId[]).map((id) => {
                    const a = ACCENTS[id];
                    const active = theme.accent === id;
                    return (
                      <button
                        key={id}
                        onClick={() => set("accent", id)}
                        aria-label={a.label}
                        aria-pressed={active}
                        className="relative size-7 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110"
                        style={{
                          background: `oklch(${theme.mode === "dark" ? 0.76 : 0.6} ${a.c} ${a.h})`,
                          boxShadow: active
                            ? `0 0 0 2px var(--surface), 0 0 0 4px oklch(${theme.mode === "dark" ? 0.76 : 0.6} ${a.c} ${a.h})`
                            : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              </Row>

              <Row label="Type">
                <Segmented
                  options={(Object.keys(FONTS) as FontId[]).map((id) => ({
                    id,
                    label: FONTS[id].label,
                    style: { fontFamily: FONTS[id].display },
                  }))}
                  value={theme.font}
                  onChange={(v) => set("font", v)}
                />
              </Row>

              <Row label="Radius">
                <div className="flex gap-1.5">
                  {(Object.keys(RADII) as RadiusId[]).map((id) => (
                    <button
                      key={id}
                      onClick={() => set("radius", id)}
                      aria-label={RADII[id].label}
                      aria-pressed={theme.radius === id}
                      className={`flex size-8 items-center justify-center border transition-colors ${
                        theme.radius === id
                          ? "border-accent bg-accent-soft"
                          : "border-border hover:border-border-strong"
                      }`}
                      style={{ borderRadius: RADII[id].value }}
                    >
                      <span
                        className="block size-3 border-l-2 border-t-2 border-current"
                        style={{ borderTopLeftRadius: RADII[id].value }}
                      />
                    </button>
                  ))}
                </div>
              </Row>

              <Row label="Density">
                <Segmented
                  options={(Object.keys(DENSITIES) as DensityId[]).map((id) => ({
                    id,
                    label: DENSITIES[id].label,
                  }))}
                  value={theme.density}
                  onChange={(v) => set("density", v)}
                />
              </Row>

              <Row label="Motion">
                <Segmented
                  options={(Object.keys(MOTIONS) as MotionId[]).map((id) => ({
                    id,
                    label: MOTIONS[id].label,
                  }))}
                  value={theme.motion}
                  onChange={(v) => set("motion", v)}
                />
              </Row>

              <p className="pt-2 text-xs font-medium text-muted">Background</p>

              <Row label="Show">
                <Segmented
                  options={(Object.keys(SHOWS) as ShowId[]).map((id) => ({
                    id,
                    label: SHOWS[id].label,
                  }))}
                  value={theme.show}
                  onChange={(v) => set("show", v)}
                />
              </Row>

              <Row label="Terrain">
                <Segmented
                  options={(Object.keys(TERRAINS) as TerrainId[]).map((id) => ({
                    id,
                    label: TERRAINS[id].label,
                  }))}
                  value={theme.terrain}
                  onChange={(v) => set("terrain", v)}
                />
              </Row>

              <Row label="Flow">
                <Segmented
                  options={(Object.keys(FLOWS) as FlowId[]).map((id) => ({
                    id,
                    label: FLOWS[id].label,
                  }))}
                  value={theme.flow}
                  onChange={(v) => set("flow", v)}
                />
              </Row>

              <Row label="Grid">
                <Segmented
                  options={(Object.keys(GRIDS) as GridId[]).map((id) => ({
                    id,
                    label: GRIDS[id].label,
                  }))}
                  value={theme.grid}
                  onChange={(v) => set("grid", v)}
                />
              </Row>

              <Row label="Cursor">
                <Segmented
                  options={(Object.keys(CURSORS) as CursorId[]).map((id) => ({
                    id,
                    label: CURSORS[id].label,
                  }))}
                  value={theme.cursor}
                  onChange={(v) => set("cursor", v)}
                />
              </Row>
            </div>

            <footer className="flex items-center gap-1.5 border-t border-border px-4 py-3">
              <DockAction onClick={randomize} icon={<Dices size={14} />}>
                Surprise me
              </DockAction>
              <DockAction onClick={reset} icon={<RotateCcw size={13} />}>
                Reset
              </DockAction>
              <DockAction
                onClick={copyLink}
                icon={copied ? <Check size={13} /> : <Link2 size={13} />}
              >
                {copied ? "Copied" : "Share"}
              </DockAction>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 rounded-full border border-border bg-surface/80 p-1 shadow-lg backdrop-blur-xl">
        <button
          onClick={toggleMode}
          aria-label={`Switch to ${theme.mode === "dark" ? "light" : "dark"} mode`}
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          {ready && theme.mode === "dark" ? (
            <Moon size={16} />
          ) : (
            <Sun size={16} />
          )}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Open theme builder"
          className={`grid size-9 place-items-center rounded-full transition-colors ${
            open
              ? "bg-accent text-accent-contrast"
              : "text-muted hover:bg-surface-2 hover:text-text"
          }`}
        >
          <Sliders size={16} />
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; style?: React.CSSProperties }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          style={o.style}
          className={`rounded-sm border px-2.5 py-1 text-xs transition-colors ${
            value === o.id
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted hover:border-border-strong hover:text-text"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DockAction({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      {icon}
      {children}
    </button>
  );
}
