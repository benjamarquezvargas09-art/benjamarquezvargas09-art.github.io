import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultLang, langInfo, langPath, loaders, type Dict, type Lang } from "../content/translations";

const STORAGE_KEY = "bm-lang";

interface I18n {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => Promise<void>;
}

const Ctx = createContext<I18n | null>(null);

/** Reemplaza {clave} por su valor: fmt("{age} años", { age: 16 }). */
export const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));

export function readStoredLang(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* modo privado: no pasa nada, solo no se recuerda */
  }
}

function applyDocumentLang(lang: Lang, dict: Dict) {
  document.documentElement.lang = langInfo(lang).htmlLang;
  document.title = dict.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", dict.meta.description);
}

export function I18nProvider({
  initialLang = defaultLang,
  initialDict,
  children,
}: {
  initialLang?: Lang;
  initialDict: Dict;
  children: ReactNode;
}) {
  const [state, setState] = useState<{ lang: Lang; t: Dict }>({ lang: initialLang, t: initialDict });

  const setLang = useCallback(async (lang: Lang) => {
    const { default: dict } = await loaders[lang]();
    setState({ lang, t: dict });
    storeLang(lang);
    applyDocumentLang(lang, dict);
    // Cambia la URL sin recargar, para que cada idioma tenga su dirección.
    const next = langPath(lang) + window.location.hash;
    if (window.location.pathname + window.location.hash !== next) history.pushState({ lang }, "", next);
  }, []);

  const value = useMemo(() => ({ ...state, setLang }), [state, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n fuera de I18nProvider");
  return ctx;
}
