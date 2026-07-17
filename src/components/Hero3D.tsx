"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Hero3D.module.css";

const STEP_LABELS = [
  "01 reqs",
  "02 architecture",
  "03 build",
  "04 integrate",
  "05 test & harden",
  "06 go live",
];

const CYCLE_MS = 13000;
const BUILD_START_MS = 800;
const BUILD_MS = 9700;
const FADE_MS = 700;
const EDGE_BAND = 0.02;
const TEMP_HIDE_AT = 0.985;
const TURNTABLE_RAD_PER_SEC = 0.14;

const KIND_SOLID = 0;
const KIND_TEMP = 1;
const KIND_GHOST = 2;

interface SitePoints {
  coords: number[];
  buildTimes: number[];
  kinds: number[];
}

interface WallOpening {
  d0: number;
  d1: number;
  y0: number;
  y1: number;
}

/**
 * Generates the construction-site point cloud, sequenced to match the checkpoints:
 * the site is surveyed first (reqs), a light blueprint outline of the finished tower
 * is drawn (architecture), then crane and materials arrive and the structure fills
 * the outline floor by floor (build / integrate / test & harden), topping out with
 * the antenna at go-live. Every point carries a build time (0..1) that drives the
 * reveal, plus a kind: solid structure, temporary works that vanish at go-live, or
 * ghost blueprint lines.
 */
