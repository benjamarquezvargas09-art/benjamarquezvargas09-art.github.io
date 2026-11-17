import { useEffect, useRef, useState } from "react";
import type { Tier } from "../../lib/motion";

/**
 * Fondo fijo. Three.js se descarga recién cuando el navegador está libre,
 * así el texto del hero aparece primero y nunca espera a la escena 3D.
 * Sin WebGL (o con movimiento reducido) queda un fondo estático en CSS.
 */
export default function Background({ tier }: { tier: Tier | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tier || tier === "static" || !canvasRef.current) return;
    let disposed = false;
    let handle: { dispose: () => void } | undefined;

    const boot = () =>
      import("./scene").then(({ createScene }) => {
        if (disposed || !canvasRef.current) return;
        handle = createScene(canvasRef.current, tier);
        requestAnimationFrame(() => setReady(true));
      });

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = idle(() => void boot(), { timeout: 1200 });

    return () => {
      disposed = true;
      window.cancelIdleCallback?.(id as number);
      handle?.dispose();
    };
  }, [tier]);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__static" />
      {tier && tier !== "static" && <canvas ref={canvasRef} className="bg__canvas" data-ready={ready || undefined} />}
    </div>
  );
}
