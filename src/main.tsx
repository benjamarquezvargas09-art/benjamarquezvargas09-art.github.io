import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/gloock/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/archivo/wdth.css";
import "./styles/index.css";
import { App } from "./App";
import { defaultLang, isLang, langPath, loaders, type Lang } from "./content/translations";
import { I18nProvider, readStoredLang } from "./lib/i18n";

async function start() {
  const root = document.getElementById("root")!;
  const segment = window.location.pathname.split("/")[1];
  let lang: Lang = isLang(segment) ? segment : defaultLang;
  let redirected = false;

  // Si alguien eligió otro idioma antes y entra a "/", se respeta su preferencia.
  const stored = readStoredLang();
  if (!segment && isLang(stored) && stored !== defaultLang) {
    lang = stored;
    redirected = true;
    history.replaceState(null, "", langPath(lang) + window.location.hash);
  }

  const { default: dict } = await loaders[lang]();
  const tree = (
    <StrictMode>
      <I18nProvider initialLang={lang} initialDict={dict}>
        <App />
      </I18nProvider>
    </StrictMode>
  );

  if (root.hasChildNodes() && !redirected) {
    hydrateRoot(root, tree);
  } else {
    if (redirected) {
      document.documentElement.lang = lang;
      document.title = dict.meta.title;
    }
    root.textContent = "";
    createRoot(root).render(tree);
  }
}

void start();
