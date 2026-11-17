import { useRef } from "react";
import { evidenceAnchor, skillEvidence, skillGroups } from "../../content/skills";
import { useI18n } from "../../lib/i18n";
import { SplitText } from "../ui/SplitText";

/** 3 · Lo que sabe hacer: tres grupos, cada habilidad muestra dónde se usó. */
export function Skills({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  // Foco de luz que sigue al mouse dentro de la sección.
  const onMove = (e: React.PointerEvent) => {
    const el = sectionRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section skills" id="habilidades" ref={sectionRef} onPointerMove={onMove} aria-labelledby="skills-title">
      <div className="skills__spot" aria-hidden="true" />
      <div className="wrap">
        <div className="skills__head">
          <SplitText as="h2" id="skills-title" className="display" text={t.skills.title} locale={lang} />
          <p className="skills__hint" data-reveal="fade">
            {t.skills.hint}
          </p>
        </div>

        <div className="skills__groups">
          {skillGroups.map((group) => (
            <div className="skills__group" key={group.id} data-reveal="stagger">
              <h3 className="skills__group-title">{t.skills.groups[group.id]}</h3>
              <ul>
                {group.skills.map((id, i) => (
                  <li className="skill" key={id} tabIndex={0} style={{ "--i": i } as React.CSSProperties} data-cursor="">
                    <span className="skill__name">{t.skills.items[id]}</span>
                    <span className="skill__evidence">
                      <span className="skill__used">{t.skills.usedIn}</span>
                      {skillEvidence[id].map((ev) => (
                        <a
                          key={ev}
                          href={evidenceAnchor[ev]}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(evidenceAnchor[ev]);
                          }}
                        >
                          {t.evidence[ev]}
                        </a>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
