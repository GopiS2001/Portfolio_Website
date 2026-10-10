// Fonts, gradients and icons the admin Configuration page can choose from.
// Keep these lists in sync with ADMIN DASHBOARD/src/portfolio/options.ts.

/** Fonts bundled with next/font — no extra network request needed. */
export const BUILT_IN_SANS = "Geist";
export const BUILT_IN_SERIF = "Instrument Serif";

/** Google Fonts query per family (weights/italics each family actually ships). */
const SANS_SPEC = "wght@300;400;500;600;700";
const SERIF_SPEC = "ital@0;1";

export function googleFontHref(family: string, kind: "sans" | "serif") {
  const spec = kind === "sans" ? SANS_SPEC : SERIF_SPEC;
  return `https://fonts.googleapis.com/css2?family=${family.trim().replace(/ /g, "+")}:${spec}&display=swap`;
}

/**
 * Project cover gradients. Written out in full so Tailwind generates these classes;
 * a gradient that is not in this list falls back to the first one.
 */
export const GRADIENTS = [
  "from-amber-300 via-orange-400 to-rose-500",
  "from-sky-300 via-indigo-400 to-violet-500",
  "from-emerald-300 via-teal-400 to-cyan-500",
  "from-fuchsia-300 via-pink-400 to-rose-500",
  "from-yellow-200 via-lime-300 to-emerald-400",
  "from-slate-300 via-slate-400 to-slate-600",
  "from-rose-300 via-red-400 to-orange-500",
  "from-cyan-200 via-sky-400 to-blue-600",
  "from-violet-300 via-purple-400 to-fuchsia-500",
  "from-stone-200 via-amber-200 to-yellow-400",
];

export const safeGradient = (g: string) => (GRADIENTS.includes(g) ? g : GRADIENTS[0]);
