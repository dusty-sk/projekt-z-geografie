import type { LocationCategoryId } from "../../data/locations";

/** Initial view: roughly the Detva / Podpoľanie area. */
export const MAP_CENTER: [number, number] = [48.585, 19.44];
export const MAP_ZOOM = 11;

export type TileLayerConfig = {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
  /** Optional separate place-name label overlay (Esri needs one; CARTO does not). */
  labelUrl?: string;
};

/**
 * The CARTO basemap key is read from VITE_CARTO_API_KEY (see .env.example).
 * Without it the site falls back to the keyless Esri dark basemap, so the map
 * always works — the key only changes which provider supplies the tiles.
 */
const CARTO_KEY = (import.meta.env.VITE_CARTO_API_KEY as string | undefined)?.trim();
export const hasCartoKey = Boolean(CARTO_KEY);

export const CARTO_DARK: TileLayerConfig = {
  url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${CARTO_KEY ?? ""}`,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd",
};

export const ESRI_DARK: TileLayerConfig = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  attribution:
    'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
  maxZoom: 16,
  labelUrl:
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
};

export const OSM: TileLayerConfig = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};

export const PRIMARY_TILES: TileLayerConfig = hasCartoKey ? CARTO_DARK : ESRI_DARK;
export const FALLBACK_TILES: TileLayerConfig = hasCartoKey ? ESRI_DARK : OSM;

export type CategoryMarkerStyle = {
  glyph: string;
  /** Accent colour for the marker glyph (teal family, with warm history tone). */
  accent: string;
};

export const categoryMarker: Record<LocationCategoryId, CategoryMarkerStyle> = {
  priroda: { glyph: "▲", accent: "#7fd1a6" },
  kulturne: { glyph: "✦", accent: "#63d3c4" },
  historia: { glyph: "◆", accent: "#e0b566" },
  rekreacia: { glyph: "●", accent: "#9fb6e0" },
};
