import Header from '@components/Header'
import Card from '@components/Card'
import Styles from '@styles/Projects.module.css'
import Nav from '@components/Nav'
export default function project({items}){
        return(
        
        <div>
          <main className= {Styles.Main}>
        <Header text="Welcome to my portfolio!" />
        
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

      </main>
      </div>
      
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