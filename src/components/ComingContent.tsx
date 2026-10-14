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
};

const statusLabel: Record<ComingItem["status"], string> = {
  pripravujeme: "Pripravujeme",
  vprieskume: "V prieskume",
  "hotovo-čiastečne": "Čiastočne hotovo",
};

export function ComingContent({ intro, items, backTo, note }: ComingContentProps) {
  return (
    <section className="section coming ornament ornament--flourish-top">
      <div className="shell shell--narrow">
        <Reveal>
          <div className="coming__status" aria-hidden="true">
            <span className="coming__status-dot" />
            Časť stránky sa dokončuje
          </div>
          <p className="coming__intro">{intro}</p>
        </Reveal>

        <Reveal delay={100}>
          <ul className="coming__list">
            {items.map((item) => (
              <li key={item.title} className="coming__item">
                <p className="coming__tag">{statusLabel[item.status]}</p>
                <h3 className="coming__title">{item.title}</h3>
                <p className="coming__desc">{item.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>

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