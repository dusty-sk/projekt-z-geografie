import { PageHeader } from "../components/PageHeader";
import { ComingContent } from "../components/ComingContent";
import { Button } from "../components/Button";
import { researchPage } from "../data/underConstruction";
import { ConstellationStar } from "../eggs/Constellation";

export function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow={researchPage.eyebrow}
        title={researchPage.title}
        lede={researchPage.lede}
        meta={researchPage.meta}
        image={{ slug: "detviansky-potok.jpg" }}
        ornament={<ConstellationStar index={3} />}
      />
      <ComingContent
        intro={researchPage.intro}
        items={researchPage.items}
        note={researchPage.note}
        backTo={{ label: "Späť na domov", to: "/" }}
      >
        <div className="coming__next">
          <article className="coming__panel">
            <p className="eyebrow">Zber údajov</p>
            <h3>Prieskum otvorených otázok</h3>
            <p className="coming__desc">
              Anketári zapisujú odpovede na otázky o vzťahu obyvateľov k miestu, kde žijú. Odpovede sú voľný text, nie hodnotenie na škále 0–5. Zapisujeme len odpovede, bez mien a kontaktných údajov. Štyri otázky sme vybrali pre dve oblasti: Starú Detvu a Sídlisko.
            </p>
          </article>
          <article className="coming__panel">
            <p className="eyebrow">Výsledky</p>
            <h3>Štatistické výsledky prieskumu</h3>
            <p className="coming__desc">
              Vypočítané z odpovedí, ktoré sú práve uložené v prehliadači. Pre každú otázku ukazujeme najčastejšie témy, priemernú dĺžku odpovede a porovnanie medzi Starou Detvou a Sídliskom.
            </p>
            <Button to="/vysledky-prieskumu" variant="ghost" arrow>
              Otvoriť výsledky prieskumu
            </Button>
          </article>
        </div>
      </ComingContent>
    </>
  );
}