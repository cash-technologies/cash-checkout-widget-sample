import styles from "../styles/loader.module.css";

export default function Loader() {
  return (
    <div className={styles.ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
