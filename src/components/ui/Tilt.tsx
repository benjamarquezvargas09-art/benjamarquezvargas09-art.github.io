import { useEffect, useRef, type ReactNode } from "react";

/**
 * Inclinación 3D al pasar el mouse (perspectiva + rotación suave),
 * con un brillo que sigue al puntero. Solo con mouse y sin movimiento reducido.
 */
export function Tilt({ children, max = 7, className }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transition = "transform 120ms var(--ease-out)";
        el.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg)`;
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.transition = "transform 700ms var(--ease-out)";
      el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={["tilt", className].filter(Boolean).join(" ")}>
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </div>
  );
}
