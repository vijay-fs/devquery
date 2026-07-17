import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import styles from "./Engagement.module.css";

const PLANS = [
  {
    mono: "fixed scope · one launch",
    title: "Project build",
    lede: "Fixed-scope delivery, from first call to launch.",
    items: [
      "Discovery & system architecture",
      "Full-stack build & QA",
      "Launch, deploy & handover docs",
      "Post-launch support window",
    ],
    featured: false,
  },
  {
    mono: "embedded · sprint-based",
    title: "Dedicated squad",
    lede: "An embedded engineering team that plugs into yours.",
    items: [
      "Senior engineers on demand",
      "Sprint-based delivery",
      "Works in your stack & tools",
      "Scale up or down monthly",
    ],
    featured: true,
  },
  {
    mono: "always on · managed ops",
    title: "Managed operations",
    lede: "We run and maintain your systems for you.",
    items: [
      "Dedicated servers set up via vendors",
      "Monitoring, uptime & alerts",
      "Databases, backups & migrations",
      "Ongoing response & fixes",
    ],
    featured: false,
  },
];

export default function Engagement() {
  return (
    <section id="engagement" className={styles.section}>
      <div className="dq-container">
        <div className={styles.header}>
          <span className={`dq-badge ${styles.badge}`}>Engagement models</span>
          <h2 className={styles.heading}>Work with us the way that fits</h2>
          <p className={styles.sub}>
            Three ways to bring DevQuery in — from a one-off build to running your systems long
            term.
          </p>
        </div>
        <Reveal className={styles.grid}>
          {PLANS.map((plan) => (
            <div key={plan.title} className={styles.card}>
              {plan.featured ? (
                <>
                  <div className={styles.topBar} />
                  <div className={styles.monoRow}>
                    <span className={styles.mono}>{plan.mono}</span>
                    <span className={styles.chosen}>Most chosen</span>
                  </div>
                </>
              ) : (
                <span className={`${styles.mono} ${styles.monoAlone}`}>{plan.mono}</span>
              )}
              <h3 className={styles.title}>{plan.title}</h3>
              <p className={styles.lede}>{plan.lede}</p>
              <ul className={styles.list}>
                {plan.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <Check size={16} strokeWidth={1.75} className={styles.check} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {plan.featured ? (
                <a href="#contact" className={`dq-btn ${styles.buttonCta}`}>
                  Book a Demo
                  <ArrowRight size={16} strokeWidth={1.75} />
                </a>
              ) : (
                <a href="#contact" className={styles.textCta}>
                  Book a Demo
                  <ArrowRight size={16} strokeWidth={1.75} />
                </a>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
