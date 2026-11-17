/**
 * Escena 3D de fondo (Three.js). Se carga de forma diferida desde Background.tsx.
 * ─────────────────────────────────────────────────────────────
 *  · Estrellas: un campo que da profundidad; cerca del mouse se apartan y brillan.
 *  · La línea: el hilo naranja de toda la web, en 3D. La cámara la recorre
 *    a medida que bajás y la línea se va dibujando delante tuyo.
 *  · Dos galaxias de partículas (una detrás del nombre; la otra es
 *    el destino al final de la página) que reaccionan al mouse.
 *  · Portales que atravesás al bajar y figuras de alambre a los costados.
 */
import * as THREE from "three";
import { clamp, ease, lerp, pointer, POTIP_EVENT, scrollState, type Tier } from "../../lib/motion";
import { createGalaxy } from "./galaxy";
import { createProps } from "./props";

const INK = new THREE.Color("#0b0b0c");
const LINE = new THREE.Color("#ff5a1f");

const pointsVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime, uPixel, uVel, uPotip, uAspect, uMouseOn;
  uniform vec2 uMouse;
  varying float vAlpha;
  varying float vHot;
  varying float vNear;
  void main() {
    vec3 p = position;
    float drift = uTime * (0.12 + uPotip * 1.2);
    p.x += sin(drift + aSeed * 6.283) * 0.25;
    p.y += cos(drift * 0.9 + aSeed * 4.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Mouse: en pantalla, las estrellas cercanas se corren y se encienden.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
    float dist = length(d);
    float f = smoothstep(0.32, 0.0, dist) * uMouseOn;
    gl_Position.xy += normalize(d + 1e-5) / vec2(uAspect, 1.0) * f * 0.07 * gl_Position.w;
    vNear = f;

    float depth = -mv.z;
    gl_PointSize = aSize * uPixel * (1.0 + uVel * 0.6 + f * 1.6) * (22.0 / depth);
    float twinkle = 0.45 + 0.55 * pow(0.5 + 0.5 * sin(uTime * (0.8 + aSeed * 2.4) + aSeed * 40.0), 2.0);
    vAlpha = smoothstep(110.0, 10.0, depth) * smoothstep(0.4, 3.0, depth) * twinkle;
    vHot = step(0.965, aSeed);
  }
`;

const pointsFragment = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  varying float vHot;
  varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.22, 0.0, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.35;
    vec3 col = mix(vec3(0.93, 0.94, 0.9), vec3(1.0, 0.4, 0.16), max(vHot, vNear * 0.9));
    gl_FragColor = vec4(col, (core + halo) * vAlpha * (0.9 + vNear));
  }
`;

export interface SceneHandle {
  dispose: () => void;
}

export function createScene(canvas: HTMLCanvasElement, tier: Exclude<Tier, "static">): SceneHandle {
  const full = tier === "full";
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: full, alpha: false, powerPreference: "high-performance" });
  const pixelRatio = full ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1) * 0.8;
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(INK, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(INK, 0.03);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

  /* ── La línea ─────────────────────────────────────────── */
  const SEGMENTS = 44;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    pts.push(
      new THREE.Vector3(
        Math.sin(i * 0.55) * 5 + Math.sin(i * 0.21) * 3,
        Math.cos(i * 0.43) * 2.6 + Math.sin(i * 0.17) * 1.8,
        -i * 6,
      ),
    );
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const TUBULAR = full ? 900 : 500;
  const RADIAL = 6;
  const lineGeo = new THREE.TubeGeometry(curve, TUBULAR, 0.045, RADIAL, false);
  const glowGeo = new THREE.TubeGeometry(curve, TUBULAR, 0.28, RADIAL, false);
  const lineMat = new THREE.MeshBasicMaterial({ color: LINE, fog: true });
  const glowMat = new THREE.MeshBasicMaterial({
    color: LINE,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  });
  const line = new THREE.Mesh(lineGeo, lineMat);
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(line, glow);
  const indexCount = lineGeo.index!.count;
  const perSegment = RADIAL * 6;

  /* ── Galaxias ─────────────────────────────────────────── */
  const galaxyA = createGalaxy({ count: full ? 56000 : 14000, radius: 11.5, branches: 4, spin: 1.05, pixelRatio });
  // Galaxia del hero: cerca de la cámara e inclinada (se ve como una elipse ancha), arriba del nombre.
  const galaxyBaseY = pts[1].y + 2;
  galaxyA.points.position.set(pts[1].x + 1.2, galaxyBaseY, -6);
  galaxyA.points.rotation.set(0.3, 0.1, -0.2);
  const galaxyB = createGalaxy({ count: full ? 32000 : 8000, radius: 13, branches: 3, spin: 0.8, pixelRatio, inner: "#ff8a52" });
  curve.getPointAt(1, galaxyB.points.position);
  galaxyB.points.position.add(new THREE.Vector3(-2, 1, -10));
  galaxyB.points.rotation.set(1.05, 0.3, 0.2);
  scene.add(galaxyA.points, galaxyB.points);

  /* ── Portales y figuras ───────────────────────────────── */
  const props = createProps(curve, full);
  scene.add(props.group);
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let lastPX = 0;
  let lastPY = 0;
  let pSpeed = 0;
  let spinA = 0;
  let spinB = 0;

  /* ── Partículas ───────────────────────────────────────── */
  const COUNT = full ? 3400 : 1200;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const z = 10 - Math.random() * 280;
    const center = curve.getPointAt(clamp(-z / 264));
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.pow(Math.random(), 0.55) * 34;
    positions[i * 3] = center.x + Math.cos(angle) * radius;
    positions[i * 3 + 1] = center.y + Math.sin(angle) * radius * 0.7;
    positions[i * 3 + 2] = z;
    sizes[i] = 0.5 + Math.pow(Math.random(), 3) * 2.6;
    seeds[i] = Math.random();
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  pointsGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const pointsUniforms = {
    uTime: { value: 0 },
    uPixel: { value: pixelRatio },
    uVel: { value: 0 },
    uPotip: { value: 0 },
    uAspect: { value: 1 },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uMouseOn: { value: 0 },
  };
  const points = new THREE.Points(
    pointsGeo,
    new THREE.ShaderMaterial({
      uniforms: pointsUniforms,
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  points.frustumCulled = false;
  scene.add(points);

  /* ── Tamaño ───────────────────────────────────────────── */
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas angostas, la cámara se aleja un poco para que la línea entre.
    camera.fov = w < 700 ? 68 : 55;
    // En celulares la galaxia sube para no quedar detrás del texto.
    galaxyA.points.position.y = galaxyBaseY + (w < 700 ? 3.2 : 0);
    camera.updateProjectionMatrix();
    pointsUniforms.uAspect.value = w / h;
    pointsUniforms.uPixel.value = renderer.getPixelRatio();
  };
  resize();
  window.addEventListener("resize", resize);

  /* ── Easter egg ───────────────────────────────────────── */
  let potip = 0;
  const onPotip = () => (potip = 1);
  window.addEventListener(POTIP_EVENT, onPotip);

  /* ── Loop ─────────────────────────────────────────────── */
  const start = performance.now();
  const INTRO_MS = 2600;
  let progress = 0;
  let vel = 0;
  let mx = 0;
  let my = 0;
  let starX = 9;
  let starY = 9;
  let starOn = 0;
  const target = new THREE.Vector3();
  const look = new THREE.Vector3();

  /* Calidad adaptativa: si la compu no llega a ~45 fps, baja resolución y efectos. */
  let quality = 0;
  let frames = 0;
  let slowFrames = 0;
  let last = performance.now();
  const degrade = () => {
    quality += 1;
    slowFrames = 0;
    frames = 0;
    if (quality === 1) {
      renderer.setPixelRatio(pixelRatio * 0.75);
      galaxyB.points.visible = false;
      glow.visible = false;
    } else if (quality === 2) {
      renderer.setPixelRatio(pixelRatio * 0.6);
      props.group.visible = false;
    }
    resize();
  };

  const tick = () => {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (now - start > 3500 && quality < 2 && !document.hidden) {
      frames += 1;
      if (dt > 22) slowFrames += 1;
      if (frames >= 120) {
        if (slowFrames > 60) degrade();
        frames = 0;
        slowFrames = 0;
      }
    }
    const time = (now - start) / 1000;
    const intro = ease.out(clamp((now - start) / INTRO_MS));

    progress = lerp(progress, scrollState.progress, 0.07);
    vel = lerp(vel, clamp(Math.abs(scrollState.velocity) / 45), 0.08);
    mx = lerp(mx, pointer.nx, 0.05);
    my = lerp(my, pointer.ny, 0.05);
    potip = Math.max(0, potip - 0.006);

    // Cámara: recorre la línea con el scroll; arranca lejos y "aterriza" en la intro.
    const u = clamp(progress * 0.86);
    curve.getPointAt(u, target);
    curve.getPointAt(Math.min(u + 0.035, 1), look);
    camera.position.set(target.x + 5 + mx * 1.6, target.y + 2.6 - my * 1.0, target.z + 12 + (1 - intro) * 46);
    camera.lookAt(look.x + mx * 0.6, look.y - my * 0.4, look.z);
    camera.rotation.z += Math.sin(time * 0.15) * 0.015;

    // Galaxias: giran siempre, más rápido al scrollear; el mouse abre un remolino.
    camera.updateMatrixWorld();
    ndc.set(pointer.nx, -pointer.ny);
    raycaster.setFromCamera(ndc, camera);
    pSpeed = lerp(pSpeed, clamp(Math.hypot(pointer.x - lastPX, pointer.y - lastPY) / 60), 0.1);
    lastPX = pointer.x;
    lastPY = pointer.y;
    spinA += 0.0035 + vel * 0.03 + potip * 0.04;
    spinB += 0.0025 + vel * 0.02;
    for (const [g, spin] of [
      [galaxyA, spinA],
      [galaxyB, spinB],
    ] as const) {
      g.uniforms.uTime.value = time;
      g.uniforms.uSpin.value = spin;
      g.uniforms.uIntro.value = ease.out(clamp((now - start) / 3400));
      g.aim(raycaster, pointer.active, pSpeed + potip);
    }
    props.update(time, mx, my, vel);

    // La línea se dibuja por delante de la cámara: el tramo que ya pasó se borra,
    // así nunca queda un tubo gigante tapando el texto.
    const reveal = clamp((u + 0.1) * intro + (1 - intro) * intro * 0.08);
    const end = Math.floor((indexCount * reveal) / perSegment) * perSegment;
    const begin = Math.floor((indexCount * clamp(u - 0.004)) / perSegment) * perSegment;
    lineGeo.setDrawRange(begin, Math.max(0, end - begin));
    glowGeo.setDrawRange(begin, Math.max(0, end - begin));
    glowMat.opacity = 0.05 + vel * 0.07 + potip * 0.35;

    // Estrellas: el puntero (suavizado) en coordenadas de pantalla -1..1.
    if (pointer.active) {
      starX = starX > 8 ? pointer.nx : lerp(starX, pointer.nx, 0.18);
      starY = starY > 8 ? -pointer.ny : lerp(starY, -pointer.ny, 0.18);
    }
    starOn = lerp(starOn, pointer.active ? 1 : 0, 0.05);
    pointsUniforms.uMouse.value.set(starX, starY);
    pointsUniforms.uMouseOn.value = starOn * intro;
    pointsUniforms.uTime.value = time;
    pointsUniforms.uVel.value = vel;
    pointsUniforms.uPotip.value = potip;

    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(tick);

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener(POTIP_EVENT, onPotip);
      [lineGeo, glowGeo, pointsGeo].forEach((g) => g.dispose());
      galaxyA.dispose();
      galaxyB.dispose();
      props.dispose();
      [lineMat, glowMat, points.material].forEach((m) => (m as THREE.Material).dispose());
      renderer.dispose();
    },
  };
}
