import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={`dq-container ${styles.inner}`}>
        <a href="#top" className={styles.brand}>
          Dev<span className={styles.brandAccent}>Query</span>
        </a>
        <div className={styles.links}>
          <a href="#services" className={styles.link}>
            Services
          </a>
          <a href="#products" className={styles.link}>
            Products
          </a>
          <a href="#approach" className={styles.link}>
            How we work
          </a>
          <a href="#contact" className={`dq-btn ${styles.demo}`}>
            Book a Demo
          </a>
        </div>
      </div>
    </nav>
  );
}
