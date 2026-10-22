import { useMemo } from "react";
import {
  SURVEY_AREAS,
  SURVEY_QUESTIONS,
  type SurveyArea,
  type SurveyStats,
} from "../../data/survey";
import "./results.css";

type ComparisonProps = {
  filter: "all" | SurveyArea;
  stats: SurveyStats;
};

function fmt(value: number | null): string {
  return value !== null && !Number.isNaN(value) ? value.toFixed(2) : "—";
}

function buildNotes(stats: SurveyStats): string[] {
  const notes: string[] = [];
  if (stats.total === 0) return notes;

  for (const area of stats.areas) {
    if (area.count === 0) continue;
    const answered = area.questions.filter((q) => q.topSnippet !== "");
    if (answered.length === 0) continue;
    for (const q of answered) {
      notes.push(
        `${area.area}: pri otázke "${q.short}" sa najčastejšia odpoveď objavila ${q.count}×`,
      );
    }
  }

  const [a, b] = stats.areas;
  if (a && b && a.count > 0 && b.count > 0 && a.overallMean !== null && b.overallMean !== null) {
    const diff = Math.abs(a.overallMean - b.overallMean);
    const small = Math.min(a.count, b.count) < 5;
    const higher = a.overallMean > b.overallMean ? a.area : b.area;
    notes.push(
      small
        ? `Priemerná dĺžka odpovedí sa líši o ${diff.toFixed(2)} znakov. Pri takej malej vzorke (${a.count} a ${b.count}) však rozdiel nemožno považovať za preukazný.`
        : `${higher} má v priemere o ${diff.toFixed(2)} znakov dlhšie odpovede. Je to len orientačné porovnanie vzorky, nie dôkaz kvality.`,
    );
  }

  return notes;
}

export function Comparison({ filter, stats }: ComparisonProps) {
  const [firstArea, secondArea] = SURVEY_AREAS;
  const first = stats.areas.find((a) => a.area === firstArea);
  const second = stats.areas.find((a) => a.area === secondArea);

  const rows = SURVEY_QUESTIONS.map((q, idx) => ({
    q,
    sd: first?.questions[idx],
    sl: second?.questions[idx],
    all: stats.overall.questions[idx],
  }));

  const filterLabel = filter === "all" ? "Všetci respondenti" : filter;
  const notes = useMemo(() => buildNotes(stats), [stats]);

  return (
    <article className="chart-card chart-card--wide">
      <header className="chart-card__head">
        <div>
          <p className="chart-card__eyebrow">Porovnanie</p>
          <h3 className="chart-card__title">Porovnanie oblastí</h3>
        </div>
        <p className="chart-card__meta">
Filter: {filterLabel} · Spolu N = {stats.total}
        </p>
      </header>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <caption className="sr-only">
            Najčastejšie odpovede podľa otázky a oblasti
          </caption>
          <thead>
            <tr>
              <th scope="col">Otázka</th>
              <th scope="col">
                {firstArea}
                <span className="comparison-table__n">N = {first?.count ?? 0}</span>
              </th>
              <th scope="col">
                {secondArea}
                <span className="comparison-table__n">N = {second?.count ?? 0}</span>
              </th>
              <th scope="col">
                Spolu
                <span className="comparison-table__n">N = {stats.total}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.q.id}>
                <th scope="row" title={r.q.label}>
                  {r.q.short}
                </th>
                <td>{r.sd?.topSnippet || "—"}</td>
                <td>{r.sl?.topSnippet || "—"}</td>
                <td className="comparison-table__overall">{fmt(r.all?.mean ?? null)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length > 0 && (
        <ul className="comparison-notes">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </article>
  );
}