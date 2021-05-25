import Link from 'next/link'
import Styles from '@styles/Nav.module.css'
export default function Nav() {
  return (
  <nav className={Styles.nav} role="navigation" aria-label="main navigation">
      <Link href="/project">
        <a>Projects</a>
      </Link>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
    </nav>
  )
}
