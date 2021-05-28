import Link from 'next/link'

export default function Card({ title, picture, link }) {
  return (
    <>
      <Link href={`/items/${link}`}>
        <a>
          <div className="card">
            <div className="title">{title}</div>
            <div className="picture">
              <img src={picture} alt={title} width= "300px" height="300px"/>
            </div>
          </div>
        </a>
      </Link>
      <style jsx>{
        `
        .card {
          margin: 1em;
        }
        `
      }
      </style>
    </>
  )
}
