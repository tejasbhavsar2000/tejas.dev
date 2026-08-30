"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Github } from "@/components/ui/icons";
import type { Project } from "@/content/projects";

/**
 * A native <dialog> rather than a portal, so focus trapping, Escape, and the
 * backdrop come from the platform instead of from us.
 *
 * The body resolves in priority order: the live thing if it runs in a browser
 * and the visitor has the input for it, else the recording, else the details.
 * Nothing loads until the dialog is actually open.
 */
export function DemoDialog({
  open,
  onClose,
  project,
  canEmbed,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
  /** Demos assume a keyboard and mouse, so only embed where those exist. */
  canEmbed: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const media = project.media;
  const embed = media.kind === "demo" && canEmbed;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // A click landing on the dialog itself is a click on the backdrop.
        if (e.target === ref.current) onClose();
      }}
      aria-label={project.name}
      className="m-auto w-[92vw] max-w-[72rem] rounded-lg border border-border bg-surface p-0 text-text backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className={embed ? "flex h-[86vh] flex-col" : "flex flex-col"}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="mt-0.5 text-sm text-muted">
              {media.kind === "demo" && canEmbed
                ? media.hint
                : `${project.year} · ${project.tags.join(" · ")}`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <X size={17} />
          </button>
        </header>

        {open && embed && media.kind === "demo" && (
          <iframe
            src={media.src}
            title={project.name}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            className="min-h-0 flex-1 bg-bg"
          />
        )}

        {open && !embed && media.kind !== "none" && (
          <video
            src={media.preview}
            muted
            loop
            autoPlay
            playsInline
            controls
            className="aspect-[16/10] w-full bg-bg object-cover"
          />
        )}

        {media.kind === "none" && (
          <div className="relative aspect-[16/7] w-full bg-surface-2">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 10px)",
              }}
            />
            <p className="absolute bottom-4 left-5 text-sm text-muted">
              Client work, so there is no public demo.
            </p>
          </div>
        )}

        <div className="space-y-4 border-t border-border px-5 py-5">
          <p className="max-w-[62ch] text-base leading-relaxed text-muted">
            {project.blurb}
          </p>
          <p className="max-w-[62ch] border-l-2 border-accent pl-3 text-base leading-relaxed">
            {project.note}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-base font-medium text-accent transition-opacity hover:opacity-80"
              >
                {media.kind === "demo" ? "Open in a new tab" : "Live site"}
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.source && (
              <a
                href={project.source}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-base text-muted transition-colors hover:text-text"
              >
                <Github size={14} /> Source
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
