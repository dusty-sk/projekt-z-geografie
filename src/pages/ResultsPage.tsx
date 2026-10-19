import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ResultsGrid } from "../components/results/ResultsGrid";
import { useSurveyResponses } from "../hooks/useSurveyResponses";
import {
  computeSurveyStats,
  SURVEY_AREAS,
  SURVEY_QUESTIONS,
  type SurveyArea,
} from "../data/survey";
import "./ResultsPage.css";

// Derived from the single source of truth so adding/removing an area never
// requires touching this component.
const FILTERS: Array<{ id: "all" | SurveyArea; label: string }> = [
  { id: "all", label: "Všetci respondenti" },
  ...SURVEY_AREAS.map((area) => ({ id: area, label: area })),
];

export function ResultsPage() {
  const { responses } = useSurveyResponses();
  const [filter, setFilter] = useState<"all" | SurveyArea>("all");
  const stats = useMemo(() => computeSurveyStats(responses), [responses]);

  return (
    <section className="results-page">
      <PageHeader
        eyebrow="Výsledky otvoreného prieskumu"
        title="Štatistické výsledky otvoreného prieskumu"
        lede="Témy najčastejších odpovedí pre každú otázku, priemer počtu znakov a porovnanie medzi Starou Detvou a Sídliskom. Všetky hodnoty sú počítané priamo z reálneho súboru odpovedí."
        meta={[
          { label: "Oblasti", value: String(SURVEY_AREAS.length) },
          { label: "Otázky", value: String(SURVEY_QUESTIONS.length) },
          { label: "Zaznamenané odpovede", value: String(stats.total) },
        ]}
      />
      <div
        className="results-page__filters shell"
        role="group"
        aria-label="Filtrovať výsledky podľa oblasti"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-chip${filter === f.id ? " is-active" : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="shell">
        <ResultsGrid filter={filter} stats={stats} />
      </div>
    </section>
  );
}