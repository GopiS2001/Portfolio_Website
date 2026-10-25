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
import { motion } from "motion/react";
import type { SiteData } from "@/lib/site-types";
import { NeuCard, NeuChip } from "../neu";
import { EASE } from "../motion";
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

/** A skill listed in more than one group (or twice with different casing) shows only the first time. */
function dedupe(groups: SiteData["skills"]["groups"]) {
  const seen = new Set<string>();
  return groups
    .map((g) => ({
      ...g,
      skills: g.skills.filter((skill) => {
        const key = skill.trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    }))
    .filter((g) => g.skills.length > 0);
}

export function Skills() {
  const { skills, settings } = useSite().data;
  const groups = dedupe(skills.groups);
  const marquee = skills.marquee;
  // Bento: the first two groups stand tall when there are enough cards around them
  const bento = groups.length >= 4;

  return (
    <Section id="skills">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
        {groups.map((group, i) => {
          const Icon = icons[group.icon] ?? LayoutTemplate;
          return (
            <Reveal key={group.id} delay={(i % 3) * 0.08} className={bento && i < 2 ? "lg:row-span-2" : undefined}>
              <NeuCard as="article" className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-center gap-4">
                  <span className="neu-in-sm grid size-12 shrink-0 place-items-center rounded-full font-mono text-sm text-accent-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg leading-snug font-semibold sm:text-xl">{group.title}</h3>
                  <Icon aria-hidden className="ml-auto size-5 shrink-0 text-subtle" />
                </div>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {group.skills.map((skill, j) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.2 + j * 0.03, ease: EASE }}
                    >
                      <NeuChip>{skill}</NeuChip>
                    </motion.li>
                  ))}
                </ul>
              </NeuCard>
            </Reveal>
          );
        })}
      </div>

      {/* Infinite tech marquee running through a pressed track */}
      {settings.showMarquee && marquee.length > 0 && (
        <Reveal className="mt-14">
          <div
            className="neu-in overflow-hidden rounded-full py-4"
            style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
          >
            <ul className="animate-marquee flex w-max gap-4 pr-4">
              {[...marquee, ...marquee].map((item, i) => (
                <li key={i} aria-hidden={i >= marquee.length}>
                  <NeuChip className="px-5 py-2 text-sm text-fg">{item}</NeuChip>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
