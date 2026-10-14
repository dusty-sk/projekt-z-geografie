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
        backTo={{ label: "Spät na domov", to: "/" }}
      />
      <section className="section section--tight">
        <div className="shell shell--narrow">
          <div className="coming__note-wrap">
            <p className="eyebrow">Zber údajov</p>
            <h3>Prieskum spokojnosti obyvatelov</h3>
            <p className="coming__desc measure">
              Anketári zaznamenávajú odpovede na štyri otázky na škále 0 (vôbec nie) až 5 (úplne
              spokojný) v dvoch vzorkových oblastiach — Stará Detva a Sídlisko.
            </p>
            <Button to="/prieskum" variant="primary">
              Otvorit zber odpovedí
            </Button>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="shell shell--narrow">
          <div className="coming__note-wrap">
            <p className="eyebrow">Výsledky</p>
            <h3>Štatistické výsledky prieskumu</h3>
            <p className="coming__desc measure">
              Vypocítané automaticky z aktuálneho, reálne uloženého súboru odpovedí. Zobrazuje
              priemery, distribúciu hlasov 0–5, percentá a porovnanie medzi Starou Detvou a Sídliskom.
            </p>
            <Button to="/vysledky-prieskumu" variant="ghost" arrow>
              Otvorit výsledky prieskumu
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
