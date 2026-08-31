import { Reveal } from "@/components/ui/reveal";
import { SECTIONS, SectionId } from "@/content/site";

type Variant = "plain" | "split" | "band";

/**
 * `split` gives a section a sticky left column so its detail scrolls past a
 * fixed heading. `band` runs a raised surface full bleed behind it. Alternating
 * these is what stops every section looking like the last one.
 */
export function Section({
  id,
  title,
  lede,
  variant = "plain",
  children,
}: {
  id: SectionId;
  title: string;
  lede?: string;
  variant?: Variant;
  children: React.ReactNode;
}) {
  const section = SECTIONS.find((s) => s.id === id);
  const index = String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(
    2,
    "0",
  );

  const header = (
    <Reveal>
      <p className="mb-5 flex items-baseline gap-2.5 text-sm text-muted">
        <span className="font-mono text-accent tnum">{index}</span>
        {section?.label ?? id}
      </p>
      <h2 className="max-w-[24ch] text-3xl font-semibold leading-tight">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">
          {lede}
        </p>
      )}
    </Reveal>
  );

  const inner =
    variant === "split" ? (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">{header}</div>
        <div>{children}</div>
      </div>
    ) : (
      <>
        <div className="mb-12">{header}</div>
        {children}
      </>
    );

  const body = (
    <section id={id} className="scroll-mt-24 py-20 sm:py-28">
      {inner}
    </section>
  );

  // Every variant centres its own content, because sections are rendered
  // outside a shared container so that `band` can bleed past it.
  const centred = (
    <div className="mx-auto w-full max-w-[64rem] px-6 sm:px-8">{body}</div>
  );

  if (variant !== "band") return centred;

  // Translucent rather than opaque, so the terrain behind the page shows
  // through. The sticky header already uses this treatment.
  return (
    <div className="bg-surface/70 backdrop-blur-sm">{centred}</div>
  );
}
