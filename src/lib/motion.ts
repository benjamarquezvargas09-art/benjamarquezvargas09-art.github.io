/**
 * Sistema de movimiento compartido.
 * ─────────────────────────────────────────────────────────────
 * Tres niveles de efectos según el dispositivo:
 *   full   → fondo 3D completo, cursor propio, imanes, letras que reaccionan.
 *   lite   → fondo 3D más liviano (móviles, equipos modestos, ahorro de datos).
 *   static → sin WebGL ni movimiento continuo (prefers-reduced-motion).
 *
 * El scroll y el puntero se guardan en objetos mutables (no en estado de React)
 * para que la escena 3D los lea en cada frame sin re-renderizar nada.
 */
export type Tier = "full" | "lite" | "static";

export const scrollState = { y: 0, progress: 0, velocity: 0, max: 1 };
export const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false };

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function detectTier(): Tier {
  if (typeof window === "undefined") return "static";
  if (prefersReducedMotion()) return "static";

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) return "static";

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;

  if (saveData || cores < 4 || memory < 4 || !finePointer || window.innerWidth < 900) return "lite";
  return "full";
}

/** Curvas compartidas (mismos valores que tokens.css). */
export const ease = {
  out: (t: number) => 1 - Math.pow(1 - t, 4),
  inOut: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Evento global para el easter egg (escribir "potip"). */
export const POTIP_EVENT = "potip:found";
