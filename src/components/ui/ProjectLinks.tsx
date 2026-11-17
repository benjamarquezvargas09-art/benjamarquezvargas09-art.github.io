import { isPending } from "../../content/site";
import type { LinkKind, ProjectLink } from "../../content/projects";
import { useI18n } from "../../lib/i18n";
import { Icon, type IconName } from "./Icon";
import { Magnetic } from "./Magnetic";
import { Pending } from "./Pending";

const iconFor: Record<LinkKind, IconName> = {
  site: "site",
  github: "code",
  demo: "video",
  docs: "docs",
  video: "video",
  download: "download",
  images: "images",
};

/** Botones de un proyecto. Los links pendientes no se muestran en producción. */
export function ProjectLinks({ links, primary = "site" }: { links: ProjectLink[]; primary?: LinkKind }) {
  const { t } = useI18n();
  if (!links.length) return null;
  return (
    <ul className="project-links">
      {links.map((link) =>
        isPending(link.url) ? (
          <li key={link.kind}>
            <Pending label={t.labels.links[link.kind]} />
          </li>
        ) : (
          <li key={link.kind}>
            <Magnetic strength={0.2}>
              <a
                className={`button ${link.kind === primary ? "button--primary" : "button--ghost"}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor=""
              >
                <Icon name={iconFor[link.kind]} size={18} />
                <span>{t.labels.links[link.kind]}</span>
                <span className="sr-only">{t.labels.opensNewTab}</span>
                <Icon name="arrowUpRight" size={16} className="button__arrow" />
              </a>
            </Magnetic>
          </li>
        ),
      )}
    </ul>
  );
}
