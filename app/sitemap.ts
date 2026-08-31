import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { getAllPosts } from "@/lib/writing";

/** Driven off the posts on disk, so publishing one keeps this correct. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE.url}/writing/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...posts,
  ];
}
