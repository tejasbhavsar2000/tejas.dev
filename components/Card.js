import Link from "next/link";

export default function Card({ title, link, date }) {
  return (
    <div>
      <Link href={`/blogs/${link.replace(".md", "")}`}>
        <h2 className="title">{title}</h2>
      </Link>
      <style jsx>
        {`
          div * {
            margin: 0px;
          }
          a {
            text-decoration: none;
            color: var(--color-primary-light);
          }

          .title {
            margin: 0px;
            padding: 36px 0px 0px;
            font-size: 36px;
            font-weight: bold;
          }
          div:hover {
            cursor: pointer;
            background-image: linear-gradient(
              90deg,
              rgb(202, 168, 106) 0%,
              rgb(215, 223, 110) 90%
            );
            background-size: 100%;
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -webkit-text-fill-color: transparent;
            -moz-text-fill-color: transparent;
          }
        `}
      </style>
    </div>
  );
}
