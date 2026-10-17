import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePresentation } from "./PresentationContext";
import { presentationIndex, presentationSequence } from "./presentation-sequence";

/** True when the event came from a text field, so typing is never hijacked. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/**
 * Global presentation-mode keys.
 *  · P            — enter / leave the demonstration (works while browsing)
 *  · Escape       — leave the demonstration
 *  · → / ←        — next / previous stop (section or location)
 * Arrow up/down, Space and Page keys are left untouched so a page can be
 * scrolled naturally, and the map keeps its own panning keys.
 */
export function usePresentationKeys() {
  const { active, exit, toggle } = usePresentation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const plain = !event.ctrlKey && !event.metaKey && !event.altKey;

      if (plain && event.key.toLowerCase() === "p") {
        if (!isTypingTarget(event.target)) {
          event.preventDefault();
          toggle();
        }
        return;
      }

      if (!active) return;

      if (event.key === "Escape") {
        event.preventDefault();
        exit();
        return;
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (isTypingTarget(event.target)) return;
      // Never fight the map for its arrow keys.
      if (event.target instanceof Element && event.target.closest(".leaflet-container")) return;

      event.preventDefault();
      const index = presentationIndex(pathname);
      const base = index === -1 ? 0 : index;
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = Math.min(Math.max(base + delta, 0), presentationSequence.length - 1);
      const stop = presentationSequence[next];
      if (stop) navigate(stop.to);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, exit, toggle, navigate, pathname]);
}
