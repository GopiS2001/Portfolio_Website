"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // Both icons render; CSS picks the visible one, so there's no hydration mismatch.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="group relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-card text-fg backdrop-blur transition hover:border-accent/50"
    >
      <Sun className="size-[18px] transition duration-500 dark:-translate-y-8 dark:rotate-90 dark:opacity-0" />
      <Moon className="absolute size-[18px] translate-y-8 -rotate-90 opacity-0 transition duration-500 dark:translate-y-0 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
