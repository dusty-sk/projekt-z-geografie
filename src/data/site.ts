export const site = {
  name: "OBJAV DETVU",
  shortName: "Detvu",
  tagline: "Detva. Objav ju inak.",
  description:
    "Interaktívny školský projekt o Detve a Podpoľaní — miesta, príbehy, mapa a výsledky prieskumu.",
  school: "Školský geografický projekt",
  credit: "Vytvoril Ondrej Remeselník",
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
      { to: "/svet", label: "Tichý svet" },
    ],
  },
] as const;

export const sourceNotes = [
  "Základné údaje o regióne: Wikipédia (sk), SHMÚ, Štatistický úrad SR.",
  "Fotografie: Wikimedia Commons, licencie CC BY-SA.",
  "Výsledky výskumu projektu označujeme a dopĺňame priebežne.",
] as const;

/** Honest credits: the owner, the AI tools that helped, in plain language. */
export const credits = [
  {
    role: "Tvorca a majiteľ projektu",
    name: "Ondrej Remeselník",
    note: "Návrh projektu, obsah, kontrola zdrojov a zodpovednosť za zverejnené údaje.",
  },
  {
    role: "Vyhladavaťel informácií",
    name: "Jakub Lapin",
    note: "AI model, ktorý vygeneroval pôvodný základ projektu.",
  },
  {
    role: "Žiť.",
    name: "Erik",
    note: "žil.",
  },
] as const;
