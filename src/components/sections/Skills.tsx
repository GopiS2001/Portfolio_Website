"use client";

import {
  Brain,
  Cloud,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  LayoutTemplate,
  Palette,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { useSite } from "../SiteProvider";

// Keys must match the icon options in the admin dashboard.
const icons: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  server: Server,
  database: Database,
  wrench: Wrench,
  code: Code2,
  cloud: Cloud,
  smartphone: Smartphone,
  palette: Palette,
  cpu: Cpu,
  terminal: Terminal,
  git: GitBranch,
  shield: Shield,
  brain: Brain,
  globe: Globe,
  layers: Layers,
  sparkles: Sparkles,
};

export function Skills() {
  const { skills, settings } = useSite().data;
  const marquee = skills.marquee;

  return (
    <Section id="skills">
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.groups.map((group, i) => {
          const Icon = icons[group.icon] ?? LayoutTemplate;
          return (
            <Reveal key={group.id} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-card p-7 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-accent/40">
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 size-48 rounded-full opacity-0 blur-3xl transition duration-700 group-hover:opacity-100"
                  style={{ background: "var(--glow)" }}
                />
                <div className="relative flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-serif text-3xl">{group.title}</h3>
                  <span className="ml-auto font-mono text-xs text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted transition group-hover:text-fg"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Infinite tech marquee */}
      {settings.showMarquee && marquee.length > 0 && (
        <div
          className="relative mt-16 overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)" }}
        >
          <div className="animate-marquee flex w-max gap-12">
            {[...marquee, ...marquee].map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= marquee.length}
                className="flex items-center gap-12 font-serif text-4xl whitespace-nowrap text-subtle italic"
              >
                {item}
                <span className="text-accent not-italic">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
