import { useEffect, useRef } from "react";
import { profile } from "../../content/profile";
import { socials } from "../../content/socials";
import { computeAge } from "../../lib/age";
import { fmt, useI18n } from "../../lib/i18n";
import { clamp, lerp, pointer, scrollState, type Tier } from "../../lib/motion";
import { CircleText } from "../ui/CircleText";
import { Icon } from "../ui/Icon";
import { Magnetic } from "../ui/Magnetic";
import { SplitText } from "../ui/SplitText";

const NAME = `${profile.displayName}.`;

export function Hero({ tier, onExplore }: { tier: Tier | null; onExplore: () => void }) {
  const { t, lang } = useI18n();
  const nameRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const instagram = socials.find((s) => s.id === "instagram");
  const age = computeAge(profile.birthDate);
  const { visibility } = profile;

  // Letras que se apartan del mouse + el hero se aleja al bajar.
  useEffect(() => {
    if (!tier || tier === "static") return;
    const chars = Array.from(nameRef.current?.querySelectorAll<HTMLElement>(".hero__char") ?? []);
    const state = chars.map(() => ({ x: 0, y: 0, r: 0 }));
    const interactive = tier === "full";
    let frame = 0;

    const loop = () => {
      chars.forEach((el, i) => {
        let tx = 0;
        let ty = 0;
        let tr = 0;
        if (interactive && pointer.active) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy);
          const force = clamp(1 - dist / 260);
          tx = (dx / (dist || 1)) * force * 34;
          ty = (dy / (dist || 1)) * force * 26;
          tr = (dx / (dist || 1)) * force * 9;
        }
        const s = state[i];
        s.x = lerp(s.x, tx, 0.14);
        s.y = lerp(s.y, ty, 0.14);
        s.r = lerp(s.r, tr, 0.14);
        el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(2)}deg)`;
      });

      const vh = window.innerHeight;
      const k = clamp(scrollState.y / vh);
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(0, ${(k * vh * 0.28).toFixed(1)}px, 0) scale(${(1 - k * 0.06).toFixed(4)})`;
        innerRef.current.style.opacity = String(1 - k * 0.9);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [tier]);

  const meta = fmt(t.hero.ageCity, { age, city: profile.cityShort });

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner" ref={innerRef}>
        <h1 className="hero__title" id="hero-title">
          <span className="hero__hello">
            <SplitText text={t.hero.hello} locale={lang} reveal={false} stagger={60} className="hero__hello-text" />
          </span>{" "}
          <span className="sr-only">{profile.fullName} </span>
          <span className="hero__name" ref={nameRef} aria-hidden="true">
            {Array.from(NAME).map((ch, i) => (
              <span className="hero__char-mask" key={i}>
                <span className={`hero__char${ch === "." ? " hero__char--dot" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                  <span className="hero__char-in">{ch}</span>
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div className="hero__bottom">
          <div className="hero__copy">
            <p className="hero__tagline">{t.hero.tagline}</p>
            <p className="hero__sub">{t.hero.sub}</p>
            {(visibility.age || visibility.city) && (
              <p className="hero__meta">
                {visibility.age && visibility.city
                  ? meta
                  : visibility.age
                    ? fmt(t.about.ageValue, { age })
                    : profile.cityShort}
              </p>
            )}
          </div>

          <div className="hero__actions">
            <Magnetic>
              <a
                className="button button--primary"
                href="#proyectos"
                data-cursor=""
                onClick={(e) => {
                  e.preventDefault();
                  onExplore();
                }}
              >
                <span>{t.hero.ctaProjects}</span>
                <Icon name="arrowDown" size={18} />
              </a>
            </Magnetic>
            {instagram && typeof instagram.url === "string" && (
              <Magnetic strength={0.25}>
                <a
                  className="hero__ig"
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="IG"
                  aria-label={`${t.hero.ctaInstagram} ${instagram.handle} ${t.labels.opensNewTab}`}
                >
                  <CircleText text={`${t.hero.ctaInstagram.toUpperCase()} · ${instagram.handle?.toUpperCase()} · `}>
                    <Icon name="instagram" size={26} />
                  </CircleText>
                  <span className="hero__handle" aria-hidden="true">
                    <span className="hero__at">@</span>
                    {instagram.handle?.replace(/^@/, "")}
                  </span>
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
