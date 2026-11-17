import { useEffect, useRef, type JSX } from "react";
import { achievements, type Achievement } from "../../content/achievements";
import { isPending } from "../../content/site";
import { useI18n } from "../../lib/i18n";
import { lerp } from "../../lib/motion";
import { Pending } from "../ui/Pending";
import { SplitText } from "../ui/SplitText";

/** Dibujos de línea que aparecen al pasar el mouse por cada logro. */
const art: Record<Achievement["art"], JSX.Element> = {
  // Movimiento en L del caballo sobre un tablero.
  knight: (
    <>
      <g className="art__board">
        {Array.from({ length: 16 }, (_, i) => (i + Math.floor(i / 4)) % 2 === 0 ? <rect key={i} x={(i % 4) * 40 + 20} y={Math.floor(i / 4) * 40 + 20} width="40" height="40" /> : null)}
      </g>
      <path className="art__stroke" d="M40 160 V60 H100" pathLength={1} />
      <circle className="art__dot" cx="100" cy="60" r="7" />
    </>
  ),
  // El dohyo del sumo y los dos robots.
  sumo: (
    <>
      <circle className="art__stroke" cx="100" cy="100" r="74" pathLength={1} />
      <rect className="art__robot" x="62" y="88" width="28" height="24" rx="4" />
      <rect className="art__robot art__robot--hot" x="112" y="88" width="28" height="24" rx="4" />
      <path className="art__stroke art__stroke--late" d="M90 100 H112" pathLength={1} />
    </>
  ),
  // La pista del seguidor de línea.
  track: (
    <>
      <path className="art__stroke" d="M30 150 C 30 60, 90 40, 100 100 S 170 150, 170 50" pathLength={1} />
      <rect className="art__robot art__robot--hot" x="160" y="38" width="20" height="16" rx="3" />
    </>
  ),
  trophy: (
    <path className="art__stroke" d="M60 40 H140 V80 A40 40 0 0 1 60 80 Z M100 120 V150 M70 160 H130" pathLength={1} />
  ),
};

/** 7 · Logros y competencias, como una tabla de premios. */
export function Achievements() {
  const { t, lang } = useI18n();
  const floatRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // El dibujo flota y sigue al mouse dentro de la lista (solo con mouse).
  useEffect(() => {
    const list = listRef.current;
    const float = floatRef.current;
    if (!list || !float || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0;
    let y = 0;
    let fx = 0;
    let fy = 0;
    let frame = 0;
    let running = false;
    const loop = () => {
      fx = lerp(fx, x, 0.14);
      fy = lerp(fy, y, 0.14);
      float.style.transform = `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(1)}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-art]");
      float.dataset.art = row?.dataset.art ?? "";
      if (!running) {
        fx = x;
        fy = y;
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      float.dataset.art = "";
      running = false;
      cancelAnimationFrame(frame);
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="section wins" id="logros" aria-labelledby="wins-title">
      <div className="wrap">
        <SplitText as="h2" id="wins-title" className="display" text={t.wins.title} locale={lang} />

        <div className="wins__stage">
          <div className="wins__float" ref={floatRef} aria-hidden="true">
            {achievements.map((a) => (
              <svg key={a.id} className={`art art--${a.art}`} data-for={a.art} viewBox="0 0 200 200">
                {art[a.art]}
              </svg>
            ))}
          </div>

          <ol className="wins__list" ref={listRef}>
            {achievements.map((a, i) => {
              const copy = t.wins.items[a.id];
              const years = a.years.filter((y) => !isPending(y));
              return (
                <li className="win" key={a.id} data-art={a.art} data-reveal="row" style={{ "--i": i } as React.CSSProperties}>
                  <svg className="win__art-inline art" viewBox="0 0 200 200" aria-hidden="true">
                    {art[a.art]}
                  </svg>
                  <div className="win__main">
                    <h3 className="win__name">{copy.name}</h3>
                    <p className="win__result">{copy.result}</p>
                  </div>
                  <div className="win__text">
                    <p>{copy.text}</p>
                    <ul className="win__tags">
                      {copy.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="win__with">
                    <span className="label">{t.labels.with}</span> {a.with.join(", ")}
                    {"extra" in copy && copy.extra ? ` ${copy.extra}` : ""}
                  </p>
                  <p className="win__years">
                    {years.length > 0 ? years.join(" · ") : <Pending label={t.labels.year} />}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
