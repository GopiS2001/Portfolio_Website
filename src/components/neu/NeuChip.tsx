import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: "span" | "li";
  /** raised (default) for tags on a card, pressed for tags sitting in a track */
  variant?: "raised" | "pressed";
};

/** Small tag for a technology or skill. */
export function NeuChip({ as: Tag = "span", variant = "raised", className = "", ...rest }: Props) {
  const surface = variant === "pressed" ? "neu-in-sm" : "neu-sm";
  return (
    <Tag
      className={`${surface} inline-flex items-center rounded-full px-3 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-muted ${className}`}
      {...rest}
    />
  );
}
