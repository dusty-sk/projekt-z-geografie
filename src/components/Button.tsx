import type { ReactNode } from "react";
import "./Button.css";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

type LinkProps = BaseProps & {
  to: string;
  onClick?: never;
  type?: never;
};

type ActionProps = BaseProps & {
  to?: never;
  onClick: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
};

export type ButtonProps = (LinkProps | ActionProps) & {
  /** Renders a trailing arrow glyph. */
  arrow?: boolean;
};

const classes = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ");

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = true,
  ...rest
}: ButtonProps) {
  const cls = classes("btn", `btn--${variant}`, `btn--${size}`, className);

  if (rest.to !== undefined) {
    const { to } = rest;
    return (
      <a className={cls} href={to}>
        <span className="btn__label">{children}</span>
        {arrow && <span className="btn__arrow" aria-hidden="true" />}
      </a>
    );
  }

  const { onClick, type = "button", "aria-label": ariaLabel } = rest;
  return (
    <button className={cls} type={type} onClick={onClick} aria-label={ariaLabel}>
      <span className="btn__label">{children}</span>
      {arrow && <span className="btn__arrow" aria-hidden="true" />}
    </button>
  );
}
