import { useEffect, useState } from "react";
import { profile } from "../../content/profile";
import { isPending, site } from "../../content/site";
import { socials } from "../../content/socials";
import { fmt, useI18n } from "../../lib/i18n";
import { POTIP_EVENT } from "../../lib/motion";
import { CircleText } from "../ui/CircleText";
import { Icon } from "../ui/Icon";
import { Magnetic } from "../ui/Magnetic";
import { SplitText } from "../ui/SplitText";

/** 8 · Redes y contacto + la firma "No es un protip, es Potip." (única aparición). */
export function Contact({ onTop }: { onTop: () => void }) {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [signed, setSigned] = useState(false);

  // El email se arma recién en el navegador: no queda escrito en el HTML para bots.
  useEffect(() => {
    if (profile.visibility.email) setEmail(profile.email);
  }, []);

  // Escribir "potip" o tocar la insignia vuelve a dibujar la firma.
  useEffect(() => {
    const onPotip = () => {
      setSigned(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setSigned(true)));
    };
    window.addEventListener(POTIP_EVENT, onPotip);
    return () => window.removeEventListener(POTIP_EVENT, onPotip);
  }, []);

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin permiso de portapapeles: el botón de mail sigue funcionando */
    }
  };

  const visibleSocials = profile.visibility.socials
    ? socials.filter(
        (s) =>
          s.id !== "email" &&
          (s.id !== "whatsapp" || profile.visibility.phone) &&
          (!isPending(s.url) || site.showPending),
      )
    : [];
  const year = new Date().getFullYear();

  return (
    <section className="section contact" id="contacto" aria-labelledby="contact-title">
      <div className="wrap">
        <SplitText as="h2" id="contact-title" className="contact__title" text={t.contact.title} locale={lang} stagger={70} />
        <p className="contact__text" data-reveal="fade">
          {t.contact.text}
        </p>

        <div className="contact__actions" data-reveal="fade">
          {profile.visibility.phone && (
            <Magnetic>
              <a
                className="button button--primary button--xl"
                href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(t.contact.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor=""
              >
                <Icon name="whatsapp" size={20} />
                <span>{t.contact.whatsapp}</span>
                <span className="sr-only">{t.labels.opensNewTab}</span>
              </a>
            </Magnetic>
          )}
          {email && (
            <>
              <Magnetic>
                <a className="button button--ghost button--xl" href={`mailto:${email}`} data-cursor="">
                  <Icon name="mail" size={20} />
                  <span>{t.contact.email}</span>
                </a>
              </Magnetic>
              <button type="button" className="button button--ghost" onClick={() => void copy()} data-cursor="">
                <Icon name={copied ? "check" : "copy"} size={18} />
                <span aria-live="polite">{copied ? t.contact.copied : t.contact.copy}</span>
              </button>
            </>
          )}
        </div>

        <div className="contact__grid">
          <div data-reveal="fade">
            <h3 className="label">{t.contact.socials}</h3>
            <ul className="socials">
              {visibleSocials.map((s) =>
                isPending(s.url) ? (
                  <li key={s.id} className="socials__item socials__item--pending">
                    <Icon name={s.icon} size={22} />
                    <span>{s.label} [PENDIENTE]</span>
                  </li>
                ) : (
                  <li key={s.id}>
                    <Magnetic strength={0.4}>
                      <a
                        className="socials__item"
                        data-handle={s.handle ? "" : undefined}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor=""
                        aria-label={`${s.label}${s.handle ? ` ${s.handle}` : ""} ${t.labels.opensNewTab}`}
                      >
                        <span className="socials__icon">
                          <Icon name={s.icon} size={22} />
                        </span>
                        {s.handle ? (
                          <span className="socials__handle" aria-hidden="true">
                            {s.handle.startsWith("@") ? (
                              <>
                                <span className="socials__at">@</span>
                                {s.handle.slice(1)}
                              </>
                            ) : (
                              s.handle
                            )}
                          </span>
                        ) : (
                          <span className="socials__tip" aria-hidden="true">
                            {s.label}
                          </span>
                        )}
                      </a>
                    </Magnetic>
                  </li>
                ),
              )}
            </ul>
          </div>

          <button
            type="button"
            className="signature"
            data-signed={signed || undefined}
            data-reveal="sign"
            onClick={() => window.dispatchEvent(new Event(POTIP_EVENT))}
            aria-label={profile.catchphrase}
            data-cursor="✎"
          >
            <CircleText text={`${profile.catchphrase.toUpperCase()} · `} size={168}>
              <svg className="signature__name" viewBox="0 0 220 90" aria-hidden="true">
                <text x="110" y="62" textAnchor="middle">
                  {profile.nickname}
                </text>
              </svg>
            </CircleText>
          </button>
        </div>
      </div>

      <footer className="footer wrap">
        <p>{fmt(t.footer.made, { city: profile.cityShort })}</p>
        <p>
          © {year} {profile.fullName}
        </p>
        <p className="footer__credit">
          <a href="https://svs.gsfc.nasa.gov/4720" target="_blank" rel="noopener noreferrer">
            Moon: NASA SVS · LRO / LOLA
          </a>
        </p>
        <button type="button" className="footer__top" onClick={onTop} data-cursor="">
          <span>{t.footer.top}</span>
          <Icon name="arrowUp" size={16} />
        </button>
      </footer>
    </section>
  );
}
