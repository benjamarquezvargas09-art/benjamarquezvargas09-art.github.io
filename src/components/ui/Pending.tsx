import { isPending, PENDING, site } from "../../content/site";

/**
 * Muestra "[PENDIENTE]" solo en desarrollo, para que veas qué dato falta.
 * En producción no renderiza nada.
 */
export function Pending({ label }: { label?: string }) {
  if (!site.showPending) return null;
  return (
    <span className="pending" title="Dato por completar en src/content">
      {label ? `${label}: ` : ""}
      {PENDING}
    </span>
  );
}

/** true si el valor se puede mostrar (no está pendiente o estamos en desarrollo). */
export const canShow = (value: unknown) => !isPending(value) || site.showPending;
