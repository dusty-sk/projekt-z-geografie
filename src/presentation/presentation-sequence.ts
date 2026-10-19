import { locations } from "../data/locations";

export type PresentationStop = {
  /** Real route path, e.g. "/miesta/polana". */
  readonly to: string;
  /** Slovak label shown in the presentation bar. */
  readonly label: string;
};

/**
 * Curated live-demo order. It mirrors the real routes and the real location
 * order — nothing here is invented. Arrow keys walk the project the way it is
 * actually structured: home → map → catalogue → each location → research →
 * results → region → regional research → about.
 *
 * Note: /prieskum is intentionally omitted — it stays reachable by direct URL
 * but is not part of the guided presentation.
 */
export const presentationSequence: readonly PresentationStop[] = [
  { to: "/", label: "Domov" },
  { to: "/mapa", label: "Interaktívna mapa" },
  { to: "/miesta", label: "Miesta" },
  ...locations.map((location) => ({
    to: `/miesta/${location.id}`,
    label: location.name,
  })),
  { to: "/vyskum", label: "Výskum" },
  { to: "/vysledky-prieskumu", label: "Výsledky prieskumu" },
  { to: "/region", label: "Región" },
  { to: "/regionalny-vyskum", label: "Regionálny výskum" },
  { to: "/o-projekte", label: "O projekte" },
];

/** Index of `pathname` in the sequence, or -1 when the route is not a stop. */
export function presentationIndex(pathname: string): number {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return presentationSequence.findIndex((stop) => stop.to === clean);
}
