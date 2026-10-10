"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { apiUrl } from "@/lib/api";
import { BUILT_IN_SANS, BUILT_IN_SERIF, googleFontHref } from "@/lib/appearance";
import type { SiteData, SiteSettings } from "@/lib/site-types";

export type DataSource = "live" | "snapshot" | "cache" | "build";

const CACHE_KEY = "site-data";

const SiteContext = createContext<{ data: SiteData; source: DataSource } | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

async function getJson(url: string, timeoutMs: number): Promise<SiteData> {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const data = (await res.json()) as SiteData;
  if (!data?.settings || !data?.profile) throw new Error(`${url} returned an unexpected shape`);
  return data;
}

function readCache(): SiteData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SiteData) : null;
  } catch {
    return null;
  }
}

/**
 * Content resolution order:
 *   1. live API (MySQL)                   — the source of truth
 *   2. /site-data.json                    — snapshot the backend rewrites on every admin change
 *   3. this browser's last good copy      — localStorage
 *   4. the snapshot bundled at build time — always available, already rendered in the HTML
 */
export function SiteProvider({ initial, children }: { initial: SiteData; children: ReactNode }) {
  const [state, setState] = useState<{ data: SiteData; source: DataSource }>({
    data: initial,
    source: "build",
  });

  useEffect(() => {
    let cancelled = false;
    const apply = (data: SiteData, source: DataSource) => !cancelled && setState({ data, source });

    (async () => {
      try {
        const live = await getJson(apiUrl("/public/site"), 5000);
        apply(live, "live");
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch {}
        return;
      } catch {}

      const candidates: { data: SiteData; source: DataSource }[] = [];
      try {
        candidates.push({ data: await getJson("/site-data.json", 4000), source: "snapshot" });
      } catch {}
      const cached = readCache();
      if (cached) candidates.push({ data: cached, source: "cache" });

      // Use the newest copy we can find, but never go older than what's already on screen.
      const newest = candidates
        .filter((c) => c.data.generatedAt > initial.generatedAt)
        .sort((a, b) => b.data.generatedAt.localeCompare(a.data.generatedAt))[0];
      if (newest) apply(newest.data, newest.source);
    })();

    return () => {
      cancelled = true;
    };
  }, [initial.generatedAt]);

  useAppearance(state.data.settings, state.data.profile.name);

  return (
    <SiteContext.Provider value={state}>
      <MotionConfig reducedMotion={state.data.settings.enableAnimations ? "user" : "always"}>
        {children}
      </MotionConfig>
    </SiteContext.Provider>
  );
}

// ---------------------------------------------------------------------------

function loadFont(family: string, kind: "sans" | "serif") {
  const id = `site-font-${kind}`;
  let link = document.getElementById(id) as HTMLLinkElement | null;
  const builtIn = kind === "sans" ? BUILT_IN_SANS : BUILT_IN_SERIF;
  const root = document.documentElement.style;

  if (!family || family === builtIn) {
    link?.remove();
    root.removeProperty(`--site-font-${kind}`);
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const href = googleFontHref(family, kind);
  if (link.href !== href) link.href = href;
  root.setProperty(
    `--site-font-${kind}`,
    `"${family}", ${kind === "sans" ? "ui-sans-serif, system-ui, sans-serif" : "ui-serif, Georgia, serif"}`,
  );
}

/** Pushes Configuration-page settings onto <html>: theme, fonts, sizes, accent colours, title. */
function useAppearance(settings: SiteSettings, name: string) {
  useEffect(() => {
    const root = document.documentElement;

    // Theme: when the toggle is disabled the configured default always wins.
    let theme = settings.defaultTheme;
    if (settings.enableThemeToggle) {
      try {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") theme = saved;
      } catch {}
    }
    const dark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);

    root.style.setProperty("--site-font-size", `${settings.baseFontSize || 16}px`);
    root.style.setProperty("--heading-scale", String((settings.headingScale || 100) / 100));
    root.style.setProperty("--accent-light", settings.accentLight || "#a87a32");
    root.style.setProperty("--accent-dark", settings.accentDark || "#d9b26a");
    root.classList.toggle("no-animations", !settings.enableAnimations);

    loadFont(settings.fontSans, "sans");
    loadFont(settings.fontSerif, "serif");

    if (settings.siteTitle) document.title = settings.siteTitle;
    else if (name) document.title = name;
  }, [settings, name]);
}
