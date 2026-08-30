import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-2xs text-muted">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p>
          Built with Next.js and a theme system you can{" "}
          <span className="text-accent">edit yourself</span> — bottom right.
        </p>
      </div>
    </footer>
  );
}
