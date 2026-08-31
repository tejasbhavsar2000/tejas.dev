"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replaces the React DevTools screenshots this post used to carry. Both trees
 * are real components; every box flashes on its own re-render, so the
 * difference between lifted and colocated state is something you cause rather
 * than something you're shown.
 */

function useRenderFlash<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const count = useRef(0);
  count.current += 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [
        { boxShadow: "0 0 0 1.5px var(--accent)", background: "var(--accent-soft)" },
        { boxShadow: "0 0 0 1.5px var(--border)", background: "transparent" },
      ],
      { duration: 700, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
    );
  });

  return { ref, renders: count.current };
}

function Box({
  name,
  depth = 0,
  children,
}: {
  name: string;
  depth?: number;
  children?: React.ReactNode;
}) {
  const { ref, renders } = useRenderFlash<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ marginLeft: depth * 14 }}
      className="rounded-sm border border-border p-2"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs">{name}</span>
        <span className="text-xs text-muted tnum">
          {renders} {renders === 1 ? "render" : "renders"}
        </span>
      </div>
      {children && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

function Field({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="type a pokémon…"
        aria-label="Pokemon name"
        className="w-full rounded-xs border border-border bg-bg px-2 py-1 font-mono text-xs outline-none focus:border-accent"
      />
      <p className="text-xs text-muted">
        {value ? `${value} is my favourite` : "enter a pokémon"}
      </p>
    </div>
  );
}

/* --- Lifted: App owns the state, so App re-renders on every keystroke ------ */
function LiftedTree() {
  const [pokemon, setPokemon] = useState("");
  return (
    <Box name="App">
      <Box name="Sidebar" depth={1} />
      <Box name="PokemonName" depth={1}>
        <Field value={pokemon} onChange={setPokemon} />
      </Box>
      <Box name="Footer" depth={1} />
    </Box>
  );
}

/* --- Colocated: the state lives where it is used -------------------------- */
function PokemonNameColocated() {
  const [pokemon, setPokemon] = useState("");
  return (
    <Box name="PokemonName" depth={1}>
      <Field value={pokemon} onChange={setPokemon} />
    </Box>
  );
}

function ColocatedTree() {
  return (
    <Box name="App">
      <Box name="Sidebar" depth={1} />
      <PokemonNameColocated />
      <Box name="Footer" depth={1} />
    </Box>
  );
}

export function ColocationDemo() {
  const [nonce, setNonce] = useState(0);

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <p className="text-xs text-muted">
          Type in either input
        </p>
        <button
          onClick={() => setNonce((n) => n + 1)}
          className="rounded-xs px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          Reset counts
        </button>
      </div>

      <div key={nonce} className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-bg p-4">
          <p className="mb-3 text-xs text-muted">
            State in <span className="text-accent">App</span>
          </p>
          <LiftedTree />
        </div>
        <div className="bg-bg p-4">
          <p className="mb-3 text-xs text-muted">
            State in <span className="text-accent">PokemonName</span>
          </p>
          <ColocatedTree />
        </div>
      </div>

      <figcaption className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted">
        On the left, every keystroke re-renders App, Sidebar and Footer too. On
        the right, only the component that owns the state re-renders. The
        counters on its siblings never move.
      </figcaption>
    </figure>
  );
}
