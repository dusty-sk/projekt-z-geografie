import { Link } from "react-router-dom";
import { categoryById, type Location } from "../../data/locations";
import { categoryMarker } from "./mapConfig";
import "./MapControls.css";

type LocationListProps = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LocationList({ locations, selectedId, onSelect }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="maplist maplist--empty">
        <p>Pre túto kategóriu tu nie je žiadna lokalita.</p>
      </div>
    );
  }

  return (
    <ol className="maplist">
      {locations.map((location, index) => {
        const category = categoryById(location.categories[0]);
        const selected = location.id === selectedId;
        const scope = location.scope.withinDetva
          ? location.scope.municipality
          : `${location.scope.municipality} · mimo Detvy`;

        return (
          <li
            key={location.id}
            className={`maplist__item${selected ? " is-selected" : ""}`}
            style={{ ["--accent" as string]: categoryMarker[category.id].accent }}
          >
            <button
              type="button"
              className="maplist__row"
              aria-pressed={selected}
              onClick={() => onSelect(location.id)}
            >
              <span className="maplist__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="maplist__body">
                <span className="maplist__meta">
                  <span className="maplist__dot" aria-hidden="true" />
                  {category.label} · {scope}
                </span>
                <span className="maplist__name">{location.name}</span>
                <span className="maplist__summary">{location.summary}</span>
              </span>
            </button>

            <Link className="maplist__open" to={`/miesta/${location.id}`}>
              Profil
              <span className="maplist__arrow" aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
