import "./results.css";

type BarChartProps = {
  title: string;
  short: string;
  topSnippet: string | undefined;
  mean: number | null;
  sample: number;
  className?: string;
};

export function BarChart({ title, short, topSnippet, mean, sample, className }: BarChartProps) {
  const hasAnswer = typeof topSnippet === "string" && topSnippet.trim().length > 0;
  const meanLabel = mean !== null && !Number.isNaN(mean) ? mean.toFixed(2) : "—";

  return (
    <article className={`chart-card answer-plate${className ? ` ${className}` : ""}`}>
      <header className="chart-card__head">
        <div>
          <p className="chart-card__eyebrow">{short}</p>
          <h3 className="chart-card__title">{title}</h3>
        </div>
        <p className="chart-card__meta">N = {sample}</p>
      </header>

      {hasAnswer ? (
        <blockquote className="answer-plate__quote">{topSnippet}</blockquote>
      ) : (
        <p className="answer-plate__empty">Zatiaľ neboli zaznamenané žiadne odpovede.</p>
      )}

      <footer className="answer-plate__foot">
        <span className="answer-plate__stat">
          <span className="answer-plate__stat-value">{meanLabel}</span>
          <span className="answer-plate__stat-label">znakov na odpoveď · priemer</span>
        </span>
      </footer>
    </article>
  );
}
