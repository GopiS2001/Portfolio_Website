"use client";

import { useState } from "react";
import { ArrowUpRight, Download, Smartphone } from "lucide-react";
import { safeGradient } from "@/lib/appearance";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { GithubIcon } from "../SocialIcons";
import { useSite } from "../SiteProvider";

// A link button shows whenever a URL was entered in the dashboard (leave it empty to hide it).
const usable = (url: string) => Boolean(url);

const pill =
  "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-accent/60 hover:text-accent";

// Keep in sync with PROJECT_CATEGORIES in ADMIN DASHBOARD/src/portfolio/options.ts.
const PROJECT_CATEGORIES = [
  { value: "office", label: "Office projects" },
  { value: "personal", label: "My projects" },
] as const;

type Filter = "all" | (typeof PROJECT_CATEGORIES)[number]["value"];

export function Projects() {
  const { projects } = useSite().data;
  const [filter, setFilter] = useState<Filter>("all");

  const categoryOf = (p: (typeof projects)[number]) => p.category ?? "personal";
  // Only offer tabs for categories that actually have projects.
  const tabs = [
    { value: "all" as Filter, label: "All", count: projects.length },
    ...PROJECT_CATEGORIES.map((c) => ({
      value: c.value as Filter,
      label: c.label,
      count: projects.filter((p) => categoryOf(p) === c.value).length,
    })).filter((t) => t.count > 0),
  ];
  const shown = filter === "all" ? projects : projects.filter((p) => categoryOf(p) === filter);

  return (
    <Section id="projects">
      {tabs.length > 2 && (
        <div role="tablist" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab.value === filter;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  active ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-accent/50 hover:text-fg"
                }`}
              >
                {tab.label}
                <span className={`font-mono text-xs ${active ? "opacity-70" : "opacity-60"}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((project, i) => (
          <Reveal
            key={`${filter}-${project.id}`}
            delay={(i % 2) * 0.08}
            className={project.featured ? "md:col-span-2" : undefined}
          >
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-accent/40">
              {project.imageUrl ? (
                <div
                  className={`relative overflow-hidden bg-elevated ${
                    project.featured ? "aspect-[16/9] md:aspect-[21/8]" : "aspect-[16/10]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="size-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                /* Generated cover when no screenshot was uploaded */
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${safeGradient(project.gradient)} ${
                    project.featured ? "aspect-[16/9] md:aspect-[21/8]" : "aspect-[16/10]"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.45),transparent_55%)]" />
                  <div className="absolute inset-x-8 -bottom-6 top-10 rounded-t-2xl border border-white/40 bg-white/25 shadow-2xl backdrop-blur-md transition duration-700 group-hover:-translate-y-2 md:inset-x-14 md:top-12">
                    <div className="flex gap-1.5 p-4">
                      <span className="size-2.5 rounded-full bg-white/70" />
                      <span className="size-2.5 rounded-full bg-white/50" />
                      <span className="size-2.5 rounded-full bg-white/30" />
                    </div>
                    <div className="space-y-2 px-5">
                      <div className="h-3 w-1/3 rounded-full bg-white/60" />
                      <div className="h-2 w-2/3 rounded-full bg-white/40" />
                      <div className="h-2 w-1/2 rounded-full bg-white/30" />
                    </div>
                  </div>
                  <span className="absolute top-4 left-5 font-mono text-xs text-black/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-3xl">{project.title}</h3>
                  <div className="flex shrink-0 gap-2">
                    {usable(project.sourceUrl) && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} source code`}
                        className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:text-fg"
                      >
                        <GithubIcon className="size-4" />
                      </a>
                    )}
                    {usable(project.liveUrl) && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} live site`}
                        className="grid size-10 place-items-center rounded-full bg-fg text-bg transition group-hover:rotate-45"
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-muted">{project.description}</p>
                {Boolean(project.apkUrl || project.links?.length) && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.links?.map((link) => (
                      <a
                        key={`${link.label}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={pill}
                      >
                        {link.label}
                        <ArrowUpRight className="size-4" />
                      </a>
                    ))}
                    {project.apkUrl && (
                      <a href={project.apkUrl} download className={pill}>
                        <Smartphone className="size-4" />
                        Download APK
                        <Download className="size-4" />
                      </a>
                    )}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
