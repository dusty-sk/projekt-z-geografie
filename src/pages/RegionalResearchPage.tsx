import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { ResearchEntryCard } from "../components/research/ResearchEntryCard";
import { researchIntro, researchSections } from "../data/regionalResearch";
import "./RegionalResearchPage.css";

const LEGEND = [
  { cls: "ok", label: "Overené", desc: "Údaj je doložený uvedeným zdrojom." },
  {
    cls: "partial",
    label: "Čiastočne overené",
    desc: "Základ je doložený, detaily treba doplniť.",
  },
  { cls: "todo", label: "Na overenie", desc: "Údaj čaká na kontrolu zdroja." },
  { cls: "draft", label: "Pripravujeme", desc: "Obsah sa dopĺňa — zatiaľ zámerne prázdne." },
] as const;

export function RegionalResearchPage() {
  return (
    <div className="rr">
      <PageHeader
        eyebrow="Región · Výskum"
        title="Regionálny výskum Podpoľania"
        lede="Päť tematických celkov o krajine, pamiatkach, vodstve a ľudovej kultúre Detvy a Podpoľania — pri každej položke uvádzame zdroj a stav overenia."
        image={{ slug: "polana-skliarovo.jpg" }}
        meta={[
          { label: "Región", value: "Podpoľanie" },
          { label: "Celky", value: "5 tematických sekcií" },
          { label: "Zdroj", value: "Wikimedia Commons · CC BY-SA" },
        ]}
      />

      <nav className="rr-index" aria-label="Sekcie regionálneho výskumu">
        <div className="shell rr-index__inner">
          {researchSections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="rr-index__link">
              <span className="rr-index__num">{section.eyebrow.split(" — ")[0]}</span>
              <span className="rr-index__label">{section.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="section section--tight rr-intro ornament ornament--corners-trbl" aria-labelledby="rr-intro-title">
        <div className="shell shell--narrow">
          <Reveal>
            <p className="eyebrow">{researchIntro.eyebrow}</p>
            <h2 className="rr-intro__title" id="rr-intro-title">
              {researchIntro.title}
            </h2>
            {researchIntro.body.map((paragraph, index) => (
              <p className="rr-intro__para" key={index}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={100}>
            <ul className="rr-legend" aria-label="Význam stavov overenia">
              {LEGEND.map((item) => (
                <li className="rr-legend__item" key={item.cls}>
                  <span className={`rr-status rr-status--${item.cls}`}>{item.label}</span>
                  <span className="rr-legend__desc">{item.desc}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {researchSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`section rr-section ornament ${
            index % 2 === 0 ? "ornament--lattice" : "ornament--ribbon"
          }`}
          aria-labelledby={`rr-sec-${section.id}`}
        >
          <div className="shell">
            <header className="rr-section__head">
              <Reveal>
                <p className="eyebrow">{section.eyebrow}</p>
                <h2 className="rr-section__title" id={`rr-sec-${section.id}`}>
                  {section.title}
                </h2>
                <p className="rr-section__lede">{section.lede}</p>
              </Reveal>
              {section.note && (
                <Reveal delay={80}>
                  <p className="rr-section__note">{section.note}</p>
                </Reveal>
              )}
            </header>

            <div className="rr-entries">
              {section.entries.map((entry) => (
                <ResearchEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section--tight rr-outro ornament ornament--flourish-bottom" aria-labelledby="rr-outro-title">
        <div className="shell shell--narrow">
          <Reveal>
            <h2 className="rr-outro__title" id="rr-outro-title">
              Ako s touto časťou pracujeme
            </h2>
            <p className="rr-outro__para">
              Sekcia je postavená tak, aby sa dala priebežne dopĺňať: všetok obsah je v jednom
              súbore a nová položka sa pridá bez zásahu do dizajnu. Rozpracované časti zostávajú
              viditeľne označené, aby bolo vždy jasné, čo je doložené a čo ešte len overujeme.
            </p>
            <div className="rr-outro__actions">
              <Button to="/region" variant="primary">
                Región Podpoľania
              </Button>
              <Button to="/miesta" variant="ghost">
                Miesta a lokality
              </Button>
              <Button to="/mapa" variant="ghost">
                Interaktívna mapa
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
