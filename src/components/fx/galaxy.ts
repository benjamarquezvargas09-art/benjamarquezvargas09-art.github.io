/**
 * Galaxia de partículas (inspirada en las escenas tipo "Vesper").
 * ─────────────────────────────────────────────────────────────
 * Decenas de miles de puntos en brazos espirales que giran a distinta
 * velocidad (el centro más rápido). Todo se calcula en la GPU.
 * El mouse abre un remolino: las partículas se apartan, giran y se
 * encienden de naranja alrededor del cursor.
 */
import * as THREE from "three";

const vertex = /* glsl */ `
  attribute float aRadius;
  attribute float aAngle;
  attribute vec3 aRand;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime, uPixel, uIntro, uSpin, uRadius;
  uniform vec3 uPointer;
  uniform float uPointerStrength, uPointerReach;
  uniform vec3 uInner, uOuter;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = aRadius;
    float ang = aAngle + uSpin / (r * 0.35 + 0.6);
    vec3 p = vec3(cos(ang) * r, 0.0, sin(ang) * r) + aRand;

    // Entrada: las partículas llegan en espiral desde afuera.
    float k = clamp(uIntro * 1.15 - aSeed * 0.15, 0.0, 1.0);
    p.xz *= mix(2.6, 1.0, k);
    p.y += (1.0 - k) * (aSeed - 0.5) * 6.0;

    // Remolino del mouse.
    vec2 d = p.xz - uPointer.xz;
    float dist = length(d);
    float f = smoothstep(uPointerReach, 0.0, dist) * uPointerStrength;
    vec2 dir = d / max(dist, 0.001);
    p.xz += dir * f * 1.5 + vec2(-dir.y, dir.x) * f * 1.6;
    p.y += f * (aSeed - 0.5) * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixel * (1.0 + f * 1.4) * (26.0 / -mv.z);

    vColor = mix(uInner, uOuter, smoothstep(0.0, 0.55, r / uRadius));
    vColor = mix(vColor, vec3(1.0, 0.5, 0.25), f * 0.7);
    vAlpha = k * (0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 40.0)) * smoothstep(uRadius * 1.1, uRadius * 0.6, r);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha * 0.75);
  }
`;

export interface Galaxy {
  points: THREE.Points;
  uniforms: Record<string, THREE.IUniform>;
  /** Proyecta el puntero sobre el plano de la galaxia. */
  aim: (raycaster: THREE.Raycaster, active: boolean, boost: number) => void;
  dispose: () => void;
}

export function createGalaxy({
  count,
  radius = 10,
  branches = 4,
  spin = 1.1,
  pixelRatio,
  inner = "#ffb487",
  outer = "#cfd3c6",
}: {
  count: number;
  radius?: number;
  branches?: number;
  spin?: number;
  pixelRatio: number;
  inner?: string;
  outer?: string;
}): Galaxy {
  const aRadius = new Float32Array(count);
  const aAngle = new Float32Array(count);
  const aRand = new Float32Array(count * 3);
  const aSize = new Float32Array(count);
  const aSeed = new Float32Array(count);
  const position = new Float32Array(count * 3); // requerido por three; la posición real sale del shader

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * radius;
    aRadius[i] = r;
    aAngle[i] = ((i % branches) / branches) * Math.PI * 2 + r * spin;
    const spread = 0.35 * (0.25 + r / radius);
    for (let j = 0; j < 3; j++) {
      const sign = Math.random() < 0.5 ? -1 : 1;
      aRand[i * 3 + j] = Math.pow(Math.random(), 3) * sign * spread * (j === 1 ? 0.45 : 1) * radius * 0.35;
    }
    aSize[i] = 0.35 + Math.pow(Math.random(), 4) * 2.4;
    aSeed[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geo.setAttribute("aRadius", new THREE.BufferAttribute(aRadius, 1));
  geo.setAttribute("aAngle", new THREE.BufferAttribute(aAngle, 1));
  geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPixel: { value: pixelRatio },
    uIntro: { value: 0 },
    uSpin: { value: 0 },
    uRadius: { value: radius },
    uPointer: { value: new THREE.Vector3(999, 0, 999) },
    uPointerStrength: { value: 0 },
    uPointerReach: { value: 3.2 },
    uInner: { value: new THREE.Color(inner) },
    uOuter: { value: new THREE.Color(outer) },
  };

  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  points.frustumCulled = false;

  const plane = new THREE.Plane();
  const normal = new THREE.Vector3();
  const hit = new THREE.Vector3();
  let strength = 0;

  return {
    points,
    uniforms,
    aim(raycaster, active, boost) {
      normal.set(0, 1, 0).applyQuaternion(points.quaternion);
      plane.setFromNormalAndCoplanarPoint(normal, points.position);
      const ok = active && raycaster.ray.intersectPlane(plane, hit);
      if (ok) {
        points.worldToLocal(hit);
        const inside = hit.length() < radius * 1.4;
        uniforms.uPointer.value.lerp(hit, 0.25);
        strength += ((inside ? 0.9 + boost : 0) - strength) * 0.08;
      } else {
        strength += (0 - strength) * 0.05;
      }
      uniforms.uPointerStrength.value = strength;
      uniforms.uPointerReach.value = 2.4 + boost * 1.6;
    },
    dispose() {
      geo.dispose();
      (points.material as THREE.Material).dispose();
    },
  };
}
