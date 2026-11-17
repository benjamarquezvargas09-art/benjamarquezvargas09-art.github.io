import { createElement, type ElementType } from "react";

/**
 * Parte un texto en palabras (o caracteres) envueltas en una máscara,
 * para que suban desde abajo una tras otra al entrar en pantalla.
 * Usa Intl.Segmenter, así también corta bien japonés y chino.
 * El texto completo queda en aria-label para lectores de pantalla.
 */
function segment(text: string, by: "word" | "char", locale: string) {
  if (by === "char") return Array.from(text);
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (!Seg) return text.split(/(\s+)/);
  return Array.from(new Seg(locale, { granularity: "word" }).segment(text), (s) => s.segment);
}

export function SplitText({
  text,
  as = "span",
  by = "word",
  locale = "es",
  className,
  delay = 0,
  stagger = 45,
  reveal = true,
  id,
}: {
  text: string;
  as?: ElementType;
  by?: "word" | "char";
  locale?: string;
  className?: string;
  delay?: number;
  stagger?: number;
  reveal?: boolean;
  id?: string;
}) {
  let index = 0;
  const parts = segment(text, by, locale).map((part, i) => {
    if (/^\s+$/.test(part)) return part;
    const n = index++;
    return (
      <span className="split__mask" key={i} aria-hidden="true">
        <span className="split__item" style={{ transitionDelay: `${delay + n * stagger}ms`, animationDelay: `${delay + n * stagger}ms` }}>
          {part}
        </span>
      </span>
    );
  });

  return createElement(
    as,
    {
      id,
      className: ["split", className].filter(Boolean).join(" "),
      "aria-label": text,
      ...(reveal ? { "data-reveal": "" } : {}),
    },
    parts,
  );
}
