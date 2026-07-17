import styles from "./CapabilityStrip.module.css";

const CAPABILITIES = [
  "ERP builds & migrations",
  "Agentic AI pipelines",
  "Database engineering",
  "SaaS products",
  "Dedicated infrastructure",
];

export default function CapabilityStrip() {
  return (
    <section className={styles.section}>
      <div className={`dq-container ${styles.inner}`}>
        <span className={styles.label}>What we do</span>
        <div className={styles.chips}>
          {CAPABILITIES.map((capability) => (
            <span key={capability} className={styles.chip}>
              {capability}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
