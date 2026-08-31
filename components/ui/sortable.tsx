"use client";

import { Reorder, useDragControls } from "motion/react";
import { GripVertical } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * Drag to reorder a list, offered the way Notion does it: a grip fades in beside
 * a row on hover, and the row's own click keeps working. Every row here already
 * owns its click (a project opens its modal, the email copies), so drag could
 * not be "grab the row" without fighting the primary action.
 *
 * `touch-action: none` goes on the grip alone, never the row, so a vertical drag
 * across content always scrolls the page.
 */

/** Drag affordances are a pointer idea, so they only exist for a real pointer. */
export function useDragEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return enabled;
}

export function useSortable<T extends string>(ids: T[]) {
  const [order, setOrder] = useState<T[]>(ids);
  const enabled = useDragEnabled();

  const move = useCallback((id: T, direction: -1 | 1) => {
    setOrder((prev) => {
      const from = prev.indexOf(id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }, []);

  return { order, setOrder, move, enabled };
}

type Ctx = {
  selected: string | null;
  setSelected: (id: string | null) => void;
  move: (id: string, direction: -1 | 1) => void;
  count: number;
  labelOf: (id: string) => string;
};

const SortableContext = createContext<Ctx | null>(null);

export function SortableList<T extends string>({
  order,
  onReorder,
  move,
  enabled,
  as = "ul",
  className,
  labelOf = (id) => id,
  children,
}: {
  order: T[];
  onReorder: (next: T[]) => void;
  move: (id: T, direction: -1 | 1) => void;
  enabled: boolean;
  as?: "ul" | "ol";
  className?: string;
  labelOf?: (id: string) => string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-sortable-item]")) {
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

  if (!enabled) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <SortableContext.Provider
      value={{
        selected,
        setSelected,
        move: move as Ctx["move"],
        count: order.length,
        labelOf,
      }}
    >
      <Reorder.Group
        axis="y"
        as={as}
        values={order}
        onReorder={onReorder}
        className={className}
      >
        {children}
      </Reorder.Group>
    </SortableContext.Provider>
  );
}

export function SortableItem({
  id,
  as = "li",
  className,
  children,
}: {
  id: string;
  as?: "li" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(SortableContext);
  const controls = useDragControls();

  // Outside a provider the list is not draggable, so render the plain element.
  if (!ctx) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const isSelected = ctx.selected === id;

  return (
    <Reorder.Item
      value={id}
      as={as}
      dragListener={false}
      dragControls={controls}
      data-sortable-item=""
      // No scale here: Reorder measures bounding boxes, and scaling the
      // dragged item corrupts that measurement so nothing reorders.
      whileDrag={{ zIndex: 30, boxShadow: "0 8px 24px rgb(0 0 0 / 0.18)" }}
      className={`group/sortable relative rounded-sm outline-none transition-shadow ${
        isSelected
          ? "shadow-[0_0_0_1.5px_var(--accent)]"
          : "hover:shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
      } ${className ?? ""}`}
    >
      <Grip
        label={ctx.labelOf(id)}
        visible={isSelected}
        onPointerDown={(e) => {
          e.stopPropagation();
          // Start the drag before touching state: a re-render mid gesture can
          // drop it.
          controls.start(e);
          ctx.setSelected(id);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            ctx.move(id, -1);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            ctx.move(id, 1);
          }
        }}
      />
      {children}
    </Reorder.Item>
  );
}

/**
 * The shared handle. Lives in the container gutter so it costs no layout, and is
 * a real button so it takes focus and answers to the arrow keys.
 */
export function Grip({
  label,
  visible,
  onPointerDown,
  onKeyDown,
  className = "-left-6 top-1/2 -translate-y-1/2",
}: {
  label: string;
  visible: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      aria-label={`Move ${label}`}
      style={{ touchAction: "none" }}
      className={`absolute z-20 grid size-5 cursor-grab place-items-center rounded-xs text-muted transition-opacity hover:text-accent focus-visible:opacity-100 active:cursor-grabbing group-hover/sortable:opacity-100 group-hover/free:opacity-100 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <GripVertical size={14} />
    </button>
  );
}
