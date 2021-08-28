import Styles from "@styles/markdown.module.css";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import { useEffect } from "react";
export function slugifyString(string) {
  return string
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase();
}

export function ReactMarkdownTransformImageUri(src) {
  return `/blog/${src}`;
}

export default function ReactMarkdownComponents() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return {
    h1: ({ children }) => (
      <span>
        <h1 className={Styles.content__h1}>{children}</h1>
      </span>
    ),
    h2: ({ children }) => (
      <h2 className={Styles.content__h2} id={`${slugifyString(children[0])}`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className={Styles.content__h3}>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    h6: ({ children }) => <h6>{children}</h6>,
    strong: ({ children }) => <span>{children}</span>,
    p: ({ children }) => <p className={Styles.content__p}>{children}</p>,
    a: ({ children, href }) => (
      <a href={href} className={Styles.content__a}>
        {children}
      </a>
    ),
    ol: ({ children }) => <ol>{children}</ol>,
    ul: ({ children }) => <ul className={Styles.content__ul}>{children}</ul>,
    li: ({ children }) => <li className={Styles.content__li}>{children}</li>,
    pre: ({ children }) => (
      <pre className={`language-jsx line-numbers  ${Styles.content__pre}`}>
        {children}
      </pre>
    ),
    code: ({ children }) => (
      <code className={Styles.content__code}>{children}</code>
    ),
    hr: () => <hr className={Styles.content__hr} />,
    img: ({ src, alt }) => {
      return <img src={src} alt={alt} className={Styles.content__img} />;
    },
  };
}
