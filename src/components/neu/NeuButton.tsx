import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Common = {
  /** primary = accent fill (identifiable without shadows), ghost = raised surface */
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function neuButtonClass(variant: Common["variant"] = "primary", size: Common["size"] = "md") {
  const tone = variant === "primary" ? "neu-primary" : "neu-sm text-fg hover:text-accent-ink";
  const pad = size === "lg" ? "px-7 py-3.5 text-[0.95rem]" : "px-5 py-2.5 text-sm";
  return `neu-interactive inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-60 ${tone} ${pad}`;
}

/** A link when given href, otherwise a real <button>. */
export function NeuButton(props: AsLink | AsButton) {
  const { variant, size, className = "", children, ...rest } = props;
  const cls = `${neuButtonClass(variant, size)} ${className}`;
  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
