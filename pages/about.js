import Head from "next/head";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <Head>
        <title>About</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>/about</h1>
      </main>

      <style jsx>{`
        h1 {
          color: var(--color-secondary);
          font-size: 90px;
          padding: 20px 0;
          margin: 0px;
        }
        main {
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </motion.div>
  );
}
