"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RotateCcw } from "lucide-react";
import { Grip, useDragEnabled } from "@/components/ui/sortable";

/**
 * Free two dimensional movement for the hero blocks.
 *
 * The first version of this positioned everything absolutely with percentage
 * coordinates inside a fixed height box. Blocks collided between 820 and 1100px
 * and it had to be switched off below 820px entirely. This inverts that:
 *
 * - Blocks stay in **normal flow**, so the untouched layout is the responsive
 *   one and is correct at every width.
 * - A drag records a pixel offset applied as `transform: translate(x, y)`.
 *   Transforms do not affect layout, so the hero never reflows and blocks cannot
 *   push each other around.
 * - With no offsets the markup renders exactly as it would without this file.
 *
 * During a drag nothing goes through React: the transform is written straight to
 * the node and the guides are positioned directly, so a drag costs no renders.
 */

const SNAP = 5;

type Offset = { x: number; y: number };

type Ctx = {
  register: (id: string, el: HTMLElement | null) => void;
  startDrag: (id: string, e: React.PointerEvent) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  offsets: Record<string, Offset>;
};

const FreeMoveContext = createContext<Ctx | null>(null);

export function FreeMoveArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const enabled = useDragEnabled();
  const areaRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const offsets = useRef<Record<string, Offset>>({});
  const [committed, setCommitted] = useState<Record<string, Offset>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const guideX = useRef<HTMLDivElement>(null);
  const guideY = useRef<HTMLDivElement>(null);

  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el);
    else nodes.current.delete(id);
  }, []);

  const apply = (id: string, o: Offset) => {
    const el = nodes.current.get(id);
    if (el) el.style.transform = `translate(${o.x}px, ${o.y}px)`;
  };

  const reset = useCallback(() => {
    offsets.current = {};
    nodes.current.forEach((el) => {
      el.style.transform = "";
    });
    setCommitted({});
    setDirty(false);
    setSelected(null);
  }, []);

  // Pull stray blocks back inside when the window shrinks.
  useEffect(() => {
    if (!enabled) return;
    const area = areaRef.current;
    if (!area) return;

    const ro = new ResizeObserver(() => {
      const bounds = area.getBoundingClientRect();
      let changed = false;
      for (const [id, o] of Object.entries(offsets.current)) {
        const el = nodes.current.get(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const flowLeft = r.left - o.x;
        const flowTop = r.top - o.y;
        const clamped = {
          x: clamp(o.x, bounds.left - flowLeft, bounds.right - r.width - flowLeft),
          y: clamp(o.y, bounds.top - flowTop, bounds.bottom - r.height - flowTop),
        };
        if (clamped.x !== o.x || clamped.y !== o.y) {
          offsets.current[id] = clamped;
          apply(id, clamped);
          changed = true;
        }
      }
      if (changed) setCommitted({ ...offsets.current });
    });
    ro.observe(area);
    return () => ro.disconnect();
  }, [enabled]);

  const startDrag = useCallback(
    (id: string, e: React.PointerEvent) => {
      const area = areaRef.current;
      const el = nodes.current.get(id);
      if (!area || !el) return;

      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setSelected(id);

      const bounds = area.getBoundingClientRect();
      const start = offsets.current[id] ?? { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();

      // Flow position is the current rect minus whatever offset is already on it.
      const flowLeft = rect.left - start.x;
      const flowTop = rect.top - start.y;
      const { width, height } = rect;

      // Measured once: a transform only drag cannot move anything else, so the
      // move handler below does pure arithmetic and never reads layout.
      const targetsX: number[] = [bounds.left + bounds.width / 2];
      const targetsY: number[] = [bounds.top + bounds.height / 2];
      nodes.current.forEach((other, otherId) => {
        if (otherId === id) return;
        const r = other.getBoundingClientRect();
        targetsX.push(r.left, r.left + r.width / 2, r.right);
        targetsY.push(r.top, r.top + r.height / 2, r.bottom);
      });

      const originX = e.clientX;
      const originY = e.clientY;

      const showGuide = (ref: typeof guideX, at: number | null, vertical: boolean) => {
        const g = ref.current;
        if (!g) return;
        if (at === null) {
          g.style.opacity = "0";
          return;
        }
        g.style.opacity = "1";
        if (vertical) g.style.left = `${at - bounds.left}px`;
        else g.style.top = `${at - bounds.top}px`;
      };

      const onMove = (ev: PointerEvent) => {
        let x = start.x + (ev.clientX - originX);
        let y = start.y + (ev.clientY - originY);

        // Keep the block inside the hero, so it can never land on the next
        // section or off screen.
        x = clamp(x, bounds.left - flowLeft, bounds.right - width - flowLeft);
        y = clamp(y, bounds.top - flowTop, bounds.bottom - height - flowTop);

        let hitX: number | null = null;
        let hitY: number | null = null;

        for (const target of targetsX) {
          for (const edge of [
            flowLeft + x,
            flowLeft + x + width / 2,
            flowLeft + x + width,
          ]) {
            if (Math.abs(edge - target) <= SNAP) {
              x += target - edge;
              hitX = target;
              break;
            }
          }
          if (hitX !== null) break;
        }
        for (const target of targetsY) {
          for (const edge of [
            flowTop + y,
            flowTop + y + height / 2,
            flowTop + y + height,
          ]) {
            if (Math.abs(edge - target) <= SNAP) {
              y += target - edge;
              hitY = target;
              break;
            }
          }
          if (hitY !== null) break;
        }

        offsets.current[id] = { x, y };
        apply(id, { x, y });
        showGuide(guideX, hitX, true);
        showGuide(guideY, hitY, false);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        showGuide(guideX, null, true);
        showGuide(guideY, null, false);
        setCommitted({ ...offsets.current });
        setDirty(true);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
    },
    [],
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-free-item]")) {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [selected]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <FreeMoveContext.Provider
      value={{ register, startDrag, selected, setSelected, offsets: committed }}
    >
      <div ref={areaRef} className={`relative ${className ?? ""}`}>
        {children}

        <div
          ref={guideX}
          aria-hidden
          className="pointer-events-none absolute top-0 z-30 h-full w-px bg-accent opacity-0"
        />
        <div
          ref={guideY}
          aria-hidden
          className="pointer-events-none absolute left-0 z-30 h-px w-full bg-accent opacity-0"
        />
      </div>

      {dirty && (
        <button
          onClick={reset}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          <RotateCcw size={13} />
          Reset layout
        </button>
      )}
    </FreeMoveContext.Provider>
  );
}

export function FreeMoveItem({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(FreeMoveContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ctx?.register(id, ref.current);
    return () => ctx?.register(id, null);
  }, [ctx, id]);

  if (!ctx) return <div className={className}>{children}</div>;

  const isSelected = ctx.selected === id;

  return (
    <div
      ref={ref}
      data-free-item=""
      className={`group/free relative rounded-sm transition-shadow ${
        isSelected
          ? "shadow-[0_0_0_1.5px_var(--accent)]"
          : "hover:shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
      } ${className ?? ""}`}
    >
      <Grip
        label={label}
        visible={isSelected}
        onPointerDown={(e) => {
          e.stopPropagation();
          ctx.startDrag(id, e);
        }}
      />
      {children}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  // A block wider than its bounds would invert the range.
  if (max < min) return min;
  return Math.min(max, Math.max(min, value));
}
