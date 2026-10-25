"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotionConfig,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

/** Shared easing for every entrance: a long, soft deceleration. */
export const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------

/** Hairline accent bar along the top edge that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

// ---------------------------------------------------------------------------

/**
 * Text that rises into view a word (or letter) at a time from behind a mask.
 * `inView` waits until it scrolls into view; otherwise it plays on mount (above the fold).
 */
export function SplitReveal({
  text,
  by = "word",
  delay = 0,
  stagger = by === "word" ? 0.06 : 0.025,
  inView = false,
  className,
}: {
  text: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  inView?: boolean;
  /** Applied to each moving piece, e.g. a gradient fill that must sit on the glyphs themselves */
  className?: string;
}) {
  const words = text.split(/(\s+)/).filter(Boolean);
  let index = 0;

  return (
    <>
      {words.map((word, w) => {
        if (/^\s+$/.test(word)) return " ";
        const pieces = by === "char" ? [...word] : [word];
        return (
          // Keep a word's letters together so it never breaks mid-word
          <span key={w} className="inline-block whitespace-nowrap">
            {pieces.map((piece, p) => {
              const i = index++;
              const target = { y: "0%", opacity: 1 };
              return (
                <span key={p} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <motion.span
                    data-reveal
                    className={`inline-block ${className ?? ""}`}
                    initial={{ y: "105%", opacity: 0 }}
                    {...(inView
                      ? { whileInView: target, viewport: { once: true, margin: "-60px" } }
                      : { animate: target })}
                    transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
                  >
                    {piece}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------

/**
 * Counts a stat like "5+", "120K" or "99.9%" up from zero when it first scrolls into view.
 * Values without a leading number render as-is.
 */
export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotionConfig();
  const match = /^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value);

  useEffect(() => {
    const el = ref.current;
    if (!seen || reduce || !match || !el) return;
    const [, prefix, raw, suffix] = match;
    const target = parseFloat(raw.replace(/,/g, ""));
    const decimals = raw.split(".")[1]?.length ?? 0;
    const grouped = raw.includes(",");
    const format = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouped,
      }) +
      suffix;
    el.textContent = format(0);
    const controls = animate(0, target, {
      duration: 1.8,
      delay,
      ease: EASE,
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => controls.stop();
    // match is derived from value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce, value, delay]);

  return <span ref={ref}>{value}</span>;
}
