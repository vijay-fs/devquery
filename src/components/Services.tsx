import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import styles from "./Services.module.css";

const WAVE_PATH =
  "M0,150 Q28.75,66 57.5,150 T115,150 T172.5,150 T230,150 T287.5,150 T345,150 T402.5,150 T460,150";

interface Service {
  number: string;
  formula: string;
  title: string;
  body: ReactNode;
  art: ReactNode;
}

const SERVICES: Service[] = [
  {
    number: "01",
    formula: "wave propagation · v = f·λ",
    title: "Web development & management",
    body: (
      <>
        We design, build and manage your websites and web apps end-to-end — from first commit to
        ongoing operations. Like a wave, a good product keeps moving long after launch.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        <line x1="0" y1="150" x2="460" y2="150" stroke="#e8e8ed" strokeWidth="1.5" />
        <path d={WAVE_PATH} fill="none" stroke="rgba(0,51,255,0.15)" strokeWidth="2" />
        <path
          d={WAVE_PATH}
          fill="none"
          stroke="#0033FF"
          strokeWidth="2.5"
          strokeDasharray="10 14"
          style={{ animation: "dqDash 1.5s linear infinite" }}
        />
        <circle
          r="7"
          fill="#0033FF"
          style={{
            offsetPath: `path('${WAVE_PATH}')`,
            animation: "dqTravel 3.5s linear infinite",
          }}
        />
      </svg>
    ),
  },
  {
    number: "02",
    formula: "orbital mechanics · F = G·m₁m₂/r²",
    title: "ERP systems, built to fit",
    body: (
      <>
        Custom ERP designed around how your organization actually works — not the other way around.
        Every module in stable orbit around your core.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        <circle cx="230" cy="150" r="125" fill="none" stroke="#e8e8ed" strokeWidth="1.5" />
        <circle cx="230" cy="150" r="75" fill="none" stroke="#e8e8ed" strokeWidth="1.5" />
        <circle cx="230" cy="150" r="22" fill="#0033FF" />
        <circle cx="230" cy="150" r="6" fill="#0A1020" />
        <g style={{ transformOrigin: "230px 150px", animation: "dqOrbit 7s linear infinite" }}>
          <circle cx="305" cy="150" r="8" fill="#0033FF" />
        </g>
        <g style={{ transformOrigin: "230px 150px", animation: "dqOrbit 16s linear infinite" }}>
          <circle cx="355" cy="150" r="8" fill="#fff" stroke="#0A1020" strokeWidth="2" />
          <circle cx="105" cy="150" r="6" fill="#0A1020" />
        </g>
      </svg>
    ),
  },
  {
    number: "03",
    formula: "conservation of momentum · p = m·v",
    title: "Legacy → modern migration",
    body: (
      <>
        We migrate ERP and business systems off legacy stacks onto modern, maintainable
        architectures — safely. Momentum transferred, nothing lost in the handover.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        <rect x="86" y="42" width="288" height="6" fill="#0A1020" />
        <line x1="194" y1="48" x2="194" y2="182" stroke="#0A1020" strokeWidth="1.5" />
        <circle cx="194" cy="200" r="18" fill="#fff" stroke="#0A1020" strokeWidth="2" />
        <line x1="230" y1="48" x2="230" y2="182" stroke="#0A1020" strokeWidth="1.5" />
        <circle cx="230" cy="200" r="18" fill="#fff" stroke="#0A1020" strokeWidth="2" />
        <line x1="266" y1="48" x2="266" y2="182" stroke="#0A1020" strokeWidth="1.5" />
        <circle cx="266" cy="200" r="18" fill="#fff" stroke="#0A1020" strokeWidth="2" />
        <g style={{ transformOrigin: "158px 48px", animation: "dqSwingL 2s linear infinite" }}>
          <line x1="158" y1="48" x2="158" y2="182" stroke="#0A1020" strokeWidth="1.5" />
          <circle cx="158" cy="200" r="18" fill="#0033FF" />
        </g>
        <g style={{ transformOrigin: "302px 48px", animation: "dqSwingR 2s linear infinite" }}>
          <line x1="302" y1="48" x2="302" y2="182" stroke="#0A1020" strokeWidth="1.5" />
          <circle cx="302" cy="200" r="18" fill="#0033FF" />
        </g>
      </svg>
    ),
  },
  {
    number: "04",
    formula: "mass–energy equivalence · E = mc²",
    title: "Agentic AI pipelines",
    body: (
      <>
        We embed agentic AI into your existing systems, or build intelligent pipelines from scratch.
        Small inputs, outsized energy released across your workflows.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        <ellipse cx="230" cy="140" rx="150" ry="52" fill="none" stroke="#e8e8ed" strokeWidth="1.5" />
        <g style={{ transformOrigin: "230px 140px", transform: "rotate(60deg)" }}>
          <ellipse cx="230" cy="140" rx="150" ry="52" fill="none" stroke="#e8e8ed" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: "230px 140px", transform: "rotate(120deg)" }}>
          <ellipse cx="230" cy="140" rx="150" ry="52" fill="none" stroke="#e8e8ed" strokeWidth="1.5" />
        </g>
        <circle
          r="6"
          fill="#0033FF"
          style={{
            offsetPath: "path('M80,140 a150,52 0 1,0 300,0 a150,52 0 1,0 -300,0')",
            animation: "dqTravel 4s linear infinite",
          }}
        />
        <g style={{ transformOrigin: "230px 140px", transform: "rotate(60deg)" }}>
          <circle
            r="6"
            fill="#0033FF"
            style={{
              offsetPath: "path('M80,140 a150,52 0 1,0 300,0 a150,52 0 1,0 -300,0')",
              animation: "dqTravel 5s linear infinite",
              animationDelay: "-2s",
            }}
          />
        </g>
        <g style={{ transformOrigin: "230px 140px", transform: "rotate(120deg)" }}>
          <circle
            r="6"
            fill="#0A1020"
            style={{
              offsetPath: "path('M80,140 a150,52 0 1,0 300,0 a150,52 0 1,0 -300,0')",
              animation: "dqTravel 6s linear infinite",
              animationDelay: "-1s",
            }}
          />
        </g>
        <circle
          cx="230"
          cy="140"
          r="13"
          fill="#0033FF"
          style={{ transformOrigin: "230px 140px", animation: "dqPulse 2s ease-in-out infinite" }}
        />
        <text
          x="230"
          y="278"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#0A1020"
          fontFamily="Inter, system-ui, sans-serif"
        >
          E = mc²
        </text>
      </svg>
    ),
  },
  {
    number: "05",
    formula: "ripple propagation · I ∝ 1/r²",
    title: "Database engineering",
    body: (
      <>
        Design, optimization and ongoing management of databases for organizations at any scale.
        Queries that ripple outward — fast at any radius.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        {[0, -1.33, -2.66].map((delay) => (
          <circle
            key={delay}
            cx="230"
            cy="150"
            r="120"
            fill="none"
            stroke="#0033FF"
            strokeWidth="2"
            style={{
              transformOrigin: "230px 150px",
              animation: "dqRipple 4s linear infinite",
              animationDelay: `${delay}s`,
            }}
          />
        ))}
        <path d="M203,132 v36 a27,10 0 0 0 54,0 v-36" fill="#0A1020" />
        <path d="M203,144 a27,10 0 0 0 54,0" fill="none" stroke="#ffffff" strokeWidth="2" />
        <path d="M203,156 a27,10 0 0 0 54,0" fill="none" stroke="#ffffff" strokeWidth="2" />
        <ellipse cx="230" cy="132" rx="27" ry="10" fill="#0033FF" />
      </svg>
    ),
  },
  {
    number: "06",
    formula: "harmonic oscillation · T = 2π√(L/g)",
    title: "Dedicated infrastructure",
    body: (
      <>
        We source, set up and manage dedicated servers through trusted vendors — fully end-to-end. A
        steady period you never have to think about.
      </>
    ),
    art: (
      <svg viewBox="0 0 460 300" aria-hidden="true">
        <rect x="214" y="30" width="32" height="8" fill="#0A1020" />
        <path
          d="M146.7,208.8 A190,190 0 0 1 313.3,208.8"
          fill="none"
          stroke="#e8e8ed"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <g style={{ transformOrigin: "230px 38px", animation: "dqPend 2.6s ease-in-out infinite" }}>
          <line x1="230" y1="38" x2="230" y2="210" stroke="#0A1020" strokeWidth="2" />
          <circle cx="230" cy="228" r="20" fill="#0033FF" />
        </g>
        <circle cx="230" cy="38" r="4" fill="#0A1020" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className="dq-container">
        <div className={styles.header}>
          <span className={`dq-badge ${styles.badge}`}>Services</span>
          <h2 className={styles.heading}>Solutions we deliver for your organization</h2>
          <p className={styles.sub}>
            Whatever stage you&apos;re at — greenfield, mid-migration, or scaling — we plug in and
            own the outcome.
          </p>
        </div>
        <div className={styles.list}>
          {SERVICES.map((service, index) => {
            const reverse = index % 2 === 1;
            const last = index === SERVICES.length - 1;
            const rowClass = [
              styles.row,
              reverse ? styles.rowReverse : "",
              last ? styles.rowLast : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <Reveal key={service.number} className={rowClass}>
                <div className={styles.text}>
                  <span className={styles.number}>{service.number}</span>
                  <div>
                    <span className={styles.formula}>{service.formula}</span>
                    <h3 className={styles.title}>{service.title}</h3>
                    <p className={styles.body}>{service.body}</p>
                  </div>
                </div>
                <div className={styles.art}>{service.art}</div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
