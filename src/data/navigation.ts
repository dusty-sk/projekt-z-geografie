export type NavItem = {
  /** Route path, e.g. "/mapa" */
  readonly to: string;
  /** Slovak label shown in the UI */
  readonly label: string;
  /** Short label used in the compact mobile bar if needed */
  readonly shortLabel?: string;
  /** True when the route is not yet built out and should read as "pripravujeme" */
  readonly staged?: boolean;
};

export const primaryNav: readonly NavItem[] = [
  { to: "/", label: "Domov" },
  { to: "/mapa", label: "Interaktívna mapa" },
  { to: "/miesta", label: "Miesta" },
  { to: "/vyskum", label: "Výskum" },
  { to: "/vysledky-prieskumu", label: "Výsledky prieskumu" },
  { to: "/region", label: "Región" },
  { to: "/regionalny-vyskum", label: "Regionálny výskum" },
  { to: "/o-projekte", label: "O projekte" },
];

/** Order used by the homepage "Ďalej" teaser list. */
export const homepageTeasers: readonly string[] = ["/mapa", "/miesta", "/vyskum", "/region"];
