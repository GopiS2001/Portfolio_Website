"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";
import type { DesignStyle } from "@/lib/site-types";

/** localStorage key for the visitor's chosen style (read before paint in layout.tsx too). */
export const STYLE_KEY = "design-style";

/** Tiny fixed preview of each style, so the menu reads the same whatever style is active. */
const OPTIONS: { value: DesignStyle; label: string; swatch: CSSProperties }[] = [
  {
    value: "neumorphism",
    label: "Neumorphism",
    swatch: { background: "#ece8e1", boxShadow: "2px 2px 4px rgb(166 155 138 / .6), -2px -2px 4px #fff" },
  },
  {
    value: "glassmorphism",
    label: "Glassmorphism",
    swatch: {
      background: "linear-gradient(135deg, #a1c4fd, #fbc2eb)",
      boxShadow: "inset 0 0 0 1px rgb(255 255 255 / .7)",
    },
  },
  {
    value: "claymorphism",
    label: "Claymorphism",
    swatch: {
      background: "#fdfaf5",
      boxShadow: "2px 3px 6px rgb(150 120 80 / .3), inset -2px -2px 4px rgb(150 120 80 / .2), inset 2px 2px 4px #fff",
    },
  },
  {
    value: "skeuomorphism",
    label: "Skeuomorphism",
    swatch: {
      background: "linear-gradient(#fbf9f4, #e2dcd0)",
      boxShadow: "inset 0 1px 0 #fff, 0 1px 3px rgb(40 30 15 / .35)",
      border: "1px solid rgb(60 48 30 / .35)",
    },
  },
];

/** Header button that lets visitors switch the site's design style (remembered per browser). */
export function StyleSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<DesignStyle | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    // Read the live style when opening — <html data-style> is the source of truth
    setCurrent((document.documentElement.dataset.style as DesignStyle) ?? null);
    setOpen((o) => !o);
  };

  const choose = (style: DesignStyle) => {
    document.documentElement.dataset.style = style;
    try {
      localStorage.setItem(STYLE_KEY, style);
    } catch {}
    setCurrent(style);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Change design style"
        aria-haspopup="menu"
        aria-expanded={open}
        className="ui-raised ui-press grid size-10 place-items-center rounded-full text-fg hover:border-accent/50"
      >
        <Palette className="size-[18px]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Design style"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="ui-float absolute right-0 top-full z-50 mt-3 w-56 rounded-3xl p-2"
          >
            <p className="px-3 pt-1 pb-2 text-xs tracking-wide text-muted uppercase">Design style</p>
            {OPTIONS.map((o) => {
              const active = o.value === current;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(o.value)}
                  className={`flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm transition ${
                    active ? "ui-inset text-fg" : "border border-transparent text-muted hover:text-fg"
                  }`}
                >
                  <span className="h-5 w-7 shrink-0 rounded-md" style={o.swatch} />
                  <span className="flex-1">{o.label}</span>
                  {active && <Check className="size-4 text-accent" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
