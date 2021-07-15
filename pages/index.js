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
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Put your description here."></meta>
      </Head>
      <main className={Style.home}>
        <h1>Hey, I'm Tejas!👋</h1>
        <p className={Style.item2}>
          I'm a developer from India who is in love with Frontend Development
          using React. I have worked with languages like Java, Python,
          Javascript, and Frameworks like Next.js, Nest.js.{" "}
        </p>
        <p className={Style.item2}>
          I'm currently looking for the role as <span> Frontend Developer</span>
          .{" "}
        </p>
      </main>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
        }
        h1 {
          align-self: center;
        }
      `}</style>
    </motion.div>
  );
}
