import { BarChart } from "./BarChart";
import { Comparison } from "./Comparison";
import {
  SURVEY_QUESTIONS,
  statsForFilter,
  type SurveyArea,
  type SurveyStats,
} from "../../data/survey";
import "./results.css";

type ResultsProps = {
  filter: "all" | SurveyArea;
  stats: SurveyStats;
};

export function ResultsGrid({ filter, stats }: ResultsProps) {
  const base = statsForFilter(stats, filter);
  const sample = base.count;

  return (
    <div className="results-grid">
      {SURVEY_QUESTIONS.map((q, idx) => {
        const qs = base.questions[idx] ?? stats.overall.questions[idx];
        return (
          <BarChart
            key={q.id}
            title={q.label}
            short={q.short}
            topSnippet={qs.topSnippet}
            mean={qs.mean}
            sample={sample}
          />
        );
      })}
      <Comparison filter={filter} stats={stats} />
    </div>
  );
}