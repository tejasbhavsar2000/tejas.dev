import Nav from '@components/Nav'
import '@styles/global.css'
import { Fragment } from 'react'
import '@styles/app.css'
import { AnimatePresence } from 'framer-motion'
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (<Fragment>
    <AnimatePresence exitBeforeEnter>
      <div className="layout">
      <Nav />
      <Component {...pageProps} />
    </div>
    </AnimatePresence>
  </Fragment>

  )
}