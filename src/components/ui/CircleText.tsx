import { useId, type ReactNode } from "react";

/** Texto que gira en círculo alrededor de un centro (ícono o símbolo). */
export function CircleText({ text, size = 132, children }: { text: string; size?: number; children?: ReactNode }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className="circle-text" style={{ width: size, height: size }}>
      <svg className="circle-text__ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id={id} d="M50 50 m-39 0 a39 39 0 1 1 78 0 a39 39 0 1 1 -78 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="242" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="circle-text__center">{children}</span>
    </span>
  );
}
