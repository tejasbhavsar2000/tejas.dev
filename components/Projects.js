import Header from '@components/Header'
import Card from '@components/Card'
export default Projects = () =>{
    return(
        <main>
        <Header text="Welcome to my portfolio!" />

        <div className="cards">
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
      
    )
}