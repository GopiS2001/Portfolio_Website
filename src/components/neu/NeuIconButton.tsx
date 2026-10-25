import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Common = {
  /** Accessible name — the button shows only an icon */
  label: string;
  size?: "sm" | "md" | "lg";
  /** Accent fill instead of a raised surface */
  primary?: boolean;
  className?: string;
  children: ReactNode;
};
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };

const SIZES = { sm: "size-9", md: "size-11", lg: "size-14" };

/** Round icon-only button: social links, copy email, menu, back-to-top. */
export function NeuIconButton(props: AsLink | AsButton) {
  const { label, size = "md", primary, className = "", children, ...rest } = props;
  const cls = `neu-interactive grid shrink-0 place-items-center rounded-full ${SIZES[size]} ${
    primary ? "neu-primary" : "neu-sm rounded-full text-muted hover:text-accent-ink"
  } ${className}`;
  if (rest.href !== undefined) {
    const external = /^https?:\/\//.test(rest.href);
    return (
      <a
        aria-label={label}
        title={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
