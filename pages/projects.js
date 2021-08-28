import { motion } from "framer-motion";
import Styles from "@styles/Projects.module.css";
import Head from "next/head";
import Project from "@components/Project";
const projects = ({ projectProps }) => {
  return (
    <motion.main
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={Styles.main}
    >
      <Head>
        <title>Projects</title>
        <meta name="description" content="My Projects"></meta>
      </Head>
      <h1>/projects</h1>

      <ul className={Styles.li}>
        {projectProps.map((i, index) => {
          return (
            <li key={index}>
              <Project
                key={i.name}
                name={i.name}
                tags={i.tags}
                link={i.link}
              ></Project>
            </li>
          );
        })}
      </ul>
    </motion.main>
  );
};
export async function getStaticProps() {
  const data = await import(`../projects.json`);
  return {
    props: {
      projectProps: data.projects,
    },
  };
}

export default projects;
