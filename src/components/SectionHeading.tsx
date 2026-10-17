import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import "./SectionHeading.css";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  align?: "start" | "between";
  id?: string;
  level?: 2 | 3;
  actions?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "start",
  id,
  level = 2,
  actions,
}: SectionHeadingProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Reveal className={`sec-head sec-head--${align}`}>
      <div className="sec-head__main">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading className="sec-head__title" id={id}>
          {title}
        </Heading>
        {lede && <div className="sec-head__lede">{lede}</div>}
      </div>
      {actions && <div className="sec-head__actions">{actions}</div>}
    </Reveal>
  );
}
