"use client";

import { ArrowUp } from "lucide-react";
import { socialLinks } from "@/lib/links";
import { useSite } from "../SiteProvider";

export function Footer() {
  const { profile } = useSite().data;
  const socials = socialLinks(profile);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-serif text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </p>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. {profile.footerText}
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent/50 hover:text-fg"
              >
                <Icon className="size-4" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              aria-label="Back to top"
              className="ml-2 grid size-10 place-items-center rounded-full bg-fg text-bg transition hover:opacity-85"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
