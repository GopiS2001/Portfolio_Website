import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  /** Leave undefined when the on/off state is driven by CSS (e.g. the .dark class) */
  checked?: boolean;
  /** Knob contents; positioned by the caller's classes when `checked` is undefined */
  knob?: ReactNode;
  knobClassName?: string;
};

/** Pressed track with a raised knob that slides across. */
export function NeuToggle({ label, checked, knob, knobClassName = "", className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      // A CSS-driven toggle has no known state at render time, so it stays a plain button
      role={checked === undefined ? undefined : "switch"}
      aria-checked={checked}
      aria-label={label}
      title={label}
      className={`neu-in-sm relative h-9 w-16 shrink-0 rounded-full p-1 ${className}`}
      {...rest}
    >
      <span
        className={`neu-sm grid size-7 place-items-center rounded-full text-accent-ink transition-transform duration-300 ease-out ${
          checked ? "translate-x-7" : ""
        } ${knobClassName}`}
      >
        {knob}
      </span>
    </button>
  );
}
