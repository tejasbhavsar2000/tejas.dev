import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p>
          Built with Next.js. The theme is yours to change, bottom right.
        </p>
      </div>
    </footer>
  );
}
