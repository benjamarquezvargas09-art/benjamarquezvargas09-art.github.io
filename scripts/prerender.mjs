/**
 * Prerender + SEO (corre solo en `npm run build`).
 * ─────────────────────────────────────────────────────────────
 * Genera /index.html (español) y /en/, /pt/, /ja/, /zh/, /fr/, /it/
 * con el contenido ya escrito, metadatos, Open Graph, X, JSON-LD,
 * hreflang, sitemap.xml y robots.txt.
 * La fecha de nacimiento NO se incluye en ningún metadato.
 */
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = "dist";
const ssr = await import(pathToFileURL(join(process.cwd(), "dist-ssr", "entry-server.js")).href);
const { render, dicts, languages, langPath, defaultLang, profile, site, socials, projects, experiences } = ssr;

// Precarga de las fuentes del hero (el nombre gigante y los textos): aparecen antes y sin saltos.
const assetFiles = await readdir(join(DIST, "assets"));
const preloadFonts = [/^gloock-latin-400-normal-.*\.woff2$/, /^archivo-latin-wdth-normal-.*\.woff2$/, /^instrument-serif-latin-400-italic-.*\.woff2$/]
  .map((re) => assetFiles.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
const template = (await readFile(join(DIST, "index.html"), "utf8")).replace("</head>", `    ${preloadFonts}\n  </head>`);
const base = site.url.replace(/\/$/, "");
const abs = (path) => base + path;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const isPending = (v) => v === "[PENDIENTE]";
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

const sameAs = socials
  .filter((s) => s.id !== "email" && !isPending(s.url) && /^https?:/.test(s.url))
  .map((s) => s.url);

function jsonLd(lang, t) {
  const personId = `${base}/#person`;
  const spatium = experiences.find((e) => e.id === "spatium");
  const salescost = projects.find((p) => p.id === "salescost");
  const [given, ...rest] = profile.fullName.split(" ");

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.fullName,
    alternateName: ["Benjamin Márquez Vargas", "Benjamin Márquez", "Jesús Benjamin", profile.nickname],
    givenName: `${given} ${rest[0]}`,
    familyName: rest.slice(1).join(" "),
    url: abs(langPath(lang)),
    image: abs(site.ogImage),
    description: t.meta.description,
    knowsAbout: Object.values(t.skills.items),
    award: [`${t.wins.items.chess.name} — ${t.wins.items.chess.result} (2025, 2026)`],
    sameAs,
  };
  if (profile.visibility.city) {
    person.address = { "@type": "PostalAddress", addressLocality: "Salta", addressRegion: "Salta", addressCountry: "AR" };
  }
  if (profile.visibility.school) {
    person.affiliation = {
      "@type": "EducationalOrganization",
      name: profile.school,
      address: { "@type": "PostalAddress", addressLocality: "Salta", addressCountry: "AR" },
    };
  }
  if (profile.visibility.phone) {
    person.telephone = profile.phone;
    person.contactPoint = {
      "@type": "ContactPoint",
      contactType: "personal",
      telephone: profile.phone,
      url: `https://wa.me/${profile.whatsapp}`,
      availableLanguage: ["es"],
    };
  }
  person.homeLocation = { "@type": "Place", name: profile.city };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: abs("/"),
        name: profile.fullName,
        inLanguage: languages.map((l) => l.htmlLang),
        about: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${abs(langPath(lang))}#profile`,
        url: abs(langPath(lang)),
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: languages.find((l) => l.code === lang).htmlLang,
        dateModified: new Date().toISOString(),
        isPartOf: { "@id": `${base}/#website` },
        mainEntity: { "@id": personId },
      },
      { ...person },
      {
        "@type": "SoftwareApplication",
        name: salescost.name,
        url: salescost.links.find((l) => l.kind === "site").url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "es",
        description: `${t.projects.salescost.tagline} ${t.projects.salescost.description}`,
        creator: { "@id": personId },
      },
      {
        "@type": "VideoGame",
        name: spatium.name,
        alternateName: t.team.spatium.subtitle,
        url: spatium.links.find((l) => l.kind === "github").url,
        description: `${t.team.spatium.description} ${t.team.spatium.lesson}`,
        gamePlatform: ["Windows", "macOS", "Linux"],
        inLanguage: ["es", "en"],
        audience: { "@type": "PeopleAudience", suggestedMinAge: 7, suggestedMaxAge: 12 },
        author: spatium.team.map((name) => (name === profile.fullName ? { "@id": personId } : { "@type": "Person", name })),
        about: `${spatium.event} ${spatium.year}`,
        datePublished: spatium.year,
      },
    ],
  };
}

