import { Reveal } from "./Reveal";
import { SpiralMark } from "./Icons";
import { credits } from "../data/site";
import { ConstellationStar } from "../eggs/Constellation";
import { NetworkNode } from "../eggs/Network";
import "./Credits.css";

/**
 * Honest credits at the end of /o-projekte: who owns the project, which AI
 * tools helped build it, and where the data and photographs come from.
 * Part of the presentation deck too, since /o-projekte is the last stop.
 */
export function Credits() {
  return (
    <section className="section section--tight credits" aria-labelledby="credits-title">
      <div className="shell">
        <Reveal className="credits__head">
          <p className="eyebrow">Kredity</p>
          <div className="credits__title-row">
            <span className="credits__mark" aria-hidden="true">
              <SpiralMark />
            </span>
            <h2 id="credits-title" className="credits__title">
              Za vznikom tohto webu
            </h2>
            <ConstellationStar index={4} />
          </div>
          <p className="credits__lede">
            Projekt vedie jeho autor, ktorý zodpovedá za obsah. Pri tvorbe pomáhali aj AI
            nástroje — ich podiel uvádzame otvorene.
          </p>
        </Reveal>

        <div className="credits__grid">
          {credits.map((entry, index) => (
            <Reveal key={entry.name} className="credits__card" delay={80 + index * 70}>
              <p className="credits__role">{entry.role}</p>
              <p className="credits__name">{entry.name}</p>
              <p className="credits__note">{entry.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="credits__foot" delay={240}>
          <p>
            Zdroje: Wikipédia (sk), SHMÚ a Štatistický úrad SR; ilustračné fotografie
            Wikimedia Commons (CC BY-SA, autori uvedení pri snímkach).
          </p>
          <p>
            AI nástroje pomáhali pri návrhu a realizácii webu; výber obsahu, kontrola
            zdrojov a zodpovednosť za zverejnené údaje zostávajú na autorovi projektu.
          </p>
          <div className="egg-net-slot egg-net-slot--credits">
            <NetworkNode id="o-projekte" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
