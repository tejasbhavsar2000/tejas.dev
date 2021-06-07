import Nav from '@components/Nav'
import '@styles/global.css'
import { Fragment } from 'react'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (<Fragment>
    <Nav/>
        <Component {...pageProps} />
    </Fragment>
  )
  }