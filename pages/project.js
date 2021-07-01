import Header from '@components/Header'
import Card from '@components/Card'
import Styles from '@styles/Projects.module.css'
import Nav from '@components/Nav'
import { motion } from 'framer-motion'
export default function project({items}){
        return(
        
        <motion.div className= {Styles.Main} exit={{ opacity: 0 }} initial={{opacity:0}} animate={{opacity:1}}>
        <main>
        <Header text="Some of My Projects ⚒️" />
        </main>
        <div className={Styles.cards}>
          {items?.length &&
            items.map((i) => {
              return (
                <Card
                  key={i.title}
                  title={i.title}
                  picture={i.image}
                  link={i.slug}
                />
              )
            })}
          </div>

        
        </motion.div>
      
    )
}
export async function getStaticProps() {
    const portfolioData = await import(`../portfolio.json`)
  
    let slugs = []
    portfolioData.items.map((i) => {
      slugs.concat(i.slug)
    })
  
    return {
      props: {
        items: portfolioData.items,
      },
    }
  }