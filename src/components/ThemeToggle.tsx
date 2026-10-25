"use client";

import { Moon, Sun } from "lucide-react";
import { NeuToggle } from "./neu";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // The knob position and icon follow the .dark class in CSS, so there's no hydration mismatch.
  return (
    <NeuToggle
      label="Toggle dark mode"
      onClick={toggle}
      knobClassName="dark:translate-x-7"
      knob={
        <>
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </>
      }
    />
  );
}
