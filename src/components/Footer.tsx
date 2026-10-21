import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={`serif ${styles.quote}`}>
        Ik haal graag het <em>beste beeld</em> uit iedere situatie.
      </p>
      <div className={styles.row}>
        <a href="mailto:info@mediasolutions.nl" className={`serif ${styles.mail}`} data-cursor="Mail">
          info@mediasolutions.nl
        </a>
        <span className="label">© {new Date().getFullYear()} Wim van Esch</span>
      </div>
    </footer>
  );
}
