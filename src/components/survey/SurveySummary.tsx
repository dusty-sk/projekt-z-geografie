import type { SurveyStats } from "../../data/survey";
import "./survey.css";

function fmt(mean: number | null): string {
  return mean === null ? "—" : mean.toFixed(2);
}

type SurveySummaryProps = {
  stats: SurveyStats;
};

export function SurveySummary({ stats }: SurveySummaryProps) {
  const empty = stats.total === 0;

  return (
    <section className="survey-summary" aria-labelledby="survey-summary-title">
      <div className="survey-summary__head">
        <div>
          <p className="eyebrow">Súhrn</p>
          <h2 className="survey-summary__title" id="survey-summary-title">
            Zozbierané odpovede
          </h2>
        </div>
        <p className="survey-summary__total" aria-live="polite">
          <span className="survey-summary__total-value">{stats.total}</span>
          <span className="survey-summary__total-label">
            {stats.total === 1 ? "odpoveď spolu" : "odpovedí spolu"}
          </span>
        </p>
      </div>

      <ul className="survey-summary__areas">
        {stats.areas.map((area) => (
          <li key={area.area} className="survey-area-card">
            <p className="survey-area-card__name">{area.area}</p>
            <p className="survey-area-card__count">{area.count}</p>
            <p className="survey-area-card__meta">
              {area.count === 1 ? "respondent" : "respondentov"} · priemer 0–5: {fmt(area.overallMean)}
            </p>
          </li>
        ))}
      </ul>

      {empty ? (
        <p className="survey-summary__empty">
          Zatiaľ neboli zaznamenané žiadne odpovede. Akonáhle ich pridáte, súhrn sa zobrazí tu.
        </p>
      ) : (
        <div className="survey-summary__table-wrap">
          <table className="survey-summary__table">
            <caption className="sr-only">
              Priemerné hodnotenie podľa otázky a oblasti (škála 0–5)
            </caption>
            <thead>
              <tr>
                <th scope="col">Otázka</th>
                {stats.areas.map((area) => (
                  <th key={area.area} scope="col">
                    {area.area}
                  </th>
                ))}
                <th scope="col">Spolu</th>
              </tr>
            </thead>
            <tbody>
              {stats.overall.questions.map((question, index) => (
                <tr key={question.questionId}>
                  <th scope="row">{question.short}</th>
                  {stats.areas.map((area) => (
                    <td key={area.area}>{fmt(area.questions[index]?.mean ?? null)}</td>
                  ))}
                  <td className="survey-summary__overall">{fmt(question.mean)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="survey-summary__caption">
            Priemer známok na škále 0 (vôbec nie) až 5 (úplne spokojný).
          </p>
        </div>
      )}
    </section>
  );
}
