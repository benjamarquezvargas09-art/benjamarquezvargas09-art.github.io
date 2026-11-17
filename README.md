# Web personal de Benjamin

**Web en vivo:** https://benjamarquezvargas09-art.github.io/

Web personal de Jesús Benjamin Márquez Vargas. React + TypeScript + Vite, con un fondo 3D (Three.js) que se carga después del contenido, 7 idiomas y una página prerenderizada por idioma para SEO.

## Comandos

```bash
npm install        # una sola vez
npm run dev        # desarrollo en http://localhost:5173 (muestra los [PENDIENTE])
npm run build      # genera /dist listo para publicar (oculta los [PENDIENTE])
npm run preview    # prueba /dist en http://localhost:4173
npm run images     # optimiza imágenes de /assets-src → /public/images (AVIF + WebP)
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Nombre, fecha de nacimiento, ciudad, colegio, email, qué datos se muestran | `src/content/profile.ts` |
| Dominio, imagen para redes | `src/content/site.ts` |
| Redes sociales | `src/content/socials.ts` |
| Proyectos individuales (SalesCost…) | `src/content/projects.ts` |
| Experiencias en equipo (SPATIUM IV, Acindar) | `src/content/experiences.ts` |
| Logros y competencias | `src/content/achievements.ts` |
| Habilidades, juegos, pasatiempos | `src/content/skills.ts` |
| Todos los textos (bio, descripciones, botones) | `src/content/translations/<idioma>.ts` |
| Colores y tipografías | `src/styles/tokens.css` |

La **edad se calcula sola** a partir de `birthDate`. No hay que tocar nada cada año.

## Cada año

1. ¿Ganaste algo nuevo? Sumá el año en `achievements.ts` (por ejemplo, `years: ["2025", "2026", "2027"]`).
2. Revisá los textos que digan «en segundo año» o similares en `translations/`.
3. Ejecutá `npm run build` y publicá `/dist` de nuevo. El año del pie de página y la edad se actualizan solos.

## Agregar…

**Una red social:** sumá `{ id, label, icon, url }` en `socials.ts`. Los íconos disponibles son instagram, mail, github, linkedin, youtube, tiktok, x, discord y link. Una red nueva se dibuja en `src/components/ui/Icon.tsx`.

**Un proyecto:** sumá un objeto en `projects.ts` y su texto en `projects.<id>` de **cada** archivo de `translations/`. TypeScript avisa si falta uno.

**Una competencia:** sumá un objeto en `achievements.ts` (`art`: knight, sumo, track o trophy) y su texto en `wins.items.<id>` de cada idioma.

**Un idioma:** copiá `translations/en.ts` como `<código>.ts`, traducilo, sumalo en `translations/index.ts` (código, etiqueta corta, nombre y bandera) y, si hace falta, dibujá la bandera en `src/components/ui/Flag.tsx`. Para que se genere su página, sumalo también en `src/entry-server.tsx`.

**Imágenes:** poné el PNG o JPG en `/assets-src`, ejecutá `npm run images` y referencialo sin extensión (por ejemplo, `/images/spatium-base`) en `images` del proyecto.

## Datos marcados [PENDIENTE]

Aparecen solo con `npm run dev`. Se completan en los archivos de `src/content/`:

- `site.ts`: dominio real (`url`).
- `socials.ts`: GitHub, LinkedIn y YouTube. (Instagram y WhatsApp ya están; el número se cambia en `profile.ts` y `socials.ts`.)
- `projects.ts`: año, tecnologías, GitHub, y nombre, año y resultado de la competencia de SalesCost.
- `experiences.ts`: tu rol en SPATIUM IV y Acindar, capturas de SPATIUM IV, y el proyecto, desafío, resultado y año de Acindar.
- `achievements.ts`: años del Sumo Robótico y del torneo en la Técnica «Albert Einstein».

## Publicar (y que aparezca el candado de "seguro")

1. Cambiá `url` en `src/content/site.ts` por tu dominio real y ejecutá `npm run build`.
2. Subí la carpeta `/dist` a **Vercel**, **Netlify** o **Cloudflare Pages**. Los tres son gratis y dan HTTPS automático: ese es el candado de "seguro" en el navegador.
3. Las cabeceras de seguridad ya están listas:
   - `vercel.json` para Vercel;
   - `public/_headers` para Netlify y Cloudflare.
   Incluyen CSP, HSTS, nosniff, protección contra que te pongan en un iframe y permisos de cámara y micrófono bloqueados.
4. En [Google Search Console](https://search.google.com/search-console) agregá tu dominio y enviá `https://TU-DOMINIO/sitemap.xml`.

## Google e IA

- Cada idioma es una página HTML ya escrita (Google la lee sin ejecutar JavaScript), con título, descripción, Open Graph, X, `hreflang` y datos estructurados `ProfilePage` + `Person` + `SoftwareApplication` (SalesCost) + `VideoGame` (SPATIUM IV).
- `/llms.txt` es una ficha en texto plano (español + inglés) pensada para asistentes de IA (ChatGPT, Claude, Gemini, Perplexity). Se genera sola en cada `npm run build` desde `src/content/`.
- `robots.txt` permite explícitamente a Google, Bing y a los rastreadores de IA.

## Créditos

- Textura de la Luna: NASA's Scientific Visualization Studio, *CGI Moon Kit* (LRO/LROC y LOLA), dominio público. Archivos originales en `assets-src/moon/`.
- Satélite: modelo 3D oficial del *Lunar Reconnaissance Orbiter* de [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources), comprimido con meshopt (`public/models/lro.glb`; original en `assets-src/satellite/`).
- Música: no usa ninguna canción. Se genera en el navegador (`src/lib/ambient.ts`) con Web Audio y sonido 3D (HRTF). Arranca muy bajito con el primer clic o tecla, y el botón de barritas de arriba la prende y la apaga. El volumen se cambia con `MASTER_VOLUME`.

## Rendimiento y accesibilidad

- El texto del hero se pinta primero. Three.js (unos 136 KB gzip) se descarga cuando el navegador está libre.
- Hay 3 niveles de efectos:
  - **full**: computadora con mouse;
  - **lite**: móvil o equipo modesto, con menos partículas y menos resolución;
  - **static**: con `prefers-reduced-motion`, sin WebGL ni movimiento continuo.
- La intro (1,6 s) se ve una vez por sesión y nunca con movimiento reducido.
- El email se arma en el navegador para que los bots no lo lean del HTML. El teléfono sí es visible porque es para WhatsApp; para ocultarlo, poné `phone: false` en `visibility` (`profile.ts`).
- La fecha de nacimiento no aparece en metadatos, Open Graph ni JSON-LD.
- Easter egg: escribí «potip» en cualquier parte de la página.
