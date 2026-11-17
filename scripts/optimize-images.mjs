/**
 * Optimiza imágenes: `npm run images`
 * ─────────────────────────────────────────────────────────────
 * ✏️  Poné tus fotos/capturas originales (PNG o JPG) en /assets-src.
 *     Este script crea versiones AVIF y WebP en /public/images,
 *     en 720 px y 1440 px de ancho. Después referencialas sin extensión
 *     (ej: "/images/salescost-home") en projects.ts o experiences.ts.
 *
 *     También genera /public/og.jpg (la imagen al compartir el link).
 */
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public/images";
const WIDTHS = [720, 1440];

await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const { name } = parse(file);
  for (const w of WIDTHS) {
    const base = sharp(join(SRC, file)).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log("✓", name);
}

// Texturas reales de la Luna (NASA SVS, CGI Moon Kit — LRO/LROC color + LOLA elevación, dominio público).
await mkdir("public/textures", { recursive: true });
const moonColor = "assets-src/moon/lroc_color_poles_2k.tif";
await sharp(moonColor).webp({ quality: 84 }).toFile("public/textures/moon-color-2k.webp");
await sharp(moonColor).resize(1024, 512).webp({ quality: 82 }).toFile("public/textures/moon-color-1k.webp");
await sharp("assets-src/moon/ldem_3_8bit.jpg").webp({ quality: 90 }).toFile("public/textures/moon-height.webp");
console.log("✓ texturas de la Luna");

// Íconos de la app (pestaña, pantalla de inicio del celular, Google).
const iconSvg = await (await import("node:fs/promises")).readFile("public/favicon.svg");
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  await sharp(iconSvg, { density: 600 }).resize(size, size).png().toFile(`public/${name}`);
}
console.log("✓ íconos");

// Imagen para redes sociales (Open Graph / X). Sin fecha de nacimiento.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0b0b0c"/>
  <path d="M-20 470 C 220 470 260 230 430 250 C 600 270 560 560 790 520 C 980 490 1020 280 1240 310"
        fill="none" stroke="#ff5a1f" stroke-width="6" stroke-linecap="round"/>
  <text x="80" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="#9a9d93" font-style="italic">Hola, soy</text>
  <text x="74" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="168" fill="#e9ece0" letter-spacing="-4">Benjamin<tspan fill="#ff5a1f">.</tspan></text>
  <text x="82" y="380" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#e9ece0" letter-spacing="3">JESÚS BENJAMIN MÁRQUEZ VARGAS</text>
  <text x="82" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#9a9d93" letter-spacing="2">PROGRAMACIÓN · DISEÑO · PROYECTOS — SALTA, ARGENTINA</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 86, mozjpeg: true }).toFile("public/og.jpg");
console.log("✓ og.jpg");
