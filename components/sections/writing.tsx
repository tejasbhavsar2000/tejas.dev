import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { formatDate, getAllPosts } from "@/lib/writing";

export function Writing() {
  const posts = getAllPosts();
  if (!posts.length) return null;

  return (
    <Section
      id="writing"
      index="04"
      label="Writing"
      title="Occasionally I write the explanation down."
      lede="Short, and where a diagram would have done the job, there's a working component instead."
    >
      <ul className="divide-y divide-border border-y border-border">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="group block py-6 transition-colors hover:bg-surface"
            >
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="font-display text-lg font-medium transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </div>
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
                {post.description}
              </p>
              <p className="mt-3 font-mono text-2xs text-muted tnum">
                {formatDate(post.date)} · {post.readingMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
