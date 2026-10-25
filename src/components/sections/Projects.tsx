"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ExternalLink, LayoutDashboard, Lock, Smartphone, X } from "lucide-react";
import { safeGradient } from "@/lib/appearance";
import { cleanUrl } from "@/lib/links";
import type { SiteData } from "@/lib/site-types";
import { NeuButton, NeuCard, NeuChip, NeuIconButton, NeuTabs } from "../neu";
import { EASE } from "../motion";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { GithubIcon } from "../SocialIcons";
import { useSite } from "../SiteProvider";

type Project = SiteData["projects"][number];

// Keep in sync with PROJECT_CATEGORIES in ADMIN DASHBOARD/src/portfolio/options.ts.
const PROJECT_CATEGORIES = [
  { value: "office", label: "Office" },
  { value: "personal", label: "Personal" },
] as const;

type Filter = "all" | (typeof PROJECT_CATEGORIES)[number]["value"];

// Descriptions longer than this get clamped with a "Read more" button
const LONG_DESCRIPTION = 180;

const categoryOf = (p: Project) => p.category ?? "personal";

/** Every link a project card can show, with "#" placeholders and empty fields dropped. */
function projectLinks(p: Project) {
  return {
    live: cleanUrl(p.liveUrl),
    source: cleanUrl(p.sourceUrl),
    apk: cleanUrl(p.apkUrl),
    extra: (p.links ?? []).map((l) => ({ label: l.label, url: cleanUrl(l.url) })).filter((l) => l.url),
  };
}

function ProjectActions({ project }: { project: Project }) {
  const { live, source, apk, extra } = projectLinks(project);
  const any = live || source || apk || extra.length > 0;

  if (!any) {
    return categoryOf(project) === "office" ? (
      <span className="neu-in-sm inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-muted">
        <Lock aria-hidden className="size-3.5" /> Private / Client project
      </span>
    ) : null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {live && (
        <NeuIconButton href={live} label={`${project.title} — live site`} primary>
          <ArrowUpRight className="size-[18px]" />
        </NeuIconButton>
      )}
      {source && (
        <NeuIconButton href={source} label={`${project.title} — source code on GitHub`}>
          <GithubIcon className="size-[18px]" />
        </NeuIconButton>
      )}
      {extra.map((link) => {
        const Icon = /admin|dashboard/i.test(link.label) ? LayoutDashboard : ExternalLink;
        return (
          <NeuButton
            key={`${link.label}-${link.url}`}
            href={link.url}
            variant="ghost"
            target="_blank"
            rel="noreferrer"
            className="!py-2.5"
          >
            <Icon aria-hidden className="size-4" />
            {link.label}
          </NeuButton>
        );
      })}
      {apk && (
        <NeuButton
          href={apk}
          variant="ghost"
          target={apk.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          download={apk.startsWith("/") ? "" : undefined}
          className="!py-2.5"
        >
          <Smartphone aria-hidden className="size-4" />
          Android APK
        </NeuButton>
      )}
    </div>
  );
}

/** Device-screen style inset frame holding the screenshot or a generated cover. */
function ProjectScreen({ project, index }: { project: Project; index: number }) {
  const ratio = project.featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]";
  return (
    <div className="neu-in rounded-[calc(var(--r-lg)-6px)] p-2.5 sm:p-3">
      <div className={`relative overflow-hidden rounded-[var(--r-sm)] ${ratio}`}>
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="size-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className={`size-full bg-gradient-to-br ${safeGradient(project.gradient)}`}>
            <span className="absolute top-4 left-5 font-mono text-xs text-black/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="absolute inset-0 grid place-items-center font-display text-3xl font-bold text-white/90">
              {project.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const { projects } = useSite().data;
  const [filter, setFilter] = useState<Filter>("all");
  const [reading, setReading] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const openDetails = (p: Project) => {
    setReading(p);
    dialogRef.current?.showModal();
  };

  return (
    <Section id="projects">
      {tabs.length > 2 && (
        <div className="mb-10">
          <NeuTabs id="projects" label="Filter projects" tabs={tabs} value={filter} onChange={setFilter} />
        </div>
      )}

      <div className="relative isolate grid gap-7 md:grid-cols-2">
        {/* Filtering glides the remaining cards into place; removed ones shrink away */}
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, i) => {
            const long = project.description.length > LONG_DESCRIPTION;
            return (
              <motion.div
                key={project.id}
                layout
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ layout: { duration: 0.6, ease: EASE } }}
                className={project.featured ? "md:col-span-2" : undefined}
              >
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <NeuCard as="article" className="group flex h-full flex-col p-4 sm:p-5">
                    <ProjectScreen project={project} index={i} />
                    <div className="flex flex-1 flex-col px-2 pt-6 pb-2 sm:px-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-xl font-semibold sm:text-2xl">{project.title}</h3>
                        <span className="font-mono text-[0.6875rem] tracking-[0.15em] text-subtle uppercase">
                          {categoryOf(project) === "office" ? "Office" : "Personal"}
                        </span>
                      </div>
                      <p className={`mt-3 max-w-3xl leading-relaxed text-muted ${long ? "line-clamp-3" : ""}`}>
                        {project.description}
                      </p>
                      {long && (
                        <button
                          type="button"
                          onClick={() => openDetails(project)}
                          className="mt-2 self-start text-sm font-semibold text-accent-ink underline-offset-4 hover:underline"
                          aria-haspopup="dialog"
                        >
                          Read more<span className="sr-only"> about {project.title}</span>
                        </button>
                      )}
                      {project.tags.length > 0 && (
                        <ul aria-label="Tech used" className="mt-5 flex flex-wrap gap-2.5">
                          {project.tags.map((tag) => (
                            <li key={tag}>
                              <NeuChip>{tag}</NeuChip>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto pt-6">
                        <ProjectActions project={project} />
                      </div>
                    </div>
                  </NeuCard>
                </Reveal>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Full description for long ones. Native <dialog>: focus trap, Esc to close, backdrop. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="project-dialog-title"
        onClose={() => setReading(null)}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="neu m-auto w-[min(40rem,calc(100vw-2rem))] outline-none max-h-[85vh] p-0 text-fg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        {reading && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 id="project-dialog-title" className="font-display text-2xl font-semibold">
                {reading.title}
              </h3>
              <NeuIconButton label="Close" size="sm" onClick={() => dialogRef.current?.close()}>
                <X className="size-4" />
              </NeuIconButton>
            </div>
            <p className="mt-4 leading-relaxed whitespace-pre-line text-muted">{reading.description}</p>
            {reading.tags.length > 0 && (
              <ul aria-label="Tech used" className="mt-6 flex flex-wrap gap-2.5">
                {reading.tags.map((tag) => (
                  <li key={tag}>
                    <NeuChip>{tag}</NeuChip>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <ProjectActions project={reading} />
            </div>
          </div>
        )}
      </dialog>
    </Section>
  );
}
