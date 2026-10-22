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
    "Zisti viac o miestach, ktoré už poznáš. Objav ich príbehy aj názory ľudí, ktorí tu žijú.",
  primaryCta: { label: "Pozrieť mapu", to: "/mapa" },
  secondaryCta: { label: "Výsledky výskumu", to: "/vyskum" },
  image: {
    slug: "detva-kalamar.jpg",
    alt: "Pohľad na mesto Detva z vrchu Kaľamárka, v pozadí masív Poľany",
  },
  caption: "Detva z Kaľamárky · odfotil Miroslav Blaho, CC BY-SA 3.0",
  scrollHint: "Posuň sa nižšie",
};

export const intro: IntroBlock = {
  eyebrow: "01 — Región",
  title: "Krajina, ktorú vytvorila sopka a práca ľudí.",
  body: [
    "Detva leží v údolí Detvianskeho potoka na južnom okraji Poľany. Poľana je najvyššie sopečné pohorie na Slovensku a jej kaldera má v priemere takmer šesť kilometrov. Krajina okolo Detvy je súčasťou silne erodovaného stratovulkánu — teda zvyškov sopky.",
    "Podpoľanie je podhorský región s rozptýlenými lazmi. Takéto osídlenie je svojou štruktúrou výnimočné v celoslovenskom meradle. Detva je jeho prirodzeným centrom.",
  ],
  secondary: [
    "Projekt sleduje, ako prírodné podmienky ovplyvňujú každodenný život ľudí — krajinu, prácu, kultúru aj rozhodovanie.",
  ],
};

export const teasers: readonly Teaser[] = [
  {
    index: "01",
    to: "/mapa",
    label: "Interaktívna mapa",
    title: "Krajina v súvislostiach",
    description:
      "Prezri si Detvu a Podpoľanie na mape. Nájdeš tu sídla, reliéf, vodné toky aj miesta z terénneho výskumu.",
    image: { slug: "detva-old-part.jpg", alt: "Panoráma starej časti Detvy" },
  },
  {
    index: "02",
    to: "/miesta",
    label: "Miesta",
    title: "Lokality, ktoré stoja za zastavenie",
    description:
      "Výber miest regiónu — od námestia a kostola po Poľanu a vodopád. Pri každom nájdeš popis, fotografie a súvislosti.",
    image: { slug: "detvianska-huta.jpg", alt: "Obec Detvianska Huta" },
  },
  {
    index: "03",
    to: "/vyskum",
    label: "Výskum",
    title: "Čo skúmame a čo už vieme",
    description:
      "Návrh výskumu, metodika, otázky a priebežné výsledky. Pri každom údaji uvádzame zdroj a spôsob, akým sme ho získali.",
    image: { slug: "detviansky-potok.jpg", alt: "Detviansky potok v Novej Detve" },
  },
  {
    index: "04",
    to: "/region",
    label: "Región",
    title: "Poľana, ochrana prírody a dedičstvo",
    description:
      "Ako vznikla krajina, čo chráni UNESCO, ako sa menila história regiónu a čo z nej zostalo v kultúre.",
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
    "Z výšky je vidieť, že Detva nie je len mesto v údolí. Stretáva sa tu sopka, les a ľudská práca.",
  attribution: "Poľana nad Skliarovom",
};

export const closingCta: ClosingCta = {
  eyebrow: "Začni objavovať",
  title: "Vyber si vlastnú trasu po regióne",
  body: "Otvor mapu a poskladaj si prehliadku podľa toho, čo ťa zaujíma — krajina, história, kultúra alebo názory ľudí.",
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
