"use client";

import { whatsappHref } from "@/lib/links";
import { NeuIconButton } from "./neu";
import { WhatsappIcon } from "./SocialIcons";
import { useSite } from "./SiteProvider";

/** Floating "chat on WhatsApp" button — only when a WhatsApp number is set. */
export function WhatsappButton() {
  const { whatsapp, name } = useSite().data.profile;
  const href = whatsappHref(whatsapp, `Hi ${name}, I found your portfolio and would like to connect.`);
  if (!href) return null;

  return (
    <NeuIconButton
      href={href}
      label="Chat on WhatsApp"
      size="lg"
      className="fixed right-5 bottom-5 z-40 !rounded-full !text-[#1fa855] dark:!text-[#25d366]"
    >
      <WhatsappIcon className="size-7" />
    </NeuIconButton>
  );
}
