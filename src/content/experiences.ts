import { PENDING, type Maybe } from "./site";
import type { ProjectImage, ProjectLink } from "./projects";

/**
 * EXPERIENCIAS EN EQUIPO
 * ─────────────────────────────────────────────────────────────
 * ✏️  Equipos, eventos, links y roles. Los textos largos están en
 *     src/content/translations/<idioma>.ts → `team.<id>`.
 *
 *     `role: PENDING` → no se muestra en producción hasta que lo completes.
 *     No inventes un rol: escribí solo lo que hiciste de verdad.
 */
export interface Experience {
  id: "spatium" | "acindar";
  name: string;
  event: string;
  year: Maybe<string>;
  team: string[];
  role: Maybe<string>;
  tech: Maybe<string[]>;
  links: ProjectLink[];
  images: ProjectImage[];
}

export const ME = "Jesús Benjamin Márquez Vargas";

export const experiences: Experience[] = [
  {
    id: "spatium",
    name: "SPATIUM IV",
    event: "NASA Space Apps Challenge",
    year: "2026",
    team: [ME, "Laureano Monteros", "Galian Máximo", "Jonas Villa", "Alex Nuñez"],
    role: PENDING,
    tech: ["Godot 4.7.2", "GDScript", "Blender", "Terrain3D"],
    links: [
      { kind: "github", url: "https://github.com/benjamarquezvargas09-art/SPATIUM-IV-Play" },
      { kind: "docs", url: "https://github.com/benjamarquezvargas09-art/SPATIUM-IV-Play/blob/main/GUIA.md" },
      { kind: "download", url: "https://github.com/benjamarquezvargas09-art/SPATIUM-IV-Play/releases/latest" },
      // [PENDIENTE] Cuando tengas capturas, ponelas en /public/images y sumalas a `images`.
      { kind: "images", url: PENDING },
    ],
    images: [],
  },
  {
    id: "acindar",
    name: "Hackatón ArcelorMittal Acindar",
    event: "ArcelorMittal Acindar",
    year: PENDING,
    team: [ME, "Laureano Monteros", "Galian Máximo", "Samuel Reindl", "Alex Nuñez"],
    role: PENDING,
    tech: PENDING,
    links: [],
    images: [],
  },
];

/**
 * ✏️  Datos de la hackatón Acindar que faltan. Completalos acá
 *     (son nombres propios, no hace falta traducirlos).
 */
export const acindarDetails = {
  project: PENDING as Maybe<string>,
  challenge: PENDING as Maybe<string>,
  result: PENDING as Maybe<string>,
};
