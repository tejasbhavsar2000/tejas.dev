import ReactMarkdown from "react-markdown";
import ReactMarkdownComponents, {
  ReactMarkdownTransformImageUri,
} from "utils/ReactMarkdownComponents";
import getBlogData, { getAllPaths } from "lib/resolveBlogsPath";

export default function blog({ content }) {
  return (
    <ReactMarkdown
      children={content}
      transformImageUri={ReactMarkdownTransformImageUri}
      components={ReactMarkdownComponents(content)}
    ></ReactMarkdown>
  );
}

export async function getStaticProps({ ...ctx }) {
  const content = getBlogData(ctx.params.id);
  return {
    props: {
      content,
    },
  };
}

export async function getStaticPaths() {
  let paths = getAllPaths();
  return {
    paths,
    fallback: false,
  };
}
