import Link from 'next/link'
import Styles from '@styles/Nav.module.css'
import Toogle from '@components/Toggle'
import { motion } from 'framer-motion'
export default function Nav() {
  return (
    <nav className={Styles.nav} role="navigation" aria-label="main navigation">

      <Link href="/">
        <motion.div whileHover={{scale:1}} whileTap={{scale:0.80}}>
          <a>Home</a>
        </motion.div>
      </Link>
      <Link href="/project">
        <motion.div whileHover={{scale:1}} whileTap={{scale:0.80}}>
          <a>Projects</a>
        </motion.div>
      </Link>
      <Link href="/contact">
        <motion.div whileHover={{scale:1}} whileTap={{scale:0.80}}>
          <a>Contact</a>
        </motion.div>
      </Link>
      <Toogle />
    </nav>
  )
}
