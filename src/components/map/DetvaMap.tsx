import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as LeafletNS from "leaflet";
import { categoryById, type Location } from "../../data/locations";
import { secretLocation } from "../../data/secretLocation";
import {
  MAP_CENTER,
  MAP_ZOOM,
  PRIMARY_TILES,
  FALLBACK_TILES,
  type TileLayerConfig,
  categoryMarker,
} from "./mapConfig";
import "./DetvaMap.css";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPopup(location: Location): string {
  const category = categoryById(location.categories[0]);
  const scope = location.scope.withinDetva
    ? location.scope.municipality
    : `${location.scope.municipality} (mimo Detvy)`;
  return `
    <div class="map-popup">
      <p class="map-popup__group">${escapeHtml(category.label)} · ${escapeHtml(scope)}</p>
      <p class="map-popup__title">${escapeHtml(location.name)}</p>
      <p class="map-popup__summary">${escapeHtml(location.summary)}</p>
      <a class="map-popup__link" data-location-id="${escapeHtml(location.id)}" href="/miesta/${escapeHtml(location.id)}">Otvoriť profil</a>
    </div>`;
}

type MappableLocation = Location & { coords: { lat: number; lon: number } };

/** Only locations with usable coordinates can be drawn or fitted on the map. */
function mappableLocations(locations: readonly Location[]): MappableLocation[] {
  return locations.filter(
    (location): location is MappableLocation =>
      Boolean(location.coords) &&
      Number.isFinite(location.coords?.lat) &&
      Number.isFinite(location.coords?.lon),
  );
}

type DetvaMapProps = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onSecret: () => void;
};

/**
 * Leaflet map. Leaflet itself is loaded with a dynamic import inside an effect
 * so it never runs during SSR; the component renders a styled frame until then.
 */
