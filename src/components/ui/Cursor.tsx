import { useEffect, useRef } from "react";
import { lerp } from "../../lib/motion";

/**
 * Cursor propio (solo nivel "full", con mouse).
 * Un punto que sigue exacto y un anillo que llega con retardo.
 * Sobre elementos con data-cursor="Texto" el anillo crece y muestra ese texto.
 * El cursor nativo sigue existiendo para campos de texto.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        document.documentElement.dataset.customCursor = "on";
      }
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role='slider'], input[type='range']");
      const text = target?.dataset.cursor ?? "";
      ring.current?.toggleAttribute("data-hover", Boolean(target));
      ring.current?.toggleAttribute("data-label", Boolean(text));
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };
    const onLeave = () => {
      visible = false;
      delete document.documentElement.dataset.customCursor;
    };
    const onDown = () => ring.current?.setAttribute("data-press", "");
    const onUp = () => ring.current?.removeAttribute("data-press");

    const loop = () => {
      rx = lerp(rx, x, 0.18);
      ry = lerp(ry, y, 0.18);
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      delete document.documentElement.dataset.customCursor;
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <span ref={label} className="cursor__label" />
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
