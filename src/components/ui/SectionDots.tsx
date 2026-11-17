import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n";

/**
 * Índice lateral: un punto por cada tema, uno debajo del otro.
 * El del tema que estás leyendo se alarga en naranja; al pasar el mouse
 * aparece el nombre. Clic = te lleva a esa parte.
 * ✏️  Si agregás una sección, sumala acá con el mismo `id` que en su <section>.
 */
export function SectionDots({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const { t } = useI18n();
  const sections = [
    { id: "top", label: t.nav.home },
    { id: "sobre-mi", label: t.nav.about },
    { id: "como-pienso", label: t.mind.title },
    { id: "habilidades", label: t.skills.title },
    { id: "pasatiempos", label: t.hobbies.title },
    { id: "proyectos", label: t.nav.work },
    { id: "equipo", label: t.nav.team },
    { id: "logros", label: t.nav.wins },
    { id: "contacto", label: t.nav.contact },
  ];
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // Las secciones son fijas; solo cambian sus nombres con el idioma.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="dots" aria-label={t.nav.sections}>
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="dots__link"
              aria-current={active === s.id ? "true" : undefined}
              data-cursor=""
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`#${s.id}`);
              }}
            >
              <span className="dots__label">{s.label}</span>
              <span className="dots__dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
