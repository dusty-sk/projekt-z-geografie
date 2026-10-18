export const site = {
  name: "OBJAV DETVU",
  shortName: "Detvu",
  tagline: "Detva. Objav ju inak.",
  description:
    "Interaktívny geografický výskumný projekt o Detve a Podpoľaní — miesta, príbehy, mapa a výsledky terénneho výskumu.",
  school: "Stredná škola — školský geografický projekt",
  projectType: "Školský geografický výskum v teréne",
  region: "Podpoľanie",
  town: "Detva",
  coordinates: { lat: 48.5514, lon: 19.4183 },
  coordinatesLabel: "48°33′05″ s. š. · 19°25′06″ v. d.",
  currentYear: 2026,
} as const;

export const footerColumns = [
  {
    title: "Projekt",
    links: [
      { to: "/o-projekte", label: "O projekte" },
      { to: "/vyskum", label: "Výskum" },
      { to: "/region", label: "Región" },
    ],
  },
  {
    title: "Preskúmať",
    links: [
      { to: "/mapa", label: "Interaktívna mapa" },
      { to: "/miesta", label: "Miesta" },
    ],
  },
] as const;

export const sourceNotes = [
  "Základné údaje o regióne: Wikipédia (sk), SHMÚ, Štatistický úrad SR.",
  "Fotografie: Wikimedia Commons, licencie CC BY-SA.",
  "Výsledky terénneho výskumu projektu sú označené a dopĺňané priebežne.",
] as const;
