import { useCallback, useRef, useState } from "react";
import { Button } from "../components/Button";
import { usePrefersReducedMotion } from "../components/Reveal";
import { WorldAnchors } from "../components/world/WorldAnchors";
import { WorldScene } from "../components/world/WorldScene";
import { useWorldClock } from "../components/world/useWorldClock";
import {
  worldAnchorIndex,
  worldAnchors,
  worldAtlasCopy,
  type WorldAnchor,
  type WorldAnchorId,
} from "../data/world";
import { site } from "../data/site";
import "./WorldPage.css";

function LightIcon({ isNight }: { isNight: boolean }) {
  if (isNight) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M17.8 15.4A7.2 7.2 0 0 1 8.6 6.2 7.2 7.2 0 1 0 17.8 15.4Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 3.2V5 M12 19V20.8 M3.2 12H5 M19 12H20.8 M5.8 5.8L7.1 7.1 M16.9 16.9L18.2 18.2 M18.2 5.8L16.9 7.1 M7.1 16.9L5.8 18.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorldPage() {
  const clock = useWorldClock();
  const reduced = usePrefersReducedMotion();
  const [found, setFound] = useState<Set<WorldAnchorId>>(() => new Set());
  const [activeId, setActiveId] = useState<WorldAnchorId | null>(null);
  const buttons = useRef(new Map<WorldAnchorId, HTMLButtonElement>());

  const activeAnchor = worldAnchors.find((anchor) => anchor.id === activeId) ?? null;
  const activeIndex = activeAnchor ? worldAnchors.findIndex((anchor) => anchor.id === activeAnchor.id) : -1;

  const registerButton = useCallback((id: WorldAnchorId, node: HTMLButtonElement | null) => {
    if (node) buttons.current.set(id, node);
    else buttons.current.delete(id);
  }, []);

  const preview = useCallback((anchor: WorldAnchor) => {
    setActiveId(anchor.id);
  }, []);

  const activate = useCallback((anchor: WorldAnchor) => {
    setActiveId(anchor.id);
    setFound((current) => {
      if (current.has(anchor.id)) return current;
      const next = new Set(current);
      next.add(anchor.id);
      return next;
    });
  }, []);

  const goToAnchor = (anchor: WorldAnchor) => {
    setActiveId(anchor.id);
    const node = buttons.current.get(anchor.id);
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const foundIds = Array.from(found).join(" ");

  return (
    <div className="world-page">
      <header className="world-page__intro shell">
        <div className="world-page__intro-main">
          <p className="eyebrow">Tichý svet · Krajina v premene svetla</p>
          <h1 className="world-page__title">
            Krajina, ktorá si <em>pamätá.</em>
          </h1>
        </div>
        <div className="world-page__intro-side">
          <p className="lede">
            Päť miest medzi vrcholmi, vodou a drevom. S každou hodinou sa mení svetlo — a s ním aj to,
            čo je vidieť. Rozhliadni sa. Úkryty sú bližšie, než sa zdá.
          </p>
          <p className="world-page__time-note">
            Krajina sa riadi tvojím miestnym časom. V noci je iná, ale jej úkryty zostávajú otvorené
            vždy.
          </p>
          <p className="world-page__coord coord">{site.coordinatesLabel}</p>
        </div>
      </header>

      <section
        className={`world world--${clock.phase}`}
        aria-labelledby="world-title"
        data-phase={clock.phase}
      >
        <h2 id="world-title" className="sr-only">
          Tichý svet Podpoľania
        </h2>

        <div
          className="world__stage"
          id="world-stage"
          data-found={foundIds}
          data-active={activeId ?? undefined}
        >
          <WorldScene />

          <div className="world__hud">
            <p className="world__light">
              <span className="world__light-icon">
                <LightIcon isNight={clock.isNight} />
              </span>
              <span>{clock.label}</span>
              <span className="world__light-dot" aria-hidden="true">
                ·
              </span>
              <span>{clock.time}</span>
            </p>

            <p className="world__found" aria-label={`Objavené ${found.size} z 5`}>
              <span className="world__found-label">Objavené</span>
              <span className="world__ticks" aria-hidden="true">
                {worldAnchors.map((anchor) => (
                  <span key={anchor.id} className={found.has(anchor.id) ? "is-on" : undefined} />
                ))}
              </span>
              <span className="world__found-value">{found.size}/5</span>
            </p>
          </div>

          <WorldAnchors
            found={found}
            active={activeId}
            onActivate={activate}
            onPreview={preview}
            registerButton={registerButton}
          />

          <div className="world__caption" id="world-caption" aria-live="polite" aria-atomic="true">
            <p className="world__caption-kicker">
              {activeAnchor && activeIndex >= 0 ? (
                <>
                  <span>{worldAnchorIndex[activeIndex]}</span>
                  <span>Úkryt · {activeAnchor.region}</span>
                </>
              ) : (
                <>
                  <span>I—V</span>
                  <span>Päť tichých miest</span>
                </>
              )}
            </p>

            <h3 className="world__caption-title">
              {activeAnchor ? activeAnchor.name : "Krajina čaká."}
            </h3>

            {activeAnchor ? (
              <>
                <p className="world__caption-place">{activeAnchor.place}</p>
                <p className="world__caption-text">{activeAnchor.clue}</p>
                <p
                  className={`world__caption-status${found.has(activeAnchor.id) ? " is-found" : ""}`}
                >
                  {found.has(activeAnchor.id)
                    ? "Objavené"
                    : "Ešte neobjavené — klikni, dotkni sa alebo stlač Enter."}
                </p>
              </>
            ) : (
              <p className="world__caption-text">
                Pohyb sa po krajine, dotkni sa svetelného bodu alebo použi Tab a Enter. Každé miesto
                sa ozve inak.
              </p>
            )}
          </div>

          <p id="world-anchor-help" className="sr-only">
            Päť úkrytov. Pomocou klávesu Tab prejdi medzi nimi. Enter alebo medzerník označí úkryt
            ako objavený.
          </p>
        </div>
      </section>

      <section className="world-page__atlas shell" aria-labelledby="world-atlas-title">
        <div className="world-page__atlas-head">
          <div>
            <p className="eyebrow">{worldAtlasCopy.eyebrow}</p>
            <h2 className="world-page__atlas-title" id="world-atlas-title">
              {worldAtlasCopy.title}
            </h2>
          </div>
          <p className="lede">{worldAtlasCopy.lede}</p>
        </div>

        <ol className="world-index">
          {worldAnchors.map((anchor, index) => {
            const isFound = found.has(anchor.id);
            return (
              <li key={anchor.id} className={isFound ? "is-found" : undefined}>
                <button
                  type="button"
                  className="world-index__button"
                  aria-label={`Prejsť k úkrytu ${anchor.name} v lokalite ${anchor.region}.`}
                  onClick={() => goToAnchor(anchor)}
                >
                  <span className="world-index__num">{worldAnchorIndex[index]}</span>
                  <span className="world-index__place">
                    {anchor.region}
                    <span>{anchor.place}</span>
                  </span>
                  <span className="world-index__name">{anchor.name}</span>
                  <span className="world-index__status">{isFound ? "objavené" : "ticho"}</span>
                  <span className="world-index__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="world-page__atlas-foot">
          <p>{worldAtlasCopy.disclaimer}</p>
          <Button to="/mapa" variant="ghost">
            Skutočná mapa Podpoľania
          </Button>
        </div>
      </section>
    </div>
  );
}
