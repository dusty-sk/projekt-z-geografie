import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { ResearchEntryCard } from "../components/research/ResearchEntryCard";
import { researchIntro, researchSections } from "../data/regionalResearch";
import "./RegionalResearchPage.css";

const SECTION_IDS = researchSections.map((section) => section.id);

/** Tracks which themed section currently crosses the middle of the viewport. */
function useActiveSection(): string {
  const [active, setActive] = useState(SECTION_IDS[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return active;
}

const LEGEND = [
  { cls: "ok", label: "Overené", desc: "Údaj je doložený uvedeným zdrojom." },
  {
    cls: "partial",
    label: "Čiastočne overené",
    desc: "Základ máme doložený, no detaily ešte treba doplniť.",
  },
  { cls: "todo", label: "Na overenie", desc: "Údaj ešte čaká na kontrolu zdroja." },
  { cls: "draft", label: "Pripravujeme", desc: "Obsah sa dopĺňa, preto je zatiaľ zámerne prázdny." },
] as const;

export function RegionalResearchPage() {
  const active = useActiveSection();

  return (
    <div className="rr">
      <PageHeader
        eyebrow="Región · Výskum"
        title="Regionálny výskum Podpoľania"
        lede="Päť tém o krajine, pamiatkach, vode a ľudovej kultúre Detvy a Podpoľania. Pri každej položke uvádzame zdroj a stav overenia."
        image={{ slug: "polana-skliarovo.jpg" }}
        meta={[
          { label: "Región", value: "Podpoľanie" },
          { label: "Témy", value: "5" },
          { label: "Zdroj", value: "Wikimedia Commons · CC BY-SA" },
        ]}
      />

      <nav className="rr-index" aria-label="Sekcie regionálneho výskumu">
        <div className="shell rr-index__inner">
          {researchSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`rr-index__link${active === section.id ? " is-active" : ""}`}
              aria-current={active === section.id ? "true" : undefined}
            >
              <span className="rr-index__num">{section.eyebrow.split(" — ")[0]}</span>
              <span className="rr-index__label">{section.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="section section--tight rr-intro" aria-labelledby="rr-intro-title">
        <span className="terrain terrain--head" aria-hidden="true" />
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

      {researchSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="section rr-section"
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

      <section className="section section--tight rr-outro" aria-labelledby="rr-outro-title">
        <div className="shell shell--narrow">
          <Reveal>
            <h2 className="rr-outro__title" id="rr-outro-title">
              Ako s touto časťou pracujeme
            </h2>
            <p className="rr-outro__para">
              Túto časť môžeme priebežne dopĺňať. Všetok obsah je v jednom súbore, takže nová
              položka nevyžaduje zásah do dizajnu. Nedokončené časti nechávame viditeľne
              označené, aby bolo jasné, čo je doložené a čo ešte overujeme.
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
