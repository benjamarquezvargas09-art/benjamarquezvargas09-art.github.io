import { useEffect, useRef } from "react";
import { clamp, scrollState } from "../../lib/motion";

/**
 * Cinta de texto infinita. Se acelera cuando scrolleás rápido
 * y se frena al pasar el mouse. Con movimiento reducido queda quieta.
 */
export function Marquee({
  items,
  reverse = false,
  className,
  speed = 40,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = track.animate(
      [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(-50%,0,0)" }],
      { duration: speed * 1000, iterations: Infinity, easing: "linear", direction: reverse ? "reverse" : "normal" },
    );
    let hover = false;
    let rate = 1;
    let frame = 0;
    const loop = () => {
      const boost = 1 + clamp(Math.abs(scrollState.velocity) / 12, 0, 5);
      const targetRate = hover ? 0.15 : boost;
      rate += (targetRate - rate) * 0.08;
      anim.playbackRate = rate;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    const enter = () => (hover = true);
    const leave = () => (hover = false);
    track.addEventListener("pointerenter", enter);
    track.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      anim.cancel();
      track.removeEventListener("pointerenter", enter);
      track.removeEventListener("pointerleave", leave);
    };
  }, [reverse, speed]);

  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item}
          <span className="marquee__sep" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={["marquee", className].filter(Boolean).join(" ")}>
      <div className="marquee__track" ref={trackRef}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
