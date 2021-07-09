import Head from "next/head";

import Nav from "@components/Nav";
import Header from "@components/Header";
import { motion } from "framer-motion";
import Footer from "@components/Footer";
import ContactForm from "@components/ContactForm";

export default function Contact() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <Head>
        <title>My Portfolio | Contact</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>/about</h1>
      </main>

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          color: var(--color-secondary);
          font-size: 90px;
          padding: 20px 0px;
          margin: 0px;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </motion.div>
  );
}
