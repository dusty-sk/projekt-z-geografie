import { useLocation, useNavigate } from "react-router-dom";
import { site } from "../data/site";
import { SpiralMark } from "../components/Icons";
import { usePresentation } from "./PresentationContext";
import { PresentationTimeline } from "./PresentationTimeline";
import { presentationIndex, presentationSequence } from "./presentation-sequence";
import "./PresentationBar.css";

/**
 * Minimal control surface for the immersive demonstration. Rendered only while
 * the mode is active; the rest of the site chrome is hidden by presentation.css.
 */
export function PresentationBar() {
  const { active, exit, timelineOpen, toggleTimeline } = usePresentation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!active) return null;

  const index = presentationIndex(pathname);
  const total = presentationSequence.length;
  const number = index === -1 ? 1 : index + 1;
  const current = index === -1 ? null : presentationSequence[index];

  const go = (delta: number) => {
    const base = index === -1 ? 0 : index;
    const next = Math.min(Math.max(base + delta, 0), total - 1);
    navigate(presentationSequence[next].to);
  };

  return (
    <>
      <div className="present-vignette" aria-hidden="true" />
      <PresentationTimeline />
      <div className="present-bar" role="region" aria-label="Režim prezentácie">
      <div className="present-bar__brand">
        <span className="present-bar__mark">
          <SpiralMark />
        </span>
        <span className="present-bar__wordmark">{site.name}</span>
      </div>

      <p className="present-bar__now" aria-live="polite">
        <span className="present-bar__now-index">{String(number).padStart(2, "0")}</span>
        <span className="present-bar__now-label">{current?.label ?? "Prezentácia"}</span>
      </p>

      <div className="present-bar__controls">
        <button
          type="button"
          className="present-bar__nav"
          onClick={() => go(-1)}
          disabled={index <= 0}
          aria-label="Predchádzajúca sekcia"
          title="Predchádzajúca (←)"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="present-bar__count">
          {number}
          <span aria-hidden="true">/{total}</span>
        </span>

        <button
          type="button"
          className="present-bar__nav"
          onClick={() => go(1)}
          disabled={index >= total - 1}
          aria-label="Nasledujúca sekcia"
          title="Nasledujúca (→)"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="present-bar__overview"
          onClick={toggleTimeline}
          aria-pressed={timelineOpen}
          aria-label="Prehľad prezentácie"
          title="Prehľad prezentácie (S)"
        >
          <span className="present-bar__overview-label">Prehľad</span>
          <kbd>S</kbd>
        </button>

        <button type="button" className="present-bar__exit" onClick={exit} title="Ukončiť prezentáciu (Esc)">
          <span className="present-bar__exit-label">Ukončiť</span>
          <kbd>Esc</kbd>
        </button>
      </div>

      <div className="present-bar__track" aria-hidden="true">
        <span className="present-bar__fill" style={{ width: `${(number / total) * 100}%` }} />
      </div>
      </div>
    </>
  );
}
