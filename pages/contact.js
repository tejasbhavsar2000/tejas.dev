import Head from 'next/head'

import Nav from '@components/Nav'
import Header from '@components/Header'
import Footer from '@components/Footer'
import ContactForm from '@components/ContactForm'

export default function Contact() {
  return (
    <div className="container">
      <Head>
        <title>My Portfolio | Contact</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header text="Contact me" />
        <ContactForm />
      </main>

      <Footer />

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>


    </div>
  )
}
