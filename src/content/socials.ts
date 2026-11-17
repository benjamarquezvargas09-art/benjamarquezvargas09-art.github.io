import { PENDING, type Maybe } from "./site";

/**
 * REDES Y ENLACES
 * ─────────────────────────────────────────────────────────────
 * ✏️  Para agregar una red: sumá un objeto al array.
 *     `icon` tiene que existir en src/components/ui/Icon.tsx
 *     (instagram, whatsapp, mail, github, linkedin, youtube, tiktok, x, discord, link).
 *     `handle` (opcional) se muestra al lado del círculo: @usuario, número, etc.
 *
 *     Las redes con `url: PENDING` no se muestran en producción;
 *     en desarrollo aparecen marcadas para que no te olvides.
 */
export type SocialIcon =
  | "instagram"
  | "mail"
  | "github"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "x"
  | "discord"
  | "whatsapp"
  | "link";

export interface Social {
  id: string;
  label: string;
  handle?: string;
  icon: SocialIcon;
  url: Maybe<string>;
}

export const socials: Social[] = [
  { id: "instagram", label: "Instagram", handle: "@benjamv09", icon: "instagram", url: "https://www.instagram.com/benjamv09/" },
  { id: "whatsapp", label: "WhatsApp", handle: "+54 9 387 510 1422", icon: "whatsapp", url: "https://wa.me/5493875101422" },
  // El email se arma en el navegador (ver Contact.tsx) para que los bots no lo lean del HTML.
  { id: "email", label: "Email", icon: "mail", url: "mailto" },
  { id: "github", label: "GitHub", handle: "benjamarquezvargas09-art", icon: "github", url: "https://github.com/benjamarquezvargas09-art" },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin", url: PENDING },
  { id: "youtube", label: "YouTube", icon: "youtube", url: PENDING },
];
