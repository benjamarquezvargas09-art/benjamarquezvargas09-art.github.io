import { useCallback, useEffect, useRef, useState } from "react";
import type { Ambient } from "../../lib/ambient";
import { useI18n } from "../../lib/i18n";

const KEY = "bm-sound";

function readPref(): "on" | "off" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}
function writePref(v: "on" | "off") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

/**
 * Botón de música. Los navegadores no dejan sonar audio sin que la persona
 * toque algo, así que la música arranca muy bajito con el primer clic o tecla
 * (salvo que la hayan apagado antes). El botón la prende y la apaga.
 */
export function SoundToggle() {
  const { t } = useI18n();
  const [on, setOn] = useState(false);
  const ambient = useRef<Ambient | null>(null);
  const loading = useRef<Promise<Ambient> | null>(null);

  const get = useCallback(async () => {
    if (ambient.current) return ambient.current;
    loading.current ??= import("../../lib/ambient").then(({ createAmbient }) => (ambient.current = createAmbient()));
    return loading.current;
  }, []);

  const play = useCallback(async () => {
    const a = await get();
    await a.start();
    setOn(true);
  }, [get]);

  const pause = useCallback(() => {
    ambient.current?.stop();
    setOn(false);
  }, []);

  // Primer gesto de la persona en la página → arranca, si no la apagó antes.
  useEffect(() => {
    if (readPref() === "off") return;
    const first = (e: Event) => {
      if ((e.target as HTMLElement).closest(".sound")) return; // el botón ya lo maneja
      cleanup();
      void play();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
    window.addEventListener("pointerdown", first);
    window.addEventListener("keydown", first);
    return cleanup;
  }, [play]);

  useEffect(() => () => ambient.current?.dispose(), []);

  const toggle = () => {
    if (on) {
      pause();
      writePref("off");
    } else {
      void play();
      writePref("on");
    }
  };

  return (
    <button
      type="button"
      className="sound"
      data-on={on || undefined}
      aria-pressed={on}
      aria-label={on ? t.nav.soundOff : t.nav.soundOn}
      title={on ? t.nav.soundOff : t.nav.soundOn}
      onClick={toggle}
    >
      <span className="sound__bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </span>
    </button>
  );
}
