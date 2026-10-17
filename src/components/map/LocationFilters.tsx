import { locationCategories, type LocationCategoryId } from "../../data/locations";
import { categoryMarker } from "./mapConfig";
import "./MapControls.css";

export type MapFilter = LocationCategoryId | "all";

type LocationFiltersProps = {
  active: MapFilter;
  total: number;
  visible: number;
  counts: Record<LocationCategoryId, number>;
  onChange: (filter: MapFilter) => void;
};

export function LocationFilters({ active, total, visible, counts, onChange }: LocationFiltersProps) {
  return (
    <div className="map-filters">
      <div className="map-filters__chips" role="group" aria-label="Filtrovať podľa kategórie">
        <button
          type="button"
          className={`map-chip${active === "all" ? " is-active" : ""}`}
          aria-pressed={active === "all"}
          onClick={() => onChange("all")}
        >
          Všetko
          <span className="map-chip__count">{total}</span>
        </button>

        {locationCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`map-chip${active === category.id ? " is-active" : ""}`}
            aria-pressed={active === category.id}
            onClick={() => onChange(category.id)}
            style={{ ["--chip-accent" as string]: categoryMarker[category.id].accent }}
          >
            <span className="map-chip__glyph" aria-hidden="true">
              {categoryMarker[category.id].glyph}
            </span>
            {category.label}
            <span className="map-chip__count">{counts[category.id]}</span>
          </button>
        ))}
      </div>

      <p className="map-filters__status" aria-live="polite">
        Zobrazených <strong>{visible}</strong> z {total} lokalít
      </p>
    </div>
  );
}
