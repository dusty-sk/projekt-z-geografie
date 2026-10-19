import { useState } from "react";
import { Link } from "react-router-dom";
import { AppImage } from "../AppImage";
import { Lightbox, type LightboxImage } from "../Lightbox";
import { Reveal } from "../Reveal";
import { Button } from "../Button";
import { LocationImage } from "./LocationImage";
import {
  categoryById,
  getLocationNeighbours,
  type Location,
} from "../../data/locations";
import { creditFor } from "../../data/imageCredits";
import "./LocationDetail.css";

function formatLat(lat: number): string {
  const hemi = lat >= 0 ? "s. š." : "j. š.";
  return `${Math.abs(lat).toFixed(5)}° ${hemi}`;
}

function formatLon(lon: number): string {
  const hemi = lon >= 0 ? "v. d." : "z. d.";
  return `${Math.abs(lon).toFixed(5)}° ${hemi}`;
}

const verificationLabel: Record<Location["verification"]["status"], string> = {
  "overené": "Overené",
  "čiastočne overené": "Čiastočne overené",
  "na overenie": "Na overenie",
};

const verificationClass: Record<Location["verification"]["status"], string> = {
  "overené": "verified",
  "čiastočne overené": "partial",
  "na overenie": "unverified",
};

type LocationDetailProps = {
  location: Location;
};

/**
 * The single reusable detail-page template. Every location is rendered from
 * this component using only the central dataset — no per-page markup.
 */
