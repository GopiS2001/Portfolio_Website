"use client";

import { ArrowUp } from "lucide-react";
import { socialLinks } from "@/lib/links";
import { NeuIconButton } from "../neu";
import { useSite } from "../SiteProvider";

export function Footer() {
  const { profile } = useSite().data;
  const socials = socialLinks(profile);

  return (
    <footer className="px-4 pt-8 pb-6 sm:px-6">
      <div className="neu mx-auto flex max-w-[1200px] flex-col items-center gap-5 rounded-[var(--r-lg)] px-6 py-5 text-center md:flex-row md:justify-between md:text-left">
        <a href="#home" className="font-display text-xl font-bold tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </a>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. {profile.footerText}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map(({ href, label, Icon }) => (
            <NeuIconButton key={label} href={href} label={label} size="sm">
              <Icon className="size-4" />
            </NeuIconButton>
          ))}
          <NeuIconButton label="Back to top" size="sm" primary onClick={() => window.scrollTo({ top: 0 })}>
            <ArrowUp className="size-4" />
          </NeuIconButton>
        </div>
      </div>
    </footer>
  );
}
