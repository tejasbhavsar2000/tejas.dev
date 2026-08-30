export function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <header className="mb-10 sm:mb-14">
        <p className="mb-4 flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-muted">
          <span className="text-accent tnum">{index}</span>
          <span className="h-px w-6 bg-border" />
          {label}
        </p>
        <h2 className="max-w-[22ch] text-3xl font-semibold">{title}</h2>
        {lede && (
          <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-muted">
            {lede}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
