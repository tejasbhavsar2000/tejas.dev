import ReactMarkdown from "react-markdown";
import ReactMarkdownComponents, {
  ReactMarkdownTransformImageUri,
} from "utils/ReactMarkdownComponents";
import getBlogData, { getAllPaths } from "lib/resolveBlogsPath";
import { motion } from "framer-motion";

export default function blog({ content }) {
  return (
    <motion.main
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ReactMarkdown
        className="container"
        children={content}
        transformImageUri={ReactMarkdownTransformImageUri}
        components={ReactMarkdownComponents(content)}
      ></ReactMarkdown>
    </motion.main>
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
