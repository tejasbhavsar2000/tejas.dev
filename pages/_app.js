import Nav from '@components/Nav'
import '@styles/global.css'
import { Fragment } from 'react'
import Style from '@styles/app.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (<Fragment>
    <div className="layout">
    <Nav/>  
    <Component {...pageProps} />  
    </div>
    
    </Fragment>
    
  )
  }