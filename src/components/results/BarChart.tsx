import type { CSSProperties } from "react";
import { pctFromDist, maxMin, sumDist } from "../../utils/stats";
import "./results.css";

type BarChartProps = {
  title: string;
  short: string;
  distribution: number[]; // 0..5
  mean: number | null;
  sample: number;
  className?: string;
};

export function BarChart({
  title,
  short,
  distribution,
  mean,
  sample,
  className,
}: BarChartProps) {
  const n = sumDist(distribution);
  const pct = pctFromDist(distribution);
  const mm = maxMin(distribution);
  const values = Array.from({ length: 6 }, (_, r) => r);

  return (
    <article className={`chart-card${className ? ` ${className}` : ""}`}>
      <header className="chart-card__head">
        <div>
          <p className="chart-card__eyebrow">{short}</p>
          <h3 className="chart-card__title">{title}</h3>
        </div>
        <p className="chart-card__meta">
          N = {sample} · Priemer = {mean === null ? "—" : mean.toFixed(2)} ·
          Škála 0–5
        </p>
      </header>

      {n === 0 ? (
        <p className="chart-card__empty">
          Pre túto otázku zatiaľ nie sú dostupné žiadne odpovede.
        </p>
      ) : (
        <>
          <div className="chart-card__bars" role="group" aria-label={`Distribúcia hodnotení pre ${title}`}>
            {values.map((r) => {
              const c = distribution[r] || 0;
              const p = pct[r] || 0;
              const label = `${r} = ${c} odpovedí (${(p * 100).toFixed(0)} %)`;
              return (
                <div
                  key={r}
                  className="chart-bar"
                  title={label}
                  aria-label={label}
                  style={{ "--bar-index": r } as CSSProperties}
                >
                  <span className="chart-bar__label">{r}</span>
                  <div className="chart-bar__track">
                    <div
                      className="chart-bar__fill"
                      style={{ height: `${Math.max(4, p * 100)}%` }}
                    />
                  </div>
                  <span className="chart-bar__count">{c}</span>
                </div>
              );
            })}
          </div>

          <ul className="chart-card__stats">
            <li>Rozdelenie: {values.map(r => `${r}:${distribution[r]||0}`).join(", ")}</li>
            <li>Percentuálne: {values.map(r => `${r}: ${((pct[r]||0)*100).toFixed(0)}%`).join(", ")}</li>
            <li>Najnižšie pozorované: {mm.min ?? "—"}</li>
            <li>Najvyššie pozorované: {mm.max ?? "—"}</li>
          </ul>
        </>
      )}
    </article>
  );
}
