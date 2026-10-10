"use client";

import { whatsappHref } from "@/lib/links";
import { WhatsappIcon } from "./SocialIcons";
import { useSite } from "./SiteProvider";

/** Floating "chat on WhatsApp" button — only when a WhatsApp number is set. */
export function WhatsappButton() {
  const { whatsapp, name } = useSite().data.profile;
  const href = whatsappHref(whatsapp, `Hi ${name}, I found your portfolio and would like to connect.`);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-10px_rgb(37_211_102/0.7)] transition hover:scale-105"
    >
      <WhatsappIcon className="size-7" />
    </a>
  );
}
