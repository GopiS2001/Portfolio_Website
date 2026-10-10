"use client";

import type { ReactNode } from "react";
import type { SectionKey } from "@/lib/site-types";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/** "Title <em>highlight</em>suffix" heading, edited per section in the dashboard. */
export function SectionTitle({ id }: { id: SectionKey }) {
  const section = useSite().data.sections.find((s) => s.key === id);
  if (!section) return null;
  const { title, highlight, titleSuffix } = section;
  const spaceAfterTitle = title && highlight ? " " : "";
  const spaceBeforeSuffix = highlight && titleSuffix && /^\w/.test(titleSuffix) ? " " : "";
  return (
    <>
      {title}
      {spaceAfterTitle}
      {highlight && <em className="text-accent">{highlight}</em>}
      {spaceBeforeSuffix}
      {titleSuffix}
    </>
  );
}

export function Section({ id, children }: { id: SectionKey; children: ReactNode }) {
  const eyebrow = useSite().data.sections.find((s) => s.key === id)?.eyebrow;

  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 md:py-32">
      <Reveal className="mb-14 max-w-2xl">
        {eyebrow && (
          <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-accent uppercase">
            <span className="h-px w-8 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          <SectionTitle id={id} />
        </h2>
      </Reveal>
      {children}
    </section>
  );
}
