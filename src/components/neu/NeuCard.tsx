import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li" | "form" | "section";
  /** raised (extruded) or pressed (inset) */
  variant?: "raised" | "pressed";
  /** Lifts on hover and sinks in when pressed — for cards that are themselves clickable */
  interactive?: boolean;
};

/** The basic neumorphic surface: same colour as the page, depth from two shadows. */
export function NeuCard({ as: Tag = "div", variant = "raised", interactive, className = "", ...rest }: Props) {
  const surface = variant === "pressed" ? "neu-in rounded-neu" : "neu";
  return <Tag className={`${surface} ${interactive ? "neu-interactive" : ""} ${className}`} {...rest} />;
}
