"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { StyleSwitcher } from "./StyleSwitcher";
import { useSite } from "./SiteProvider";

export function Navbar() {
  const { profile, settings, sections } = useSite().data;
  const firstId = sections.find((s) => s.visible)?.key ?? "home";
  const navLinks = sections
    .filter((s) => s.visible && s.showInNav)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({ id: s.key, label: s.navLabel || s.key }));
  const contactVisible = sections.some((s) => s.key === "contact" && s.visible);
  const linkIds = navLinks.map((l) => l.id).join(",");

  const [active, setActive] = useState<string>(firstId);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of linkIds.split(",")) {
      const el = id && document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [linkIds]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 pl-5 transition-all duration-500 ${
          scrolled
            ? "border-line bg-bg/70 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
            : "border-transparent"
        }`}
      >
        <a href={`#${firstId}`} className="font-serif text-2xl tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active === link.id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line bg-card"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {settings.enableStyleSwitcher && <StyleSwitcher />}
          {settings.enableThemeToggle && <ThemeToggle />}
          {settings.showHeaderCta && contactVisible && (
            <a
              href="#contact"
              className="hidden rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition hover:opacity-85 sm:inline-block"
            >
              {settings.headerCtaLabel}
            </a>
          )}
          {navLinks.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-line bg-card md:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 flex max-w-6xl flex-col rounded-3xl border border-line bg-bg/90 p-2 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm ${
                    active === link.id ? "bg-card text-fg" : "text-muted"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
