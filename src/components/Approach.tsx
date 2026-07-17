"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import styles from "./Approach.module.css";

const STEPS = [
  {
    title: "Plan & architect",
    body: "Requirements, workflows and constraints mapped into a clear system architecture and delivery plan.",
  },
  {
    title: "Design & build",
    body: "Agile sprints with code review, CI and staging environments — working software every iteration.",
  },
  {
    title: "Test & release",
    body: "Automated testing, QA and UAT before a controlled, zero-surprise release to production.",
  },
  {
    title: "Operate & improve",
    body: "Monitoring, maintenance, backups and iterative improvements once you're live — we run it with you.",
  },
];

type Pose = Record<string, [number, number]>;

const SIT: Pose = {
  head: [8, -31], neck: [8, -25], hip: [8, -13], shoulder: [8, -22],
  kneeL: [-1, -13], footL: [-2, 0], kneeR: [0, -12], footR: [1, 0],
  handL: [1, -13], handR: [3, -12],
};
const STAND: Pose = {
  head: [-2, -32], neck: [-2, -26], hip: [-2, -14], shoulder: [-2, -23],
  kneeL: [-3, -7], footL: [-4, 0], kneeR: [-1, -7], footR: [0, 0],
  handL: [-6, -14], handR: [2, -14],
};
const JUMP: Pose = {
  head: [-4, -33], neck: [-4, -27], hip: [-4, -15], shoulder: [-4, -24],
  kneeL: [-6, -7], footL: [-7, -1], kneeR: [-2, -7], footR: [-1, -1],
  handL: [-11, -31], handR: [3, -31],
};

