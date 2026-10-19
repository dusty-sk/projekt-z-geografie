import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";
import { usePresentation } from "../presentation/PresentationContext";

export function MidnightProtocol() {
  const { closeEgg } = useEggs();

  return (
    <EggModal
      titleId="egg-midnight-title"
      label="THE MIDNIGHT PROTOCOL · 00:00"
      className="egg-midnight-shell"
      onClose={closeEgg}
    >
      <div className="egg-midnight">
        <p className="egg-midnight__clock" aria-hidden="true">
          00:00
        </p>
        <p className="egg-eyebrow">Nočný protokol · lokálny čas zariadenia</p>
        <h2 id="egg-midnight-title" className="egg-title">
          THE MIDNIGHT PROTOCOL
        </h2>
        <p className="egg-lede">
          Web sa na chvíľu prehol do inej tmy. Ornamenty sú len svietiace línie a
          archív pošepká vetu, ktorú cez deň nehovorí.
        </p>
        <blockquote className="egg-midnight__quote">
          „V tejto minúte nie je Detva bodom na mape. Je to miesto, kde sa mapa
          naučila mlčať.“
        </blockquote>
        <p className="egg-note">
          Téma zostane zapnutá do obnovenia stránky. Protokol sa spúšťa o 00:00 podľa
          lokálneho času zariadenia — alebo cez archív a terminál.
        </p>
      </div>
    </EggModal>
  );
}

type ObserverPhase = "idle" | "visible" | "message";

const OBSERVER_EVENTS = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;

export function SilentObserver() {
  const { active, recordObserver } = useEggs();
  const { active: presenting } = usePresentation();
  const location = useLocation();
  const [phase, setPhase] = useState<ObserverPhase>("idle");

  const override = Number(new URLSearchParams(location.search).get("egg-idle"));
  const idleMs =
    Number.isFinite(override) && override > 0 ? Math.min(override, 3600) * 1000 : 60_000;

  useEffect(() => {
    if (active || presenting) {
      setPhase("idle");
      return;
    }

    let idleTimer = 0;
    let hideTimer = 0;
    let shown = false;
    let finished = false;

    const arm = () => {
      window.clearTimeout(idleTimer);
      if (finished) return;
      idleTimer = window.setTimeout(reveal, idleMs);
    };

    const reveal = () => {
      if (document.hidden) {
        arm();
        return;
      }
      const seen = recordObserver();
      shown = true;
      setPhase(seen >= 2 ? "message" : "visible");
      hideTimer = window.setTimeout(() => {
        shown = false;
        setPhase("idle");
        if (seen >= 2) finished = true;
        else arm();
      }, seen >= 2 ? 9000 : 5000);
    };

    const onMove = () => {
      if (shown) {
        window.clearTimeout(hideTimer);
        shown = false;
        setPhase("idle");
        arm();
        return;
      }
      arm();
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(idleTimer);
        window.clearTimeout(hideTimer);
        shown = false;
        setPhase("idle");
      } else {
        arm();
      }
    };

    for (const name of OBSERVER_EVENTS) {
      window.addEventListener(name, onMove, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);
    arm();

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(hideTimer);
      for (const name of OBSERVER_EVENTS) {
        window.removeEventListener(name, onMove);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, presenting, idleMs, location.pathname, location.search, recordObserver]);

  return (
    <>
      <div
        className={`egg-observer${phase === "visible" ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" focusable="false">
          <circle className="egg-observer__ring" cx="100" cy="100" r="76" />
          <circle className="egg-observer__ring egg-observer__ring--inner" cx="100" cy="100" r="52" />
          <path
            className="egg-observer__eye"
            d="M28 100C58 62 142 62 172 100C142 138 58 138 28 100Z"
          />
          <circle className="egg-observer__pupil" cx="100" cy="100" r="14" />
          <circle className="egg-observer__spark" cx="100" cy="100" r="3" />
        </svg>
      </div>

      {phase === "message" && (
        <div className="egg-observer-message" role="status">
          <span className="egg-observer-message__mark" aria-hidden="true" />
          <p>
            Nezostávaj len pri tomto mieste. Chodba má ešte šesť dverí — niektoré
            sú v mape, iné v čase.
          </p>
          <button
            type="button"
            className="egg-observer-message__close"
            onClick={() => setPhase("idle")}
            aria-label="Zavrieť správu"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
