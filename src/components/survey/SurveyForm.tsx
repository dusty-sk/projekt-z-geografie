import { useRef, useState, type FormEvent } from "react";
import { RatingInput } from "./RatingInput";
import {
  SURVEY_AREAS,
  SURVEY_QUESTIONS,
  type SurveyArea,
  type SurveyQuestionId,
  type SurveyResponse,
  type SurveyResponseInput,
  type SurveyValidationErrors,
  type SurveyWriteResult,
} from "../../data/survey";
import "./survey.css";

type Draft = {
  area: SurveyArea | "";
  ratings: Record<SurveyQuestionId, number | null>;
  date: string;
  code: string;
};

function draftFromResponse(response?: SurveyResponse): Draft {
  return {
    area: response?.area ?? "",
    ratings: {
      q1: response?.ratings.q1 ?? null,
      q2: response?.ratings.q2 ?? null,
      q3: response?.ratings.q3 ?? null,
      q4: response?.ratings.q4 ?? null,
    },
    date: response?.date ?? "",
    code: response?.code ?? "",
  };
}

type SurveyFormProps = {
  title: string;
  description?: string;
  /** Provided in edit mode; absent when adding a new response. */
  initial?: SurveyResponse;
  submitLabel: string;
  onSubmit: (input: SurveyResponseInput) => SurveyWriteResult;
  onSaved?: (id: string) => void;
  onCancel?: () => void;
};

export function SurveyForm({
  title,
  description,
  initial,
  submitLabel,
  onSubmit,
  onSaved,
  onCancel,
}: SurveyFormProps) {
  const [draft, setDraft] = useState<Draft>(() => draftFromResponse(initial));
  const [errors, setErrors] = useState<SurveyValidationErrors>({});
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const setRating = (id: SurveyQuestionId, value: number) => {
    setDraft((prev) => ({ ...prev, ratings: { ...prev.ratings, [id]: value } }));
    setErrors((prev) => {
      if (!prev.ratings?.[id]) return prev;
      const nextRatings = { ...prev.ratings };
      delete nextRatings[id];
      return { ...prev, ratings: nextRatings };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);

    const result = onSubmit({
      area: draft.area,
      ratings: draft.ratings,
      date: draft.date.trim() || undefined,
      code: draft.code.trim() || undefined,
    });

    if (!result.ok) {
      setErrors(result.errors);
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setErrors({});
    onSaved?.(result.id);
    if (!initial) {
      setDraft(draftFromResponse());
      setSaved(true);
    }
  };

  const handleReset = () => {
    setDraft(draftFromResponse(initial));
    setErrors({});
    setSaved(false);
  };

  return (
    <form className="survey-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="survey-form__head">
        <h2 className="survey-form__title">{title}</h2>
        {description && <p className="survey-form__desc">{description}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="survey-area">
          Oblasť prieskumu
        </label>
        <select
          id="survey-area"
          className={`field__control${errors.area ? " is-invalid" : ""}`}
          value={draft.area}
          aria-invalid={errors.area ? true : undefined}
          onChange={(event) => {
            setDraft((prev) => ({ ...prev, area: event.target.value as SurveyArea | "" }));
            setErrors((prev) => ({ ...prev, area: undefined }));
          }}
        >
          <option value="">— Vyberte oblasť —</option>
          {SURVEY_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors.area && (
          <p className="field__error" role="alert">
            {errors.area}
          </p>
        )}
      </div>

      <div className="survey-form__ratings">
        {SURVEY_QUESTIONS.map((question) => (
          <RatingInput
            key={question.id}
            question={question}
            name={`rating-${question.id}`}
            value={draft.ratings[question.id]}
            onChange={(value) => setRating(question.id, value)}
            error={errors.ratings?.[question.id]}
          />
        ))}
      </div>

      <div className="survey-form__meta">
        <div className="field">
          <label className="field__label" htmlFor="survey-date">
            Dátum (nepovinné)
          </label>
          <input
            id="survey-date"
            type="date"
            className={`field__control${errors.date ? " is-invalid" : ""}`}
            value={draft.date}
            aria-invalid={errors.date ? true : undefined}
            onChange={(event) => {
              setDraft((prev) => ({ ...prev, date: event.target.value }));
              setErrors((prev) => ({ ...prev, date: undefined }));
            }}
          />
          {errors.date && (
            <p className="field__error" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="survey-code">
            Anonymný kód respondenta (nepovinné)
          </label>
          <input
            id="survey-code"
            type="text"
            maxLength={40}
            className={`field__control${errors.code ? " is-invalid" : ""}`}
            value={draft.code}
            aria-invalid={errors.code ? true : undefined}
            placeholder="napr. A-01"
            onChange={(event) => {
              setDraft((prev) => ({ ...prev, code: event.target.value }));
              setErrors((prev) => ({ ...prev, code: undefined }));
            }}
          />
          {errors.code && (
            <p className="field__error" role="alert">
              {errors.code}
            </p>
          )}
        </div>
      </div>

      <div className="survey-form__actions">
        <button type="submit" className="btn btn--primary">
          <span className="btn__label">{submitLabel}</span>
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            <span className="btn__label">Zrušiť úpravu</span>
          </button>
        )}
        <button type="button" className="survey-form__reset" onClick={handleReset}>
          Vyčistiť formulár
        </button>
      </div>

      <p className="survey-form__privacy">
        Nezberáme mená ani kontaktné údaje. Zaznamenávame len oblasť, štyri hodnotenia a voliteľný
        anonymný kód.
      </p>
      {saved && (
        <p className="survey-form__saved" role="status">
          Odpoveď bola uložená.
        </p>
      )}
    </form>
  );
}
