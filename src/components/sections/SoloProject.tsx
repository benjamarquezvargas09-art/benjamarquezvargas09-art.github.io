import { projects } from "../../content/projects";
import { isPending } from "../../content/site";
import { useI18n } from "../../lib/i18n";
import { canShow, Pending } from "../ui/Pending";
import { ProjectLinks } from "../ui/ProjectLinks";
import { SplitText } from "../ui/SplitText";
import { Tilt } from "../ui/Tilt";

/** 5 · Proyectos individuales. */
export function SoloProject() {
  const { t, lang } = useI18n();

  return (
    <section className="section solo" id="proyectos" aria-labelledby="solo-title">
      <div className="wrap">
        <div className="solo__head">
          <SplitText as="h2" id="solo-title" className="display" text={t.solo.title} locale={lang} />
          <p className="solo__intro" data-reveal="fade">
            {t.solo.intro}
          </p>
        </div>

        {projects.map((project) => {
          const copy = t.projects[project.id];
          const img = project.images[0];
          return (
            <article className="showcase" key={project.id} aria-labelledby={`${project.id}-name`}>
              {img && (
                <div className="showcase__media" data-reveal="media">
                  <Tilt className="browser">
                    <div className="browser__bar" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span className="browser__url">salescost.online</span>
                    </div>
                    <picture>
                      <source type="image/avif" srcSet={`${img.src}-720.avif 720w, ${img.src}-1440.avif 1440w`} sizes="(min-width: 1000px) 58vw, 92vw" />
                      <img
                        src={`${img.src}-1440.webp`}
                        srcSet={`${img.src}-720.webp 720w, ${img.src}-1440.webp 1440w`}
                        sizes="(min-width: 1000px) 58vw, 92vw"
                        width={img.width}
                        height={img.height}
                        alt={copy.imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </Tilt>
                </div>
              )}

              <div className="showcase__body">
                <h3 className="showcase__name" id={`${project.id}-name`} data-reveal="fade">
                  {project.name}
                </h3>
                <p className="showcase__tagline" data-reveal="fade">
                  {copy.tagline}
                </p>
                <p data-reveal="fade">{copy.description}</p>

                <div className="showcase__cols" data-reveal="fade">
                  <div>
                    <h4 className="label">{t.labels.myPart}</h4>
                    <ul className="ticks">
                      {copy.roles.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="label">{t.labels.competition}</h4>
                    <p>{copy.context}</p>
                    {(canShow(project.competition.name) || canShow(project.competition.result)) && (
                    <p className="showcase__pending">
                      {isPending(project.competition.name) ? <Pending label={t.labels.competition} /> : project.competition.name}{" "}
                      {isPending(project.competition.year) ? <Pending label={t.labels.year} /> : project.competition.year}{" "}
                      {isPending(project.competition.result) ? <Pending label={t.labels.result} /> : project.competition.result}
                    </p>
                    )}
                    {canShow(project.tech) && <h4 className="label">{t.labels.tech}</h4>}
                    {isPending(project.tech) ? (
                      <Pending />
                    ) : (
                      <ul className="chips">
                        {project.tech.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <ProjectLinks links={project.links} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
