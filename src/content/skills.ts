/**
 * HABILIDADES Y PASATIEMPOS
 * ─────────────────────────────────────────────────────────────
 * ✏️  Los nombres visibles están en translations/<idioma>.ts
 *     (`skills.items` y `hobbies.also`). Acá solo va el orden,
 *     el grupo y en qué proyectos se usó cada habilidad.
 *
 *     `usedIn` acepta ids de projects.ts, experiences.ts y achievements.ts.
 */
export const skillGroups = [
  { id: "create", skills: ["programming", "webdesign", "apps", "posts", "tools"] },
  { id: "think", skills: ["strategy", "ideas", "problems", "detail", "learning"] },
  { id: "share", skills: ["teamwork", "collaboration", "communication", "competitions"] },
] as const;

export type SkillId = (typeof skillGroups)[number]["skills"][number];
export type GroupId = (typeof skillGroups)[number]["id"];

/** Ids de evidencia → el nombre visible está en translations (`evidence`). */
export type EvidenceId =
  | "salescost"
  | "spatium"
  | "acindar"
  | "chess"
  | "sumo"
  | "linefollower"
  | "instagram"
  | "pitch";

export const skillEvidence: Record<SkillId, EvidenceId[]> = {
  programming: ["salescost", "spatium", "sumo"],
  webdesign: ["salescost"],
  apps: ["salescost", "spatium"],
  posts: ["instagram"],
  tools: ["salescost", "spatium"],
  strategy: ["chess", "sumo"],
  ideas: ["salescost", "spatium"],
  problems: ["salescost", "linefollower"],
  detail: ["salescost", "chess"],
  learning: ["spatium", "acindar"],
  teamwork: ["spatium", "acindar"],
  collaboration: ["spatium", "acindar", "sumo"],
  communication: ["pitch"],
  competitions: ["spatium", "acindar", "chess"],
};

/** Ancla de la sección a la que lleva cada evidencia al hacer clic. */
export const evidenceAnchor: Record<EvidenceId, string> = {
  salescost: "#proyectos",
  spatium: "#equipo",
  acindar: "#equipo",
  chess: "#logros",
  sumo: "#logros",
  linefollower: "#logros",
  instagram: "#contacto",
  pitch: "#equipo",
};

/** Juegos: son nombres propios, iguales en todos los idiomas. */
export const games = ["Fortnite", "Counter-Strike", "Minecraft", "Roblox", "Plato", "Brawl Stars"];

export const alsoEnjoy = [
  "webs",
  "apps",
  "coding",
  "computer",
  "tools",
  "ideas",
  "posts",
  "events",
  "people",
  "experiments",
] as const;
export type AlsoId = (typeof alsoEnjoy)[number];
