import { PENDING, type Maybe } from "./site";

/**
 * LOGROS Y COMPETENCIAS
 * ─────────────────────────────────────────────────────────────
 * ✏️  Para sumar un logro: agregá un objeto acá y su texto en
 *     translations/<idioma>.ts → `wins.items.<id>`.
 *     `art` elige el dibujo de línea que aparece al pasar el mouse
 *     (knight, sumo, track, trophy).
 *     Ganaste el ajedrez de nuevo? Sumá el año a `years`.
 */
export interface Achievement {
  id: "chess" | "sumo" | "linefollower";
  years: Maybe<string>[];
  with: string[];
  art: "knight" | "sumo" | "track" | "trophy";
}

export const achievements: Achievement[] = [
  {
    id: "chess",
    years: ["2025", "2026"],
    with: ["Mariano Andrada", "Alex Nuñez"],
    art: "knight",
  },
  {
    id: "sumo",
    years: [PENDING],
    with: ["Laureano Monteros", "Alex Nuñez", "Galian Máximo"],
    art: "sumo",
  },
  {
    id: "linefollower",
    years: [PENDING], // fue en 2° año
    with: ["Laureano Monteros"],
    art: "track",
  },
];
