import type { JSX } from "react";
import type { FlagId } from "../../content/translations";

/**
 * Banderas dibujadas en SVG (Windows no muestra los emojis de banderas).
 * Proporción 4:3 simplificada para que se lean a 20 px.
 * ✏️  Para un idioma nuevo, agregá su bandera acá.
 */
const flags: Record<FlagId, JSX.Element> = {
  ar: (
    <>
      <rect width="24" height="18" fill="#74acdf" />
      <rect y="6" width="24" height="6" fill="#fff" />
      <circle cx="12" cy="9" r="1.9" fill="#f6b40e" />
    </>
  ),
  us: (
    <>
      <rect width="24" height="18" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 18) / 13} width="24" height={18 / 13} fill="#b22234" />
      ))}
      <rect width="10.5" height={(18 / 13) * 7} fill="#3c3b6e" />
    </>
  ),
  br: (
    <>
      <rect width="24" height="18" fill="#009c3b" />
      <path d="M12 2.2 21.6 9 12 15.8 2.4 9z" fill="#ffdf00" />
      <circle cx="12" cy="9" r="3.6" fill="#002776" />
    </>
  ),
  jp: (
    <>
      <rect width="24" height="18" fill="#fff" />
      <circle cx="12" cy="9" r="5" fill="#bc002d" />
    </>
  ),
  cn: (
    <>
      <rect width="24" height="18" fill="#de2910" />
      <path d="m5 2.4.9 2.7h2.8l-2.3 1.7.9 2.7L5 7.8 2.7 9.5l.9-2.7-2.3-1.7h2.8z" fill="#ffde00" />
      <circle cx="9.6" cy="2.4" r="0.7" fill="#ffde00" />
      <circle cx="11" cy="4.2" r="0.7" fill="#ffde00" />
      <circle cx="11" cy="6.6" r="0.7" fill="#ffde00" />
      <circle cx="9.6" cy="8.4" r="0.7" fill="#ffde00" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="18" fill="#002395" />
      <rect x="8" width="8" height="18" fill="#fff" />
      <rect x="16" width="8" height="18" fill="#ed2939" />
    </>
  ),
  it: (
    <>
      <rect width="8" height="18" fill="#009246" />
      <rect x="8" width="8" height="18" fill="#fff" />
      <rect x="16" width="8" height="18" fill="#ce2b37" />
    </>
  ),
};

export function Flag({ id }: { id: FlagId }) {
  return (
    <svg className="flag" viewBox="0 0 24 18" width="20" height="15" aria-hidden="true" focusable="false">
      {flags[id]}
    </svg>
  );
}
