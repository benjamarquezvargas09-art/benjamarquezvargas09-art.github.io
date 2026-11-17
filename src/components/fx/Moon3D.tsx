import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Contenedor de la Luna 3D. Three.js se carga recién cuando la sección
 * está cerca de la pantalla. Mientras tanto (o sin WebGL) se ve el dibujo SVG.
 */
export function Moon3D({ fallback, hint }: { fallback: ReactNode; hint: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) return;

    let disposed = false;
    let handle: { dispose: () => void } | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("./moonScene").then(({ createMoon }) => {
          if (disposed) return;
          handle = createMoon(canvas, {
            reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            small: window.innerWidth < 900,
            // Se muestra recién cuando las texturas de la NASA terminaron de cargar.
            onReady: () => requestAnimationFrame(() => setReady(true)),
          });
        });
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(wrap);
    return () => {
      disposed = true;
      io.disconnect();
      handle?.dispose();
    };
  }, []);

  return (
    <div className="moon3d" ref={wrapRef} data-ready={ready || undefined}>
      <div className="moon3d__fallback">{fallback}</div>
      <canvas ref={canvasRef} className="moon3d__canvas" data-cursor="" aria-label={hint} role="img" />
      <p className="moon3d__hint" aria-hidden="true">
        {hint}
      </p>
    </div>
  );
}
