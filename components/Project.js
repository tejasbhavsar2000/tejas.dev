import styles from "@styles/Projects.module.css";
import Link from "next/link";
const Project = ({ name, tags, link }) => {
  return (
    <div className={styles.project}>
      <div className={styles.upper}>
        <Link href={link}>
          <h2>{name}</h2>
        </Link>
        <ul>
          {tags.map((tag) => {
            return (
              <li key={tag}>
                <span>{tag}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <video
        playsInline
        autoPlay
        muted
        loop
        src={`projects/${name}.webm`}
      ></video>
    </div>
  );
};
export default Project;