export function LocationDetail({ location }: LocationDetailProps) {
  const { hero, scope } = location;
  const coords = location.coords;
  const heroCredit = creditFor(hero.slug);
  const neighbours = getLocationNeighbours(location.id);
  const primaryCategory = categoryById(location.categories[0]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const galleryImages: LightboxImage[] = (location.gallery ?? []).map((image) => ({
    slug: image.slug,
    alt: image.alt,
    caption: image.alt,
    credit: creditFor(image.slug)?.artist,
  }));

  const sections = [
    { id: "loc-about", label: "O lokalite", heading: "Čo tu nájdete", paragraphs: location.description },
    { id: "loc-geo", label: "Geografický význam", heading: "Kde sa nachádza a prečo", paragraphs: location.geography },
    ...(location.history
      ? [{ id: "loc-hist", label: "Historický a kultúrny význam", heading: "Stopy minulosti", paragraphs: location.history }]
      : []),
  ];

  return (
    <article className="loc" aria-labelledby="loc-title">
      {/* ------------------------------------------------------------- Hero */}
      <header className="loc-hero">
        <div className="loc-hero__media">
          <AppImage
            slug={hero.slug}
            alt={hero.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="loc-hero__scrim" />
        </div>

        <div className="loc-hero__inner shell">
          <Reveal className="loc-hero__content">
            <p className="eyebrow">Miesta · {primaryCategory.label}</p>
            <h1 className="loc-hero__title" id="loc-title">
              {location.name}
            </h1>
            {location.alsoKnownAs && location.alsoKnownAs.length > 0 && (
              <p className="loc-hero__aka">známe aj ako {location.alsoKnownAs.join(" · ")}</p>
            )}
            <p className="loc-hero__summary">{location.summary}</p>
          </Reveal>

          <Reveal delay={140} className="loc-hero__aside">
            <ul className="loc-hero__cats" aria-label="Kategórie">
              {location.categories.map((id) => (
                <li key={id}>{categoryById(id).label}</li>
              ))}
            </ul>

            {coords ? (
              <dl className="loc-hero__coords">
                <div>
                  <dt>Zemepisná šírka</dt>
                  <dd>{formatLat(coords.lat)}</dd>
                </div>
                <div>
                  <dt>Zemepisná dĺžka</dt>
                  <dd>{formatLon(coords.lon)}</dd>
                </div>
                {location.coordPrecision && (
                  <div>
                    <dt>Presnosť</dt>
                    <dd>{location.coordPrecision}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="loc-hero__coords-empty text-dim">Súradnice zatiaľ nie sú uvedené.</p>
            )}

            <div className="loc-hero__scope">
              <p className="loc-hero__scope-head">
                Zaradenie
                {!scope.withinDetva && <span className="loc-hero__scope-flag">Mimo mesta Detva</span>}
              </p>
              <p className="loc-hero__scope-line">
                {scope.municipality} · okres {scope.district} · {scope.region} kraj
              </p>
              {scope.note && <p className="loc-hero__scope-note">{scope.note}</p>}
            </div>

            <p className="loc-hero__credit">
              {hero.kind === "illustrative" && (
                <span className="loc-hero__badge">Ilustračná fotografia</span>
              )}
              {heroCredit && (
                <span>
                  {heroCredit.artist} / Wikimedia Commons · {heroCredit.license}
                </span>
              )}
            </p>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------------------------ Facts */}
      {location.facts && location.facts.length > 0 && (
        <section className="loc-facts" aria-label="Rýchle fakty">
          <div className="shell">
            <ul className="loc-facts__grid">
              {location.facts.map((fact, index) => (
                <li key={fact.label}>
                  <Reveal delay={index * 70}>
                    <p className="loc-facts__value">{fact.value}</p>
                    <p className="loc-facts__label">{fact.label}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- Narrative */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`loc-section${index % 2 === 1 ? " loc-section--alt" : ""}`}
          aria-labelledby={section.id}
        >
          <div className="shell">
            <div className={`loc-section__grid${index % 2 === 1 ? " loc-section__grid--reverse" : ""}`}>
              <Reveal className="loc-section__lead">
                <p className="eyebrow">
                  {String(index + 1).padStart(2, "0")} — {section.label}
                </p>
                <h2 id={section.id} className="loc-section__title">
                  {section.heading}
                </h2>
              </Reveal>

              <div className="loc-prose">
                {section.paragraphs.map((paragraph) => (
                  <Reveal key={paragraph.slice(0, 28)} as="p" className="loc-prose__para">
                    {paragraph}
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ------------------------------------------------------ Highlights */}
      <section className="loc-section" aria-labelledby="loc-highlights">
        <div className="shell">
          <div className="loc-section__grid">
            <Reveal className="loc-section__lead">
              <p className="eyebrow">Čo je tu zaujímavé</p>
              <h2 id="loc-highlights" className="loc-section__title">
                Prečo sa oplatí zastaviť
              </h2>
            </Reveal>

            <ol className="loc-highlights">
              {location.highlights.map((item, index) => (
                <Reveal as="li" key={item.slice(0, 28)} delay={index * 60} className="loc-highlight">
                  <span className="loc-highlight__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="loc-highlight__text">{item}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Gallery */}
      {location.gallery && location.gallery.length > 0 && (
        <section className="loc-section loc-section--tight" aria-label="Ďalšie fotografie">
          <div className="shell">
            <div className="loc-gallery">
              {location.gallery.map((image, index) => (
                <Reveal key={image.slug} className="loc-gallery__item" variant="scale">
                  <LocationImage image={image} onZoom={() => setLightbox(index)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        images={galleryImages}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />

      {/* --------------------------------------------------------- Visitor */}
      <section className="loc-section loc-section--alt" aria-labelledby="loc-visitor">
        <div className="shell shell--narrow">
          <Reveal className="loc-callout">
            <p className="eyebrow">Prínos pre návštevníkov</p>
            <h2 id="loc-visitor" className="loc-callout__title">
              Potenciál lokality
            </h2>
            <p className="loc-callout__text">{location.visitorAppeal}</p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- Research */}
      {location.research && (
        <section className="loc-section" aria-labelledby="loc-research">
          <div className="shell shell--narrow">
            <Reveal className="loc-research">
              <p className="eyebrow">Súvisiaci výskum</p>
              <h2 id="loc-research" className="loc-research__title">
                Čo by sme tu skúmali
              </h2>
              <p className="loc-research__focus">{location.research.focus}</p>
              <p className="loc-research__status">
                Stav: {location.research.status}. Táto časť opisuje zámer skúmania, nie zistenia — výsledky
                výskumu zverejníme až po ich overení a spracovaní.
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* --------------------------------------------- Sources + verification */}
      <section className="loc-section loc-section--tight" aria-label="Zdroje a overenie">
        <div className="shell shell--narrow">
          <Reveal className="loc-sources">
            <div className="loc-sources__block">
              <p className="loc-sources__head">Zdroje a súradnice</p>
              <p className="loc-sources__coord">
                {coords
                  ? `Súradnice${location.coordPrecision ? ` (${location.coordPrecision})` : ""}: ${
                      location.coordSource ?? "zdroj neuvedený"
                    }.`
                  : "Súradnice pre túto lokalitu zatiaľ nie sú uvedené."}
              </p>
              {location.coordSourceUrl && (
                <p className="loc-sources__coord">
                  <a href={location.coordSourceUrl} target="_blank" rel="noreferrer noopener">
                    Otvoriť zdroj súradníc
                  </a>
                </p>
              )}
              <ul className="loc-sources__list">
                {location.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer noopener">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="loc-verify">
              <p className="loc-verify__head">
                Stav overenia
                <span className={`loc-verify__status loc-verify__status--${verificationClass[location.verification.status]}`}>
                  {verificationLabel[location.verification.status]}
                </span>
              </p>
              <ul>
                {location.verification.items.map((item) => (
                  <li key={item.slice(0, 28)}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Nav */}
      <nav className="loc-nav" aria-label="Navigácia medzi lokalitami">
        <div className="shell">
          <div className="loc-nav__top">
            <Button to="/mapa" variant="primary">
              Späť na mapu
            </Button>
            <Link className="loc-nav__all" to="/miesta">
              Všetky miesta
            </Link>
          </div>

          {neighbours && (
            <ul className="loc-nav__peers">
              <li>
                <Link className="loc-nav__peer" to={`/miesta/${neighbours.previous.id}`}>
                  <span className="loc-nav__peer-dir">Predchádzajúce</span>
                  <span className="loc-nav__peer-name">{neighbours.previous.name}</span>
                </Link>
              </li>
              <li className="loc-nav__peer-sep" aria-hidden="true" />
              <li>
                <Link className="loc-nav__peer loc-nav__peer--next" to={`/miesta/${neighbours.next.id}`}>
                  <span className="loc-nav__peer-dir">Nasledujúce</span>
                  <span className="loc-nav__peer-name">{neighbours.next.name}</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </article>
  );
}
