"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mail, MoveDiagonal, RotateCcw } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/icons";
import { SITE } from "@/content/site";

/**
 * The hero is a miniature slide editor: every element is selectable, draggable,
 * and scalable, with snap guides and a floating toolbar. It is the same set of
 * runtime problems I worked on at Alai — nested content, precise selection,
 * resizing that survives — rebuilt at the size of a header.
 *
 * On coarse pointers and narrow screens it renders as a plain stacked layout,
 * because a drag affordance nobody can use is just a layout bug.
 */

type ElementId = "badge" | "name" | "tagline" | "intro" | "links";

type Box = { x: number; y: number; scale: number };

type Corner = "tl" | "tr" | "bl" | "br";

/** Which way a drag on each corner counts as "bigger". */
const CORNER_SIGN: Record<Corner, [number, number]> = {
  tl: [-1, -1],
  tr: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
};

const LAYOUT: Record<ElementId, Box> = {
  badge: { x: 0, y: 4, scale: 1 },
  name: { x: 0, y: 13, scale: 1 },
  tagline: { x: 0, y: 44, scale: 1 },
  intro: { x: 54, y: 46, scale: 1 },
  links: { x: 0, y: 82, scale: 1 },
};

const WIDTHS: Record<ElementId, string> = {
  badge: "max-content",
  name: "max-content",
  tagline: "min(30ch, 52%)",
  intro: "min(42ch, 44%)",
  links: "max-content",
};

const LABELS: Record<ElementId, string> = {
  badge: "Badge",
  name: "Heading",
  tagline: "Display",
  intro: "Body",
  links: "Link row",
};

const SNAP_PX = 5;

