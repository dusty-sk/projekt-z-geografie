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
    note: "Poddanská obec vígľašského panstva",
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
    title: "Vulkanický masív, ktorý určuje všetko",
    body: [
      "Poľana je najvyššie sopečné pohorie na Slovensku. Ide o silne erodovaný stratovulkán s kalderou približne 6 kilometrov v priemere a obvodom takmer 20 kilometrov — patrí medzi najväčšie vyhasnuté sopky v Európe.",
      "Detva leží v údolí Detvianskeho potoka na južnom okraji tohto masívu. Južný okraj mesta zasahuje do údolia Slatiny, kde sa otvára severný okraj Javoria.",
    ],
    image: { slug: "polana-skliarovo.jpg", alt: "Masív Poľany nad Skliarovom pri Detve" },
  },
  {
    id: "osidlenie",
    eyebrow: "02 — Osídlenie",
    title: "Rozptýlené lazy ako charakter regiónu",
    body: [
      "Podpoľanie je podhorská oblasť v centrálnej časti Banskobystrického samosprávneho kraja. Jej typickým znakom je rozptýlené laznícke osídlenie, ktoré je svojou rozlohou a štruktúrou špecifickým javom aj v rámci Slovenska.",
      "Administratívnym centrom regiónu je okresné mesto Detva. Okres Detva má rozlohu 449,14 km² a žije v ňom približne 32-tisíc obyvateľov.",
    ],
    image: { slug: "detvianska-huta.jpg", alt: "Pohľad na obec Detvianska Huta v Podpoľaní" },
  },
  {
    id: "ochrana",
    eyebrow: "03 — Ochrana prírody",
    title: "Chránená krajinná oblasť a UNESCO",
    body: [
      "CHKO Poľana bola vyhlásená v roku 1981 a patrí medzi štrnásť chránených krajinných oblastí na Slovensku. Zaberá plochu 20 360,48 ha a na väčšine jej území platí druhý stupeň ochrany.",
      "Od roku 1990 je Poľana súčasťou slovenských biosférických rezervácií programu UNESCO Človek a biosféra. V chránenom území vedie náučný chodník s dlhým okruhom 17 km a krátkym okruhom 8,5 km.",
    ],
    image: { slug: "detviansky-potok.jpg", alt: "Detviansky potok v Novej Detve" },
  },
  {
    id: "dedictvo",
    eyebrow: "04 — Dedičstvo",
    title: "Bryndza, kroj a amfiteáter",
    body: [
      "V roku 1787 založil Ján Vagač v Detve prvú bryndziareň na Slovensku. O tri desaťročia neskôr, v roku 1811, bola Detva kráľovskou listinou povýšená na mestečko.",
      "Erb mesta — tri smreky na zelenej pažiti v striebornom štíte — symbolizuje lesné bohatstvo oblasti. Detvianska kultúra a folklór sú dodnes jedným z najviditeľnejších znakov regiónu.",
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
  { year: "3 000 r. pred Kr.", text: "Archeologické nálezy pravekej keramiky a obydlí na území mesta" },
  { year: "Stredovek", text: "Veľkomoravské hradisko na neďalekej Kalamárke" },
  { year: "1638", text: "Založenie Detvy ako poddanskej obce vígľašského panstva" },
  { year: "1787", text: "Ján Vagač zakladá prvú bryndziareň na Slovensku" },
  { year: "1811", text: "Detva je povýšená na mestečko s výročnými trhmi a jarmokmi" },
  { year: "1955", text: "Vznik Podpolianskych strojární (PPS)" },
  { year: "1965", text: "Detva získava štatút mesta" },
  { year: "1981", text: "Vyhlásenie Chránenej krajinnej oblasti Poľana" },
  { year: "1990", text: "Poľana sa stáva biosférickou rezerváciou UNESCO" },
  { year: "1996", text: "Detva sa stáva správnym sídlom okresu" },
];
