"use client";

import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { useSite } from "../SiteProvider";

export function About() {
  const { profile, about } = useSite().data;
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Section id="about">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Reveal>
          {/* Portrait card — shows the uploaded avatar, or a monogram */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-accent/60 via-transparent to-accent/30" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-elevated p-8">
              {profile.avatarUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
              ) : (
                <div
                  aria-hidden
                  className="absolute -right-24 -bottom-24 size-72 rounded-full blur-3xl"
                  style={{ background: "var(--glow)" }}
                />
              )}
              <span
                className={`relative font-mono text-xs tracking-[0.25em] uppercase ${profile.avatarUrl ? "text-white/80" : "text-subtle"}`}
              >
                Portfolio · {new Date().getFullYear()}
              </span>
              {!profile.avatarUrl && (
                <span className="font-serif text-[9rem] leading-none text-accent italic">{initials}</span>
              )}
              <div className={`relative ${profile.avatarUrl ? "text-white" : ""}`}>
                <p className="font-serif text-3xl">{profile.name}</p>
                <p className={`text-sm ${profile.avatarUrl ? "text-white/75" : "text-muted"}`}>{profile.role}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-fg" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          {about.highlights.length > 0 && (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {about.highlights.map((h, i) => (
                <Reveal key={h.id} delay={0.1 + i * 0.06}>
                  <div className="h-full rounded-2xl border border-line bg-card p-5 backdrop-blur transition hover:border-accent/40">
                    <p className="font-medium">{h.title}</p>
                    <p className="mt-1 text-sm text-muted">{h.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
