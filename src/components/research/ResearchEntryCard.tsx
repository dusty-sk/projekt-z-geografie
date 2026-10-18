import { Reveal } from "../Reveal";
import { AppImage } from "../AppImage";
import { creditFor } from "../../data/imageCredits";
import type { ResearchEntry, VerificationStatus } from "../../data/regionalResearch";
import "./research.css";

const statusLabel: Record<VerificationStatus, string> = {
  "overené": "Overené",
  "čiastočne overené": "Čiastočne overené",
  "na overenie": "Na overenie",
  pripravujeme: "Pripravujeme",
};

const statusClass: Record<VerificationStatus, string> = {
  "overené": "ok",
  "čiastočne overené": "partial",
  "na overenie": "todo",
  pripravujeme: "draft",
};

type ResearchEntryCardProps = {
  entry: ResearchEntry;
};

/**
 * One editable research entry: title, lead, description, geographic / cultural
 * context, facts, sources and an honest verification badge. Illustrative images
 * are badged so they are never mistaken for a direct photograph.
 */
export function ResearchEntryCard({ entry }: ResearchEntryCardProps) {
  const { image } = entry;
  const credit = image ? creditFor(image.slug) : undefined;
  const hasMedia = Boolean(image);
  const classes = [
    "rr-card",
    hasMedia ? "rr-card--media" : "",
    entry.placeholder ? "rr-card--todo" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Reveal as="article" className={classes}>
      {image && (
        <figure className="rr-card__media">
          <div className="rr-card__frame">
            <AppImage slug={image.slug} alt={image.alt} loading="lazy" decoding="async" />
            {image.kind === "illustrative" && <span className="rr-card__badge">Ilustračné</span>}
          </div>
          <figcaption className="rr-card__caption">
            <span className="rr-card__caption-desc">{image.alt}</span>
            {image.kind === "illustrative" && image.note && (
              <span className="rr-card__caption-note">{image.note}</span>
            )}
            {credit && (
              <span className="rr-card__credit">
                {credit.artist} / Wikimedia Commons · {credit.license}
              </span>
            )}
          </figcaption>
        </figure>
      )}

      <div className="rr-card__body">
        <header className="rr-card__head">
          <div className="rr-card__heading">
            <h3 className="rr-card__title">{entry.name}</h3>
            {entry.alsoKnownAs && entry.alsoKnownAs.length > 0 && (
              <p className="rr-card__aka">inak {entry.alsoKnownAs.join(", ")}</p>
            )}
          </div>
          <span className={`rr-status rr-status--${statusClass[entry.verification.status]}`}>
            {statusLabel[entry.verification.status]}
          </span>
        </header>

        <p className="rr-card__summary">{entry.summary}</p>

        {entry.placeholder && (
          <p className="rr-card__todo">Na doplnenie — obsah tejto položky sa pripravuje.</p>
        )}

        <div className="rr-card__prose">
          {entry.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {entry.geography && entry.geography.length > 0 && (
          <div className="rr-card__block">
            <h4 className="rr-card__block-title">Geografický kontext</h4>
            <ul>
              {entry.geography.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.culture && entry.culture.length > 0 && (
          <div className="rr-card__block">
            <h4 className="rr-card__block-title">Kultúrny a historický kontext</h4>
            <ul>
              {entry.culture.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.facts && entry.facts.length > 0 && (
          <dl className="rr-card__facts">
            {entry.facts.map((fact) => (
              <div className="rr-card__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {entry.verification.items && entry.verification.items.length > 0 && (
          <div className="rr-card__verify">
            <h4 className="rr-card__block-title">Ešte overiť</h4>
            <ul>
              {entry.verification.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.sources && entry.sources.length > 0 && (
          <div className="rr-card__sources">
            <span className="rr-card__sources-label">Zdroje</span>
            <ul>
              {entry.sources.map((source) => (
                <li key={source.label}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  ) : (
                    source.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
