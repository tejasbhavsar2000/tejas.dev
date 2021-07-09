import ReactMarkdown from "react-markdown";
import ReactMarkdownComponents, {
  ReactMarkdownTransformImageUri,
} from "utils/ReactMarkdownComponents";

export default function blog({ content }) {
  return (
    <ReactMarkdown
      children={content}
      transformImageUri={ReactMarkdownTransformImageUri}
      components={ReactMarkdownComponents(content)}
    ></ReactMarkdown>
  );
}
export async function getStaticProps() {
  const content = await fetch("").then((response) => response.text());

  return {
    props: {
      content,
    },
    revalidate: 1,
  };
}
