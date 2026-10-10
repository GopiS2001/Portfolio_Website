"use client";

import type { ComponentType } from "react";
import type { SectionKey } from "@/lib/site-types";
import { useSite } from "./SiteProvider";
import { Navbar } from "./Navbar";
import { Maintenance } from "./Maintenance";
import { WhatsappButton } from "./WhatsappButton";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

const SECTIONS: Record<SectionKey, ComponentType> = {
  home: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  contact: Contact,
};

/** Renders only what the admin switched on, in the order set in the dashboard. */
export function SiteContent() {
  const { data } = useSite();
  const { settings, sections } = data;

  if (!settings.siteEnabled) return <Maintenance />;

  const visible = sections.filter((s) => s.visible).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {settings.showHeader && <Navbar />}
      <main className={settings.showHeader ? undefined : "pt-4"}>
        {visible.map((section) => {
          const Component = SECTIONS[section.key];
          return Component ? <Component key={section.key} /> : null;
        })}
      </main>
      {settings.showFooter && <Footer />}
      {settings.showWhatsappButton && <WhatsappButton />}
    </>
  );
}
