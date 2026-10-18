import { useCallback, useMemo, useRef, useState } from "react";
import { useSurveyResponses, downloadSurveyCsv } from "../hooks/useSurveyResponses";
import { SurveyForm } from "../components/survey/SurveyForm";
import { SurveySummary } from "../components/survey/SurveySummary";
import { SurveyTable } from "../components/survey/SurveyTable";
import {
  computeSurveyStats,
  SURVEY_QUESTIONS,
  type SurveyResponse,
  type SurveyResponseInput,
} from "../data/survey";
import { usePrefersReducedMotion } from "../components/Reveal";
import "./SurveyPage.css";

export function SurveyPage() {
  const { responses, ready, persistent, addResponse, updateResponse, deleteResponse, clearAll } =
    useSurveyResponses();
  const reduced = usePrefersReducedMotion();

  const [editing, setEditing] = useState<SurveyResponse | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => computeSurveyStats(responses), [responses]);

  const handleSubmit = useCallback(
    (input: SurveyResponseInput) => {
      if (editing) {
        const result = updateResponse(editing.id, input);
        if (result.ok) {
          setHighlightedId(editing.id);
          setEditing(null);
        }
        return result;
      }
      return addResponse(input);
    },
    [editing, updateResponse, addResponse],
  );

  const handleEdit = useCallback(
    (response: SurveyResponse) => {
      setEditing(response);
      setHighlightedId(null);
      window.requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [reduced],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteResponse(id);
      setEditing((current) => (current?.id === id ? null : current));
    },
    [deleteResponse],
  );

  const noticeTone = !ready ? "loading" : persistent ? "info" : "warn";
  const noticeText = !ready
    ? "Načítavam uložené odpovede…"
    : persistent
      ? "Odpovede sa ukladajú iba v tomto prehliadači (lokálne úložisko) na tomto zariadení. Nie synchronizované medzi zariadeniami ani prehliadačmi."
      : "Úložisko prehliadača je nedostupné (napríklad v súkromnom režime). Odpovede sa práve teraz neukladajú a po obnovení stránky zmiznú.";

  return (
    <section className="survey-page">
      <header className="survey-page__head">
        <div className="shell survey-page__head-inner">
          <div className="survey-page__head-main">
            <p className="eyebrow">Prieskum</p>
            <h1 className="survey-page__title">Prieskum otvorených otázok</h1>
            <p className="survey-page__lede">
              Zber odpovedí na otvorené otázky o mieste, kde žijete. Zaznamenávame len odpovede — žiadne mená ani kontaktné údaje.
            </p>
          </div>

          <aside className="survey-brief" aria-label="Prehľad prieskumu">
            <p className="survey-brief__label">Prehľad</p>
            <dl className="survey-brief__list">
              <div className="survey-brief__row">
                <dt>Oblasti</dt>
                <dd>{stats.areas.length}</dd>
              </div>
              <div className="survey-brief__row">
                <dt>Otázky</dt>
                <dd>{SURVEY_QUESTIONS.length}</dd>
              </div>
              <div className="survey-brief__row">
                <dt>Zaznamenané odpovede</dt>
                <dd>{stats.total}</dd>
              </div>
              <div className="survey-brief__row">
                <dt>Ukladanie</dt>
                <dd className="survey-brief__row-note">V tomto prehliadači</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      <div className={`survey-page__notice survey-page__notice--${noticeTone}`} role="status">
        <div className="shell">
          <p>{noticeText}</p>
        </div>
      </div>

      <div className="shell survey-page__body">
        <SurveySummary stats={stats} />

        <div className="survey-page__grid">
          <div className="survey-page__col" ref={formRef}>
            <SurveyForm
              key={editing?.id ?? "new"}
              title={editing ? "Upraviť odpoveď" : "Nová odpoveď"}
              description={
                editing
                  ? "Upravte nesprávne zadané odpovede a uložte zmeny."
                  : "Vyberte oblasť a zadajte odpovede na otázky."
              }
              initial={editing ?? undefined}
              submitLabel={editing ? "Uložiť zmeny" : "Pridať odpoveď"}
              onSubmit={handleSubmit}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </div>

          <div className="survey-page__col">
            <div className="survey-page__toolbar">
              <h2 className="survey-page__subtitle">Záznam odpovedí</h2>
              <div className="survey-page__tools">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => downloadSurveyCsv(responses)}
                  disabled={responses.length === 0}
                >
                  <span className="btn__label">Exportovať CSV</span>
                </button>

                {responses.length > 0 &&
                (confirmClear ? (
                  <span className="survey-page__confirm" role="group" aria-label="Potvrdenie vymazania">
                    <span>Vymazať všetky odpovede?</span>
                    <button
                      type="button"
                      className="survey-action survey-action--danger"
                      onClick={() => {
                        clearAll();
                        setEditing(null);
                        setConfirmClear(false);
                      }}
                    >
                      Vymazať
                    </button>
                    <button
                      type="button"
                      className="survey-action"
                      onClick={() => setConfirmClear(false)}
                    >
                      Zrušiť
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="survey-page__clear"
                    onClick={() => setConfirmClear(true)}
                  >
                    Vymazať všetko
                  </button>
                ))}
              </div>
            </div>

            <SurveyTable
              responses={responses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}