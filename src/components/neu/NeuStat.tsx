"use client";

import { CountUp } from "../motion";

/** Circular raised badge with a mono number that counts up, e.g. "2.3+ / Years experience". */
export function NeuStat({
  value,
  label,
  delay = 0,
  className = "",
}: {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`neu grid size-24 place-items-center rounded-full text-center sm:size-28 ${className}`}>
      <dl>
        <dt className="sr-only">{label}</dt>
        <dd className="font-mono text-xl font-medium text-fg sm:text-2xl">
          <CountUp value={value} delay={delay} />
        </dd>
        <dd aria-hidden className="mx-auto mt-0.5 max-w-[5.5rem] text-[0.6875rem] leading-tight text-muted">
          {label}
        </dd>
      </dl>
    </div>
  );
}
