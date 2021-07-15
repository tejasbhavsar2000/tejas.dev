import Link from "next/link";
import Styles from "@styles/Nav.module.css";
import Toogle from "@components/Toggle";
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
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>
              <Home />
            </a>
          </motion.div>
        </Link>
      </div>
      <div className={Styles.nav}>
        <Link href="/uses">
          <motion.div
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>uses</a>
          </motion.div>
        </Link>
        <Link href="/blogs">
          <motion.div
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>blogs</a>
          </motion.div>
        </Link>
        <Link href="/about">
          <motion.div
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>about</a>
          </motion.div>
        </Link>
        <Link href="https://github.com/tejasbhavsar2000">
          <motion.div
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>
              <GitHubIcon />
            </a>
          </motion.div>
        </Link>
        <Link href="https://twitter.com/_tejas_bhavsar">
          <motion.div
            whileHover={{ cursor: "pointer", scale: 1 }}
            whileTap={{ scale: 0.8 }}
          >
            <a>
              <TwitterIcon />
            </a>
          </motion.div>
        </Link>
        <motion.div
          whileHover={{ cursor: "pointer", scale: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <a>
            <Toogle />
          </a>
        </motion.div>
      </div>
    </nav>
  );
}
