import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-accent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold">
          Nothing selected on this canvas.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-accent-contrast"
        >
          Back to the start
        </Link>
      </div>
    </main>
  );
}
