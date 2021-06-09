import Link from 'next/link'
import Styles from '@styles/Nav.module.css'
import Toogle from '@components/Toggle'
export default function Nav() {
  return (
  <nav className={Styles.nav} role="navigation" aria-label="main navigation">
      <Toogle/>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/project">
        <a>Projects</a>
      </Link>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
    </nav>
  )
}
