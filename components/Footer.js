export default function Footer() {
  return (
    <footer>
      Inspired By&nbsp;<a href="https://sreetamdas.com">Sreetam Das</a>
      &nbsp;&bull;&nbsp;Made with&nbsp;
      <a href="https://nextjs.org">Next.js</a>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;

          border-top: 1px solid #eaeaea;
          display: flex;
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
