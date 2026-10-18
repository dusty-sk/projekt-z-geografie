import { Link } from "react-router-dom";
import { AppImage } from "../components/AppImage";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { hero, intro, teasers, panorama, closingCta, anchors } from "../data/home";
import { regionFacts } from "../data/region";
import { creditLine } from "../data/imageCredits";
import { site } from "../data/site";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media" aria-hidden="true">
          <AppImage
            className="hero__img"
            slug={hero.image.slug}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__scrim" />
          <div className="hero__vignette" />
          <span className="terrain terrain--summit" aria-hidden="true" />
        </div>

        <div className="hero__inner shell">
          <div className="hero__content">
            <p className="hero__coord coord coord--bright">
              <span className="hero__coord-mark" aria-hidden="true" />
              {site.coordinatesLabel}
            </p>

            <p className="hero__eyebrow">
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              {hero.eyebrow}
            </p>

            <h1 className="hero__title" id="hero-title">
              {hero.title}
            </h1>

            <p className="hero__subtitle">{hero.subtitle}</p>

            <div className="hero__actions">
              <Button to={hero.primaryCta.to} variant="primary" size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button to={hero.secondaryCta.to} variant="ghost" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="hero__foot">
            <p className="hero__caption">{hero.caption}</p>
            <a className="hero__scroll" href={`#${anchors.intro}`}>
              <span className="hero__scroll-line" aria-hidden="true" />
              <span>{hero.scrollHint}</span>
            </a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Intro */}
      <section className="section intro" id={anchors.intro} aria-labelledby="intro-title">
        <div className="shell">
          <div className="intro__grid">
            <div className="intro__text">
              <SectionHeading
                eyebrow={intro.eyebrow}
                title={intro.title}
                id="intro-title"
                lede={
                  <>
                    {intro.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)} className="intro__para">
                        {paragraph}
                      </p>
                    ))}
                  </>
                }
              />

              <Reveal delay={120} className="intro__secondary">
                {intro.secondary.map((text) => (
                  <p key={text.slice(0, 32)}>{text}</p>
                ))}
              </Reveal>
            </div>

            <Reveal delay={160} className="intro__figure">
              <figure className="figure">
                <div className="figure__frame">
                  <AppImage
                    slug="detva-stara-cast.jpg"
                    alt="Stará časť Detvy s tradičnou zástavbou"
                  />
                </div>
                <figcaption className="figure__caption">
                  <span>Stará časť Detvy</span>
                  <span className="figure__credit">{creditLine("detva-stara-cast.jpg")}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* ------------------------------------------------------ Fact strip */}
          <ul className="facts" aria-label="Základné údaje o regióne">
            {regionFacts.map((fact, index) => (
              <li className="facts__item" key={fact.label}>
                <Reveal delay={index * 90}>
                  <span className="facts__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="facts__value">
                    {fact.value}
                    {fact.unit && <span className="facts__unit">{fact.unit}</span>}
                  </p>
                  <p className="facts__label">{fact.label}</p>
                  {fact.note && <p className="facts__note">{fact.note}</p>}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------- Teasers */}
      <section className="section teasers" aria-labelledby="teasers-title">
        <div className="shell">
          <SectionHeading
            eyebrow="Ďalej"
            title="Štyri spôsoby, ako sa dozvedieť viac"
            id="teasers-title"
            lede="Začnite mapou, prejdite sa miestami, nahliadnite do výskumu alebo si prečítajte o celom regióne."
          />

          <ul className="teasers__list">
            {teasers.map((teaser, index) => (
              <li className="teaser" key={teaser.to}>
                <Reveal delay={index * 70} className="teaser__reveal">
                  <Link className="teaser__link" to={teaser.to}>
                    <div className="teaser__media">
                      <AppImage slug={teaser.image.slug} alt={teaser.image.alt} />
                    </div>
                    <div className="teaser__body">
                      <p className="teaser__meta">
                        <span className="teaser__index">{teaser.index}</span>
                        <span className="teaser__label">{teaser.label}</span>
                      </p>
                      <h3 className="teaser__title">{teaser.title}</h3>
                      <p className="teaser__desc">{teaser.description}</p>
                      <span className="teaser__cta">
                        Otvoriť
                        <span className="teaser__cta-arrow" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- Panorama */}
      <section className="panorama" aria-labelledby="panorama-title">
        <div className="panorama__media" aria-hidden="true">
          <AppImage slug={panorama.image.slug} alt="" />
          <div className="panorama__scrim" />
        </div>

        <div className="panorama__inner shell">
          <Reveal className="panorama__content">
            <p className="eyebrow">{panorama.eyebrow}</p>
            <blockquote className="panorama__quote" id="panorama-title">
              {panorama.quote}
            </blockquote>
            <p className="panorama__attribution">{panorama.attribution}</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section className="section cta" aria-labelledby="cta-title">
        <span className="terrain terrain--corner" aria-hidden="true" />
        <div className="shell shell--narrow">
          <Reveal className="cta__inner">
            <p className="eyebrow">{closingCta.eyebrow}</p>
            <h2 className="cta__title" id="cta-title">
              {closingCta.title}
            </h2>
            <p className="cta__body">{closingCta.body}</p>
            <div className="cta__actions">
              <Button to={closingCta.primaryCta.to} variant="primary" size="lg">
                {closingCta.primaryCta.label}
              </Button>
              <Button to={closingCta.secondaryCta.to} variant="ghost" size="lg" arrow={false}>
                {closingCta.secondaryCta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
