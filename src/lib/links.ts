import type { ComponentType, SVGProps } from "react";
import type { SiteProfile } from "./site-types";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
} from "@/components/SocialIcons";

/** Public address of the website (canonical URL, sitemap, JSON-LD). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://gopi-portfolio-eight.vercel.app").replace(
  /\/$/,
  "",
);

// A social site's home page with no profile path ("https://x.com/") is as good as empty
const BARE_SOCIAL = /^https?:\/\/(www\.)?(x|twitter|github|linkedin|instagram)\.com\/?$/i;
// Share-sheet tracking parameters that Instagram / X append to profile links; utm_* anywhere
const SOCIAL_HOST = /(^|\.)(instagram|x|twitter)\.com$/i;
const SOCIAL_TRACKING = /^(igsh|igshid|stkn|exln|s|t)$/i;
const TRACKING = /^utm_\w+$/i;

/**
 * Turns whatever was typed in the dashboard into a usable link, or "" to hide the button:
 * "#" placeholders and bare social home pages become "", "www.…" gains https://, and
 * tracking parameters are stripped. Relative paths (/uploads/…) and mailto:/tel: pass through.
 */
export function cleanUrl(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  if (!value || value === "#" || value.startsWith("#") || BARE_SOCIAL.test(value)) return "";
  if (value.startsWith("/") || /^(mailto|tel):/i.test(value)) return value;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    const social = SOCIAL_HOST.test(url.hostname);
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING.test(key) || (social && SOCIAL_TRACKING.test(key))) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return "";
  }
}

/** wa.me link from any phone format ("+91 98765 43210" -> https://wa.me/919876543210). */
export function whatsappHref(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

type Social = { label: string; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

/** Only the social profiles that were filled in on the dashboard. */
export function socialLinks(p: SiteProfile): Social[] {
  const all: Social[] = [
    { label: "GitHub", href: cleanUrl(p.github), Icon: GithubIcon },
    { label: "LinkedIn", href: cleanUrl(p.linkedin), Icon: LinkedinIcon },
    { label: "Instagram", href: cleanUrl(p.instagram), Icon: InstagramIcon },
    { label: "X", href: cleanUrl(p.twitter), Icon: XIcon },
    { label: "WhatsApp", href: whatsappHref(p.whatsapp), Icon: WhatsappIcon },
  ];
  return all.filter((s) => s.href);
}
