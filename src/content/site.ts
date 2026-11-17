/**
 * CONFIGURACIÓN GENERAL DEL SITIO
 * ─────────────────────────────────────────────────────────────
 * ✏️  Cambiá `url` cuando tengas el dominio definitivo.
 *     Se usa para la URL canónica, el sitemap, Open Graph y JSON-LD.
 */
export const site = {
  // ✏️  Dirección principal de la web (sin barra final): Vercel.
  //     La copia de GitHub Pages apunta acá como canónica para que Google no la duplique.
  //     Si comprás un dominio propio, conectalo en Vercel y cambialo acá.
  url: "https://benjamin-marquez.vercel.app",

  // Imagen para compartir en redes (1200×630). Se genera con `npm run images`.
  ogImage: "/og.jpg",

  // Color de la barra del navegador en móviles.
  themeColor: "#0b0b0c",

  /**
   * Muestra las etiquetas [PENDIENTE] en la web.
   * En desarrollo (`npm run dev`) se ven para que sepas qué falta;
   * en producción se ocultan automáticamente.
   */
  showPending: import.meta.env.DEV,
} as const;

/** Marca un dato que todavía falta completar. */
export const PENDING = "[PENDIENTE]" as const;
export type Maybe<T> = T | typeof PENDING;

export const isPending = (value: unknown): value is typeof PENDING => value === PENDING;
