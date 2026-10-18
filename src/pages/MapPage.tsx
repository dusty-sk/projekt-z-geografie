import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DetvaMap } from "../components/map/DetvaMap";
import { LocationList } from "../components/map/LocationList";
import { LocationFilters, type MapFilter } from "../components/map/LocationFilters";
import { locations, locationCategories, type LocationCategoryId } from "../data/locations";
import "./MapPage.css";

const FILTERS = new Set<string>(["all", "priroda", "kulturne", "historia", "rekreacia"]);

function normalizeFilter(value: string | null): MapFilter {
  return value && FILTERS.has(value) ? (value as MapFilter) : "all";
}

export function MapPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Map state is kept in the URL so a filtered/selected view can be shared
  // and so deep links (e.g. /mapa?lokalita=polana) work.
  const filter = normalizeFilter(searchParams.get("kategoria"));
  const selectedId = searchParams.get("lokalita");

  const update = useCallback(
    (next: { kategoria?: MapFilter | null; lokalita?: string | null }) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(next)) {
            if (value === null) params.delete(key);
            else params.set(key, value);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (next: MapFilter) => update({ kategoria: next === "all" ? null : next, lokalita: null }),
    [update],
  );
  const setSelectedId = useCallback((id: string) => update({ lokalita: id }), [update]);

  const visible = useMemo(
    () => (filter === "all" ? [...locations] : locations.filter((l) => l.categories.includes(filter))),
    [filter],
  );

  const counts = useMemo(() => {
    const base = Object.fromEntries(
      locationCategories.map((c) => [c.id, 0]),
    ) as Record<LocationCategoryId, number>;
    for (const location of locations) {
      for (const category of location.categories) base[category] += 1;
    }
    return base;
  }, []);

  useEffect(() => {
    if (selectedId && !visible.some((l) => l.id === selectedId)) update({ lokalita: null });
  }, [selectedId, visible, update]);

  const handleOpen = useCallback((id: string) => navigate(`/miesta/${id}`), [navigate]);

  return (
    <section className="map-page">
      <header className="map-page__head">
        <span className="terrain terrain--head" aria-hidden="true" />
        <div className="shell">
          <p className="eyebrow">Interaktívna mapa</p>
          <h1 className="map-page__title">Mapa miest Podpoľania</h1>
          <p className="map-page__lede">
            Desať lokalít okresu Detva a okolia — prírodné, kultúrne aj historické. Kliknite na značku
            alebo v zozname; každé miesto má vlastný profil. Keďže nie všetky lokality ležia priamo v
            Detve, pri každej uvádzame obec a okres.
          </p>
        </div>
      </header>

      <div className="map-page__filters">
        <div className="shell">
          <LocationFilters
            active={filter}
            total={locations.length}
            visible={visible.length}
            counts={counts}
            onChange={setFilter}
          />
        </div>
      </div>

      <div className="map-page__body">
        <aside className="map-page__list" aria-label="Zoznam zobrazených lokalít">
          <LocationList locations={visible} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
        <div className="map-page__map">
          <DetvaMap
            locations={visible}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpen={handleOpen}
          />
        </div>
      </div>
    </section>
  );
}
