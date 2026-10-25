"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { ThemeToggle } from "./ThemeToggle";
import { NeuButton, NeuIconButton } from "./neu";
import { EASE } from "./motion";
import { useSite } from "./SiteProvider";

export function Navbar() {
  const { profile, settings, sections } = useSite().data;
  const firstId = sections.find((s) => s.visible)?.key ?? "home";
  const navLinks = sections
    .filter((s) => s.visible && s.showInNav)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({ id: s.key, label: s.navLabel || s.key }));
  const contactVisible = sections.some((s) => s.key === "contact" && s.visible);

  const active = useScrollSpy(
    navLinks.map((l) => l.id),
    firstId,
  );
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 px-4 pt-4 sm:px-6"
      initial={{ y: "-130%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <nav
        aria-label="Main"
        className="neu mx-auto flex max-w-[1200px] items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5"
      >
        <a href={`#${firstId}`} className="font-display text-xl font-bold tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                className={`relative isolate block rounded-full px-4 py-2 text-sm transition-colors ${
                  active === link.id ? "font-semibold text-accent-ink" : "text-muted hover:text-fg"
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="neu-in-sm absolute inset-0 -z-10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {settings.enableThemeToggle && <ThemeToggle />}
          {settings.showHeaderCta && contactVisible && (
            <NeuButton href="#contact" className="hidden sm:inline-flex">
              {settings.headerCtaLabel}
            </NeuButton>
          )}
          {navLinks.length > 0 && (
            <NeuIconButton
              label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              size="sm"
              className="lg:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </NeuIconButton>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="neu mx-auto mt-3 flex max-w-[1200px] flex-col gap-1 p-3 lg:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.id ? "location" : undefined}
                  className={`block rounded-[var(--r-md)] px-4 py-3 text-sm ${
                    active === link.id ? "neu-in-sm font-semibold text-accent-ink" : "text-muted"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {settings.showHeaderCta && contactVisible && (
              <li className="mt-2 sm:hidden">
                <NeuButton href="#contact" onClick={() => setOpen(false)} className="w-full">
                  {settings.headerCtaLabel}
                </NeuButton>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
