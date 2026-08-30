import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ColocationDemo } from "@/components/mdx/colocation-demo";

const components = {
  ColocationDemo,
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-24 text-2xl font-semibold first:mt-0"
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 {...props} className="mt-10 scroll-mt-24 text-lg font-semibold" />
  ),
  p: (props: React.ComponentProps<"p">) => (
    // Prose is body text, so it gets full contrast. `text-muted` is metadata.
    <p {...props} className="mt-5 max-w-[68ch] leading-[1.75]" />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul {...props} className="mt-5 max-w-[68ch] list-disc space-y-2 pl-5" />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      {...props}
      className="text-accent underline decoration-from-font underline-offset-4"
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-accent pl-4 italic text-muted"
    />
  ),
};

const prettyCodeOptions = {
  theme: { dark: "github-dark-dimmed", light: "github-light" },
  keepBackground: false,
  defaultLang: "jsx",
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypePrettyCode, prettyCodeOptions],
            ],
          },
        }}
      />
    </div>
  );
}
