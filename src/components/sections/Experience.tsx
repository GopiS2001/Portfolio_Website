"use client";

import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { NeuCard, NeuChip, NeuTimelineDot } from "../neu";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { useSite } from "../SiteProvider";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "June 2024 — Present" / "Sep 2025 – Aug 2026" / "2019 - 2021": is the role still running? */
function isCurrent(period: string) {
  const end = period.split(/\s+(?:—|–|-|to)\s+/i).pop()?.trim().toLowerCase() ?? "";
  if (/present|current|now|today/.test(end)) return true;
  const year = Number(/\b(\d{4})\b/.exec(end)?.[1]);
  if (!year) return false;
  const month = MONTHS.findIndex((m) => end.startsWith(m));
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && (month === -1 ? true : month >= now.getMonth()));
}

// "**anything**" from the dashboard, plus metrics like "10+ user roles", "99.9% uptime", "AES-256-CBC"
const EMPHASIS = /\*\*(.+?)\*\*|(\b\d[\d,.]*[+%](?:\s+[a-z][\w-]*){0,2})|(\b[A-Z]{2,}-\d+(?:-[A-Z]+)?\b)/g;

function emphasize(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(EMPHASIS)) {
    out.push(text.slice(last, m.index));
    out.push(
      <strong key={m.index} className="font-semibold text-fg">
        {m[1] ?? m[0]}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

export function Experience() {
  const { experience } = useSite().data;

  return (
    <Section id="experience">
      <ol className="relative">
        {/* The groove the timeline dots sit in */}
        <span aria-hidden className="neu-in-sm absolute top-2 bottom-2 left-[11px] w-1.5 rounded-full sm:left-[13px]" />
        {experience.map((job, i) => {
          // One point per line in the dashboard's project explanation
          const points = (job.description ?? "")
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean);
          const current = isCurrent(job.period);
          return (
            <li key={job.id} className="relative pb-10 pl-12 last:pb-0 sm:pl-16">
              <NeuTimelineDot active={current} className="absolute top-7 left-0 sm:left-0.5" />
              <Reveal delay={i * 0.05}>
                <NeuCard as="article" className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                    <span className="font-mono">{job.period}</span>
                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden className="size-3.5" />
                        {job.location}
                      </span>
                    )}
                    {current && (
                      <span className="neu-in-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-success-ink">
                        <span aria-hidden className="size-1.5 rounded-full bg-success" />
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold sm:text-2xl">{job.role}</h3>
                  <p className="mt-1 font-medium text-accent-ink">{job.company}</p>
                  {points.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {points.map((point, j) => (
                        <li key={j} className="flex gap-3 leading-relaxed text-muted">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{emphasize(point)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.stack.length > 0 && (
                    <ul aria-label="Tech used" className="mt-6 flex flex-wrap gap-2.5">
                      {job.stack.map((tech) => (
                        <li key={tech}>
                          <NeuChip>{tech}</NeuChip>
                        </li>
                      ))}
                    </ul>
                  )}
                </NeuCard>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
