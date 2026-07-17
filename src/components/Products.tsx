import styles from "./Products.module.css";

const CANDLES = [
  { x: 81, wickY1: 235, wickY2: 325, bodyY: 250, bodyH: 60, blue: true },
  { x: 133, wickY1: 205, wickY2: 305, bodyY: 220, bodyH: 70, blue: true },
  { x: 185, wickY1: 225, wickY2: 300, bodyY: 240, bodyH: 50, blue: false },
  { x: 237, wickY1: 175, wickY2: 275, bodyY: 190, bodyH: 70, blue: true },
  { x: 289, wickY1: 195, wickY2: 280, bodyY: 210, bodyH: 55, blue: false },
  { x: 341, wickY1: 145, wickY2: 250, bodyY: 160, bodyH: 75, blue: true },
  { x: 393, wickY1: 170, wickY2: 245, bodyY: 185, bodyH: 50, blue: false },
  { x: 445, wickY1: 125, wickY2: 225, bodyY: 140, bodyH: 70, blue: true },
  { x: 497, wickY1: 105, wickY2: 195, bodyY: 120, bodyH: 60, blue: true },
];

const CUBE_TRANSFORMS = [
  "rotateY(0deg) translateZ(17px)",
  "rotateY(90deg) translateZ(17px)",
  "rotateY(180deg) translateZ(17px)",
  "rotateY(270deg) translateZ(17px)",
  "rotateX(90deg) translateZ(17px)",
  "rotateX(-90deg) translateZ(17px)",
];

function AlgoChart() {
  return (
    <svg viewBox="0 0 640 400" aria-hidden="true">
      {[80, 160, 240, 320].map((y) => (
        <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="#e8e8ed" strokeWidth="1" />
      ))}
      {CANDLES.map((candle) => (
        <g key={candle.x}>
          <line
            x1={candle.x}
            y1={candle.wickY1}
            x2={candle.x}
            y2={candle.wickY2}
            stroke="#a8a8ad"
            strokeWidth="2"
          />
          <rect
            x={candle.x - 11}
            y={candle.bodyY}
            width="22"
            height={candle.bodyH}
            fill={candle.blue ? "#0033FF" : "#c2c2c9"}
          />
        </g>
      ))}
      <line x1="549" y1="135" x2="549" y2="205" stroke="#a8a8ad" strokeWidth="2" />
      <rect
        x="538"
        y="150"
        width="22"
        height="45"
        fill="#0033FF"
        style={{ transformOrigin: "549px 195px", animation: "dqCandle 2.8s ease-in-out infinite" }}
      />
      <path
        d="M40,300 L120,270 L200,290 L280,235 L360,255 L440,190 L520,160 L600,120"
        fill="none"
        stroke="#0A1020"
        strokeWidth="2.5"
        strokeDasharray="1400"
        style={{ animation: "dqDraw 7s linear infinite" }}
      />
      <circle
        cx="600"
        cy="120"
        r="5"
        fill="#0A1020"
        style={{ transformOrigin: "600px 120px", animation: "dqPulse 2s ease-in-out infinite" }}
      />
    </svg>
  );
}

export default function Products() {
  return (
    <section id="products" className={styles.section}>
      <div className="dq-container">
        <div className={styles.header}>
          <span className={`dq-badge ${styles.badge}`}>Our products</span>
          <h2 className={styles.heading}>Tools we&apos;ve built and ship</h2>
          <p className={styles.sub}>
            We eat our own cooking. These are products designed, built and operated by DevQuery.
          </p>
        </div>

        <div className={styles.bento}>
          <div className={styles.bentoMain}>
            <div className={styles.bentoMainHead}>
              <span className={styles.flagBadge}>Fintech · Flagship</span>
              <h3 className={styles.bentoTitle}>Algo Trading Tool</h3>
              <p className={styles.bentoBody}>
                Design, backtest and run automated trading strategies with live market data and risk
                controls — from signal to execution.
              </p>
            </div>
            <div className={styles.chartWrap}>
              <div className={styles.chart}>
                <AlgoChart />
              </div>
            </div>
          </div>
          <div className={styles.bentoSide}>
            <div className={`${styles.card} ${styles.sideCard}`}>
              <div className={styles.cubePerspective}>
                <div className={styles.cube}>
                  {CUBE_TRANSFORMS.map((transform) => (
                    <div key={transform} className={styles.cubeFace} style={{ transform }} />
                  ))}
                </div>
              </div>
              <span className={styles.kicker}>Platform</span>
              <h4 className={styles.cardTitle}>Dynamic API Builder</h4>
              <p className={styles.cardBody}>
                Spin up production-grade APIs from a schema — no boilerplate, endpoints and docs
                generated for you.
              </p>
            </div>
            <div className={`${styles.card} ${styles.sideCard}`}>
              <div className={styles.icon}>
                <div className={styles.isoLayer} style={{ top: 28 }}>
                  <div className={styles.isoDiamond} style={{ background: "#0A1020" }} />
                </div>
                <div className={styles.isoLayer} style={{ top: 17, animationDelay: "-1.3s" }}>
                  <div className={styles.isoDiamond} style={{ background: "#0033FF", opacity: 0.85 }} />
                </div>
                <div className={styles.isoLayer} style={{ top: 6, animationDelay: "-2.6s" }}>
                  <div
                    className={styles.isoDiamond}
                    style={{ background: "rgba(0,51,255,0.15)", border: "1.5px solid #0033FF" }}
                  />
                </div>
              </div>
              <span className={styles.kicker}>Multi-tenant SaaS</span>
              <h4 className={styles.cardTitle}>Tenant SaaS Suite</h4>
              <p className={styles.cardBody}>
                Lease management, document management and task management — multi-tenant from the
                ground up.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.rowOfThree}>
          <div className={styles.card}>
            <div className={styles.icon}>
              <div className={styles.disc} style={{ top: 8, background: "#0033FF" }} />
              <div
                className={styles.disc}
                style={{ top: 22, background: "rgba(0,51,255,0.45)", animationDelay: "-1.2s" }}
              />
              <div
                className={styles.disc}
                style={{ top: 36, background: "#0A1020", animationDelay: "-2.4s" }}
              />
            </div>
            <span className={styles.kicker}>Tool</span>
            <h4 className={styles.cardTitle}>Database Management Tool</h4>
            <p className={styles.cardBody}>
              Browse, query, and administer your databases from one clean interface — built for
              teams.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.scanBox}>
              <div className={styles.scanLineText} style={{ top: 11, width: 24 }} />
              <div className={styles.scanLineText} style={{ top: 19, width: 34 }} />
              <div className={styles.scanLineText} style={{ top: 27, width: 18 }} />
              <div className={styles.scanCircle} />
              <div className={styles.scanBeam} />
            </div>
            <span className={styles.kicker}>SaaS API</span>
            <h4 className={styles.cardTitle}>Engineering Drawing Extraction</h4>
            <p className={styles.cardBody}>
              A SaaS API that reads engineering drawings and returns structured data — dimensions,
              annotations and metadata.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <div className={styles.trayBase} />
              <div className={styles.dropArrow}>
                <div className={styles.dropStem} />
                <div className={styles.dropHead} />
              </div>
            </div>
            <span className={styles.kicker}>Utility</span>
            <h4 className={styles.cardTitle}>YouTube Video Downloader</h4>
            <p className={styles.cardBody}>
              Fast, reliable downloads with format and quality selection — a handy tool from our
              lab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
