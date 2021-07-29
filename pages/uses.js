import { motion } from "framer-motion";
import Styles from "@styles/uses.module.css";
import Head from "next/head";

export default function uses({ Devices }) {
  return (
    <motion.main
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={Styles.main}
    >
      <Head>
        <title>Uses</title>
        <meta name="description" content="Things I use."></meta>
      </Head>
      <h1>/uses</h1>
      <h2>Equipments:</h2>
      <ul className={Styles.li}>
        {Devices.map((i) => {
          return (
            <li key={i.name}>
              {i.emoji}
              {i.link == "" ? i.name : <a href={i.link}>{i.name}</a>}
            </li>
          );
        })}
      </ul>
    </motion.main>
  );
}

export async function getStaticProps() {
  const data = await import(`../uses.json`);

  return {
    props: {
      Devices: data.devices,
    },
  };
}
