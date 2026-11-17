import { alsoEnjoy, games } from "../../content/skills";
import { useI18n } from "../../lib/i18n";
import { Marquee } from "../ui/Marquee";
import { SplitText } from "../ui/SplitText";

/** 4 · Intereses y pasatiempos: más relajado, con los juegos en cintas gigantes. */
export function Hobbies() {
  const { t, lang } = useI18n();
  const half = Math.ceil(games.length / 2);

  return (
    <section className="section hobbies" id="pasatiempos" aria-labelledby="hobbies-title">
      <div className="wrap hobbies__head">
        <SplitText as="h2" id="hobbies-title" className="display" text={t.hobbies.title} locale={lang} />
        <p className="hobbies__intro" data-reveal="fade">
          {t.hobbies.intro}
        </p>
      </div>

      <div className="hobbies__games" aria-label={t.hobbies.gamesLabel} role="group">
        <ul className="sr-only">
          {games.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <div aria-hidden="true">
          <Marquee items={games.slice(0, half)} className="marquee--giant" speed={34} />
          <Marquee items={games.slice(half)} className="marquee--giant marquee--outline" speed={38} reverse />
        </div>
      </div>

      <div className="wrap hobbies__also" data-reveal="fade">
        <h3 className="hobbies__also-title">{t.hobbies.alsoTitle}</h3>
        <ul className="hobbies__also-list">
          {alsoEnjoy.map((id) => (
            <li key={id}>{t.hobbies.also[id]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
