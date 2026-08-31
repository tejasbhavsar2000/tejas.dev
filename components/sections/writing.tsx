import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { formatDate, getAllPosts } from "@/lib/writing";

export function Writing() {
  const posts = getAllPosts();
  if (!posts.length) return null;

  return (
    <Section
      id="writing"
      title="Thinking out loud."
      lede="Notes I wish I had found first."
    >
      <ul className="divide-y divide-border border-t border-border">
        {posts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={i * 0.05}>
            <Link href={`/writing/${post.slug}`} className="group block py-7">
              <h3 className="flex items-center gap-1.5 text-xl font-medium transition-colors group-hover:text-accent">
                {post.title}
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </h3>
              <p className="mt-2.5 max-w-[62ch] text-base leading-relaxed text-muted">
                {post.description}
              </p>
              <p className="mt-3 text-sm text-muted tnum">
                {formatDate(post.date)} · {post.readingMinutes} min read
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
