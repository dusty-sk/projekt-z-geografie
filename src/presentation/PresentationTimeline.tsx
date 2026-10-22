import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePresentation } from "./PresentationContext";
import { presentationIndex, presentationSequence } from "./presentation-sequence";

/**
 * Stop overview for the live demonstration (S): the whole run as a timeline.
 * Every stop in presentation order with the current one highlighted and one
 * click to jump anywhere. ← / → keep working while it is open; Esc (or S)
 * closes it instead of dropping out of the demonstration. Rendered only while
 * the mode is active (see PresentationBar).
 */
export function PresentationTimeline() {
  const { active, timelineOpen, closeTimeline } = usePresentation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active || !timelineOpen) return;
    currentRef.current?.focus({ preventScroll: true });
    currentRef.current?.scrollIntoView({ block: "nearest" });
  }, [active, timelineOpen]);

  if (!active || !timelineOpen) return null;

  const currentIndex = presentationIndex(pathname);

  const go = (to: string) => {
    navigate(to);
    closeTimeline();
  };

  return (
    <>
      <div className="present-overview__scrim" aria-hidden="true" onClick={closeTimeline} />
      <nav className="present-overview" aria-label="Prehľad prezentácie">
        <div className="present-overview__head">
          <p className="present-overview__eyebrow">Prehľad prezentácie</p>
          <p className="present-overview__hint">
            Klikni na časť · <kbd>←</kbd>
            <kbd>→</kbd> listuješ · <kbd>S</kbd> alebo <kbd>Esc</kbd> ho zavrie
          </p>
        </div>

        <ol className="present-overview__list">
          {presentationSequence.map((stop, index) => {
            const isCurrent = index === currentIndex;
            return (
              <li key={stop.to}>
                <button
                  type="button"
                  ref={isCurrent ? currentRef : undefined}
                  className="present-overview__stop"
                  aria-current={isCurrent ? "step" : undefined}
                  onClick={() => go(stop.to)}
                >
                  <span className="present-overview__stop-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="present-overview__stop-label">{stop.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
