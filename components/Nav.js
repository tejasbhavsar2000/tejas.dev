import Link from "next/link";
import Styles from "@styles/Nav.module.css";
import Toogle from "@components/Toggle";
import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

import { House } from "lucide-react";
export default function Nav() {
  return (
    <nav
      className={Styles.navlayout}
      role="navigation"
      aria-label="main navigation"
    >
      <div>
        <Link href="/">
          <motion.div
            className={Styles.home}
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <House />
          </motion.div>
        </Link>
      </div>
      <div className={Styles.nav}>
        <motion.div
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link href="/projects">projects</Link>
        </motion.div>

        <motion.div
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link href="/blogs">blogs</Link>
        </motion.div>

        <motion.div
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link href="/about">about</Link>
        </motion.div>

        <motion.a
          href="https://github.com/tejasbhavsar2000"
          className={Styles.svg}
          id="github"
          whileHover={{  cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          
            <Github/>
          
        </motion.a>

        <motion.a
          id="twitter"
          href="https://twitter.com/_tejas_bhavsar"
          className={Styles.svg}
          whileHover={{  cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          
            <Twitter/>
          
        </motion.a>

        <motion.div
          className={Styles.toggle}
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Toogle />
        </motion.div>
      </div>
    </nav>
  );
}