function head(lang) {
  const t = dicts[lang];
  const info = languages.find((l) => l.code === lang);
  const url = abs(langPath(lang));
  const image = abs(site.ogImage);
  const alternates = languages
    .map((l) => `<link rel="alternate" hreflang="${l.htmlLang}" href="${abs(langPath(l.code))}" />`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${abs(langPath(defaultLang))}" />`)
    .join("\n    ");
  const ogAlt = languages
    .filter((l) => l.code !== lang)
    .map((l) => `<meta property="og:locale:alternate" content="${l.ogLocale}" />`)
    .join("\n    ");

  return `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob:; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" />
    <title>${esc(t.meta.title)}</title>
    <meta name="description" content="${esc(t.meta.description)}" />
    <meta name="author" content="${esc(profile.fullName)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="${esc(profile.fullName)}" />
    <meta property="og:title" content="${esc(t.meta.title)}" />
    <meta property="og:description" content="${esc(t.meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(profile.fullName)}" />
    <meta property="og:locale" content="${info.ogLocale}" />
    ${ogAlt}
    <meta property="profile:first_name" content="${esc(profile.displayName)}" />
    <meta property="profile:last_name" content="Márquez Vargas" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(t.meta.title)}" />
    <meta name="twitter:description" content="${esc(t.meta.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${json(jsonLd(lang, t))}</script>`;
}

for (const { code, htmlLang } of languages) {
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`)
    .replace(/<!--head-->[\s\S]*?<!--\/head-->/, head(code))
    .replace("<!--app-->", render(code));
  const out = join(DIST, langPath(code), "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log("✓", out);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${languages
  .map(
    (l) => `  <url>
    <loc>${abs(langPath(l.code))}</loc>
    <lastmod>${today}</lastmod>
${languages.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.htmlLang}" href="${abs(langPath(a.code))}" />`).join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(join(DIST, "sitemap.xml"), sitemap);
// robots.txt: buscadores y asistentes de IA son bienvenidos.
const bots = ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Applebot-Extended", "CCBot"];
const robots = bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join("\n");
await writeFile(join(DIST, "robots.txt"), `${robots}\nUser-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);

// llms.txt: ficha en texto plano (español + inglés) para asistentes de IA.
{
  const es = dicts.es;
  const en = dicts.en;
  const spatium = experiences.find((e) => e.id === "spatium");
  const acindar = experiences.find((e) => e.id === "acindar");
  const salescost = projects.find((p) => p.id === "salescost");
  const live = (links) =>
    links
      .filter((l) => !isPending(l.url))
      .map((l) => `- ${l.kind}: ${l.url}`)
      .join("\n");
  const contact = [...sameAs.map((u) => `- ${u}`), profile.visibility.phone ? `- WhatsApp: https://wa.me/${profile.whatsapp} (${profile.phone})` : ""]
    .filter(Boolean)
    .join("\n");
  const lines = [
    `# ${profile.fullName}`,
    "",
    `> ${es.meta.description}`,
    `> EN: ${en.meta.description}`,
    "",
    `- Nombre preferido / Preferred name: ${profile.displayName} (también "Jesús Benjamin"; apodo informal: ${profile.nickname})`,
    `- Ciudad / City: ${profile.city}`,
    profile.visibility.school ? `- Estudios / Studies: ${es.about.studiesValue}, ${profile.school}` : "",
    `- Sitio / Website: ${abs("/")} (idiomas: ${languages.map((l) => l.code).join(", ")})`,
    "",
    "## Sobre Benjamin",
    es.about.p1,
    es.about.p2,
    es.about.p3,
    "",
    "## About (English)",
    en.about.p1,
    en.about.p2,
    en.about.p3,
    "",
    "## Habilidades / Skills",
    Object.values(es.skills.items).join(", "),
    "",
    `## Proyecto individual: ${salescost.name}`,
    es.projects.salescost.tagline,
    es.projects.salescost.description,
    `Aporte de Benjamin: ${es.projects.salescost.roles.join("; ")}.`,
    es.projects.salescost.context,
    live(salescost.links),
    "",
    `## Experiencia en equipo: ${spatium.name} — ${es.team.spatium.subtitle} (${spatium.event} ${spatium.year})`,
    es.team.spatium.description,
    es.team.spatium.lesson,
    `Equipo: ${spatium.team.join(", ")}.`,
    `Datos reales: ${es.team.spatium.data.join("; ")}.`,
    Array.isArray(spatium.tech) ? `Tecnología: ${spatium.tech.join(", ")}.` : "",
    live(spatium.links),
    "",
    `## Experiencia en equipo: ${acindar.name}`,
    es.team.acindar.description,
    `Equipo: ${acindar.team.join(", ")}.`,
    "",
    "## Logros y competencias",
    `- ${es.wins.items.chess.name}: ${es.wins.items.chess.result} (2025, 2026).`,
    `- ${es.wins.items.sumo.name}: ${es.wins.items.sumo.text}`,
    `- ${es.wins.items.linefollower.name}: ${es.wins.items.linefollower.text}`,
    "",
    "## Pasatiempos",
    `${es.hobbies.intro} Juegos: Fortnite, Counter-Strike, Minecraft, Roblox, Plato, Brawl Stars.`,
    "",
    "## Contacto / Contact",
    contact,
    "",
  ];
  await writeFile(join(DIST, "llms.txt"), lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"));
}

await rm("dist-ssr", { recursive: true, force: true });
console.log("✓ sitemap.xml, robots.txt, llms.txt");
