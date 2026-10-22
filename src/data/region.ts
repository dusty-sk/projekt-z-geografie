/**
 * Verified, sourced facts about Detva and the Podpoľanie region.
 * Every value here is public encyclopedic/statistical information with a
 * named source — this file intentionally contains NO survey or field-study
 * results. Field-research data lives (later) under `src/data/research/`.
 */

export type Fact = {
  value: string;
  unit?: string;
  label: string;
  note?: string;
};

export type RegionSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  image?: { slug: string; alt: string };
};

export const regionFacts: readonly Fact[] = [
  {
    value: "1 457,8",
    unit: "m n. m.",
    label: "Vrch Poľana",
    note: "Najvyšší bod sopečného masívu",
  },
  {
    value: "1638",
    label: "Založenie Detvy",
    note: "Vznikla ako poddanská obec vígľašského panstva",
  },
  {
    value: "13 995",
    label: "Obyvateľov Detvy",
    note: "Sčítanie obyvateľov 2021",
  },
  {
    value: "20 360",
    unit: "ha",
    label: "CHKO Poľana",
    note: "Vyhlásená v roku 1981",
  },
];

export const regionSections: readonly RegionSection[] = [
  {
    id: "krajina",
    eyebrow: "01 — Krajina",
    title: "Sopka, ktorá dáva regiónu tvar",
    body: [
      "Poľana je najvyššie sopečné pohorie na Slovensku. Ide o silne erodovaný stratovulkán, teda zvyšok vyhasnutej sopky. Jej kaldera má v priemere približne 6 kilometrov a obvod takmer 20 kilometrov, preto sa Poľana radí medzi najväčšie vyhasnuté sopky v Európe.",
      "Detva leží v údolí Detvianskeho potoka na južnom okraji masívu. Južná časť mesta zasahuje do údolia Slatiny, za ktorým sa začína pohorie Javorie.",
    ],
    image: { slug: "polana-skliarovo.jpg", alt: "Masív Poľany nad Skliarovom pri Detve" },
  },
  {
    id: "osidlenie",
    eyebrow: "02 — Osídlenie",
    title: "Lazy, ktoré sú pre región typické",
    body: [
      "Podpoľanie leží v strednej časti Banskobystrického kraja. Jeho typickým znakom sú rozptýlené lazy. Rozlohou aj štruktúrou sú výnimočné v celoslovenskom meradle.",
      "Centrom regiónu je okresné mesto Detva. Okres Detva má rozlohu 449,14 km² a žije v ňom približne 32-tisíc obyvateľov.",
    ],
    image: { slug: "detvianska-huta.jpg", alt: "Pohľad na obec Detvianska Huta v Podpoľaní" },
  },
  {
    id: "ochrana",
    eyebrow: "03 — Ochrana prírody",
    title: "Chránená krajinná oblasť a UNESCO",
    body: [
      "CHKO Poľana vyhlásili v roku 1981. Patrí medzi štrnásť chránených krajinných oblastí na Slovensku, zaberá 20 360,48 ha a na väčšine jej územia platí druhý stupeň ochrany.",
      "V roku 1990 sa Poľana stala súčasťou slovenských biosférických rezervácií UNESCO v programe Človek a biosféra. Chráneným územím vedie náučný chodník. Dlhý okruh meria 17 km, krátky 8,5 km.",
    ],
    image: { slug: "detviansky-potok.jpg", alt: "Detviansky potok v Novej Detve" },
  },
  {
    id: "dedictvo",
    eyebrow: "04 — Dedičstvo",
    title: "Bryndza, kroj a amfiteáter",
    body: [
      "V roku 1787 založil Ján Vagač v Detve prvú bryndziareň na Slovensku. O tri desaťročia neskôr, v roku 1811, bola Detva kráľovskou listinou povýšená na mestečko.",
      "V erbe má mesto tri smreky na zelenej pažiti v striebornom štíte. Pripomínajú lesné bohatstvo oblasti. Detvianska kultúra a folklór sú dodnes jedným z najviditeľnejších znakov regiónu.",
    ],
    image: { slug: "kroj.jpg", alt: "Tradičný detviansky kroj" },
  },
];

export type GalleryImage = {
  slug: string;
  alt: string;
  caption: string;
};

/** Supplementary photographs of the region, shown as a band on the Región page. */
export const gallery: readonly GalleryImage[] = [
  {
    slug: "detva-old-part.jpg",
    alt: "Panoráma staršej časti Detvy",
    caption: "Staršia časť Detvy",
  },
  {
    slug: "folklor-detva.jpg",
    alt: "Folklórne slávnosti pod Poľanou v Detve",
    caption: "Folklórne slávnosti pod Poľanou",
  },
  {
    slug: "detva-javorinka.jpg",
    alt: "Pohľad na Detvu z Javorinky",
    caption: "Detva z Javorinky",
  },
];

export const timeline: readonly { year: string; text: string }[] = [
  { year: "3 000 r. pred Kr.", text: "Na území mesta našli archeológovia praveké obydlia a keramiku" },
  { year: "Stredovek", text: "Na neďalekej Kaľamárke stálo veľkomoravské hradisko" },
  { year: "1638", text: "Detva vznikla ako poddanská obec vígľašského panstva" },
  { year: "1787", text: "Ján Vagač založil prvú bryndziareň na Slovensku" },
  { year: "1811", text: "Detva sa stala mestečkom s právom výročných trhov a jarmokov" },
  { year: "1955", text: "Vznikli Podpolianske strojárne (PPS)" },
  { year: "1965", text: "Detva získala štatút mesta" },
  { year: "1981", text: "Vyhlásili Chránenú krajinnú oblasť Poľana" },
  { year: "1990", text: "Poľana sa stala biosférickou rezerváciou UNESCO" },
  { year: "1996", text: "Detva sa stala sídlom okresu" },
];
