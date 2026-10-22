import { useState } from "react";
import { Link } from "react-router-dom";
import { AppImage } from "../components/AppImage";
import { Lightbox } from "../components/Lightbox";
import { ZoomIcon } from "../components/Icons";
import { PageHeader } from "../components/PageHeader";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import { regionSections, timeline, regionFacts, gallery } from "../data/region";
import { creditLine } from "../data/imageCredits";
import { site } from "../data/site";
import { NetworkNode } from "../eggs/Network";
import "./RegionPage.css";

export function RegionPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const galleryImages = gallery.map((image) => ({
    slug: image.slug,
    alt: image.alt,
    caption: image.caption,
    credit: creditLine(image.slug),
  }));

  return (
    <div className="region">
      <PageHeader
        eyebrow="Región"
        title="Podpoľanie — krajina pod sopečným masívom"
        lede="Krajina, ochrana prírody, osídlenie a kultúra regiónu, ktorého centrom je Detva."
        image={{ slug: "polana-skliarovo.jpg" }}
        meta={[
          { label: "Poloha", value: `${site.town} · ${site.region}` },
          { label: "Najvyšší bod", value: "Poľana — 1 457,8 m n. m." },
          { label: "Ochrana", value: "CHKO Poľana od roku 1981" },
        ]}
        ornament={<NetworkNode id="region" />}
      />

      {/* -------------------------------------------------------------- Facts */}
      <section className="section section--tight region__facts" aria-labelledby="region-facts">
        <div className="shell">
          <Reveal>
            <p className="eyebrow" id="region-facts">
              V číslach
            </p>
          </Reveal>
          <ul className="region__facts-grid">
            {regionFacts.map((fact, index) => (
              <li key={fact.label}>
                <Reveal delay={index * 80}>
                  <p className="region__fact-value">
                    {fact.value}
                    {fact.unit && <span className="region__fact-unit">{fact.unit}</span>}
                  </p>
                  <p className="region__fact-label">{fact.label}</p>
                  {fact.note && <p className="region__fact-note">{fact.note}</p>}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ Sections */}
      {regionSections.map((section) => (
        <section
          key={section.id}
          className={`section region__section${section.image ? "" : " region__section--text"}`}
          aria-labelledby={`region-${section.id}`}
        >
          <div className="shell">
            <div className="region__section-grid">
              <div className="region__section-text">
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  id={`region-${section.id}`}
                  lede={
                    <>
                      {section.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)} className="region__para">
                          {paragraph}
                        </p>
                      ))}
                    </>
                  }
                />
              </div>

              {section.image && (
                <Reveal delay={120} className="region__figure">
                  <figure className="region__figure-inner">
                    <div className="region__figure-frame">
                      <AppImage slug={section.image.slug} alt={section.image.alt} />
                    </div>
                    <figcaption>
                      <span>{section.image.alt}</span>
                      <span className="region__figure-credit">
                        {creditLine(section.image.slug)}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ------------------------------------------------------------ Gallery */}
      <section className="section region__gallery" aria-labelledby="gallery-title">
        <div className="shell">
          <SectionHeading
            eyebrow="Galéria"
            title="Región v obrazoch"
            id="gallery-title"
            lede="Fotografie z Wikimedia Commons: krajina, kultúra a sídla Podpoľania."
          />

          <ul className="gallery">
            {gallery.map((image, index) => (
              <li className="gallery__item" key={image.slug}>
                <Reveal delay={index * 80} className="gallery__reveal">
                  <figure>
                    <div className="gallery__frame">
                      <AppImage slug={image.slug} alt={image.alt} />
                      <button
                        type="button"
                        className="gallery__zoom"
                        onClick={() => setLightbox(index)}
                        aria-label={`Zväčšiť fotografiu: ${image.caption}`}
                      >
                        <span className="gallery__zoom-badge" aria-hidden="true">
                          <ZoomIcon />
                        </span>
                      </button>
                    </div>
                    <figcaption>
                      <span className="gallery__caption">{image.caption}</span>
                      <span className="gallery__credit">{creditLine(image.slug)}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- Timeline */}
      <section className="section region__timeline" aria-labelledby="timeline-title">
        <div className="shell">
          <SectionHeading
            eyebrow="Časová os"
            title="Kľúčové míľniky regiónu"
            id="timeline-title"
            lede="Od pravekých nálezov cez vznik chránenej oblasti až po dnešné okresné mesto."
          />

          <ol className="timeline">
            {timeline.map((entry, index) => (
              <li className="timeline__item" key={entry.year}>
                <Reveal delay={index * 55}>
                  <p className="timeline__year">{entry.year}</p>
                  <p className="timeline__text">{entry.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={120} className="region__cta">
            <p className="region__cta-text">
              Chceš si tieto miesta pozrieť naživo? Otvor interaktívnu mapu alebo si prejdi
              katalóg lokalít.
            </p>
            <div className="region__cta-actions">
              <Button to="/mapa" variant="primary">
                Preskúmať mapu
              </Button>
              <Link className="region__cta-link" to="/miesta">
                Miesta regiónu
              </Link>
              <Link className="region__cta-link" to="/regionalny-vyskum">
                Regionálny výskum
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Lightbox
        images={galleryImages}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </div>
  );
}
