import { profile } from "../../content/profile";
import { useI18n } from "../../lib/i18n";

/**
 * Entrada: la línea naranja cruza la pantalla, el contador llega a 100
 * y la cortina se abre en dos. Está hecha 100 % en CSS (styles/intro.css),
 * así funciona aunque el JavaScript tarde, y dura ~1,6 s.
 * Solo se ve la primera vez por sesión; con movimiento reducido no aparece.
 */
export function Intro() {
  const { t } = useI18n();
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bottom" />
      <div className="intro__content">
        <span className="intro__name">{profile.fullName}</span>
        <span className="intro__line" />
        <span className="intro__count">
          {t.intro.loading} <span className="intro__num" />
        </span>
      </div>
    </div>
  );
}
