import { motion } from "framer-motion";
import Styles from "@styles/uses.module.css";
import Head from "next/head";

export default function uses({ stacks }) {
  return (
    <motion.main
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={Styles.main}
    >
      <Head>
        <title>Stack</title>
        <meta name="description" content="My Tech-Stack"></meta>
      </Head>
      <h1>/stack</h1>
      <h3>A list of technologies i have worked with:</h3>
      <ul className={Styles.li}>
        {stacks.map((i) => {
          return (
            <li key={i.name}>
              {i.link == "" ? i.name : <a href={i.link}>{i.name}</a>}
            </li>
          );
        })}
      </ul>
    </motion.main>
  );
}

export async function getStaticProps() {
  const data = await import(`../stack.json`);

  return {
    props: {
      stacks: data.stacks,
    },
  };
}
