import type { ComponentType, SVGProps } from "react";
import type { SiteProfile } from "./site-types";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
} from "@/components/SocialIcons";

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
    { label: "GitHub", href: p.github, Icon: GithubIcon },
    { label: "LinkedIn", href: p.linkedin, Icon: LinkedinIcon },
    { label: "Instagram", href: p.instagram, Icon: InstagramIcon },
    { label: "X", href: p.twitter, Icon: XIcon },
    { label: "WhatsApp", href: whatsappHref(p.whatsapp), Icon: WhatsappIcon },
  ];
  return all.filter((s) => s.href);
}