export default function Approach() {
  const svgRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const grid = gridRef.current;
    if (!svg || !grid) return;
    const byId = <T extends Element>(id: string) => svg.querySelector(`#${id}`) as T | null;
    const base = byId<SVGPathElement>("dq-tl-base");
    const prog = byId<SVGPathElement>("dq-tl-prog");
    const dot = byId<SVGCircleElement>("dq-tl-dot");
    if (!base || !prog || !dot) return;
    const stepEls = Array.from(grid.children) as HTMLElement[];

    let pathLength = 0;
    let checkpointLengths = [0, 0, 0, 0];
    const build = () => {
      const width = svg.clientWidth || 1200;
      const anchors: Array<[number, number]> = [
        [0, 62], [width / 8, 22], [(3 * width) / 8, 62],
        [(5 * width) / 8, 22], [(7 * width) / 8, 62], [width, 32],
      ];
      let d = `M${anchors[0][0]},${anchors[0][1]}`;
      for (let i = 1; i < anchors.length; i++) {
        const [ax, ay] = anchors[i - 1];
        const [bx, by] = anchors[i];
        const o = (bx - ax) * 0.45;
        d += ` C${ax + o},${ay} ${bx - o},${by} ${bx},${by}`;
      }
      base.setAttribute("d", d);
      prog.setAttribute("d", d);
      pathLength = base.getTotalLength();
      const checkpointXs = [width / 8, (3 * width) / 8, (5 * width) / 8, (7 * width) / 8];
      checkpointLengths = checkpointXs.map((x) => {
        let lo = 0;
        let hi = pathLength;
        for (let k = 0; k < 25; k++) {
          const mid = (lo + hi) / 2;
          if (base.getPointAtLength(mid).x < x) lo = mid;
          else hi = mid;
        }
        return (lo + hi) / 2;
      });
      checkpointLengths.forEach((len, i) => {
        const p = base.getPointAtLength(len);
        const node = byId<SVGCircleElement>(`dq-tl-n${i}`);
        if (node) {
          node.setAttribute("cx", String(p.x));
          node.setAttribute("cy", String(p.y));
        }
      });
      prog.setAttribute("stroke-dasharray", `0 ${pathLength + 10}`);
      const startGroup = byId<SVGGElement>("dq-tl-start");
      if (startGroup) startGroup.setAttribute("transform", `translate(10,${anchors[0][1]})`);
      const endGroup = byId<SVGGElement>("dq-tl-end");
      if (endGroup) {
        const end = base.getPointAtLength(pathLength);
        endGroup.setAttribute("transform", `translate(${end.x - 30},${end.y})`);
      }
    };
    build();
    window.addEventListener("resize", build);

    const DURATION = 7000;
    const HOLD = 1400;
    const start = performance.now();
    const mq = window.matchMedia("(max-width: 940px)");
    let doneAt = 0;
    let rafId = 0;

    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const lerp = (a: Pose, b: Pose, t: number): Pose => {
      const out: Pose = {};
      for (const key in a) {
        out[key] = [a[key][0] + (b[key][0] - a[key][0]) * t, a[key][1] + (b[key][1] - a[key][1]) * t];
      }
      return out;
    };
    const setAttrs = (id: string, attrs: Record<string, number | string>) => {
      const el = byId(id);
      if (el) for (const key in attrs) el.setAttribute(key, String(attrs[key]));
    };

    const tick = (now: number) => {
      if (mq.matches) {
        stepEls.forEach((step) => {
          step.style.opacity = "1";
        });
      } else {
        const t = (now - start) % (DURATION + HOLD);
        const p = Math.min(t / DURATION, 1);
        const len = p * pathLength;
        const pt = base.getPointAtLength(len);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
        prog.setAttribute("stroke-dasharray", `${len} ${pathLength + 10}`);
        stepEls.forEach((step, i) => {
          const node = byId<SVGCircleElement>(`dq-tl-n${i}`);
          if (!node) return;
          const reached = len >= checkpointLengths[i] - 4;
          step.style.opacity = reached ? "1" : "0.4";
          const kicker = step.querySelector("span");
          if (kicker) kicker.style.color = reached ? "#0033FF" : "#86868b";
          node.setAttribute("fill", reached ? "#0033FF" : "#fff");
          node.setAttribute("stroke", reached ? "#0033FF" : "#e8e8ed");
          node.setAttribute("r", Math.abs(len - checkpointLengths[i]) < 30 ? "11" : "8");
        });

        const done = len >= pathLength - 2;
        if (done && !doneAt) doneAt = now;
        if (!done) doneAt = 0;
        let pose = SIT;
        let dy = 0;
        if (done) {
          const sinceDone = now - doneAt;
          if (sinceDone < 600) {
            pose = lerp(SIT, STAND, ease(sinceDone / 600));
          } else {
            const b = Math.min((sinceDone - 600) / 350, 1);
            pose = lerp(STAND, JUMP, ease(b));
            if (b >= 1) dy = -9 * Math.abs(Math.sin(((sinceDone - 950) / 420) * Math.PI));
          }
        }
        const point = (pt2: [number, number]) => `${pt2[0].toFixed(2)},${(pt2[1] + dy).toFixed(2)}`;
        setAttrs("dq-man-head", { cx: pose.head[0], cy: pose.head[1] + dy });
        setAttrs("dq-man-torso", {
          x1: pose.hip[0], y1: pose.hip[1] + dy, x2: pose.neck[0], y2: pose.neck[1] + dy,
        });
        setAttrs("dq-man-legl", { d: `M${point(pose.hip)} L${point(pose.kneeL)} L${point(pose.footL)}` });
        setAttrs("dq-man-legr", { d: `M${point(pose.hip)} L${point(pose.kneeR)} L${point(pose.footR)}` });
        setAttrs("dq-man-arml", {
          x1: pose.shoulder[0], y1: pose.shoulder[1] + dy, x2: pose.handL[0], y2: pose.handL[1] + dy,
        });
        setAttrs("dq-man-armr", {
          x1: pose.shoulder[0], y1: pose.shoulder[1] + dy, x2: pose.handR[0], y2: pose.handR[1] + dy,
        });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <section id="approach" className={styles.section}>
      <div className="dq-container">
        <div className={styles.header}>
          <span className={`dq-badge ${styles.badge}`}>How we work</span>
          <h2 className={styles.heading}>From first call to running in production</h2>
          <p className={styles.sub}>
            One team accountable for the whole journey — architecture, delivery and operations.
          </p>
        </div>
        <Reveal className={styles.wrap}>
          <div className={styles.flowLine}>
            <svg ref={svgRef} className={styles.flowSvg} aria-hidden="true">
              <path id="dq-tl-base" fill="none" stroke="#e8e8ed" strokeWidth="2" />
              <path id="dq-tl-prog" fill="none" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" />
              <circle id="dq-tl-n0" r="8" fill="#fff" stroke="#e8e8ed" strokeWidth="2.5" />
              <circle id="dq-tl-n1" r="8" fill="#fff" stroke="#e8e8ed" strokeWidth="2.5" />
              <circle id="dq-tl-n2" r="8" fill="#fff" stroke="#e8e8ed" strokeWidth="2.5" />
              <circle id="dq-tl-n3" r="8" fill="#fff" stroke="#e8e8ed" strokeWidth="2.5" />
              <circle id="dq-tl-dot" r="7" fill="#0033FF" />
              <g id="dq-tl-start">
                <circle cx="0" cy="-26" r="5" fill="#0A1020" />
                <line x1="0" y1="-21" x2="0" y2="-9" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="0" y1="-9" x2="-5" y2="-1" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="0" y1="-9" x2="5" y2="-1" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="0" y1="-17" x2="-6" y2="-10" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                <g
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "0px 0px",
                    animation: "dqWaveArm 1.6s ease-in-out infinite",
                  }}
                >
                  <line x1="0" y1="-17" x2="9" y2="-13" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </g>
              <g id="dq-tl-end">
                <g id="dq-tl-chair">
                  <line x1="2" y1="-12" x2="15" y2="-12" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="15" y1="-12" x2="15" y2="-30" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="4" y1="-12" x2="4" y2="0" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="13" y1="-12" x2="13" y2="0" stroke="#0A1020" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <g id="dq-tl-man">
                  <circle id="dq-man-head" r="5" fill="#0033FF" />
                  <line id="dq-man-torso" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" />
                  <path id="dq-man-legl" fill="none" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path id="dq-man-legr" fill="none" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line id="dq-man-arml" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" />
                  <line id="dq-man-armr" stroke="#0033FF" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <line x1="26" y1="0" x2="26" y2="-24" stroke="#0A1020" strokeWidth="2" />
                <path d="M26,-24 L39,-20.5 L26,-17 Z" fill="#0033FF" />
              </g>
            </svg>
          </div>
          <div ref={gridRef} className={styles.grid}>
            {STEPS.map((step, index) => (
              <div key={step.title} className={styles.step}>
                <span className={styles.kicker}>step 0{index + 1}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
