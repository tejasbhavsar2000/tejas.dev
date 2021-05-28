import Head from 'next/head'
import Image from 'next/image'
import Header from '@components/Header'
import Card from '@components/Card'
import Footer from '@components/Footer'
import Background from '@components/Background'

export default function Home() {
  return (
    <div className="container">
      
      <Head>
        <title>My Portfolio Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <Footer />
      

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        
      `}</style>

      
    </div>
  )
}


