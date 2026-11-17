import type { Dict } from "./es";

/**
 * REGISTRO DE IDIOMAS
 * ─────────────────────────────────────────────────────────────
 * ✏️  Para agregar un idioma:
 *     1. copiá en.ts como <código>.ts y traducí los textos;
 *     2. sumá una entrada acá (código, etiqueta corta, nombre, bandera);
 *     3. si la bandera no existe, dibujala en src/components/ui/Flag.tsx.
 *     La URL del idioma será /<código>/ (español queda en /).
 */
export const languages = [
  { code: "es", label: "ESP", name: "Español", flag: "ar", htmlLang: "es-AR", ogLocale: "es_AR" },
  { code: "en", label: "ENG", name: "English", flag: "us", htmlLang: "en", ogLocale: "en_US" },
  { code: "pt", label: "POR", name: "Português", flag: "br", htmlLang: "pt-BR", ogLocale: "pt_BR" },
  { code: "ja", label: "JPN", name: "日本語", flag: "jp", htmlLang: "ja", ogLocale: "ja_JP" },
  { code: "zh", label: "中文", name: "简体中文", flag: "cn", htmlLang: "zh-Hans", ogLocale: "zh_CN" },
  { code: "fr", label: "FRA", name: "Français", flag: "fr", htmlLang: "fr", ogLocale: "fr_FR" },
  { code: "it", label: "ITA", name: "Italiano", flag: "it", htmlLang: "it", ogLocale: "it_IT" },
] as const;

export type Lang = (typeof languages)[number]["code"];
export type FlagId = (typeof languages)[number]["flag"];
export const defaultLang: Lang = "es";

export const isLang = (value: string | null | undefined): value is Lang =>
  languages.some((l) => l.code === value);

export const langInfo = (code: Lang) => languages.find((l) => l.code === code)!;

/** Ruta pública de cada idioma. */
export const langPath = (code: Lang) => (code === defaultLang ? "/" : `/${code}/`);

/** Carga diferida: solo se descarga el idioma que se usa. */
export const loaders: Record<Lang, () => Promise<{ default: Dict }>> = {
  es: () => import("./es"),
  en: () => import("./en"),
  pt: () => import("./pt"),
  ja: () => import("./ja"),
  zh: () => import("./zh"),
  fr: () => import("./fr"),
  it: () => import("./it"),
};

export type { Dict };
