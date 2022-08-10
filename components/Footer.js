export default function Footer() {
  return (
    <footer>
      Made with&nbsp;
      <a href="https://nextjs.org">Next.js</a>&nbsp;&bull;&nbsp; Inspired
      By&nbsp;<a href="https://sreetamdas.com">Sreetam Das</a>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;
          font-size: 15px;
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
