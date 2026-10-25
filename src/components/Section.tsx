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
      {highlight && <em className="text-grad pr-[0.08em]">{highlight}</em>}
      {spaceBeforeSuffix}
      {titleSuffix}
    </>
  );
}

export function Section({ id, children }: { id: SectionKey; children: ReactNode }) {
  const eyebrow = useSite().data.sections.find((s) => s.key === id)?.eyebrow;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 md:py-24"
    >
      <Reveal className="mb-12 max-w-2xl md:mb-14">
        {eyebrow && (
          <p className="neu-in-sm mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-accent-ink uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2
          id={`${id}-title`}
          className="font-display text-[1.75rem] leading-[1.15] font-semibold tracking-tight sm:text-4xl md:text-[2.5rem]"
        >
          <SectionTitle id={id} />
        </h2>
      </Reveal>
      {children}
    </section>
  );
}
