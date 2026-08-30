import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";
import { MdxContent } from "@/components/mdx/mdx-content";
import { formatDate, getAllPosts, getPost } from "@/lib/writing";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <main id="main">
      <Container className="max-w-[46rem]">
        <div className="py-10">
          <Link
            href="/#writing"
            className="inline-flex items-center gap-2 font-mono text-2xs text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={13} /> Back
          </Link>
        </div>

        <article className="pb-16">
          <header className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl font-semibold leading-[1.08]">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {post.description}
            </p>
            <p className="mt-6 font-mono text-2xs text-muted tnum">
              {formatDate(post.date)} · {post.readingMinutes} min read
              {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
            </p>
          </header>

          <MdxContent source={post.body} />
        </article>

        <Footer />
      </Container>
    </main>
  );
}
