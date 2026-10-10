"use client";

import { Mail } from "lucide-react";
import { useSite } from "./SiteProvider";

/** Shown instead of the whole site when "Website online" is switched off in the dashboard. */
export function Maintenance() {
  const { profile, settings } = useSite().data;

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-6">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />
      <div className="relative max-w-xl text-center">
        <p className="font-serif text-6xl tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted">{settings.maintenanceMessage}</p>
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition hover:opacity-85"
          >
            <Mail className="size-4" /> {profile.email}
          </a>
        )}
      </div>
    </main>
  );
}