function generateSitePoints(): SitePoints {
  let seed = 987654321;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const coords: number[] = [];
  const buildTimes: number[] = [];
  const kinds: number[] = [];
  const push = (x: number, y: number, z: number, buildTime: number, kind: number) => {
    coords.push(x, y, z);
    buildTimes.push(Math.min(Math.max(buildTime, 0), 1));
    kinds.push(kind);
  };
  const rod = (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    count: number, b0: number, b1: number, kind: number, spread: number
  ) => {
    for (let i = 0; i < count; i++) {
      const t = rnd();
      push(
        ax + (bx - ax) * t + (rnd() - 0.5) * spread,
        ay + (by - ay) * t + (rnd() - 0.5) * spread,
        az + (bz - az) * t + (rnd() - 0.5) * spread,
        b0 + (b1 - b0) * t + rnd() * 0.006,
        kind
      );
    }
  };
  const boxAt = (
    cx: number, cy: number, cz: number,
    sx: number, sy: number, sz: number,
    density: number, b0: number, b1: number, kind: number
  ) => {
    const areaX = sy * sz, areaY = sx * sz, areaZ = sx * sy;
    const total = 2 * (areaX + areaY + areaZ);
    const count = Math.round(total * density);
    for (let i = 0; i < count; i++) {
      const pick = rnd() * total;
      const u = rnd() - 0.5;
      const v = rnd() - 0.5;
      const side = rnd() < 0.5 ? -0.5 : 0.5;
      let x: number, y: number, z: number;
      if (pick < 2 * areaX) {
        x = side * sx; y = u * sy; z = v * sz;
      } else if (pick < 2 * (areaX + areaY)) {
        x = u * sx; y = side * sy; z = v * sz;
      } else {
        x = u * sx; y = v * sy; z = side * sz;
      }
      push(cx + x, cy + y, cz + z, b0 + (y / sy + 0.5) * (b1 - b0) + rnd() * 0.006, kind);
    }
  };
  const wall = (
    x0: number, z0: number, x1: number, z1: number,
    yBase: number, height: number, b0: number, b1: number,
    openings: WallOpening[] | null
  ) => {
    const length = Math.hypot(x1 - x0, z1 - z0);
    const dx = (x1 - x0) / length;
    const dz = (z1 - z0) / length;
    for (let y = 0; y <= height; y += 0.24) {
      for (let d = 0; d <= length; d += 0.1) {
        if (rnd() < 0.2) continue;
        if (openings && openings.some((o) => d > o.d0 && d < o.d1 && y > o.y0 && y < o.y1)) {
          continue;
        }
        push(
          x0 + dx * d + (rnd() - 0.5) * 0.06,
          yBase + y + (rnd() - 0.5) * 0.06,
          z0 + dz * d + (rnd() - 0.5) * 0.06,
          b0 + (y / height) * (b1 - b0) + rnd() * 0.006,
          KIND_SOLID
        );
      }
    }
  };
  const windowsFor = (length: number, withDoor: boolean): WallOpening[] => {
    const list: WallOpening[] = [];
    for (let d = 1.4; d + 1.8 < length - 1.0; d += 3.1) {
      list.push({ d0: d, d1: d + 1.8, y0: 0.9, y1: 2.25 });
    }
    if (withDoor && list.length > 1) {
      const door = list[Math.floor(list.length / 2)];
      door.y0 = 0.02;
      door.y1 = 2.4;
    }
    return list;
  };

  const FLOORS = 10, FLOOR_H = 3.0, SLAB_T = 0.25;
  const HALF_X = 12, HALF_Z = 7.5;
  const colXs = [-12, -6, 0, 6, 12];
  const colZs = [-7.5, -2.5, 2.5, 7.5];
  const roofY = FLOORS * FLOOR_H;

  // phase 01 - reqs (0 .. 0.12, checkpoint fires ~0.147): survey the empty site.
  rod(-22, 0.03, -14, 22, 0.03, -14, 170, 0.01, 0.05, KIND_SOLID, 0.05);
  rod(-22, 0.03, 14, 22, 0.03, 14, 170, 0.01, 0.05, KIND_SOLID, 0.05);
  rod(-22, 0.03, -14, -22, 0.03, 14, 110, 0.01, 0.05, KIND_SOLID, 0.05);
  rod(22, 0.03, -14, 22, 0.03, 14, 110, 0.01, 0.05, KIND_SOLID, 0.05);
  for (const sx of [-22, 22]) {
    for (const sz of [-14, 14]) {
      rod(sx, 0.05, sz, sx - Math.sign(sx) * 2.4, 0.05, sz, 22, 0.04, 0.08, KIND_SOLID, 0.04);
      rod(sx, 0.05, sz, sx, 0.05, sz - Math.sign(sz) * 2.4, 22, 0.04, 0.08, KIND_SOLID, 0.04);
      rod(sx, 0, sz, sx, 1.4, sz, 18, 0.05, 0.09, KIND_SOLID, 0.05);
    }
  }
  // stake-out: a marker at every future column position, then a hold until the
  // reqs checkpoint ticks - nothing is built before requirements are checked.
  for (const cx of colXs) {
    for (const cz of colZs) {
      rod(cx, 0, cz, cx, 0.55, cz, 14, 0.07, 0.115, KIND_SOLID, 0.07);
    }
  }

  // phase 02 - architecture (0.17 .. 0.31, checkpoint ~0.313): ghost blueprint of the
  // finished tower - ground-plan grid, floor outlines, corner edges and antenna.
  const ghostAt = (y: number) => 0.175 + (y / (roofY + 4.2)) * 0.135;
  for (const cx of colXs) {
    rod(cx, 0.06, -HALF_Z, cx, 0.06, HALF_Z, 40, 0.172, 0.178, KIND_GHOST, 0.02);
  }
  for (const cz of colZs) {
    rod(-HALF_X, 0.06, cz, HALF_X, 0.06, cz, 60, 0.172, 0.178, KIND_GHOST, 0.02);
  }
  for (let level = 0; level <= FLOORS; level++) {
    const y = level * FLOOR_H;
    const gb = ghostAt(y);
    rod(-HALF_X, y, -HALF_Z, HALF_X, y, -HALF_Z, 62, gb, gb, KIND_GHOST, 0.02);
    rod(-HALF_X, y, HALF_Z, HALF_X, y, HALF_Z, 62, gb, gb, KIND_GHOST, 0.02);
    rod(-HALF_X, y, -HALF_Z, -HALF_X, y, HALF_Z, 40, gb, gb, KIND_GHOST, 0.02);
    rod(HALF_X, y, -HALF_Z, HALF_X, y, HALF_Z, 40, gb, gb, KIND_GHOST, 0.02);
  }
  for (const gx of [-HALF_X, HALF_X]) {
    for (const gz of [-HALF_Z, HALF_Z]) {
      rod(gx, 0, gz, gx, roofY, gz, 110, ghostAt(0), ghostAt(roofY), KIND_GHOST, 0.02);
    }
  }
  rod(0, roofY, 0, 0, roofY + 4.2, 0, 36, ghostAt(roofY), ghostAt(roofY + 4.2), KIND_GHOST, 0.02);

  // phase 03 - build begins (0.33+): raw materials and the tower crane arrive.
  for (let i = 0; i < 12; i++) {
    const px = 17.5 + (i % 3) * 1.05;
    const pz = 7.6 + (Math.floor(i / 3) % 2) * 0.75;
    const py = 0.25 + Math.floor(i / 6) * 0.52;
    boxAt(px, py, pz, 0.9, 0.48, 0.62, 26, 0.335, 0.365, KIND_TEMP);
  }
  for (let i = 0; i < 14; i++) {
    const rz = 10.6 + (i % 7) * 0.14;
    const ry = 0.14 + Math.floor(i / 7) * 0.14;
    rod(12, ry, rz, 18, ry, rz, 42, 0.335, 0.365, KIND_TEMP, 0.03);
  }
  const CR_X = 17, CR_Z = -11, CR_H = 34;
  for (const ox of [-0.8, 0.8]) {
    for (const oz of [-0.8, 0.8]) {
      rod(CR_X + ox, 0, CR_Z + oz, CR_X + ox, CR_H, CR_Z + oz, 240, 0.35, 0.42, KIND_TEMP, 0.04);
    }
  }
  for (let by = 2; by < CR_H; by += 2.2) {
    const bb = 0.35 + (by / CR_H) * 0.065;
    rod(CR_X - 0.8, by, CR_Z - 0.8, CR_X + 0.8, by, CR_Z + 0.8, 16, bb, bb, KIND_TEMP, 0.05);
    rod(CR_X - 0.8, by, CR_Z + 0.8, CR_X + 0.8, by, CR_Z - 0.8, 16, bb, bb, KIND_TEMP, 0.05);
  }
  rod(CR_X, CR_H, CR_Z - 0.5, CR_X - 20, CR_H, CR_Z - 0.5, 220, 0.42, 0.432, KIND_TEMP, 0.05);
  rod(CR_X, CR_H, CR_Z + 0.5, CR_X - 20, CR_H, CR_Z + 0.5, 220, 0.42, 0.432, KIND_TEMP, 0.05);
  rod(CR_X, CR_H, CR_Z, CR_X + 7, CR_H, CR_Z, 130, 0.42, 0.428, KIND_TEMP, 0.08);
  boxAt(CR_X + 6.5, CR_H - 0.9, CR_Z, 1.6, 1.3, 1.6, 22, 0.428, 0.436, KIND_TEMP);
  rod(CR_X, CR_H, CR_Z, CR_X, CR_H + 3, CR_Z, 40, 0.425, 0.433, KIND_TEMP, 0.05);
  rod(CR_X, CR_H + 3, CR_Z, CR_X - 14, CR_H + 0.2, CR_Z, 110, 0.432, 0.44, KIND_TEMP, 0.04);
  rod(CR_X, CR_H + 3, CR_Z, CR_X + 6.5, CR_H + 0.2, CR_Z, 60, 0.432, 0.44, KIND_TEMP, 0.04);
  rod(CR_X - 14, CR_H, CR_Z, CR_X - 14, CR_H - 20, CR_Z, 110, 0.44, 0.448, KIND_TEMP, 0.02);
  boxAt(CR_X - 14, CR_H - 20.6, CR_Z, 0.6, 0.9, 0.6, 40, 0.448, 0.455, KIND_TEMP);

  // foundation slab and column footings
  boxAt(0, -0.4, 0, HALF_X * 2 + 3, 0.8, HALF_Z * 2 + 3, 7, 0.34, 0.395, KIND_SOLID);
  for (const cx of colXs) {
    for (const cz of colZs) {
      boxAt(cx, -0.55, cz, 1.9, 0.7, 1.9, 10, 0.34, 0.37, KIND_SOLID);
    }
  }

  // floors fill the blueprint: pillars + rebar -> beams -> slab -> block walls.
  // Floors 0-2 land in "build", 3-5 in "integrate", 6-9 in "test & harden".
  const FLOOR_B0 = 0.4, FLOOR_SPAN = 0.0462;
  for (let f = 0; f < FLOORS; f++) {
    const b = FLOOR_B0 + f * FLOOR_SPAN;
    const s = FLOOR_SPAN;
    const yFloor = f * FLOOR_H;
    const colH = FLOOR_H - SLAB_T;
    for (const cx of colXs) {
      for (const cz of colZs) {
        boxAt(cx, yFloor + colH / 2, cz, 0.55, colH, 0.55, 26, b, b + 0.4 * s, KIND_SOLID);
        for (const rx of [-0.16, 0.16]) {
          for (const rz of [-0.16, 0.16]) {
            rod(
              cx + rx, yFloor, cz + rz,
              cx + rx, yFloor + colH + 1.0, cz + rz,
              52, b - 0.1 * s, b + 0.45 * s, KIND_SOLID, 0.015
            );
          }
        }
      }
    }
    const yBeam = yFloor + FLOOR_H - SLAB_T - 0.18;
    boxAt(0, yBeam, -HALF_Z, HALF_X * 2, 0.36, 0.36, 16, b + 0.4 * s, b + 0.55 * s, KIND_SOLID);
    boxAt(0, yBeam, HALF_Z, HALF_X * 2, 0.36, 0.36, 16, b + 0.4 * s, b + 0.55 * s, KIND_SOLID);
    boxAt(-HALF_X, yBeam, 0, 0.36, 0.36, HALF_Z * 2, 16, b + 0.4 * s, b + 0.55 * s, KIND_SOLID);
    boxAt(HALF_X, yBeam, 0, 0.36, 0.36, HALF_Z * 2, 16, b + 0.4 * s, b + 0.55 * s, KIND_SOLID);
    boxAt(
      0, yFloor + FLOOR_H - SLAB_T / 2, 0,
      HALF_X * 2 + 0.8, SLAB_T, HALF_Z * 2 + 0.8,
      6, b + 0.47 * s, b + 0.68 * s, KIND_SOLID
    );
    const wallH = FLOOR_H - SLAB_T - 0.05;
    wall(-HALF_X, -HALF_Z, HALF_X, -HALF_Z, yFloor, wallH, b + 0.58 * s, b + s, windowsFor(HALF_X * 2, f === 0));
    wall(-HALF_X, HALF_Z, HALF_X, HALF_Z, yFloor, wallH, b + 0.58 * s, b + s, windowsFor(HALF_X * 2, false));
    wall(-HALF_X, -HALF_Z, -HALF_X, HALF_Z, yFloor, wallH, b + 0.58 * s, b + s, windowsFor(HALF_Z * 2, false));
    wall(HALF_X, -HALF_Z, HALF_X, HALF_Z, yFloor, wallH, b + 0.58 * s, b + s, windowsFor(HALF_Z * 2, false));
  }

  // roof: parapet, rooftop units, antenna tops out at go-live
  wall(-HALF_X, -HALF_Z, HALF_X, -HALF_Z, roofY, 0.9, 0.865, 0.905, null);
  wall(-HALF_X, HALF_Z, HALF_X, HALF_Z, roofY, 0.9, 0.865, 0.905, null);
  wall(-HALF_X, -HALF_Z, -HALF_X, HALF_Z, roofY, 0.9, 0.865, 0.905, null);
  wall(HALF_X, -HALF_Z, HALF_X, HALF_Z, roofY, 0.9, 0.865, 0.905, null);
  boxAt(-5, roofY + 0.8, 2, 3.4, 1.6, 2.4, 14, 0.9, 0.93, KIND_SOLID);
  boxAt(5.5, roofY + 0.7, -2.5, 2.6, 1.4, 2.2, 14, 0.9, 0.93, KIND_SOLID);
  rod(0, roofY, 0, 0, roofY + 4.2, 0, 90, 0.94, 0.978, KIND_SOLID, 0.03);
  boxAt(0, roofY + 4.4, 0, 0.4, 0.4, 0.4, 130, 0.972, 0.985, KIND_SOLID);

  return { coords, buildTimes, kinds };
}

