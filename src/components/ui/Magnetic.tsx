import { useEffect, useRef, type ReactNode } from "react";

/**
 * Imán: el elemento se inclina hacia el mouse cuando pasás cerca.
 * Solo con mouse (no en táctil) y nunca con movimiento reducido.
 * Mueve `transform` directamente, sin re-renderizar React.
 */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transition = "transform 160ms var(--ease-out)";
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.transition = "transform 600ms var(--ease-elastic)";
      el.style.transform = "translate3d(0, 0, 0)";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={["magnetic", className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
