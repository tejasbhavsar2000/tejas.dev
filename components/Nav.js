import Link from 'next/link'
import Styles from '@styles/Nav.module.css'
import Toogle from '@components/Toggle'
import { motion } from 'framer-motion'
export default function Nav() {
  return (
    <nav className={Styles.nav} role="navigation" aria-label="main navigation">

      <Link href="/">
        <motion.div whileHover={{cursor:'pointer',scale:1}} whileTap={{scale:0.80}}>
          <a>home</a>
        </motion.div>
      </Link>
      <Link href="/blogs">
        <motion.div whileHover={{cursor:'pointer',scale:1}} whileTap={{scale:0.80}}>
          <a>blogs</a>
        </motion.div>
      </Link>
      <Link href="/about">
        <motion.div whileHover={{cursor:'pointer',scale:1}} whileTap={{scale:0.80}}>
          <a>about</a>
        </motion.div>
      </Link>
      <Toogle />
    </nav>
  )
}
