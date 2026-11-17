import { useEffect, useId, useRef, useState } from "react";
import { langInfo, languages, type Lang } from "../../content/translations";
import { useI18n } from "../../lib/i18n";
import { Flag } from "./Flag";
import { Icon } from "./Icon";

/** Selector de idioma: bandera + código corto. Cambia sin recargar y recuerda la elección. */
export function LangSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = langInfo(lang);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    rootRef.current?.querySelector<HTMLButtonElement>("[aria-current='true']")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = async (code: Lang) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (code !== lang) await setLang(code);
  };

  return (
    <div className="lang" ref={rootRef} data-open={open || undefined}>
      <button
        ref={buttonRef}
        type="button"
        className="lang__button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t.nav.language}: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Flag id={current.flag} />
        <span className="lang__code">{current.label}</span>
        <Icon name="chevron" size={14} className="lang__chevron" />
      </button>
      <ul className="lang__menu" id={listId} role="list" inert={!open}>
        {languages.map((l) => (
          <li key={l.code}>
            <button
              type="button"
              lang={l.htmlLang}
              className="lang__item"
              aria-current={l.code === lang}
              aria-label={l.name}
              onClick={() => void choose(l.code)}
            >
              <Flag id={l.flag} />
              <span className="lang__code">{l.label}</span>
              <span className="lang__name">{l.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
