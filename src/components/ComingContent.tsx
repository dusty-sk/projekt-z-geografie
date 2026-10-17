import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import "./ComingContent.css";

export type ComingItem = {
  title: string;
  description: string;
  status: "pripravujeme" | "vprieskume" | "hotovo-čiastečne";
};

type ComingContentProps = {
  /** Short sentence explaining where this section currently stands. */
  intro: string;
  items: readonly ComingItem[];
  backTo: { label: string; to: string };
  note?: string;
  /** Optional follow-up content rendered between the board and the closing note bar. */
  children?: ReactNode;
};

const statusLabel: Record<ComingItem["status"], string> = {
  pripravujeme: "Pripravujeme",
  vprieskume: "V prieskume",
  "hotovo-čiastečne": "Čiastočne hotovo",
};

export function ComingContent({ intro, items, backTo, note, children }: ComingContentProps) {
  return (
    <section className="section coming">
      <div className="shell">
        <div className="coming__head">
          <Reveal className="coming__head-main">
            <div className="coming__status">
              <span className="coming__status-dot" aria-hidden="true" />
              Časť stránky sa dokončuje
            </div>
            <p className="coming__intro">{intro}</p>
          </Reveal>

          <Reveal delay={100} className="coming__head-count">
            <span className="coming__count-value">{items.length}</span>
            <span className="coming__count-label">plánovaných častí</span>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <ul className="coming__list">
            {items.map((item, index) => (
              <li key={item.title} className="coming__item" data-status={item.status}>
                <div className="coming__item-head">
                  <p className="coming__tag">
                    <span className="coming__tag-dot" aria-hidden="true" />
                    {statusLabel[item.status]}
                  </p>
                  <span className="coming__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="coming__title">{item.title}</h3>
                <p className="coming__desc">{item.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {children && (
          <Reveal delay={150} className="coming__next-wrap">
            {children}
          </Reveal>
        )}

        <Reveal delay={180} className="coming__note-wrap">
          {note && <p className="coming__note">{note}</p>}
          <Button to={backTo.to} variant="ghost">
            {backTo.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}