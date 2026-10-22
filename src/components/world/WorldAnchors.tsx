import { worldAnchorIndex, worldAnchors, type WorldAnchor, type WorldAnchorId } from "../../data/world";
import { WorldAnchorGlyph } from "./WorldAnchorGlyph";
import "./WorldAnchors.css";

type WorldAnchorsProps = {
  found: ReadonlySet<WorldAnchorId>;
  active: WorldAnchorId | null;
  onActivate: (anchor: WorldAnchor) => void;
  onPreview: (anchor: WorldAnchor) => void;
  registerButton: (id: WorldAnchorId, node: HTMLButtonElement | null) => void;
};

export function WorldAnchors({
  found,
  active,
  onActivate,
  onPreview,
  registerButton,
}: WorldAnchorsProps) {
  return (
    <div className="world-anchors" role="group" aria-label="Päť tichých úkrytov">
      {worldAnchors.map((anchor, index) => {
        const isFound = found.has(anchor.id);
        const isActive = active === anchor.id;

        return (
          <button
            key={anchor.id}
            ref={(node) => registerButton(anchor.id, node)}
            id={`world-anchor-${anchor.id}`}
            type="button"
            className={`world-anchor world-anchor--${anchor.align}${
              isFound ? " is-found" : ""
            }${isActive ? " is-active" : ""}`}
            style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
            aria-label={`${anchor.name}, ${anchor.place}, ${anchor.region}. Preskúmať úkryt.`}
            aria-pressed={isFound}
            data-anchor={anchor.id}
            onClick={() => onActivate(anchor)}
            onFocus={() => onPreview(anchor)}
          >
            <span className="world-anchor__pulse" aria-hidden="true" />
            <span className="world-anchor__glyph">
              <WorldAnchorGlyph id={anchor.id} />
            </span>
            <span className="world-anchor__label">
              <span className="world-anchor__num">{worldAnchorIndex[index]}</span>
              <span className="world-anchor__text">
                <span className="world-anchor__name">{anchor.name}</span>
                <span className="world-anchor__place">
                  {anchor.region} · {anchor.place}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
