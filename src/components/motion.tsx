"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotionConfig,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

/** Shared easing for every entrance: a long, soft deceleration. */
export const EASE = [0.22, 1, 0.36, 1] as const;

const finePointer = (e: PointerEvent) => e.pointerType === "mouse";

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

/** Pulls its child gently toward the cursor and springs back on leave. Mouse only. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotionConfig();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || !finePointer(e)) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="inline-block" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------

type TiltProps = HTMLMotionProps<"div"> & { as?: "div" | "article"; max?: number };

/**
 * Card that tilts toward the cursor in 3D and carries a soft accent spotlight under it
 * (.spotlight in globals.css reads --mx / --my). Tilt is skipped for reduced motion and touch.
 */
export function TiltCard({ as = "div", max = 5, className, children, style, ...rest }: TiltProps) {
  const reduce = useReducedMotionConfig();
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const Tag = as === "article" ? motion.article : motion.div;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!finePointer(e)) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce) return;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <Tag
      {...(rest as HTMLMotionProps<"div">)}
      className={`spotlight ${className ?? ""}`}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </Tag>
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
