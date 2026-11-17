import { PENDING, type Maybe } from "./site";

/**
 * PROYECTOS INDIVIDUALES
 * ─────────────────────────────────────────────────────────────
 * ✏️  Datos que no dependen del idioma: nombre, links, año, tecnologías, imágenes.
 *     Los textos (descripción, aporte, contexto) están en
 *     src/content/translations/<idioma>.ts → `projects.<id>`.
 *
 *     Para sumar un proyecto:
 *       1. agregá un objeto acá con un `id` nuevo;
 *       2. agregá `projects.<id>` en cada archivo de traducción.
 *     Si te olvidás del paso 2, TypeScript te avisa.
 */
export type LinkKind = "site" | "github" | "demo" | "docs" | "video" | "download" | "images";

export interface ProjectLink {
  kind: LinkKind;
  url: Maybe<string>;
}

export interface ProjectImage {
  /** Ruta dentro de /public, sin extensión: se sirven .avif y .webp. */
  src: string;
  width: number;
  height: number;
}

export interface Project {
  id: "salescost";
  name: string;
  year: Maybe<string>;
  tech: Maybe<string[]>;
  links: ProjectLink[];
  images: ProjectImage[];
  competition: { name: Maybe<string>; year: Maybe<string>; result: Maybe<string> };
}

export const projects: Project[] = [
  {
    id: "salescost",
    name: "SalesCost",
    year: PENDING,
    tech: PENDING, // ej: ["React", "TypeScript", "Supabase"]
    links: [
      { kind: "site", url: "https://salescost.online/" },
      { kind: "github", url: PENDING }, // ¿SalesCost tiene repositorio? Pegá el link acá.
    ],
    images: [{ src: "/images/salescost-home", width: 1440, height: 900 }],
    competition: {
      name: PENDING, // nombre de la competencia de la municipalidad
      year: PENDING,
      result: PENDING,
    },
  },
];