export function EditorCanvas() {
  const [layout, setLayout] = useState<Record<ElementId, Box>>(LAYOUT);
  const [selected, setSelected] = useState<ElementId | null>(null);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({
    x: [],
    y: [],
  });
  const [interactive, setInteractive] = useState(false);
  const [touched, setTouched] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<ElementId, HTMLDivElement>());
  const drag = useRef<{
    id: ElementId;
    mode: "move" | "scale";
    corner?: Corner;
    startX: number;
    startY: number;
    origin: Box;
    rect: DOMRect;
    canvas: DOMRect;
  } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px) and (pointer: fine)");
    const sync = () => setInteractive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Collects the alignment lines every other element (and the canvas) offers. */
  const snapTargets = useCallback(
    (id: ElementId, canvas: DOMRect) => {
      const xs = [canvas.width / 2];
      const ys = [canvas.height / 2];
      for (const [key, node] of nodes.current) {
        if (key === id) continue;
        const r = node.getBoundingClientRect();
        xs.push(r.left - canvas.left, r.right - canvas.left);
        ys.push(r.top - canvas.top, r.bottom - canvas.top);
      }
      return { xs, ys };
    },
    [],
  );

  const onPointerDown = (
    e: React.PointerEvent,
    id: ElementId,
    mode: "move" | "scale",
    corner?: Corner,
  ) => {
    if (!interactive) return;
    // Let links behave like links.
    if (mode === "move" && (e.target as HTMLElement).closest("a")) return;

    const canvas = canvasRef.current?.getBoundingClientRect();
    const node = nodes.current.get(id);
    if (!canvas || !node) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setSelected(id);
    setTouched(true);
    drag.current = {
      id,
      mode,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      origin: layout[id],
      rect: node.getBoundingClientRect(),
      canvas,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (d.mode === "scale") {
      // Uniform scale driven by the diagonal. Each corner grows outward from
      // the element, the way a corner handle behaves in a real editor.
      const [sx, sy] = CORNER_SIGN[d.corner ?? "br"];
      const diagonal = (dx * sx + dy * sy) / 2;
      const next = Math.min(
        2.4,
        Math.max(0.5, d.origin.scale + diagonal / d.rect.width),
      );
      setLayout((l) => ({ ...l, [d.id]: { ...l[d.id], scale: next } }));
      return;
    }

    let px = d.rect.left - d.canvas.left + dx;
    let py = d.rect.top - d.canvas.top + dy;

    const { xs, ys } = snapTargets(d.id, d.canvas);
    const hitX: number[] = [];
    const hitY: number[] = [];

    for (const target of xs) {
      for (const edge of [px, px + d.rect.width / 2, px + d.rect.width]) {
        if (Math.abs(edge - target) <= SNAP_PX) {
          px += target - edge;
          hitX.push(target);
          break;
        }
      }
    }
    for (const target of ys) {
      for (const edge of [py, py + d.rect.height / 2, py + d.rect.height]) {
        if (Math.abs(edge - target) <= SNAP_PX) {
          py += target - edge;
          hitY.push(target);
          break;
        }
      }
    }

    px = Math.max(0, Math.min(px, d.canvas.width - d.rect.width));
    py = Math.max(0, Math.min(py, d.canvas.height - d.rect.height));

    setGuides({ x: hitX, y: hitY });
    setLayout((l) => ({
      ...l,
      [d.id]: {
        ...l[d.id],
        x: (px / d.canvas.width) * 100,
        y: (py / d.canvas.height) * 100,
      },
    }));
  };

  const endDrag = () => {
    drag.current = null;
    setGuides({ x: [], y: [] });
  };

  // Arrow keys nudge the selection, the way they would in any editor.
  useEffect(() => {
    if (!selected || !interactive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setSelected(null);
      const step = e.shiftKey ? 4 : 1;
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const delta = deltas[e.key];
      if (!delta) return;
      e.preventDefault();
      setTouched(true);
      setLayout((l) => ({
        ...l,
        [selected]: {
          ...l[selected],
          x: Math.max(0, Math.min(96, l[selected].x + delta[0])),
          y: Math.max(0, Math.min(96, l[selected].y + delta[1])),
        },
      }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, interactive]);

  const dirty = useMemo(
    () => JSON.stringify(layout) !== JSON.stringify(LAYOUT),
    [layout],
  );

  const content: Record<ElementId, React.ReactNode> = {
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-2xs uppercase tracking-[0.14em] text-muted backdrop-blur">
        <span className="size-1.5 rounded-full bg-accent" />
        {SITE.role} · India
      </span>
    ),
    name: (
      <h1 className="text-5xl font-semibold leading-[0.95]">{SITE.name}</h1>
    ),
    tagline: (
      <p className="font-display text-2xl leading-tight text-muted">
        {SITE.tagline}
      </p>
    ),
    intro: (
      <p className="text-sm leading-relaxed text-muted sm:text-base">
        {SITE.intro}
      </p>
    ),
    links: <LinkRow />,
  };

  const order: ElementId[] = ["badge", "name", "tagline", "intro", "links"];

  if (!interactive) {
    return (
      <div className="flex flex-col gap-5 py-12">
        {order.map((id) => (
          <div key={id} style={{ maxWidth: "60ch" }}>
            {content[id]}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={canvasRef}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[clamp(30rem,52vh,34rem)] w-full select-none"
      >
        {order.map((id) => {
          const box = layout[id];
          const isSelected = selected === id;
          return (
            <div
              key={id}
              ref={(el) => {
                if (el) nodes.current.set(id, el);
                else nodes.current.delete(id);
              }}
              role="group"
              aria-label={`${LABELS[id]} — drag to move, arrow keys to nudge`}
              tabIndex={0}
              onFocus={() => setSelected(id)}
              onPointerDown={(e) => onPointerDown(e, id, "move")}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: WIDTHS[id],
                transform: `scale(${box.scale})`,
                transformOrigin: "top left",
                touchAction: "none",
              }}
              className={`absolute cursor-grab rounded-xs outline-none transition-[box-shadow] duration-150 active:cursor-grabbing ${
                isSelected
                  ? "shadow-[0_0_0_1.5px_var(--accent)]"
                  : "hover:shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
              }`}
            >
              <div className="pointer-events-none p-1.5">{content[id]}</div>

              {isSelected && (
                <>
                  {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                    <Handle
                      key={corner}
                      position={corner}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onPointerDown(e, id, "scale", corner);
                      }}
                    />
                  ))}
                  <span className="absolute -top-6 left-0 flex items-center gap-1.5 whitespace-nowrap rounded-xs bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-contrast">
                    {LABELS[id]}
                    <MoveDiagonal size={10} className="opacity-70" />
                    {Math.round(box.scale * 100)}%
                  </span>
                </>
              )}
            </div>
          );
        })}

        {guides.x.map((x, i) => (
          <span
            key={`gx-${i}`}
            className="pointer-events-none absolute top-0 h-full w-px bg-accent"
            style={{ left: x }}
          />
        ))}
        {guides.y.map((y, i) => (
          <span
            key={`gy-${i}`}
            className="pointer-events-none absolute left-0 h-px w-full bg-accent"
            style={{ top: y }}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-2 font-mono text-2xs text-muted">
        <span aria-live="polite">
          {selected ? (
            <>
              <span className="text-accent">{LABELS[selected]}</span> selected ·{" "}
              <span className="tnum">
                x {Math.round(layout[selected].x)} y{" "}
                {Math.round(layout[selected].y)}
              </span>
            </>
          ) : touched ? (
            "Nothing selected"
          ) : (
            "Everything here is draggable — go on"
          )}
        </span>
        {dirty && (
          <button
            onClick={() => {
              setLayout(LAYOUT);
              setSelected(null);
            }}
            className="flex items-center gap-1.5 rounded-xs px-2 py-1 transition-colors hover:bg-surface-2 hover:text-text"
          >
            <RotateCcw size={11} />
            Reset layout
          </button>
        )}
      </div>
    </div>
  );
}

function Handle({
  position,
  onPointerDown,
}: {
  position: Corner;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const pos = {
    tl: "-left-1 -top-1 cursor-nwse-resize",
    tr: "-right-1 -top-1 cursor-nesw-resize",
    bl: "-bottom-1 -left-1 cursor-nesw-resize",
    br: "-bottom-1 -right-1 cursor-nwse-resize",
  }[position];

  return (
    <span
      onPointerDown={onPointerDown}
      style={{ touchAction: "none" }}
      className={`absolute size-2 rounded-[1px] border border-accent bg-bg ${pos}`}
    />
  );
}

function LinkRow() {
  const items = [
    { href: SITE.links.github, icon: Github, label: "GitHub" },
    { href: SITE.links.twitter, icon: Twitter, label: "Twitter" },
    { href: SITE.links.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: SITE.links.email, icon: Mail, label: "Email" },
  ];
  return (
    <div className="pointer-events-auto flex items-center gap-2">
      {items.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="grid size-9 place-items-center rounded-sm border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Icon size={16} />
        </a>
      ))}
      <a
        href={SITE.links.resume}
        target="_blank"
        rel="noreferrer"
        className="rounded-sm border border-border px-3 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        Résumé
      </a>
    </div>
  );
}
