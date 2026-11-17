/**
 * Render en el servidor (solo en `npm run build`).
 * Genera el HTML completo de cada idioma para que Google lo lea sin JavaScript.
 */
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { I18nProvider } from "./lib/i18n";
import type { Dict, Lang } from "./content/translations";
import es from "./content/translations/es";
import en from "./content/translations/en";
import pt from "./content/translations/pt";
import ja from "./content/translations/ja";
import zh from "./content/translations/zh";
import fr from "./content/translations/fr";
import it from "./content/translations/it";

export const dicts: Record<Lang, Dict> = { es, en, pt, ja, zh, fr, it };
export { languages, langPath, defaultLang } from "./content/translations";
export { profile } from "./content/profile";
export { site } from "./content/site";
export { socials } from "./content/socials";
export { projects } from "./content/projects";
export { experiences } from "./content/experiences";

export function render(lang: Lang) {
  return renderToString(
    <I18nProvider initialLang={lang} initialDict={dicts[lang]}>
      <App />
    </I18nProvider>,
  );
}
