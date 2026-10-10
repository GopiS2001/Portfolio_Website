"use client";

import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { useSite } from "../SiteProvider";

export function Experience() {
  const { experience } = useSite().data;

  return (
    <Section id="experience">
      <ol className="relative border-l border-line md:border-none">
        {experience.map((job, i) => {
          // One point per line in the dashboard's project explanation
          const points = (job.description ?? "")
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean);
          return (
          <li key={job.id} className="relative pb-12 pl-8 last:pb-0 md:grid md:grid-cols-[220px_1fr] md:gap-12 md:pl-0">
            {/* Timeline dot (mobile) */}
            <span className="absolute top-2 -left-[5px] size-[9px] rounded-full bg-accent ring-4 ring-bg md:hidden" />

            <Reveal delay={0.05}>
              <div className="md:sticky md:top-28 md:text-right">
                <p className="font-mono text-sm text-accent">{job.period}</p>
                <p className="mt-1 text-sm text-subtle">{job.location}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative mt-3 rounded-3xl border border-line bg-card p-7 backdrop-blur transition hover:border-accent/40 md:mt-0">
                {/* Timeline dot (desktop) */}
                <span className="absolute top-8 -left-[29px] hidden size-[9px] rounded-full bg-accent ring-4 ring-bg md:block" />
                {i < experience.length - 1 && (
                  <span className="absolute top-12 -left-[25px] hidden h-[calc(100%+3rem)] w-px bg-line md:block" />
                )}
                <h3 className="font-serif text-3xl">{job.role}</h3>
                <p className="mt-1 text-muted">{job.company}</p>
                {points.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {points.map((point, j) => (
                      <li key={j} className="flex gap-3 text-muted">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {job.stack.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.stack.map((tech) => (
                      <span key={tech} className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </li>
          );
        })}
      </ol>
    </Section>
  );
}
