"use client";

import { ArrowDown, ArrowUpRight, MapPin, Zap } from "lucide-react";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";

export function Hero() {
  const { profile, settings, stats, sections } = useSite().data;
  const visible = sections.filter((s) => s.visible).sort((a, b) => a.sortOrder - b.sortOrder);
  const next = visible[visible.findIndex((s) => s.key === "home") + 1];
  const projectsVisible = visible.some((s) => s.key === "projects");
  const title = profile.heroTitle.replace(/\{name\}/g, profile.name);
  const showResume = settings.showResumeButton && profile.resumeUrl;

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-24 md:pt-32 md:pb-32">
      {/* Ambient background */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {profile.available && (
              <span className="ui-raised inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {profile.availabilityText}
              </span>
            )}
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="size-3.5" /> {profile.location}
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="max-w-5xl font-serif text-[clamp(2.75rem,8vw,6.75rem)] leading-[0.95] tracking-tight zephyr:text-[clamp(2.5rem,7vw,5.75rem)] zephyr:leading-[1.04] zephyr:tracking-[-0.02em]">
            {title}
            {title && profile.heroHighlight ? " " : ""}
            {profile.heroHighlight && <em className="text-gradient">{profile.heroHighlight}</em>}
            {profile.heroTitleSuffix ? ` ${profile.heroTitleSuffix}` : ""}
          </h1>
        </Reveal>

        {(profile.role || profile.tagline) && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              {profile.role && <span className="text-fg">{profile.role}.</span>} {profile.tagline}
            </p>
          </Reveal>
        )}

        {(projectsVisible || showResume) && (
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {projectsVisible && (
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 ui-solid ui-press rounded-full bg-fg px-7 py-3.5 text-sm font-medium text-bg hover:opacity-90 zephyr:gap-3 zephyr:border zephyr:border-fg/20 zephyr:bg-transparent zephyr:py-1.5 zephyr:pr-6 zephyr:pl-1.5 zephyr:text-xs zephyr:tracking-[0.14em] zephyr:text-fg zephyr:uppercase zephyr:hover:border-fg/40 zephyr:hover:opacity-100"
                >
                  {/* Zephyr: an ink disc with a bolt leads the label */}
                  <span className="hidden size-9 place-items-center rounded-full bg-fg text-bg zephyr:grid">
                    <Zap className="size-3.5 fill-current" />
                  </span>
                  {profile.primaryCtaLabel}
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 zephyr:hidden" />
                </a>
              )}
              {showResume && (
                <a
                  href={profile.resumeUrl}
                  target={profile.resumeUrl.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="ui-raised ui-press inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium hover:border-accent/60"
                >
                  {profile.resumeCtaLabel}
                </a>
              )}
            </div>
          </Reveal>
        )}

        {settings.showStats && stats.length > 0 && (
          <Reveal delay={0.4}>
            <dl className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-8">
              {stats.map((s) => (
                <div key={s.id}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-serif text-4xl sm:text-5xl">{s.value}</dd>
                  <dd className="mt-1 text-xs tracking-wide text-muted sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {next && (
          <a
            href={`#${next.key}`}
            aria-label={`Scroll to ${next.navLabel || next.key}`}
            className="absolute right-6 bottom-0 hidden ui-raised ui-press size-12 place-items-center rounded-full text-muted hover:text-fg md:grid"
          >
            <ArrowDown className="size-4 animate-bounce" />
          </a>
        )}
      </div>
    </section>
  );
}
