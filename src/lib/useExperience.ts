import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { detectTier, pointer, POTIP_EVENT, scrollState, type Tier } from "./motion";

/**
 * Arranca todo lo "vivo" de la página una sola vez:
 * nivel de efectos, scroll suave, puntero, apariciones al hacer scroll
 * y el easter egg de escribir "potip".
 */
export function useExperience(revealKey: string) {
  const [tier, setTier] = useState<Tier | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Nivel de efectos + scroll suave.
  useEffect(() => {
    const detected = detectTier();
    setTier(detected);
    document.documentElement.dataset.tier = detected;

    const updateMax = () => (scrollState.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    updateMax();
    const ro = new ResizeObserver(updateMax);
    ro.observe(document.body);

    let lastY = window.scrollY;
    const onNativeScroll = () => {
      const y = window.scrollY;
      scrollState.velocity = y - lastY;
      lastY = y;
      scrollState.y = y;
      scrollState.progress = y / scrollState.max;
      document.documentElement.style.setProperty("--scroll", String(scrollState.progress));
    };

    let cancelled = false;
    let destroyLenis = () => {};
    // El scroll nativo siempre alimenta el estado (también mientras Lenis carga).
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();

    if (detected !== "static") {
      import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        const lenis = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.95, anchors: { offset: -40 } });
        lenisRef.current = lenis;
        lenis.on("scroll", (l: Lenis) => {
          scrollState.y = l.scroll;
          scrollState.velocity = l.velocity;
          scrollState.progress = l.scroll / scrollState.max;
          document.documentElement.style.setProperty("--scroll", String(scrollState.progress));
        });
        const raf = (time: number) => {
          lenis.raf(time);
          frame = requestAnimationFrame(raf);
        };
        let frame = requestAnimationFrame(raf);
        destroyLenis = () => {
          cancelAnimationFrame(frame);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    }

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("scroll", onNativeScroll);
      destroyLenis();
    };
  }, []);

  // Puntero: posición en píxeles y normalizada (-1..1) para la escena y los imanes.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.active = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Apariciones: cada [data-reveal] se marca una sola vez al entrar en pantalla.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    document.querySelectorAll("[data-reveal]:not([data-visible])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [revealKey]);

  // Easter egg: escribir "potip" en cualquier parte de la página.
  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]") || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === "potip") {
        window.dispatchEvent(new Event(POTIP_EVENT));
        typed = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -40, duration: 1.4 });
    else el.scrollIntoView({ behavior: tier === "static" ? "auto" : "smooth" });
  };

  return { tier, scrollTo };
}
