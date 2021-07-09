import Head from "next/head";
import { motion } from "framer-motion";
import Style from "@styles/index.module.css";

export default function Home() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <Head>
        <title>My Portfolio Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={Style.home}>
        <h1>Hey, I'm Tejas!👋</h1>
        <p className={Style.item2}>
          Focused and enthusiastic developer with a keen interest in software
          development and artificial intelligence. By comprehensive exposure to
          the underlying concepts and applying them vividly to various projects,
          my love for these domains came into being. I am a passionate
          individual who thrives to build and apply algorithms to solve
          real-world industry problems.{" "}
        </p>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </motion.div>
  );
}
