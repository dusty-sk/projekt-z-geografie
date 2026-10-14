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

function fmt(mean: number | null): string {
  return mean === null ? "—" : mean.toFixed(2);
}

function plural(count: number): string {
  return count === 1 ? "odpoveď" : count <= 4 ? "odpovede" : "odpovedí";
}

/** Short, data-driven Slovak notes. Makes no claims a small sample cannot back. */
function buildNotes(stats: SurveyStats): string[] {
  const notes: string[] = [];
  if (stats.total === 0) return notes;

  for (const area of stats.areas) {
    if (area.count === 0) continue;
    const scored = area.questions.filter(
      (q): q is typeof q & { mean: number } => q.mean !== null,
    );
    if (scored.length === 0) continue;
    const best = scored.reduce((a, b) => (b.mean > a.mean ? b : a));
    const worst = scored.reduce((a, b) => (b.mean < a.mean ? b : a));
    notes.push(
      `${area.area}: najvyššie hodnotenie má „${best.short}“ (${best.mean.toFixed(2)}), ` +
        `najnižšie „${worst.short}“ (${worst.mean.toFixed(2)}) — spolu ${area.count} ${plural(area.count)}.`,
    );
  }

  const [a, b] = stats.areas;
  if (a && b && a.count > 0 && b.count > 0 && a.overallMean !== null && b.overallMean !== null) {
    const diff = Math.abs(a.overallMean - b.overallMean);
    const small = Math.min(a.count, b.count) < 5;
    const higher = a.overallMean > b.overallMean ? a.area : b.area;
    notes.push(
      small
        ? `Rozdiel priemerov je ${diff.toFixed(2)} bodu, no pri takej malej vzorke (${a.count} a ${b.count}) ho nemožno považovať za preukazný.`
        : `${higher} dosahuje v priemerne o ${diff.toFixed(2)} bodu viac. Ide o orientačné porovnanie vzorky, nie o objektívny dôkaz kvality.`,
    );
  }

  return notes;
}

export function Comparison({ filter, stats }: ComparisonProps) {
  // The two columns follow the dataset order — no area name is hard-coded here.
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
          <h3 className="chart-card__title">Porovnanie oblastí (škála 0–5)</h3>
        </div>
        <p className="chart-card__meta">
          Filtrované: {filterLabel} · Spolu N = {stats.total}
        </p>
      </header>

      {stats.total === 0 ? (
        <p className="chart-card__empty">
          Zatiaľ neboli zaznamenané žiadne odpovede. Po pridaní údajov sa tu zobrazí porovnanie
          oblastí {SURVEY_AREAS.join(" a ")}.
        </p>
      ) : (
        <>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <caption className="sr-only">
                Priemerné hodnotenie podľa otázky a oblasti na škále 0–5
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
                {rows.map(({ q, sd, sl, all }) => (
                  <tr key={q.id}>
                    <th scope="row" title={q.label}>
                      {q.short}
                    </th>
                    <td>{fmt(sd?.mean ?? null)}</td>
                    <td>{fmt(sl?.mean ?? null)}</td>
                    <td className="comparison-table__overall">{fmt(all?.mean ?? null)}</td>
                  </tr>
                ))}
                <tr className="comparison-table__total">
                  <th scope="row">Priemer oblasti</th>
                  <td>{fmt(first?.overallMean ?? null)}</td>
                  <td>{fmt(second?.overallMean ?? null)}</td>
                  <td className="comparison-table__overall">{fmt(stats.overall.overallMean)}</td>
                </tr>
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
        </>
      )}
    </article>
  );
}
