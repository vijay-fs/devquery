import { ArrowRight } from "lucide-react";
import styles from "./Cta.module.css";

export default function Cta() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Let&apos;s build the system your business needs.</h2>
        <p className={styles.sub}>
          Tell us what you&apos;re building — we&apos;ll tell you how we&apos;d ship it.
        </p>
        <div className={styles.actions}>
          <a href="mailto:hello@devquery.in" className={`dq-btn ${styles.primary}`}>
            Book a Demo
            <ArrowRight size={18} strokeWidth={1.75} />
          </a>
          <a href="mailto:hello@devquery.in" className={styles.email}>
            hello@devquery.in
          </a>
        </div>
      </div>
    </section>
  );
}
