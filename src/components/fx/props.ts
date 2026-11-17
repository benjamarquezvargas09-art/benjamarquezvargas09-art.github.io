/**
 * Objetos de fondo a lo largo del recorrido:
 *  · Anillos ("portales") que la cámara atraviesa al bajar.
 *  · Figuras de alambre que flotan a los costados y miran hacia el mouse.
 */
import * as THREE from "three";

export interface Props {
  group: THREE.Group;
  update: (time: number, mx: number, my: number, vel: number) => void;
  dispose: () => void;
}

export function createProps(curve: THREE.CatmullRomCurve3, full: boolean): Props {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  /* Portales */
  const ringGeo = new THREE.TorusGeometry(5.5, 0.018, 6, 160);
  const ringPaper = new THREE.MeshBasicMaterial({ color: "#e9ece0", transparent: true, opacity: 0.22, fog: true });
  const ringLine = new THREE.MeshBasicMaterial({ color: "#ff5a1f", transparent: true, opacity: 0.55, fog: true });
  disposables.push(ringGeo, ringPaper, ringLine);
  const rings: THREE.Mesh[] = [];
  const RINGS = full ? 9 : 6;
  const tangent = new THREE.Vector3();
  for (let i = 0; i < RINGS; i++) {
    const u = 0.08 + (i / RINGS) * 0.86;
    const ring = new THREE.Mesh(ringGeo, i % 3 === 1 ? ringLine : ringPaper);
    curve.getPointAt(u, ring.position);
    curve.getTangentAt(u, tangent);
    ring.lookAt(ring.position.clone().add(tangent));
    ring.scale.setScalar(0.8 + (i % 3) * 0.25);
    ring.userData.spin = (i % 2 ? 1 : -1) * (0.05 + i * 0.01);
    rings.push(ring);
    group.add(ring);
  }

  /* Figuras de alambre */
  const shapes: THREE.BufferGeometry[] = [
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.TorusKnotGeometry(1, 0.28, 90, 8),
    new THREE.DodecahedronGeometry(1.3, 0),
    new THREE.TorusGeometry(1.3, 0.45, 8, 24),
    new THREE.TetrahedronGeometry(1.5, 0),
  ];
  const wireMat = new THREE.LineBasicMaterial({ color: "#e9ece0", transparent: true, opacity: 0.16, fog: true });
  const hotMat = new THREE.LineBasicMaterial({ color: "#ff5a1f", transparent: true, opacity: 0.45, fog: true });
  disposables.push(wireMat, hotMat);
  const wires: THREE.LineSegments[] = [];
  const COUNT = full ? 14 : 7;
  const p = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    const geo = new THREE.WireframeGeometry(shapes[i % shapes.length]);
    disposables.push(geo);
    const mesh = new THREE.LineSegments(geo, i % 5 === 2 ? hotMat : wireMat);
    const u = 0.03 + (i / COUNT) * 0.92;
    curve.getPointAt(u, p);
    const side = i % 2 ? 1 : -1;
    mesh.position.set(p.x + side * (8 + (i % 3) * 2.5), p.y + ((i * 37) % 7) - 3, p.z - 4);
    mesh.scale.setScalar(0.8 + ((i * 13) % 5) * 0.2);
    mesh.userData = { rx: 0.1 + (i % 4) * 0.05, ry: 0.15 + (i % 3) * 0.06, y: mesh.position.y, phase: i * 1.7 };
    wires.push(mesh);
    group.add(mesh);
  }
  shapes.forEach((s) => s.dispose());

  return {
    group,
    update(time, mx, my, vel) {
      for (const r of rings) r.rotation.z += r.userData.spin * 0.016 * (1 + vel * 6);
      for (const w of wires) {
        const d = w.userData;
        w.rotation.x = time * d.rx + my * 0.6;
        w.rotation.y = time * d.ry + mx * 0.8;
        w.position.y = d.y + Math.sin(time * 0.6 + d.phase) * 0.5;
      }
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
