import dynamic from "next/dynamic";
import Link from "next/link";
import Styles from "@styles/Nav.module.css";
const Toggle = dynamic(() => import("@components/Toggle"));
import { motion } from "framer-motion";
import Home from "@material-ui/icons/HomeRounded";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
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
            <Home />
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

        <motion.div
          className={Styles.svg}
          id="github"
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link href="https://github.com/tejasbhavsar2000">
            <GitHubIcon />
          </Link>
        </motion.div>

        <motion.div
          id="twitter"
          className={Styles.svg}
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Link href="https://twitter.com/_tejas_bhavsar">
            <TwitterIcon />
          </Link>
        </motion.div>

        <motion.div
          className={Styles.toggle}
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Toggle />
        </motion.div>
      </div>
    </nav>
  );
}