export function DetvaMap({
  locations,
  selectedId,
  onSelect,
  onOpen,
  onSecret,
}: DetvaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<typeof LeafletNS | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const layerRef = useRef<LeafletNS.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, LeafletNS.Marker>>(new Map());
  const didFitRef = useRef(false);
  const reducedRef = useRef(false);
  const secretTimer = useRef(0);

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const onSecretRef = useRef(onSecret);
  onSecretRef.current = onSecret;

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [instance, setInstance] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  // ---- Create the map once (per retry) ----
  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    if (!el) return;

    setStatus("loading");
    didFitRef.current = false;

    (async () => {
      const mod = await import("leaflet");
      if (disposed) return;
      const L = ((mod as unknown as { default?: typeof LeafletNS }).default ?? mod) as typeof LeafletNS;
      leafletRef.current = L;
      reducedRef.current =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const map = L.map(el, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
        worldCopyJump: false,
      });
      mapRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ position: "bottomleft", imperial: false, maxWidth: 120 }).addTo(map);

      let firstTile = false;
      let errors = 0;
      const markReady = () => {
        if (!firstTile) {
          firstTile = true;
          if (!disposed) setStatus("ready");
        }
      };

      const makeLayer = (config: TileLayerConfig) => {
        const layer = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: config.maxZoom,
          ...(config.subdomains ? { subdomains: config.subdomains } : {}),
        });
        const labels = config.labelUrl ? L.tileLayer(config.labelUrl, { maxZoom: config.maxZoom }) : null;
        return { layer, labels };
      };

      const fallback = makeLayer(FALLBACK_TILES);
      fallback.layer.on("tileload", markReady);
      fallback.layer.on("tileerror", () => {
        if (!firstTile && !disposed) setStatus("error");
      });

      const primary = makeLayer(PRIMARY_TILES);
      let swapped = false;
      primary.layer.on("tileload", markReady);
      primary.layer.on("tileerror", () => {
        errors += 1;
        if (!firstTile && errors > 3 && !swapped) {
          swapped = true;
          map.removeLayer(primary.layer);
          if (primary.labels) map.removeLayer(primary.labels);
          fallback.layer.addTo(map).bringToBack();
          if (fallback.labels) fallback.labels.addTo(map);
        }
      });
      primary.layer.addTo(map);
      if (primary.labels) primary.labels.addTo(map);

      const layer = L.layerGroup().addTo(map);
      layerRef.current = layer;
      setInstance((n) => n + 1);

      // SPA navigation for popup links.
      map.getContainer().addEventListener("click", (ev) => {
        const target = (ev.target as HTMLElement).closest("[data-location-id]");
        if (target) {
          ev.preventDefault();
          onOpenRef.current(target.getAttribute("data-location-id") as string);
        }
      });

      window.setTimeout(() => {
        if (!firstTile && mapRef.current === map && !disposed) setStatus("error");
      }, 8000);

      map.whenReady(() => {
        if (!disposed) map.invalidateSize();
      });
    })();

    return () => {
      disposed = true;
      window.clearTimeout(secretTimer.current);
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      leafletRef.current = null;
    };
  }, [retryKey]);

  // ---- Build markers whenever the visible set or selection changes ----
  useEffect(() => {
    const L = leafletRef.current;
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!L || !layer || !map) return;

    layer.clearLayers();
    markersRef.current.clear();

    const mappable = mappableLocations(locations);

    mappable.forEach((location, index) => {
      const category = categoryById(location.categories[0]);
      const style = categoryMarker[category.id];
      const selected = location.id === selectedId;
      const delay = Math.min(index, 12) * 45;

      const icon = L.divIcon({
        className: "map-marker-wrap",
        html: `<span class="map-marker map-marker--${category.id}${selected ? " is-selected" : ""}" style="--marker-accent:${style.accent};animation-delay:${delay}ms">
            <span class="map-marker__glyph" aria-hidden="true">${style.glyph}</span>
          </span>`,
        iconSize: [32, 40],
        iconAnchor: [16, 38],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([location.coords.lat, location.coords.lon], {
        icon,
        title: location.name,
        alt: location.name,
        keyboard: true,
        riseOnHover: true,
      });
      marker.bindPopup(buildPopup(location), {
        className: "map-popup-shell",
        maxWidth: 320,
        autoPanPadding: [40, 40],
      });
      marker.on("click", () => onSelectRef.current(location.id));
      marker.addTo(layer);
      markersRef.current.set(location.id, marker);
    });

    // The eleventh point: intentionally quiet, outside the catalogue, and
    // never part of the ten counted markers or the fitted bounds.
    const secretIcon = L.divIcon({
      className: "egg-secret-marker-wrap",
      html: `<span class="egg-secret-marker"><span class="egg-secret-marker__ring"></span><span class="egg-secret-marker__dot"></span></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    const secret = L.marker(
      [secretLocation.coords.lat, secretLocation.coords.lon],
      {
        icon: secretIcon,
        title: "Neznámy bod",
        alt: "Neznámy bod",
        keyboard: true,
        riseOnHover: true,
      },
    );
    secret.on("click", () => {
      map.flyTo(
        [secretLocation.coords.lat, secretLocation.coords.lon],
        Math.max(map.getZoom(), 13),
        { animate: !reducedRef.current, duration: 0.8 },
      );
      window.clearTimeout(secretTimer.current);
      secretTimer.current = window.setTimeout(
        () => onSecretRef.current(),
        reducedRef.current ? 0 : 700,
      );
    });
    secret.addTo(layer);

    if (!didFitRef.current && mappable.length > 1) {
      didFitRef.current = true;
      map.fitBounds(
        L.latLngBounds(mappable.map((l) => [l.coords.lat, l.coords.lon])).pad(0.25),
        { animate: false },
      );
    }
  }, [locations, selectedId, instance]);

  // ---- Focus the selected marker ----
  useEffect(() => {
    const map = mapRef.current;
    const marker = selectedId ? markersRef.current.get(selectedId) : undefined;
    if (!map || !marker) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 13), {
      animate: !reducedRef.current,
      duration: 0.6,
    });
    marker.openPopup();
  }, [selectedId, instance]);

  const resetView = () => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const mappable = mappableLocations(locations);
    if (mappable.length > 1) {
      map.flyToBounds(
        L.latLngBounds(mappable.map((l) => [l.coords.lat, l.coords.lon])).pad(0.25),
        { animate: !reducedRef.current, maxZoom: 13 },
      );
    } else {
      map.setView(MAP_CENTER, MAP_ZOOM, { animate: !reducedRef.current });
    }
  };

  return (
    <div className="map-frame">
      <div
        ref={containerRef}
        className="map-frame__canvas"
        role="region"
        aria-label="Interaktívna mapa lokalít Podpoľania"
      />

      {status === "loading" && (
        <div className="map-overlay map-overlay--loading" aria-live="polite">
          <span className="map-spinner" aria-hidden="true" />
          <p>Načítavam mapové podklady…</p>
        </div>
      )}

      {status === "error" && (
        <div className="map-overlay map-overlay--error" role="alert">
          <p className="map-overlay__title">Mapové podklady sa nepodarilo načítať</p>
          <p className="map-overlay__text">
            Skontroluj pripojenie na internet alebo to skús znova. Zoznam lokalít vľavo funguje aj bez mapy.
          </p>
          <button type="button" className="map-overlay__button" onClick={() => setRetryKey((k) => k + 1)}>
            Skúsiť znova
          </button>
        </div>
      )}

      <button type="button" className="map-reset" onClick={resetView}>
        Obnoviť výhľad
      </button>
    </div>
  );
}
