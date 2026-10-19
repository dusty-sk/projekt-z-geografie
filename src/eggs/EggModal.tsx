import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

type EggModalProps = {
  titleId: string;
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function EggModal({
  titleId,
  label,
  onClose,
  children,
  className = "",
  wide = false,
}: EggModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const previous =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const autofocus = panel.querySelector<HTMLElement>("[data-egg-autofocus]");
    (autofocus ?? closeRef.current)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus({ preventScroll: true });
    };
  }, [onClose]);

  const onBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className={`egg-scrim ${className}`.trim()} onMouseDown={onBackdrop}>
      <div
        ref={panelRef}
        className={`egg-panel${wide ? " egg-panel--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="egg-panel__bar">
          <span className="egg-panel__signal" aria-hidden="true" />
          <span className="egg-panel__system">{label}</span>
          <button
            ref={closeRef}
            type="button"
            className="egg-close"
            onClick={onClose}
            aria-label="Zavrieť"
          >
            Zavrieť <span aria-hidden="true">×</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
