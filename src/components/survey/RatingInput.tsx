import {
  RATING_MAX_LABEL,
  RATING_MIN_LABEL,
  RATING_VALUES,
  type SurveyQuestion,
} from "../../data/survey";

type RatingInputProps = {
  question: SurveyQuestion;
  /** Radio group name — unique per question. */
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
};

export function RatingInput({ question, name, value, onChange, error }: RatingInputProps) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset className={`rating${error ? " rating--invalid" : ""}`} aria-describedby={errorId}>
      <legend className="rating__legend">
        <span className="rating__order">{String(question.order).padStart(2, "0")}</span>
        <span className="rating__label">{question.label}</span>
      </legend>

      <div className="rating__options">
        {RATING_VALUES.map((option) => (
          <label
            key={option}
            className={`rating__option${value === option ? " is-selected" : ""}`}
          >
            <input
              className="rating__radio"
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              aria-invalid={error ? true : undefined}
            />
            <span className="rating__value">{option}</span>
          </label>
        ))}
      </div>

      <div className="rating__scale" aria-hidden="true">
        <span>0 = {RATING_MIN_LABEL}</span>
        <span>5 = {RATING_MAX_LABEL}</span>
      </div>

      {error && (
        <p className="rating__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
