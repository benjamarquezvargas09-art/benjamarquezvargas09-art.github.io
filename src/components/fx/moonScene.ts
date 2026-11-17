/**
 * Luna 3D de SPATIUM IV con texturas REALES de la NASA:
 *  · Color: Lunar Reconnaissance Orbiter Camera (LROC).
 *  · Relieve: altimetría del Lunar Orbiter Laser Altimeter (LOLA).
 * Fuente: NASA's Scientific Visualization Studio, "CGI Moon Kit" (dominio público).
 * Se arrastra con el mouse o el dedo para girarla (con inercia) y gira sola despacio.
 */
import * as THREE from "three";

export function createMoon(
  canvas: HTMLCanvasElement,
  { reduced, small, onReady }: { reduced: boolean; small: boolean; onReady: () => void },
) {
  let pending = 2;
  const onLoaded = () => {
    pending -= 1;
    if (pending === 0) onReady();
  };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 9.2);

  const loader = new THREE.TextureLoader();
  const tex = loader.load(small ? "/textures/moon-color-1k.webp" : "/textures/moon-color-2k.webp", onLoaded);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const height = loader.load("/textures/moon-height.webp", onLoaded);
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, small ? 128 : 256, small ? 64 : 128),
    new THREE.MeshStandardMaterial({
      map: tex,
      displacementMap: height,
      displacementScale: 0.035,
      bumpMap: height,
      bumpScale: 1.4,
      roughness: 1,
      metalness: 0,
    }),
  );
  // La cara visible de la Luna mirando a la cámara al empezar.
  moon.rotation.y = -Math.PI / 2;
  const tilt = new THREE.Group();
  tilt.rotation.z = 0.12;
  tilt.add(moon);

  // Órbita naranja y un satélite (la colonia de SPATIUM IV, digamos).
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0, -0.32);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.009, 8, 220), new THREE.MeshBasicMaterial({ color: "#ff5a1f" }));
  const sat = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), new THREE.MeshBasicMaterial({ color: "#e9ece0" }));
  orbit.add(ring, sat);

  scene.add(tilt, orbit);
  scene.add(new THREE.AmbientLight(0xffffff, 0.08));
  const sun = new THREE.DirectionalLight(0xfff4e6, 3.2);
  sun.position.set(-4, 2, 3);
  const rim = new THREE.DirectionalLight(0xff5a1f, 1.2);
  rim.position.set(4, -1, -3);
  scene.add(sun, rim);

  /* Arrastrar para girar, con inercia */
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let vx = 0;
  let vy = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.dataset.dragging = "";
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    vx = (e.clientX - lastX) * 0.006;
    vy = (e.clientY - lastY) * 0.006;
    lastX = e.clientX;
    lastY = e.clientY;
    moon.rotation.y += vx;
    moon.rotation.x = THREE.MathUtils.clamp(moon.rotation.x + vy, -0.9, 0.9);
  };
  const onUp = () => {
    dragging = false;
    delete canvas.dataset.dragging;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let angle = 0;
  const tick = () => {
    if (!dragging) {
      moon.rotation.y += vx + (reduced ? 0 : 0.0018);
      moon.rotation.x = THREE.MathUtils.clamp(moon.rotation.x + vy, -0.9, 0.9);
      vx *= 0.94;
      vy *= 0.94;
    }
    if (!reduced) angle += 0.006;
    sat.position.set(Math.cos(angle) * 2.15, Math.sin(angle) * 2.15, 0);
    renderer.render(scene, camera);
  };

  // Solo se dibuja mientras está en pantalla.
  const io = new IntersectionObserver(([entry]) => renderer.setAnimationLoop(entry.isIntersecting ? tick : null));
  io.observe(canvas);

  return {
    dispose() {
      io.disconnect();
      ro.disconnect();
      renderer.setAnimationLoop(null);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      tex.dispose();
      height.dispose();
      moon.geometry.dispose();
      (moon.material as THREE.Material).dispose();
      ring.geometry.dispose();
      sat.geometry.dispose();
      renderer.dispose();
    },
  };
}
