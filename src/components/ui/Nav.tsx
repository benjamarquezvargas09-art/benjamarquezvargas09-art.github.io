import { useEffect, useState } from "react";
import { profile } from "../../content/profile";
import { useI18n } from "../../lib/i18n";
import { Icon } from "./Icon";
import { LangSwitcher } from "./LangSwitcher";

/**
 * ✏️  Secciones del menú. El `href` tiene que coincidir con el `id`
 *     de la sección en App.tsx.
 */
export const navItems = [
  { href: "#sobre-mi", key: "about" },
  { href: "#proyectos", key: "work" },
  { href: "#equipo", key: "team" },
  { href: "#logros", key: "wins" },
  { href: "#contacto", key: "contact" },
] as const;

export function Nav({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // La barra se esconde al bajar y vuelve al subir.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(href);
    history.replaceState(null, "", href);
  };

  const [first, ...rest] = profile.fullName.split(" ");
  return (
    <header className="nav" data-hidden={(hidden && !open) || undefined}>
      <div className="nav__progress" aria-hidden="true" />
      <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")} aria-label={`${profile.fullName} — ${t.nav.home}`}>
        <span>{[first, rest[0]].join(" ")}</span>
        <span>{rest.slice(1).join(" ")}</span>
      </a>

      <nav className="nav__links" aria-label={t.nav.menu}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={(e) => go(e, item.href)} className="nav__link">
                <span className="nav__link-text" data-text={t.nav[item.key]}>
                  {t.nav[item.key]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav__tools">
        <LangSwitcher />
        <button
          type="button"
          className="nav__menu-button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
          <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
        </button>
      </div>

      <div className="mobile-menu" id="mobile-menu" data-open={open || undefined} inert={!open}>
        <ul>
          {navItems.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}>
              <a href={item.href} onClick={(e) => go(e, item.href)}>
                {t.nav[item.key]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
