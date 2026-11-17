/**
 * Calcula la edad a partir de la fecha de nacimiento (AAAA-MM-DD).
 * Nunca escribas la edad a mano: se actualiza sola cada año.
 */
export function computeAge(birthDate: string, today: Date = new Date()): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  let age = today.getFullYear() - y;
  const beforeBirthday =
    today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

/** Fecha legible según el idioma (solo si `visibility.fullBirthDate` está activo). */
export function formatBirthday(birthDate: string, locale: string): string {
  const [y, m, d] = birthDate.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
