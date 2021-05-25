import Head from 'next/head'
import Image from 'next/image'
import Nav from '@components/Nav'
import Header from '@components/Header'
import Card from '@components/Card'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Image                          // Not working bg
        alt="Mountains"
        src="/background.png"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <Head>
        <title>My Portfolio Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />

      

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

        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      
    </div>
  )
}


