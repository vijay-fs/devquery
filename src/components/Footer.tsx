import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "ERP & migrations", href: "#services" },
      { label: "Agentic AI pipelines", href: "#services" },
      { label: "Database engineering", href: "#services" },
      { label: "Dedicated infrastructure", href: "#services" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Drawing Extraction API", href: "#products" },
      { label: "Dynamic API Builder", href: "#products" },
      { label: "Tenant SaaS Suite", href: "#products" },
      { label: "Algo Trading Tool", href: "#products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How we work", href: "#approach" },
      { label: "Contact", href: "mailto:hello@devquery.in" },
      { label: "hello@devquery.in", href: "mailto:hello@devquery.in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`dq-container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            Dev<span className={styles.brandAccent}>Query</span>
          </div>
          <p className={styles.tagline}>
            A product-led software studio building tools and running mission-critical systems for
            organizations.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h5 className={styles.colTitle}>{column.title}</h5>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={`dq-container ${styles.bottomInner}`}>
          <span className={styles.fine}>© 2026 DevQuery. All rights reserved.</span>
          <span className={styles.fine}>Built by DevQuery · devquery.in</span>
        </div>
      </div>
    </footer>
  );
}
