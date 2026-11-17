import { useEffect } from "react";
import { defaultLang, isLang } from "./content/translations";
import { useI18n } from "./lib/i18n";
import { useExperience } from "./lib/useExperience";
import Background from "./components/fx/Background";
import { Cursor } from "./components/ui/Cursor";
import { Intro } from "./components/ui/Intro";
import { Marquee } from "./components/ui/Marquee";
import { Nav } from "./components/ui/Nav";
import { SectionDots } from "./components/ui/SectionDots";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Hobbies } from "./components/sections/Hobbies";
import { SoloProject } from "./components/sections/SoloProject";
import { Team } from "./components/sections/Team";
import { Achievements } from "./components/sections/Achievements";
import { Contact } from "./components/sections/Contact";

/**
 * Orden de la historia (no cambiar sin pensarlo):
 * persona → cómo piensa → qué sabe hacer → pasatiempos →
 * proyectos propios → experiencias en equipo → logros → contacto.
 */
export function App() {
  const { t, lang, setLang } = useI18n();
  const { tier, scrollTo } = useExperience(lang);

  // Atrás/adelante del navegador también cambia el idioma.
  useEffect(() => {
    const onPop = () => {
      const seg = window.location.pathname.split("/")[1];
      const next = isLang(seg) ? seg : defaultLang;
      if (next !== lang) void setLang(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [lang, setLang]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skip}
      </a>
      <Intro />
      <Background tier={tier} />
      {tier === "full" && <Cursor />}
      <Nav onNavigate={scrollTo} />
      <SectionDots onNavigate={scrollTo} />

      <main id="main" tabIndex={-1}>
        <Hero tier={tier} onExplore={() => scrollTo("#proyectos")} />
        <div className="band" aria-hidden="true">
          <Marquee items={t.marquee} className="marquee--band" speed={30} />
        </div>
        <About />
        <Skills onNavigate={scrollTo} />
        <Hobbies />
        <SoloProject />
        <Team />
        <Achievements />
        <Contact onTop={() => scrollTo("#top")} />
      </main>
    </>
  );
}
