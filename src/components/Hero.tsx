import { ArrowRight } from "lucide-react";
import Hero3D from "@/components/Hero3D";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.section}>
      <div className={`dq-container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={`dq-badge ${styles.badge}`}>Product studio · Engineering partner</span>
          <h1 className={styles.title}>
            We build products — and the <span className={styles.titleAccent}>systems</span> your
            business runs on.
          </h1>
          <p className={styles.lede}>
            DevQuery is a product-led software studio. We ship our own tools, and we design, build,
            migrate and operate mission-critical systems for organizations —{" "}
            <strong>from ERP and databases to agentic AI pipelines</strong> and dedicated
            infrastructure.
          </p>
          <div className={styles.actions}>
            <a href="#contact" className={`dq-btn ${styles.primary}`}>
              Book a Demo
              <ArrowRight size={18} strokeWidth={1.75} />
            </a>
            <a href="#products" className={styles.secondary}>
              See our work
              <ArrowRight size={18} strokeWidth={1.75} />
            </a>
          </div>
        </div>
        <Hero3D />
      </div>
    </section>
  );
}
