"use client";

import { Gauge, Layers, Palette, Sparkles, Users, type LucideIcon } from "lucide-react";
import { NeuAvatar, NeuCard } from "../neu";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { useSite } from "../SiteProvider";

// Highlight titles are free text in the dashboard; pick an icon by keyword, else a sparkle
const TRAIT_ICONS: [RegExp, LucideIcon][] = [
  [/design/i, Palette],
  [/perform|speed|fast/i, Gauge],
  [/end|full|stack/i, Layers],
  [/collab|team|commun/i, Users],
];
const traitIcon = (title: string) => TRAIT_ICONS.find(([re]) => re.test(title))?.[1] ?? Sparkles;

export function About() {
  const { profile, about } = useSite().data;

  return (
    <Section id="about">
      <div className="grid items-start gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm pr-4 pb-6">
            <NeuAvatar
              src={profile.avatarUrl}
              name={profile.name}
              rounded="rounded-[var(--r-lg)]"
              className="aspect-[4/5] w-full"
            />
            {/* Label card overlapping the corner of the frame */}
            <div className="neu-sm absolute right-0 bottom-0 rounded-[var(--r-md)] px-5 py-3">
              <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-subtle uppercase">
                Portfolio · {new Date().getFullYear()}
              </p>
              <p className="mt-0.5 font-display font-semibold">{profile.name}</p>
              <p className="text-xs text-muted">{profile.role}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-[1.0625rem]">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-fg" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          {about.highlights.length > 0 && (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {about.highlights.map((h, i) => {
                const Icon = traitIcon(h.title);
                return (
                  <li key={h.id}>
                    <Reveal delay={0.1 + i * 0.06} className="h-full">
                      <NeuCard className="flex h-full items-start gap-4 p-5">
                        <span className="neu-in-sm grid size-12 shrink-0 place-items-center rounded-full text-accent-ink">
                          <Icon aria-hidden className="size-5" />
                        </span>
                        <div>
                          <h3 className="font-display font-semibold">{h.title}</h3>
                          <p className="mt-1 text-sm text-muted">{h.text}</p>
                        </div>
                      </NeuCard>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
