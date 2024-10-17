import Card from "@components/Card";
import Styles from "@styles/Blogs.module.css";
import { motion } from "framer-motion";
import { getAllBlogsName } from "lib/resolveBlogsPath";
import Head from "next/head";
export default function blogs({ items }) {
  return (
    <motion.main
      className={Styles.main}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Written Blogs"></meta>
      </Head>
      <header>
        <h1>
          /blog
        </h1>
      </header>

      <div className={Styles.cards}>
        <ul>
          {items?.length &&
            items.map((i) => {
              return (
                <li key={i}>
                  <Card key={i} title={i.replace(".md", "")} link={i} />{" "}
                </li>
              );
            })}
        </ul>
      </div>
    </motion.main>
  );
}
export async function getStaticProps() {
  const allBlogs = getAllBlogsName();
  return {
    props: {
      items: allBlogs,
    },
  };
}
