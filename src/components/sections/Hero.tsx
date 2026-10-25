"use client";

import { ArrowRight, Download, MapPin } from "lucide-react";
import { cleanUrl } from "@/lib/links";
import { NeuAvatar, NeuButton, NeuStat } from "../neu";
import { SplitReveal } from "../motion";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";

// Where the (up to three) stat bubbles sit around the photo orb, and their float offsets
const STAT_SPOTS = [
  "top-[2%] -left-[6%] sm:left-[-4%]",
  "top-[38%] -right-[8%] sm:right-[-10%] [animation-delay:-2s]",
  "bottom-[0%] left-[8%] [animation-delay:-4s]",
];

export function Hero() {
  const { profile, settings, stats, sections } = useSite().data;
  const visible = sections.filter((s) => s.visible);
  const projectsVisible = visible.some((s) => s.key === "projects");
  const title = profile.heroTitle.replace(/\{name\}/g, profile.name);
  const resumeUrl = settings.showResumeButton ? cleanUrl(profile.resumeUrl) : "";
  const shownStats = settings.showStats ? stats.slice(0, 3) : [];

  // Headline words rise in first; everything else follows once they've landed
  const count = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const after = 0.25 + count([title, profile.heroHighlight, profile.heroTitleSuffix].join(" ")) * 0.06;

  return (
    <section id="home" aria-label="Introduction" className="relative scroll-mt-20 overflow-x-clip">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 pt-12 pb-16 sm:px-6 md:pt-16 md:pb-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        <div>
          {profile.available && (
            <Reveal>
              <p className="neu-in-sm mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-2 text-xs text-muted sm:text-sm">
                <span aria-hidden className="animate-pulse-dot size-2 shrink-0 rounded-full bg-success" />
                <span className="truncate">
                  {profile.availabilityText || "Available for new projects"}
                  {profile.location && (
                    <>
                      <span aria-hidden className="mx-1.5 text-subtle">
                        ·
                      </span>
                      <MapPin aria-hidden className="mr-1 inline size-3.5 align-[-2px]" />
                      {profile.location}
                    </>
                  )}
                </span>
              </p>
            </Reveal>
          )}

          <h1
            aria-label={[title, profile.heroHighlight, profile.heroTitleSuffix].filter(Boolean).join(" ")}
            className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.08] font-bold tracking-tight"
          >
            <span aria-hidden>
              <SplitReveal text={title} delay={0.15} />
              {title && profile.heroHighlight ? " " : ""}
              {profile.heroHighlight && (
                <em>
                  {/* The gradient sits on each word, since the words move independently */}
                  <SplitReveal
                    text={profile.heroHighlight}
                    delay={0.15 + count(title) * 0.06}
                    className="text-grad pr-[0.08em]"
                  />
                </em>
              )}
              {profile.heroTitleSuffix ? " " : ""}
              {profile.heroTitleSuffix && (
                <SplitReveal
                  text={profile.heroTitleSuffix}
                  delay={0.15 + count([title, profile.heroHighlight].join(" ")) * 0.06}
                />
              )}
            </span>
          </h1>

          {(profile.role || profile.tagline) && (
            <Reveal delay={after}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]">
                {profile.role && <strong className="font-semibold text-fg">{profile.role}.</strong>}{" "}
                {profile.tagline}
              </p>
            </Reveal>
          )}

          {(projectsVisible || resumeUrl) && (
            <Reveal delay={after + 0.1}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {projectsVisible && (
                  <NeuButton href="#projects" size="lg" className="group">
                    {profile.primaryCtaLabel}
                    <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
                  </NeuButton>
                )}
                {resumeUrl && (
                  <NeuButton
                    href={resumeUrl}
                    variant="ghost"
                    size="lg"
                    target={resumeUrl.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    <Download aria-hidden className="size-4" />
                    {profile.resumeCtaLabel}
                  </NeuButton>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {/* Photo orb with the stats floating around it */}
        <Reveal delay={0.2} className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem]">
          <div className="relative aspect-square px-6 sm:px-8">
            <div className="neu grid size-full place-items-center rounded-full p-5 sm:p-7">
              <NeuAvatar src={profile.avatarUrl} name={profile.name} className="size-full" />
            </div>
            {shownStats.map((s, i) => (
              <div key={s.id} className={`animate-float absolute ${STAT_SPOTS[i]}`}>
                <NeuStat value={s.value} label={s.label} delay={after + 0.3 + i * 0.1} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
