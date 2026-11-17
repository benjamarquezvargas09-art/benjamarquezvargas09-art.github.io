import { profile } from "../../content/profile";
import { langInfo } from "../../content/translations";
import { computeAge, formatBirthday } from "../../lib/age";
import { fmt, useI18n } from "../../lib/i18n";
import { SplitText } from "../ui/SplitText";

/** 1 · Benjamin como persona + 2 · cómo piensa. */
export function About() {
  const { t, lang } = useI18n();
  const { visibility } = profile;
  const age = computeAge(profile.birthDate);

  const facts = [
    visibility.age && { label: t.about.facts.age, value: fmt(t.about.ageValue, { age }) },
    visibility.fullBirthDate && { label: t.about.facts.birthday, value: formatBirthday(profile.birthDate, langInfo(lang).htmlLang) },
    visibility.city && { label: t.about.facts.city, value: profile.city },
    visibility.school && { label: t.about.facts.studies, value: t.about.studiesValue },
    visibility.school && { label: t.about.facts.school, value: profile.school },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <section className="section about" id="sobre-mi" aria-labelledby="about-title">
        <div className="wrap">
          <SplitText as="h2" id="about-title" className="display about__title" text={t.about.title} locale={lang} />

          <div className="about__grid">
            <div className="about__text">
              <p className="lead" data-reveal="fade">
                {t.about.p1}
              </p>
              <p data-reveal="fade">{t.about.p2}</p>
              <p data-reveal="fade">{t.about.p3}</p>
            </div>

            <dl className="facts" data-reveal="fade">
              {facts.map((f) => (
                <div className="facts__row" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd suppressHydrationWarning>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="traits" aria-label={t.about.title} data-reveal="stagger">
            {t.about.traits.map((trait, i) => (
              <li key={trait} style={{ "--i": i } as React.CSSProperties}>
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section mind" id="como-pienso" aria-labelledby="mind-title">
        <div className="wrap">
          <SplitText as="h2" id="mind-title" className="display mind__title" text={t.mind.title} locale={lang} />
          <ol className="mind__list">
            {t.mind.items.map((item) => (
              <li className="mind__item" key={item.title} data-reveal="mind">
                <svg className="mind__line" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 14 C 120 2, 220 22, 340 10 S 520 4, 598 14" pathLength={1} />
                </svg>
                <h3 className="mind__item-title">{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
