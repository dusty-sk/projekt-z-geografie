export type Hero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  image: { slug: string; alt: string };
  caption: string;
  scrollHint: string;
};

export type IntroBlock = {
  eyebrow: string;
  title: string;
  body: string[];
  secondary: string[];
};

export type Teaser = {
  index: string;
  to: string;
  label: string;
  title: string;
  description: string;
  image: { slug: string; alt: string };
};

export type PanoramaBand = {
  image: { slug: string; alt: string };
  eyebrow: string;
  quote: string;
  attribution: string;
};

export type ClosingCta = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
};

export const hero: Hero = {
  eyebrow: "Podpoľanie · Stredné Slovensko",
  title: "Detva. Objav ju inak.",
  subtitle:
    "Objav miesta, príbehy a názory ľudí, ktoré tvoria charakter Detvy a Podpoľania.",
  primaryCta: { label: "Preskúmať mapu", to: "/mapa" },
  secondaryCta: { label: "Výsledky výskumu", to: "/vyskum" },
  image: {
    slug: "detva-kalamar.jpg",
    alt: "Pohľad na mesto Detva z vrchu Kaľamárka, v pozadí masív Poľany",
  },
  caption: "Detva z Kaľamárky · foto Miroslav Blaho, CC BY-SA 3.0",
  scrollHint: "Skrolujte",
};

export const intro: IntroBlock = {
  eyebrow: "01 — Región",
  title: "Podhorie, ktoré vyrástlo z vulkánu a drevorubačských lazy",
  body: [
    "Detva leží v údolí Detvianskeho potoka na južnom okraji Poľany — najvyššieho sopečného pohoria na Slovensku. Krajina okolo mesta je silne erodovaným stratovulkánom s kalderou takmer šesť kilometrov širokou.",
    "Región Podpoľanie je typickou podhorskou oblasťou s rozptýleným lazníckym osídlením, ktoré je svojou štruktúrou špecifické aj v rámci Slovenska. Administratívnym centrom regiónu je práve Detva.",
  ],
  secondary: [
    "Tento projekt skúma, ako sa geografické podmienky prejavujú v každodennom živote miestnych ľudí — v krajine, práci, kultúre aj rozhodovaní.",
  ],
};

export const teasers: readonly Teaser[] = [
  {
    index: "01",
    to: "/mapa",
    label: "Interaktívna mapa",
    title: "Krajina v súvislostiach",
    description:
      "Prehliadajte si Detvu a Podpoľanie na vrstvenej mape — sídla, reliéf, vodné toky a miesta z terénneho výskumu na jednom mieste.",
    image: { slug: "detva-old-part.jpg", alt: "Panoráma starej časti Detvy" },
  },
  {
    index: "02",
    to: "/miesta",
    label: "Miesta",
    title: "Lokality, ktoré stoja za zastavenie",
    description:
      "Výber miest regiónu — od amfiteátra a kúpeľov po vrcholy a rozhľadne — s popisom, fotografiami a kontextom.",
    image: { slug: "detvianska-huta.jpg", alt: "Obec Detvianska Huta" },
  },
  {
    index: "03",
    to: "/vyskum",
    label: "Výskum",
    title: "Čo sme sa v teréne pýtali",
    description:
      "Návrh výskumu, metodika, otázky a priebežné výsledky. Bez prikrášľania — každý údaj má uvedený zdroj a spôsob získania.",
    image: { slug: "detviansky-potok.jpg", alt: "Detviansky potok v Novej Detve" },
  },
  {
    index: "04",
    to: "/region",
    label: "Región",
    title: "Poľana, ochrana prírody a dedičstvo",
    description:
      "Geomorfológia, chránené územia UNESCO, história od praveku po strojárne a kultúra, ktorá región drží pokope.",
    image: { slug: "polana-skliarovo.jpg", alt: "Poľana a Skliarovo" },
  },
];

export const panorama: PanoramaBand = {
  image: {
    slug: "polana-skliarovo.jpg",
    alt: "Masív Poľany a Skliarovo nad Detvou",
  },
  eyebrow: "02 — Krajina",
  quote:
    "Zhora vidno, že Detva nie je iba mesto v údolí. Je to miesto, kde sa stretávajú vulkán, les a človek.",
  attribution: "Poľana nad Skliarovom",
};

export const closingCta: ClosingCta = {
  eyebrow: "Začnite preskúmavať",
  title: "Vyberte si vlastnú trasu po regióne",
  body: "Otvorte interaktívnu mapu a poskladajte si prehliadku podľa toho, čo vás zaujíma — krajina, história, kultúra alebo názory ľudí.",
  primaryCta: { label: "Preskúmať mapu", to: "/mapa" },
  secondaryCta: { label: "O projekte", to: "/o-projekte" },
};

/** Section anchors used by the homepage scroll hint / in-page links. */
export const anchors = {
  intro: "region",
  explore: "preskumat",
  panorama: "krajina",
  cta: "zacat",
} as const;
