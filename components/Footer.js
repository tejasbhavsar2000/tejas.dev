export default function Footer() {
  return (
    <footer >
      Made with&nbsp;
      <a href="https://nextjs.org">Next.js</a>
      <style jsx>{`
        footer {
          width: 100%;
          padding : 1rem;
          font-size: 1.1rem;
          border-top: 1px solid #eaeaea;
          display: flex;
          z-index: 999;
          justify-content: center;
          align-items: center;
          align-self: flex-end;
        }

        a {
          text-decoration: none;
        }
      `}</style>
    </footer>
  );
}
