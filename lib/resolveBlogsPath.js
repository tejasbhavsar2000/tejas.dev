import fs from "fs";

export default function getBlogData(id) {
  const content = fs.readFileSync(`public/blog/${id}/${id + ".md"}`, "utf8");
  return content;
}

export function getAllPaths() {
  const slugs = getAllBlogsName();
  const paths = slugs.map((slug) => {
    return { params: { id: slug.replace(".md", "") } };
  });
  return paths;
}

export function getAllBlogsName() {
  const slugs = fs.readdirSync(`public/blog/`).map((file) => {
    return file;
  });
  return slugs;
}
