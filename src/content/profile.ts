/**
 * PERFIL PERSONAL
 * ─────────────────────────────────────────────────────────────
 * ✏️  Acá se cambian nombre, fecha de nacimiento, ciudad y colegio.
 *     La EDAD no se escribe a mano: se calcula sola desde `birthDate`
 *     (ver src/lib/age.ts) y se actualiza cada año.
 *
 *     Los textos de biografía están en src/content/translations/<idioma>.ts
 *     (sección `about`), para que existan en todos los idiomas.
 */
export const profile = {
  fullName: "Jesús Benjamin Márquez Vargas",
  displayName: "Benjamin",
  // Apodo: solo se usa como firma y easter egg, nunca como título.
  nickname: "Potip",
  catchphrase: "No es un protip, es Potip.",
  birthDate: "2009-12-04", // AAAA-MM-DD
  city: "Salta Capital, Argentina",
  cityShort: "Salta",
  country: "AR",
  school: 'Colegio Salesiano "Ángel Zerda"',
  email: "Benjamarquezvargas09@gmail.com",
  // ✏️  Teléfono visible y número para WhatsApp (solo dígitos, con código de país).
  phone: "+54 9 387 510 1422",
  whatsapp: "5493875101422",

  /**
   * ✏️  Qué datos personales se muestran en la web.
   *     `false` = se oculta en todas las secciones.
   *     La fecha de nacimiento NUNCA se incluye en SEO ni en previews sociales.
   */
  visibility: {
    fullBirthDate: false,
    age: true,
    city: true,
    school: true,
    email: true,
    phone: true,
    socials: true,
  },
} as const;
