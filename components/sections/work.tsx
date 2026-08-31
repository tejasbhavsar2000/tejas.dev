"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { PROJECTS, Project } from "@/content/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { DemoDialog } from "@/components/ui/demo-dialog";
import {
  SortableList,
  SortableItem,
  useSortable,
} from "@/components/ui/sortable";

/** Demos want a keyboard and a mouse, and previews want hover. */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return fine;
}

const PROJECT_IDS = PROJECTS.map((p) => p.slug);

/** Matches the preview's `w-[20rem]` and its 16/10 aspect. */
const PREVIEW_W = 320;
const PREVIEW_H = 200;
const EDGE = 12;

export function Work() {
  const fine = useFinePointer();
  const { order, setOrder, move, enabled } = useSortable(PROJECT_IDS);
  const bySlug = new Map(PROJECTS.map((p) => [p.slug, p]));
  const [hovered, setHovered] = useState<Project | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  // Spring the pointer so the preview trails the cursor instead of sticking.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 });
  const py = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 });

  // Only listen while a preview is actually on screen.
  useEffect(() => {
    if (!fine || !hovered) return;
    const onMove = (e: PointerEvent) => {
      // Flip to the other side of the cursor rather than run off the right
      // edge, and keep it inside the window vertically.
      const toRight = e.clientX + 24;
      const fitsRight = toRight + PREVIEW_W <= window.innerWidth - EDGE;
      x.set(fitsRight ? toRight : e.clientX - 24 - PREVIEW_W);
      y.set(
        Math.min(
          Math.max(EDGE, e.clientY - 90),
          window.innerHeight - PREVIEW_H - EDGE,
        ),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, hovered, x, y]);

  const open = (project: Project, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setOpenProject(project);
    setHovered(null);
  };

  const close = () => {
    setOpenProject(null);
    lastTrigger.current?.focus();
  };

  return (
    <Section
      id="work"
      variant="band"
      title="Made for fun."
      lede="Some of them even work."
    >
      <div onPointerLeave={() => setHovered(null)}>
        <SortableList
          order={order}
          onReorder={setOrder}
          move={move}
          enabled={enabled}
          labelOf={(id) => bySlug.get(id)?.name ?? id}
          className="divide-y divide-border border-y border-border"
        >
          {order.map((slug, i) => {
            const project = bySlug.get(slug);
            if (!project) return null;
            return (
              <SortableItem key={slug} id={slug}>
                <Reveal delay={i * 0.05}>
                  <Row
                    project={project}
                    fine={fine}
                    onHover={() => fine && setHovered(project)}
                    onOpen={open}
                  />
                </Reveal>
              </SortableItem>
            );
          })}
        </SortableList>
      </div>

      {/*
        One shared preview that follows the cursor, rather than one per row.

        Portalled to the body on purpose. A `backdrop-filter` ancestor, which the
        translucent band is, establishes a containing block for fixed position
        descendants, so rendering this in place made it scroll with the band
        instead of staying with the cursor. A portal also keeps it safe from any
        ancestor later gaining a transform, filter or contain.
      */}
      {fine &&
        createPortal(
          <AnimatePresence>
            {hovered && hovered.media.kind !== "none" && (
              <motion.div
                key={hovered.slug}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                style={{ x: px, y: py }}
                className="pointer-events-none fixed left-0 top-0 z-40 w-[20rem] overflow-hidden rounded-md border border-border bg-surface shadow-2xl"
              >
                <video
                  src={hovered.media.preview}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="aspect-[16/10] w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {openProject && (
        <DemoDialog
          open={openProject !== null}
          onClose={close}
          project={openProject}
          canEmbed={fine}
        />
      )}
    </Section>
  );
}

function Row({
  project,
  fine,
  onHover,
  onOpen,
}: {
  project: Project;
  fine: boolean;
  onHover: () => void;
  onOpen: (p: Project, el: HTMLButtonElement) => void;
}) {
  const isDemo = project.media.kind === "demo";

  return (
    <button
      onPointerEnter={onHover}
      onFocus={onHover}
      onClick={(e) => onOpen(project, e.currentTarget)}
      className="group flex w-full flex-col items-start gap-4 py-7 text-left transition-transform duration-300 hover:translate-x-1 sm:flex-row sm:gap-5"
    >
      {/* No hover on touch, so the thumbnail comes inline. It sits above the
          text on narrow screens, where a side by side split leaves the copy
          squeezed into a column too narrow to read. */}
      {!fine && project.media.kind !== "none" && (
        <video
          src={project.media.preview}
          muted
          loop
          autoPlay
          playsInline
          // Full width only while stacked. In the row layout at sm and up,
          // `w-full` plus `shrink-0` would push the text off screen.
          className="aspect-[16/9] w-full shrink-0 rounded-sm object-cover sm:w-44"
        />
      )}

      <span className="hidden w-14 shrink-0 pt-1.5 text-sm text-muted tnum sm:block">
        {project.year}
      </span>

      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-medium transition-colors group-hover:text-accent">
            {project.name}
          </span>
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-xs bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">
              <Play size={9} /> Runs here
            </span>
          )}
        </span>
        <span className="mt-1.5 block max-w-[58ch] text-base leading-relaxed text-muted">
          {project.blurb}
        </span>
        <span className="mt-2.5 block text-sm text-muted">
          {project.tags.join(" · ")}
        </span>
      </span>

      <ArrowUpRight
        size={17}
        className="mt-1.5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </button>
  );
}
