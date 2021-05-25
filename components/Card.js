import Link from 'next/link'

export default function Card({ title, picture, link }) {
  return (
    <>
      <Link href={`/items/${link}`}>
        <a>
          <div className="card">
            <div className="title">{title}</div>
            <div className="picture">
              <img src={picture} alt={title} />
            </div>
          </div>
        </a>
      </Link>
      
    </>
  )
}
