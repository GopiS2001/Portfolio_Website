"use client";

import { motion } from "motion/react";

type Tab<T extends string> = { value: T; label: string; count?: number };

/** Pressed track; the selected tab is a raised pill that slides between options. */
export function NeuTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  id,
}: {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Unique per page — keys the sliding pill animation */
  id: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="neu-in inline-flex max-w-full flex-wrap gap-1 rounded-full p-1.5">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`relative isolate inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors sm:px-5 ${
              active ? "font-semibold text-accent-ink" : "text-muted hover:text-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`neu-tab-${id}`}
                className="neu-sm absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {tab.label}
            {tab.count !== undefined && <span className="font-mono text-xs opacity-70">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