const VERTEX_SHADER = `
attribute float aBuild;
attribute float aKind;
uniform float uPointSize;
uniform float uFocal;
varying float vBuild;
varying float vKind;
void main() {
  vBuild = aBuild;
  vKind = aKind;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uPointSize * (uFocal / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = `
uniform float uReveal;
uniform float uEdgeBand;
uniform float uTempHideAt;
uniform vec3 uBaseColor;
uniform vec3 uEdgeColor;
varying float vBuild;
varying float vKind;
void main() {
  if (vBuild > uReveal) discard;
  if (vKind > 0.5 && vKind < 1.5 && uReveal > uTempHideAt) discard;
  if (vKind > 1.5) {
    gl_FragColor = vec4(uBaseColor, 0.3);
    return;
  }
  float edge = smoothstep(uEdgeBand, 0.0, uReveal - vBuild) * step(uReveal, 0.999);
  gl_FragColor = vec4(mix(uBaseColor, uEdgeColor, edge), 0.5 + 0.4 * edge);
}
`;

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const liveBadge = liveRef.current;
    const stepEls = stepsRef.current
      ? (Array.from(stepsRef.current.children) as HTMLElement[])
      : [];
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    // The shaders output plain sRGB values; disable color management so the
    // uniforms reach the fragment shader untransformed.
    THREE.ColorManagement.enabled = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 1000);
    const rig = new THREE.Group();
    scene.add(rig);

    const size = () => {
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 390;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    const site = generateSitePoints();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(site.coords), 3));
    geometry.setAttribute("aBuild", new THREE.BufferAttribute(new Float32Array(site.buildTimes), 1));
    geometry.setAttribute("aKind", new THREE.BufferAttribute(new Float32Array(site.kinds), 1));
    geometry.computeBoundingBox();
    const box = geometry.boundingBox as THREE.Box3;
    const center = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uReveal: { value: 0 },
        uEdgeBand: { value: EDGE_BAND },
        uTempHideAt: { value: TEMP_HIDE_AT },
        uBaseColor: { value: new THREE.Color(0x0033ff) },
        uEdgeColor: { value: new THREE.Color(0x0a1020) },
        uPointSize: { value: 1.35 * Math.min(window.devicePixelRatio || 1, 2) },
        uFocal: { value: 60 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const points = new THREE.Points(geometry, material);
    points.position.set(-center.x, -center.y, -center.z);
    rig.add(points);
    // keep the turntable clear of the checkpoint labels along the right edge
    rig.position.x = -sphere.radius * 0.22;

    const distance = (sphere.radius / Math.tan((camera.fov * Math.PI) / 180 / 2)) * 1.02;
    camera.position.set(0, sphere.radius * 0.4, distance);
    camera.lookAt(0, 0, 0);
    material.uniforms.uFocal.value = distance;

    const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const applyProgress = (reveal: number, complete: boolean) => {
      material.uniforms.uReveal.value = reveal;
      stepEls.forEach((step, i) => {
        step.classList.toggle(styles.active, reveal >= (i + 1) / stepEls.length - 0.02);
      });
      if (liveBadge) liveBadge.style.opacity = complete ? "1" : "0";
    };

    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      rig.rotation.y = (elapsed / 1000) * TURNTABLE_RAD_PER_SEC;
      const t = elapsed % CYCLE_MS;
      const progress = Math.min(Math.max((t - BUILD_START_MS) / BUILD_MS, 0), 1);
      applyProgress(easeInOut(progress), progress >= 1);
      if (stage) {
        const fadeOut = Math.min(Math.max((t - (CYCLE_MS - FADE_MS)) / FADE_MS, 0), 1);
        stage.style.opacity = String(1 - fadeOut);
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      applyProgress(1, true);
      renderer.render(scene, camera);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", size);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.wrap}>
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div ref={stepsRef} className={styles.steps}>
          {STEP_LABELS.map((label) => (
            <div key={label} className={styles.step}>
              <span className={styles.stepLabel}>{label}</span>
              <span className={styles.stepLine} />
              <span className={styles.stepDot} />
            </div>
          ))}
        </div>
        <div ref={liveRef} className={styles.live}>
          <span className={styles.liveDot} />
          <span className={styles.liveText}>live · delivered</span>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>DEVQUERY · REQUIREMENTS → GO-LIVE</div>
        <div className={styles.headerSub}>build: your-business · rev 2.6</div>
      </div>
    </div>
  );
}
