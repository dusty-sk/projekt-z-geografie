import { useState } from "react";
import { SURVEY_QUESTIONS, type SurveyResponse } from "../../data/survey";
import "./survey.css";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${Number(day)}. ${Number(month)}. ${year}`;
}

type SurveyTableProps = {
  responses: readonly SurveyResponse[];
  onEdit: (response: SurveyResponse) => void;
  onDelete: (id: string) => void;
  /** Highlighted after an edit so the user can see the change. */
  highlightedId?: string | null;
};

export function SurveyTable({ responses, onEdit, onDelete, highlightedId }: SurveyTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const ordered = [...responses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (ordered.length === 0) {
    return (
      <p className="survey-table__empty">
        Zatiaľ nie sú zaznamenané žiadne odpovede. Pridajte prvú odpoveď vo formulári.
      </p>
    );
  }

  return (
    <div className="survey-table-wrap">
      <table className="survey-table">
        <caption className="sr-only">Zoznam zaznamenaných odpovedí</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Oblasť</th>
            {SURVEY_QUESTIONS.map((question) => (
              <th key={question.id} scope="col" title={question.label}>
                <abbr title={question.label}>{question.short}</abbr>
              </th>
            ))}
            <th scope="col">Dátum</th>
            <th scope="col">Kód</th>
            <th scope="col">Akcie</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((response, index) => {
            const confirming = confirmId === response.id;
            return (
              <tr
                key={response.id}
                className={highlightedId === response.id ? "is-highlighted" : undefined}
              >
                <td data-label="#">{index + 1}</td>
                <td data-label="Oblasť">
                  <span className="survey-table__area">{response.area}</span>
                </td>
                {SURVEY_QUESTIONS.map((question) => (
                  <td key={question.id} data-label={question.short}>
                    <span className="survey-table__answer">
                      {response.answers[question.id] || "—"}
                    </span>
                  </td>
                ))}
                <td data-label="Dátum">{formatDate(response.date)}</td>
                <td data-label="Kód">{response.code || "—"}</td>
                <td data-label="Akcie">
                  {confirming ? (
                    <div className="survey-table__confirm" role="group" aria-label="Potvrdenie zmazania">
                      <span className="survey-table__confirm-text">Naozaj zmazať?</span>
                      <button
                        type="button"
                        className="survey-action survey-action--danger"
                        onClick={() => {
                          onDelete(response.id);
                          setConfirmId(null);
                        }}
                      >
                        Zmazať
                      </button>
                      <button
                        type="button"
                        className="survey-action"
                        onClick={() => setConfirmId(null)}
                      >
                        Zrušiť
                      </button>
                    </div>
                  ) : (
                    <div className="survey-table__actions">
                      <button
                        type="button"
                        className="survey-action"
                        onClick={() => onEdit(response)}
                      >
                        Upraviť
                      </button>
                      <button
                        type="button"
                        className="survey-action survey-action--danger"
                        onClick={() => setConfirmId(response.id)}
                      >
                        Zmazať
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}