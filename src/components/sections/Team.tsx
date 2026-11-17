import { useEffect, useRef } from "react";
import { acindarDetails, experiences, ME } from "../../content/experiences";
import { isPending } from "../../content/site";
import { useI18n } from "../../lib/i18n";
import { canShow, Pending } from "../ui/Pending";
import { ProjectLinks } from "../ui/ProjectLinks";
import { SplitText } from "../ui/SplitText";
import { Moon3D } from "../fx/Moon3D";

function Crew({ names }: { names: string[] }) {
  const { t } = useI18n();
  return (
    <div className="crew">
      <h4 className="label">{t.labels.team}</h4>
      <ul className="crew__list">
        {names.map((n) => (
          <li key={n} data-me={n === ME || undefined}>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Role({ role }: { role: string }) {
  const { t } = useI18n();
  if (!canShow(role)) return null;
  return (
    <p className="role">
      <span className="label">{t.labels.role}</span> {isPending(role) ? <Pending /> : role}
    </p>
  );
}

/** Luna con la línea en órbita: ilustración de SPATIUM IV (reemplazable por capturas). */
function MoonArt() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pauseAnimations();
  }, []);
  return (
    <svg className="moon" viewBox="0 0 400 400" aria-hidden="true" ref={ref}>
      <defs>
        <radialGradient id="moon-shade" cx="35%" cy="35%" r="75%">
          <stop offset="0" stopColor="#e9ece0" />
          <stop offset="0.55" stopColor="#9a9d93" />
          <stop offset="1" stopColor="#1a1b1c" />
        </radialGradient>
      </defs>
      <g className="moon__orbit-back">
        <ellipse cx="200" cy="200" rx="185" ry="56" transform="rotate(-18 200 200)" />
      </g>
      <circle cx="200" cy="200" r="112" fill="url(#moon-shade)" />
      <g className="moon__craters">
        <circle cx="160" cy="165" r="16" />
        <circle cx="236" cy="230" r="24" />
        <circle cx="205" cy="140" r="8" />
        <circle cx="150" cy="240" r="10" />
        <circle cx="255" cy="168" r="6" />
      </g>
      <g className="moon__orbit-front">
        <path d="M15 200 a185 56 0 0 0 370 0" transform="rotate(-18 200 200)" />
      </g>
      <g transform="rotate(-18 200 200)">
        <circle className="moon__sat" r="6">
          <animateMotion dur="9s" repeatCount="indefinite" path="M15 200 a185 56 0 1 0 370 0 a185 56 0 1 0 -370 0" />
        </circle>
      </g>
    </svg>
  );
}

/** 6 · Experiencias en equipo. */
export function Team() {
  const { t, lang } = useI18n();
  const spatium = experiences.find((e) => e.id === "spatium")!;
  const acindar = experiences.find((e) => e.id === "acindar")!;
  const s = t.team.spatium;

  return (
    <section className="section team" id="equipo" aria-labelledby="team-title">
      <div className="wrap">
        <div className="team__head">
          <SplitText as="h2" id="team-title" className="display" text={t.team.title} locale={lang} />
          <p className="team__intro" data-reveal="fade">
            {t.team.intro}
          </p>
        </div>

        <article className="chapter" aria-labelledby="spatium-name">
          <header className="chapter__head">
            <h3 className="chapter__name" id="spatium-name">
              <SplitText text={spatium.name} by="char" stagger={40} />
            </h3>
            <p className="chapter__sub" data-reveal="fade">
              {s.subtitle}
              <span className="chapter__event">
                {spatium.event} · {spatium.year}
              </span>
            </p>
          </header>

          <div className="chapter__grid">
            <div className="chapter__art" data-reveal="media">
              <Moon3D fallback={<MoonArt />} hint={s.moonHint} />
              {spatium.images.length === 0 && <Pending label={t.labels.links.images} />}
            </div>

            <div className="chapter__body">
              <p className="label" data-reveal="fade">
                {t.labels.challenge}: {s.challenge}
              </p>
              <p className="lead" data-reveal="fade">
                {s.description}
              </p>
              <p className="chapter__lesson" data-reveal="fade">
                {s.lesson}
              </p>
              <ul className="ticks" data-reveal="fade">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chapter__grid chapter__grid--data">
            <div className="chapter__data" data-reveal="fade">
              <h4 className="label">{s.dataTitle}</h4>
              <ul className="data-list">
                {s.data.map((d) => {
                  const [name, what] = d.split(" — ");
                  return (
                    <li key={d}>
                      <span>{name}</span>
                      <span>{what}</span>
                    </li>
                  );
                })}
              </ul>
              {!isPending(spatium.tech) && (
                <>
                  <h4 className="label">{t.labels.tech}</h4>
                  <ul className="chips">
                    {spatium.tech.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <blockquote className="memory" data-reveal="fade">
            <p className="label">{s.memoryTitle}</p>
            <p>{s.memory}</p>
          </blockquote>

          <div className="chapter__foot" data-reveal="fade">
            <Crew names={spatium.team} />
            <Role role={spatium.role} />
            <ProjectLinks links={spatium.links} primary="download" />
          </div>
        </article>

        <article className="chapter chapter--compact" aria-labelledby="acindar-name">
          <header className="chapter__head">
            <h3 className="chapter__name chapter__name--md" id="acindar-name">
              <SplitText text={acindar.name} stagger={50} />
            </h3>
            {!isPending(acindar.year) && <p className="chapter__sub">{acindar.year}</p>}
          </header>
          <div className="chapter__grid">
            <div className="chapter__body" data-reveal="fade">
              <p className="lead">{t.team.acindar.description}</p>
              <dl className="facts facts--inline">
                {(
                  [
                    [t.labels.project, acindarDetails.project],
                    [t.labels.challenge, acindarDetails.challenge],
                    [t.labels.result, acindarDetails.result],
                  ] as const
                ).map(([label, value]) =>
                  isPending(value) ? (
                    <Pending key={label} label={label} />
                  ) : (
                    <div className="facts__row" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
            <div className="chapter__foot" data-reveal="fade">
              <Crew names={acindar.team} />
              <Role role={acindar.role} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
