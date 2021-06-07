import Head from 'next/head'
import Image from 'next/image'
import Header from '@components/Header'
import Card from '@components/Card'
import Footer from '@components/Footer'
import Background from '@components/Background'
import Style from '@styles/index.module.css'

export default function Home() {
  return (
    <div className="container">
      
      <Head>
        <title>My Portfolio Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={Style.home}>
        
        <p className={Style.item2}>Focused and enthusiastic developer with a keen interest in software development and artificial intelligence. By comprehensive exposure to the underlying concepts and applying them vividly to various projects, my love for these domains came into being. I am a passionate individual who thrives to build and apply algorithms to solve real-world industry problems.  </p>
      </div>
      

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


