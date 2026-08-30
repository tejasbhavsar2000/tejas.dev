"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Github } from "@/components/ui/icons";
import { PROJECTS, Project } from "@/content/projects";
import { Section } from "@/components/ui/section";

export function Work() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      index="01"
      label="Work"
      title="Things that are easier to use than to describe."
      lede="So most of these are running right here on the page rather than sitting in a screenshot. Poke at them."
    >
      <div className="space-y-6">
        {featured.map((p) => (
          <FeaturedCard key={p.slug} project={p} />
        ))}
      </div>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {rest.map((p) => (
          <CompactRow key={p.slug} project={p} />
        ))}
      </ul>
    </Section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-display text-xl font-semibold">
                {project.name}
              </h3>
              <span className="font-mono text-2xs text-muted tnum">
                {project.year}
              </span>
            </div>
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted">
              {project.blurb}
            </p>
            <p className="mt-4 max-w-[46ch] border-l-2 border-accent pl-3 text-sm leading-relaxed">
              {project.note}
            </p>
          </div>

          <div className="space-y-4">
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-xs border border-border px-2 py-0.5 font-mono text-2xs text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-accent-contrast transition-opacity hover:opacity-90"
                >
                  Open live <ArrowUpRight size={13} />
                </a>
              )}
              {project.source && (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Github size={13} /> Source
                </a>
              )}
            </div>
          </div>
        </div>

        <Media project={project} />
      </div>
    </article>
  );
}

function Media({ project }: { project: Project }) {
  if (project.media.kind === "embed") {
    return <LiveEmbed src={project.media.src} label={project.media.label} />;
  }
  if (project.media.kind === "video") {
    return <ScrubVideo src={project.media.src} name={project.name} />;
  }
  return (
    <div className="relative min-h-[16rem] border-l border-border bg-surface-2">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 9px)",
        }}
      />
      <p className="absolute bottom-4 left-4 font-mono text-2xs text-muted">
        Client work — no public demo
      </p>
    </div>
  );
}

/** Mounts the iframe only once the card is near the viewport. */
function LiveEmbed({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setMounted(true),
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-[18rem] border-t border-border bg-surface-2 lg:border-l lg:border-t-0"
    >
      {mounted && (
        <iframe
          src={src}
          title={label}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          className="absolute inset-0 size-full"
          style={{ pointerEvents: live ? "auto" : "none" }}
        />
      )}
      {!live && (
        <button
          onClick={() => setLive(true)}
          className="absolute inset-0 grid place-items-center bg-bg/40 backdrop-blur-[1px] transition-colors hover:bg-bg/25"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs shadow-lg">
            <Play size={12} className="text-accent" />
            {label}
          </span>
        </button>
      )}
    </div>
  );
}

/** Hover scrubs the clip by cursor position instead of autoplaying four loops. */
function ScrubVideo({ src, name }: { src: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const video = ref.current;
    if (!video || !ready || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  };

  return (
    <div
      onPointerMove={scrub}
      className="group/media relative min-h-[14rem] cursor-ew-resize border-t border-border bg-surface-2 lg:border-l lg:border-t-0"
    >
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={() => setReady(true)}
        aria-label={`${name} preview`}
        className="absolute inset-0 size-full object-cover"
      />
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-xs bg-bg/80 px-2 py-1 font-mono text-2xs text-muted opacity-0 backdrop-blur transition-opacity group-hover/media:opacity-100">
        ← drag across to scrub →
      </span>
    </div>
  );
}

function CompactRow({ project }: { project: Project }) {
  const href = project.live ?? project.source;
  const Wrapper = href ? "a" : "div";

  return (
    <li>
      <Wrapper
        {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
        className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:bg-surface"
      >
        <span className="font-mono text-2xs text-muted tnum">
          {project.year}
        </span>
        <span className="font-display text-base font-medium transition-colors group-hover:text-accent">
          {project.name}
        </span>
        <span className="min-w-[16ch] flex-1 text-sm text-muted">
          {project.blurb}
        </span>
        {href && (
          <ArrowUpRight
            size={14}
            className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        )}
      </Wrapper>
    </li>
  );
}
