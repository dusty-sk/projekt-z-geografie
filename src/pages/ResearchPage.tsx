import { PageHeader } from "../components/PageHeader";
import { ComingContent } from "../components/ComingContent";
import { Button } from "../components/Button";
import { researchPage } from "../data/underConstruction";

export function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow={researchPage.eyebrow}
        title={researchPage.title}
        lede={researchPage.lede}
        meta={researchPage.meta}
        image={{ slug: "detviansky-potok.jpg" }}
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
              Anketári zaznamenávajú odpovede na otázky o vzťahu obyvateľov k miestu, kde žijú. Odpovede sú zadávané ako voľný text — bez hodnotenia 0–5 škály. Zaznamenávame len odpovede — žiadne mená ani kontaktné údaje. Štyri otázky sú zvolené pre dve vzorkové oblasti — Stará Detva a Sídlisko.
            </p>
          </article>
          <article className="coming__panel">
            <p className="eyebrow">Výsledky</p>
            <h3>Štatistické výsledky prieskumu</h3>
            <p className="coming__desc">
              Vypočítané z aktuálneho reálneho súboru odpovedí. Témy najčastejších odpovedí pre každú otázku, priemer počtu znakov na odpoveď a porovnanie medzi Starou Detvou a Sídliskom.
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