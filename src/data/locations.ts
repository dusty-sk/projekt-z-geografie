/**
 * Central location dataset — the single editable source of truth for every
 * geographical location on OBJAV DETVU.
 *
 * Consumed by: the interactive map (src/pages/MapPage.tsx), the places
 * catalogue (src/pages/PlacesPage.tsx) and the detail template
 * (src/components/location/LocationDetail.tsx). Editing an entry here updates
 * all of them automatically. To add / remove / reorder locations, edit the
 * `locations` array below — previous / next navigation is derived from order.
 *
 * Editorial rules for this file:
 *  - Original Slovak text; no copied prose.
 *  - No invented dates, legends, coordinates, opening hours or visitor numbers.
 *  - Coordinates are optional: a location may be added before it is geolocated.
 *    When present they carry `coordSource`. Every location also carries a
 *    `verification` block listing what still needs a human to confirm.
 *  - `scope` makes clear that NOT all locations lie inside the town of Detva.
 *  - Photographs are `actual` (verified photo of the place) or `illustrative`
 *    (a regional / context image that is NOT the place itself).
 *  - `sources` lists only references actually consulted (no fabricated URLs).
 */

export type LocationCategoryId = "priroda" | "kulturne" | "historia" | "rekreacia";

export type LocationCategory = {
  id: LocationCategoryId;
  label: string;
  description: string;
};

export type SourceRef = {
  label: string;
  url: string;
};

export type LocationImage = {
  /** Filename inside public/images/ — the served path is /images/<slug>. */
  slug: string;
  alt: string;
  /**
   * "actual"       — verified photograph of this location
   * "illustrative" — a different place / regional context, shown for atmosphere
   */
  kind: "actual" | "illustrative";
  /** Visible note for illustrative images (what it actually shows). */
  note?: string;
};

export type LocationFact = {
  label: string;
  value: string;
};

export type LocationResearch = {
  /** Framing of the research angle — a plan or question, never a result. */
  focus: string;
  status: "plánovaný výskum" | "prebieha" | "spracúva sa";
};

export type VerificationStatus = "overené" | "čiastočne overené" | "na overenie";

export type LocationScope = {
  /** Municipality / municipalities whose cadastre contains the point. */
  municipality: string;
  /** District(s) — Poľana, for example, spans more than one. */
  district: string;
  region: string;
  /** True only when the point lies inside the town of Detva itself. */
  withinDetva: boolean;
  note?: string;
};

export type Location = {
  /** Stable URL slug: /miesta/<id> — do not change once published. */
  id: string;
  /** Slovak display name (as used across the project). */
  name: string;
  /** Officially correct or alternative names. */
  alsoKnownAs?: string[];
  categories: LocationCategoryId[];
  scope: LocationScope;
  /**
   * Coordinates are optional: a location may be added before it is geolocated.
   * When present, coordPrecision / coordSource should accompany them and the
   * map, catalogue and detail page all degrade gracefully without them.
   */
  coords?: { lat: number; lon: number };
  coordPrecision?: "presná" | "približná";
  coordSource?: string;
  coordSourceUrl?: string;
  /** Short description — one sentence. */
  summary: string;
  /** Longer, informative description (general overview). */
  description: string[];
  /** Geographical significance. */
  geography: string[];
  /** Historical or cultural importance — only where supported by evidence. */
  history?: string[];
  /** What makes the location interesting. */
  highlights: string[];
  /** Potential appeal to visitors and future development. */
  visitorAppeal: string;
  /** Verified quick facts (elevation, designation, area…). */
  facts?: LocationFact[];
  /** Related research — optional. */
  research?: LocationResearch;
  hero: LocationImage;
  gallery?: LocationImage[];
  /** References actually consulted. */
  sources: SourceRef[];
  /** Verification status for uncertain fields. */
  verification: {
    status: VerificationStatus;
    items: string[];
  };
};

export const locationCategories: readonly LocationCategory[] = [
  {
    id: "priroda",
    label: "Príroda",
    description: "Prírodné útvary a chránené územia regiónu.",
  },
  {
    id: "kulturne",
    label: "Kultúrne dedičstvo",
    description: "Stavby, múzeá a tradície, ktoré vytvárajú miestnu kultúru.",
  },
  {
    id: "historia",
    label: "História",
    description: "Miesta, ktoré pripomínajú minulosť regiónu.",
  },
  {
    id: "rekreacia",
    label: "Rekreácia",
    description: "Miesta na turistiku, oddych a voľný čas.",
  },
];

export const categoryById = (id: LocationCategoryId): LocationCategory =>
  locationCategories.find((c) => c.id === id) ?? locationCategories[0];

export const locations: readonly Location[] = [
  // =========================================================================
  {
    id: "namestie-snp",
    name: "Námestie SNP v Detve",
    categories: ["kulturne", "historia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
    },
    coords: { lat: 48.56289, lon: 19.41793 },
    coordPrecision: "približná",
    coordSource: "OpenStreetMap (Nominatim) — stred verejného priestranstva",
    coordSourceUrl: "https://www.openstreetmap.org/search?query=N%C3%A1mestie%20SNP%20Detva",
    summary:
      "Hlavné verejné priestranstvo staršej časti Detvy, kde sa stretáva každodenný život mesta.",
    description: [
      "Námestie SNP je otvorené priestranstvo obklopené historickými domami a kostolom. Hneď pri ňom stojí Kostol sv. Františka z Assisi, Podpolianske múzeum aj Vagačov dom. Preto je dobrým miestom, kde začať prehliadku Detvy.",
      "Námestie sa vyvíjalo spolu s mestom — od poddanskej obce v 17. storočí cez mestečko s výročnými trhmi až po dnešné okresné mesto. Stále slúži jarmokom, kultúrnym a spoločenským podujatiam.",
    ],
    geography: [
      "Detva leží v údolí Detvianskeho potoka na južnom okraji Poľany. Historické jadro s námestím zaberá dno doliny, novšia zástavba vystupuje na svahy.",
      "Námestie leží na križovatke miestnych ciest. Začína aj končí tu väčšina prechádzok po meste.",
    ],
    history: [
      "Detva bola založená v roku 1638 ako poddanská obec vígľašského panstva. V roku 1811 ju kráľovská listina povýšila na mestečko s právom výročných trhov a jarmokov. To posilnilo význam jej centra.",
      "V 20. storočí sa mesto rozrástlo najmä vďaka Podpolianskym strojárňam, ktoré vznikli v roku 1955. V roku 1965 získala Detva štatút mesta.",
    ],
    highlights: [
      "Historické jadro s kostolom, múzeom a pamiatkovými domami na jednom mieste.",
      "Trhy a spoločenský život, ktoré pokračujú od začiatku 19. storočia.",
      "Dobré miesto na orientáciu a oddych počas prehliadky mesta.",
    ],
    visitorAppeal:
      "Námestie je dobrým začiatkom aj koncom prechádzky mestom. Chýbajú mu však prehľadné informačné tabule, viac miest na sedenie a pravidelný program vrátane tradičných jarmokov.",
    facts: [
      { label: "Okres", value: "Detva" },
      { label: "Kraj", value: "Banskobystrický" },
    ],
    research: {
      focus:
        "Ako ľudia vnímajú centrum Detvy — kadiaľ chodia, kde sa zastavujú a čo im na námestí chýba.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detva-old-part.jpg",
      alt: "Panoráma starej časti Detvy",
      kind: "illustrative",
      note: "Ilustračná fotografia starej časti Detvy, nie samotného námestia.",
    },
    gallery: [
      {
        slug: "detva-stara-cast.jpg",
        alt: "Historická zástavba v starej časti Detvy",
        kind: "illustrative",
        note: "Historická časť Detvy ako kontext okolia námestia.",
      },
    ],
    sources: [
      { label: "Wikipédia (sk) — Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
      {
        label: "OpenStreetMap — Námestie SNP",
        url: "https://www.openstreetmap.org/search?query=N%C3%A1mestie%20SNP%20Detva",
      },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Presne určiť hranice námestia a pamiatky, ktoré naň priamo nadväzujú.",
        "Overiť súčasný stav mobiliáru a program podujatí na mestskom úrade.",
      ],
    },
  },

  // =========================================================================
  {
    id: "kostol-sv-frantiska",
    name: "Kostol sv. Františka z Assisi",
    categories: ["kulturne", "historia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
    },
    coords: { lat: 48.5601664, lon: 19.4185286 },
    coordPrecision: "presná",
    coordSource: "OpenStreetMap (way 61764130) · Wikidata Q112090969",
    coordSourceUrl: "https://www.openstreetmap.org/way/61764130",
    summary:
      "Rímskokatolícky kostol z prelomu 18. a 19. storočia a jedna z najvýraznejších stavieb Detvy.",
    description: [
      "Kostol sv. Františka z Assisi je jednoloďová klasicistická stavba. Má pravouhlo ukončené presbytérium a vežu. Stojí v historickom jadre a patrí medzi výrazné stavby mesta.",
      "Vežu vidno z viacerých častí Detvy. Slúži preto ako orientačný bod. Kostol je aj miestom farského a kultúrneho života.",
    ],
    geography: [
      "Kostol stojí v historickom jadre Detvy, v údolí Detvianskeho potoka na južnom okraji Poľany.",
      "Je vyšší než okolitá zástavba, preto tvorí vizuálnu dominantu centra.",
    ],
    history: [
      "Kostol postavili v rokoch 1804 – 1805. Stojí na mieste staršej renesančnej stavby z rokov 1662 – 1664. V roku 1823 prešiel prestavbou.",
    ],
    highlights: [
      "Ukážka klasicistickej sakrálnej architektúry z prelomu 18. a 19. storočia.",
      "Na jednom mieste sa vystriedali renesančný a dnešný klasicistický kostol.",
      "Je súčasťou historického jadra, pešo blízko námestia.",
    ],
    visitorAppeal:
      "Kostol je hlavnou zastávkou prehliadky mesta a miestom kultúrnych aj duchovných podujatí. Prehľadné označenie a citlivá prezentácia by pomohli celému centru Detvy.",
    facts: [
      { label: "Vznik", value: "1804 – 1805" },
      { label: "Prestavba", value: "1823" },
      { label: "Smer", value: "Rímskokatolícky" },
    ],
    hero: {
      slug: "detva-stara-cast.jpg",
      alt: "Historická časť Detvy v okolí kostola",
      kind: "illustrative",
      note: "Ilustračná fotografia historickej časti Detvy, nie samotného kostola.",
    },
    sources: [
      { label: "Wikipédia (sk) — Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
      { label: "OpenStreetMap — kostol (way 61764130)", url: "https://www.openstreetmap.org/way/61764130" },
      { label: "Wikidata Q112090969", url: "https://www.wikidata.org/wiki/Q112090969" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Dátum poslednej väčšej opravy a rok zápisu medzi pamiatky overiť na Pamiatkovom úrade SR.",
        "Overiť autorov a zasvätenie vedľajších oltárov.",
      ],
    },
  },

  // =========================================================================
  {
    id: "podpolianske-muzeum",
    name: "Podpolianske múzeum",
    categories: ["kulturne", "historia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
    },
    coords: { lat: 48.5610319, lon: 19.4186368 },
    coordPrecision: "presná",
    coordSource: "OpenStreetMap (Nominatim) — amenity=museum",
    coordSourceUrl: "https://www.openstreetmap.org/search?query=Podpolianske%20m%C3%BAzeum%20Detva",
    summary:
      "Regionálne múzeum v centre Detvy, ktoré sa venuje histórii a ľudovej kultúre Podpoľania.",
    description: [
      "Podpolianske múzeum sídli v centre Detvy, neďaleko námestia SNP. Vo svojich zbierkach sa zameriava na históriu regiónu a ľudovú kultúru Podpoľania.",
      "Dozvieš sa tu viac o okolitých lokalitách — od bryndziarstva po drevorezbárstvo — skôr, než sa vyberieš do terénu.",
    ],
    geography: [
      "Múzeum stojí v historickom jadre Detvy. Mesto sa rozvinulo v údolí Detvianskeho potoka na južnom okraji Poľany.",
      "Pre Podpoľanie je typické rozptýlené laznícke osídlenie. Práve touto podobou regiónu sa múzeum zaoberá.",
    ],
    history: [
      "Podpoľanie je tradičný región v strednej časti Banskobystrického kraja. Jeho centrom je okresné mesto Detva. Kultúra regiónu vychádza z pastierstva, bryndziarstva, drevorezbárstva a folklóru.",
    ],
    highlights: [
      "Prehľad regionálnej histórie a ľudovej kultúry na jednom mieste.",
      "Dobrá úvodná zastávka pred návštevou lokalít v regióne.",
      "Blízkosť námestia a ďalších pamiatok historického jadra.",
    ],
    visitorAppeal:
      "Múzeum sa hodí pre školské výpravy, tematické výstavy a spoznávanie lokalít, ktoré s regiónom súvisia.",
    facts: [
      { label: "Okres", value: "Detva" },
      { label: "Zameranie", value: "Regionálna história a etnografia" },
    ],
    research: {
      focus:
        "Ako múzeum pracuje s miestnou identitou Podpoľania a ktoré témy považuje za dôležité pre región.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detva-javorinka.jpg",
      alt: "Pohľad na Detvu z Javorinky",
      kind: "illustrative",
      note: "Ilustračná fotografia mesta Detva, nie samotného múzea.",
    },
    sources: [
      {
        label: "OpenStreetMap — Podpolianske múzeum",
        url: "https://www.openstreetmap.org/search?query=Podpolianske%20m%C3%BAzeum%20Detva",
      },
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
    ],
    verification: {
      status: "na overenie",
      items: [
        "Rok založenia, zriaďovateľa a prehľad stálych expozícií overiť priamo v múzeu.",
        "Oficiálnu adresu, otváracie hodiny a vstupné neuvádzame, kým ich nemáme overené.",
      ],
    },
  },

  // =========================================================================
  {
    id: "amfiteater-detva",
    name: "Amfiteáter Detva",
    categories: ["kulturne", "rekreacia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
    },
    coords: { lat: 48.5736492, lon: 19.4212023 },
    coordPrecision: "presná",
    coordSource: "OpenStreetMap (way 243291757) — amenity=theatre",
    coordSourceUrl: "https://www.openstreetmap.org/way/243291757",
    summary:
      "Prírodný amfiteáter na severnom okraji Detvy, kde sa konajú Folklórne slávnosti pod Poľanou.",
    description: [
      "Detviansky amfiteáter je prírodný areál s hľadiskom. Vďaka sklonu terénu na severnom okraji mesta sa tu podujatia môžu konať pod holým nebom.",
      "Mesto Detva amfiteáter prenajíma a zverejňuje kalendár jeho obsadenosti. Popri festivaloch sa tu preto konajú aj ďalšie kultúrne a spoločenské akcie.",
    ],
    geography: [
      "Amfiteáter leží na severnom okraji Detvy, kde sa mesto dotýka svahov Poľany. Spája mestskú zástavbu s prírodou.",
      "Hľadisko je orientované do otvoreného priestoru a využíva terénny sklon.",
    ],
    history: [
      "Amfiteáter je spojený s festivalom Folklórne slávnosti pod Poľanou. Na podujatí sa stretávajú folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
    ],
    highlights: [
      "Spev, tanec a hudba pod holým nebom.",
      "Najznámejšie folklórne podujatie regiónu.",
      "Kultúrny zážitok v prírodnom prostredí pod Poľanou.",
    ],
    visitorAppeal:
      "Pre región je amfiteáter dôležitým kultúrnym a turistickým miestom. Mimo festivalovej sezóny sa tu môžu konať koncerty, divadlo a komunitné podujatia.",
    facts: [
      { label: "Typ", value: "Prírodný amfiteáter" },
      { label: "Poloha", value: "Severný okraj Detvy" },
    ],
    research: {
      focus:
        "Aký význam majú folklórne slávnosti pre kultúrnu identitu regiónu a pre miestnu ekonomiku.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "folklor-detva.jpg",
      alt: "Folklórne slávnosti pod Poľanou v Detve",
      kind: "actual",
      note: "Fotografia z folklórnych slávností, ktoré sa konajú v detvianskom amfiteátri.",
    },
    sources: [
      { label: "Mesto Detva — Amfiteáter", url: "https://www.detva.sk/amfiteater.html" },
      { label: "OpenStreetMap — amfiteáter (way 243291757)", url: "https://www.openstreetmap.org/way/243291757" },
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Kapacitu hľadiska a rok výstavby amfiteátra overiť u organizátora.",
        "Overiť presný názov festivalu a jeho termín v aktuálnom roku.",
      ],
    },
  },

  // =========================================================================
  {
    id: "vagacov-dom",
    name: "Vagačov dom",
    categories: ["historia", "kulturne"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
    },
    coords: { lat: 48.56083, lon: 19.41972 },
    coordPrecision: "presná",
    coordSource: "Wikipédia (sk) — súradnice článku „Vagačov dom (Detva)“",
    coordSourceUrl: "https://sk.wikipedia.org/wiki/Vaga%C4%8Dov_dom_(Detva)",
    summary:
      "Dom z roku 1908, ktorý je spojený s rodinou Vagačovcov a prvou bryndziarňou na Slovensku.",
    description: [
      "Vagačov dom stojí na Partizánskej ulici v historickej časti Detvy. Postavili ho v roku 1908 a mesto ho považuje za jednu zo svojich dominánt.",
      "Dom pripomína rodinu Vagačovcov, ktorá v Detve začala bryndziarsku výrobu. Jeho architektúra zároveň dotvára historický ráz ulice.",
    ],
    geography: [
      "Dom stojí v historickej časti Detvy, v údolí Detvianskeho potoka na južnom okraji Poľany.",
      "Poloha v centre mesta z neho robí jednu z výrazných stavieb historického jadra.",
    ],
    history: [
      "V roku 1787 založil Ján Vagač, rodák zo Starej Turej, v Detve prvú bryndziareň na Slovensku. Bol to podnik na výrobu bryndze. Jeho výrobky preslávili Detvu aj v zahraničí, najmä v Rakúsku a v Amerike.",
      "Samotný Vagačov dom postavili až v roku 1908. Dnešná budova teda pochádza z neskoršieho obdobia než bryndziareň.",
    ],
    highlights: [
      "Priama väzba na bryndziarsku tradíciu, ktorá preslávila Detvu.",
      "Architektúra historického domu v centre mesta.",
      "Príbeh rodiny, ktorá ovplyvnila hospodárstvo regiónu.",
    ],
    visitorAppeal:
      "Dom sa hodí ako zastávka mestskej pamiatkovej trasy a ako miesto pre expozíciu o bryndziarstve. Bryndza je silná téma, ktorá by mohla prilákať aj gastronomických návštevníkov.",
    facts: [
      { label: "Rok stavby domu", value: "1908" },
      { label: "Bryndziareň", value: "1787" },
      { label: "Ulica", value: "Partizánska" },
    ],
    research: {
      focus:
        "Aké miesto má bryndziarska tradícia v hospodárstve a identite Podpoľania.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "kroj.jpg",
      alt: "Historický detviansky kroj (okolo roku 1910)",
      kind: "illustrative",
      note: "Ilustračná fotografia detvianskeho kroja z obdobia okolo roku 1910, nie budovy Vagačovho domu.",
    },
    sources: [
      {
        label: "Wikipédia (sk) — Vagačov dom (Detva)",
        url: "https://sk.wikipedia.org/wiki/Vaga%C4%8Dov_dom_(Detva)",
      },
      { label: "Wikipédia (sk) — Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Overiť, ako budovu využívajú dnes a v akom je stavebnom stave.",
        "Objasniť v teréne vzťah medzi domom z roku 1908 a pôvodnou bryndziarňou z roku 1787.",
      ],
    },
  },

  // =========================================================================
  {
    id: "kalamarka",
    name: "Kaľamárka",
    alsoKnownAs: ["Kalamárka"],
    categories: ["priroda", "historia", "rekreacia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
      note: "Leží v katastrálnom území mesta Detva, približne 4 km severne od centra.",
    },
    coords: { lat: 48.6057, lon: 19.4181 },
    coordPrecision: "presná",
    coordSource: "Wikipédia (sk) — „Kalamárka (vrch v Poľane)“",
    coordSourceUrl: "https://sk.wikipedia.org/wiki/Kalam%C3%A1rka_(vrch_v_Po%C4%BEane)",
    summary:
      "Nízky vrch nad Detvou so skalnou plošinou. Je to významná archeologická lokalita a chránená prírodná pamiatka.",
    description: [
      "Kaľamárka má niekoľko skalnatých pahorkov a na vrchole skalnú plošinu so strmými stenami. Z Detvy sa na ňu dá vyjsť pri kratšej túre.",
      "Okrem prírodnej hodnoty je to aj dôležitá archeologická lokalita. Plošina bola osídlená v praveku aj v ranom stredoveku.",
    ],
    geography: [
      "Kaľamárka (807,9 m n. m.) leží v pohorí Poľana, v podcelku Detvianske predhorie. Od Detvy je vzdialená približne 4 km severným smerom.",
      "Vrch tvorí nevýrazný hrebeň s niekoľkými skalnatými pahorkami. Patrí do povodia Slatiny a do Chránenej krajinnej oblasti Poľana.",
    ],
    history: [
      "Skalná plošina na vrchole je významná archeologická lokalita z doby bronzovej a z veľkomoravského obdobia. V ranom stredoveku tu stálo veľkomoravské hradisko.",
      "Časť vrcholu je od roku 1977 chránenou prírodnou pamiatkou na rozlohe 1,28 ha. Chráni erózny zvyšok bočného andezitového prúdu.",
    ],
    highlights: [
      "Archeologická lokalita z doby bronzovej a z veľkomoravského obdobia.",
      "Pekný, hoci obmedzený výhľad na Detviansku kotlinu a okolité vrchy.",
      "Na vrchol sa dá dostať značenou Rudnou magistrálou z Detvy.",
    ],
    visitorAppeal:
      "Kaľamárka je obľúbeným cieľom kratších peších výletov z Detvy. Spája prírodu, výhľady a archeológiu, preto sa hodí na náučný výstup alebo školskú exkurziu.",
    facts: [
      { label: "Nadmorská výška", value: "807,9 m n. m." },
      { label: "Vzdialenosť od Detvy", value: "≈ 4 km" },
      { label: "Ochrana", value: "Prírodná pamiatka (1977, 1,28 ha)" },
    ],
    research: {
      focus:
        "Archeologická lokalita Kaľamárky a vzťah miestnych obyvateľov k vrchu nad mestom.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detva-kalamar.jpg",
      alt: "Pohľad na Detvu z Kaľamárky",
      kind: "actual",
      note: "Fotografia vyhotovená z Kaľamárky — výhľad na Detvu.",
    },
    sources: [
      {
        label: "Wikipédia (sk) — Kalamárka (vrch v Poľane)",
        url: "https://sk.wikipedia.org/wiki/Kalam%C3%A1rka_(vrch_v_Po%C4%BEane)",
      },
      {
        label: "Wikipédia (sk) — Kalamárka (prírodná pamiatka)",
        url: "https://sk.wikipedia.org/wiki/Kalam%C3%A1rka_(pr%C3%ADrodn%C3%A1_pamiatka)",
      },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Overiť presnú trasu a stav značenia prístupu k vrcholu.",
        "Overiť, aká časť vrcholu patrí do chráneného územia.",
      ],
    },
  },

  // =========================================================================
  {
    id: "melichova-skala",
    name: "Melichova skala",
    categories: ["priroda", "rekreacia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
      note: "Katastrálne územie mesta Detva (časť Skliarovo).",
    },
    coords: { lat: 48.5936111, lon: 19.4502778 },
    coordPrecision: "presná",
    coordSource: "Wikipédia (sk) — článok „Melichova skala“",
    coordSourceUrl: "https://sk.wikipedia.org/wiki/Melichova_skala",
    summary:
      "Približne 30 m vysoká andezitová skalná ihla na južnom svahu Poľany, chránená ako prírodná pamiatka.",
    description: [
      "Melichova skala je približne 30 m vysoká skalná ihla. Vystupuje z lesnatého svahu nad Skliarovom, tvarom pripomína obelisk a je výrazná už z väčšej vzdialenosti.",
      "Skala je chránená ako prírodná pamiatka. Má vedeckú aj estetickú hodnotu, pretože na nej vidno, ako erózia pretvára sopečné horniny.",
    ],
    geography: [
      "Melichova skala je prírodná pamiatka v katastrálnom území mesta Detva, v časti Skliarovo. Spravuje ju Štátna ochrana prírody.",
      "Skalná ihla stojí na južnom, miernom svahu stratovulkánu Poľana. Vznikla selektívnou eróziou a denudáciou. Tie odstránili menej odolné časti andezitového prúdu a nechali len jeho najtvrdšie jadro.",
    ],
    highlights: [
      "Ukážka toho, ako vznikajú skalné útvary na vyhasnutej sopke.",
      "Výrazný prírodný objekt v lesoch na južných svahoch Poľany.",
      "Prírodná pamiatka vyhlásená v roku 1964.",
    ],
    visitorAppeal:
      "Skala sa hodí ako cieľ náučnej trasy alebo geologickej vychádzky. V okolí je viac andezitových útvarov, ktoré sa dajú spojiť do spoločnej geologickej trasy.",
    facts: [
      { label: "Výška skaly", value: "≈ 30 m" },
      { label: "Vyhlásená", value: "1964" },
      { label: "Rozloha", value: "2,1060 ha" },
    ],
    research: {
      focus: "Ako vznikli andezitové útvary Poľany a prečo je dôležité chrániť ich.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "polana-skliarovo.jpg",
      alt: "Poľana a Skliarovo pod ňou",
      kind: "illustrative",
      note: "Ilustračná fotografia oblasti Skliarovo pod Poľanou, kde sa lokalita nachádza — nie samotnej skalnej ihly.",
    },
    sources: [
      { label: "Wikipédia (sk) — Melichova skala", url: "https://sk.wikipedia.org/wiki/Melichova_skala" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Overiť presnú polohu skaly a ako sa k nej dá dostať.",
        "Overiť aktuálne označenie chráneného územia.",
      ],
    },
  },

  // =========================================================================
  {
    id: "vodopad-bystro",
    name: "Vodopád Bystrô",
    alsoKnownAs: ["Vodopád Bystrého potoka", "Vodopád Bystré"],
    categories: ["priroda", "rekreacia"],
    scope: {
      municipality: "Hriňová",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: false,
      note: "Leží v katastrálnom území mesta Hriňová, nie v Detve.",
    },
    coords: { lat: 48.62194, lon: 19.47944 },
    coordPrecision: "presná",
    coordSource: "Wikipédia (sk) — „Vodopád Bystrého potoka“",
    coordSourceUrl: "https://sk.wikipedia.org/wiki/Vodop%C3%A1d_Bystr%C3%A9ho_potoka",
    summary:
      "Vodopád na Bystrom potoku v Poľane, chránený ako národná prírodná pamiatka.",
    description: [
      "Vodopád vzniká na Bystrom potoku v hornej časti povodia pod sedlom Priehybina. Voda padá cez približne 20 m vysokú stenu. Patrí medzi výrazné vodné útvary Poľany.",
      "Na rozdiel od väčšiny lokalít v tejto databáze neleží v Detve. Nachádza sa v katastrálnom území susedného mesta Hriňová, hoci stále v okrese Detva.",
    ],
    geography: [
      "Vodopád leží v hornej časti Bystrého potoka, južne až juhovýchodne od vrchu Poľana. Nachádza sa pod sedlom Priehybina vo výške približne 983 m n. m.",
      "Bystrá je pravostranný prítok Slatiny a pramení pod Poľanou. Vodopád preto patrí do povodia Slatiny v pohorí Poľana.",
    ],
    history: [
      "Lokalita je národnou prírodnou pamiatkou a chráneným krajinným výtvorom. Hovorovo sa nazýva aj vodopád Bystré alebo vodopád Bystrô.",
    ],
    highlights: [
      "Vodopád, ktorý vytvorila voda vo vulkanickom podloží.",
      "Chránené územie s peknou scenériou Poľany.",
      "Prírodná zaujímavosť, ktorá patrí k známym cieľom Podpoľania.",
    ],
    visitorAppeal:
      "Vodopád je cieľom turistických vychádzok. Leží pri značených trasách a náučných chodníkoch, takže sa dá spojiť s ďalšími miestami v okolí.",
    facts: [
      { label: "Výška vodopádu", value: "≈ 20 m (zdroje sa líšia)" },
      { label: "Nadmorská výška", value: "≈ 983 m n. m." },
      { label: "Ochrana", value: "Národná prírodná pamiatka" },
    ],
    research: {
      focus:
        "Koľko turistov vodopád navštevuje, aké trasy k nemu vedú a ako návštevnosť ovplyvňuje chránené územie.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detviansky-potok.jpg",
      alt: "Detviansky potok v Novej Detve",
      kind: "illustrative",
      note: "Ilustračná fotografia vodného toku (Detviansky potok), nie samotného vodopádu Bystrého potoka.",
    },
    sources: [
      {
        label: "Wikipédia (sk) — Vodopád Bystrého potoka",
        url: "https://sk.wikipedia.org/wiki/Vodop%C3%A1d_Bystr%C3%A9ho_potoka",
      },
      { label: "Wikipédia (sk) — Hriňová", url: "https://sk.wikipedia.org/wiki/Hri%C5%88ov%C3%A1" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Výška vodopádu sa v zdrojoch líši (Wikipédia uvádza približne 20 m, OpenStreetMap 23 m). Treba ju overiť v teréne.",
        "Názov „Bystrô“ je hovorový. Oficiálny názov je Vodopád Bystrého potoka.",
        "Overiť oficiálny prístup a značenie trasy k vodopádu.",
      ],
    },
  },

  // =========================================================================
  {
    id: "polana",
    name: "Poľana",
    categories: ["priroda", "rekreacia"],
    scope: {
      municipality: "Hriňová, Očová, Valaská (kataster NPR Zadná Poľana)",
      district: "Detva · Zvolen · Brezno",
      region: "Banskobystrický",
      withinDetva: false,
      note: "Najvyšší vrch masívu leží mimo mesta Detva; NPR Zadná Poľana zasahuje do katastrov troch obcí.",
    },
    coords: { lat: 48.6369, lon: 19.4833 },
    coordPrecision: "presná",
    coordSource: "Wikipédia (sk) — „Poľana (vrch)“",
    coordSourceUrl: "https://sk.wikipedia.org/wiki/Po%C4%BEana_(vrch)",
    summary:
      "Najvyšší vrch pohoria Poľana a jadro chráneného územia, ktoré je od roku 1990 biosférickou rezerváciou UNESCO.",
    description: [
      "Poľana je najvyšší vrch svojho pohoria a najvýraznejší masív regiónu. Z vrcholu je široký výhľad na okolité pohoria aj na Podpoľanie.",
      "Masív je silne erodovaný stratovulkán s kalderou, ktorá mu dáva kruhový tvar. Lesy a lúky na jeho území sú súčasťou chránenej krajiny.",
    ],
    geography: [
      "Poľana (1 457,8 m n. m.) je najvyšší vrch rovnomenného pohoria v Slovenskom stredohorí. Leží približne 7 km severne od Hriňovej.",
      "Vrchol patrí do národnej prírodnej rezervácie Zadná Poľana. Tá zasahuje do katastrov obcí Očová a Valaská a mesta Hriňová, v okresoch Zvolen, Detva a Brezno. Rezervácia má rozlohu 855,4941 ha a bola novelizovaná v roku 1993.",
      "Poľana sa považuje za najvyššiu vyhasnutú sopku v Strednej Európe. Jej kaldera má v priemere približne 6 km.",
    ],
    history: [
      "Chránenú krajinnú oblasť Poľana vyhlásili v roku 1981. Od roku 1990 je Poľana súčasťou slovenských biosférických rezervácií UNESCO v programe Človek a biosféra.",
    ],
    highlights: [
      "Najvyšší vrch pohoria a výrazný vulkanický útvar.",
      "Chránené územie s náučnými chodníkmi. Dlhší okruh meria 17 km, kratší 8,5 km.",
      "Výhľady na okolité pohoria a na Podpoľanie.",
    ],
    visitorAppeal:
      "Poľana je hlavnou turistickou lokalitou regiónu. Vedú cez ňu značené trasy a náučné chodníky, takže sa hodí na celodenný výlet.",
    facts: [
      { label: "Nadmorská výška", value: "1 457,8 m n. m." },
      { label: "Ochrana", value: "CHKO Poľana (1981)" },
      { label: "UNESCO", value: "Biosférická rezervácia (1990)" },
      { label: "NPR Zadná Poľana", value: "855,4941 ha (1953/1993)" },
    ],
    research: {
      focus:
        "Prečo je dôležité chrániť prírodu na Poľane a ako chránené územie vnímajú návštevníci.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "polana-skliarovo.jpg",
      alt: "Masív Poľany a Skliarovo",
      kind: "actual",
      note: "Fotografia masívu Poľany nad Skliarovom (vrch Poľana, 1458 m).",
    },
    sources: [
      { label: "Wikipédia (sk) — Poľana (vrch)", url: "https://sk.wikipedia.org/wiki/Po%C4%BEana_(vrch)" },
      { label: "Wikipédia (sk) — Zadná Poľana", url: "https://sk.wikipedia.org/wiki/Zadn%C3%A1_Po%C4%BEana" },
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Tvrdenie „najvyššia vyhasnutá sopka v Strednej Európe“ sa často cituje. Treba ho overiť v odbornej literatúre.",
        "Overiť prístupové trasy a sezónne obmedzenia v chránenom území.",
      ],
    },
  },

  // =========================================================================
  {
    id: "drevene-krize",
    name: "Expozícia detvianskych drevených krížov",
    categories: ["kulturne", "historia"],
    scope: {
      municipality: "Detva",
      district: "Detva",
      region: "Banskobystrický",
      withinDetva: true,
      note: "V severovýchodnej časti Detvy, v priestore kalvárie.",
    },
    coords: { lat: 48.56522, lon: 19.42487 },
    coordPrecision: "približná",
    coordSource:
      "OpenStreetMap (way 243314650 „Detvianske kríže“ / node „Drevené vyrezávané kríže“)",
    coordSourceUrl: "https://www.openstreetmap.org/way/243314650",
    summary:
      "Súbor vyrezávaných drevených krížov, ktorý ukazuje drevorezbársku tradíciu Podpoľania.",
    description: [
      "Expozícia ukazuje typickú podobu ľudového umenia regiónu — vyrezávané drevené kríže. V Podpoľaní sa stavali popri cestách, na cintorínoch aj vo voľnej krajine.",
      "Lokalita je súčasťou širšieho areálu kalvárie v severovýchodnej časti Detvy. Stojí tu aj kaplnka Sedembolestnej Panny Márie.",
    ],
    geography: [
      "Expozícia sa nachádza v Detve, v priestore kalvárie na okraji mesta.",
      "Vyrezávané kríže pri cestách a na cintorínoch sú typickým prvkom krajiny v okolí Poľany. Nachádzajú sa pri cestách lazov aj v obciach.",
    ],
    history: [
      "Drevorezbárstvo patrí k najvýraznejším prejavom ľudovej kultúry regiónu. Drevené kríže nesú stopy miestnej umeleckej tradície, ktorá sa odovzdávala z generácie na generáciu.",
    ],
    highlights: [
      "Ukážka detvianskeho drevorezbárstva.",
      "Remeslo, viera a krajina regiónu na jednom mieste.",
      "Súčasť širšieho areálu kalvárie v Detve.",
    ],
    visitorAppeal:
      "Expozícia sa hodí ako zastávka mestskej kultúrnej trasy. Náučné tabule a sprievodné materiály by pomohli priblížiť remeslo širšej verejnosti.",
    facts: [
      { label: "Typ", value: "Expozícia ľudového umenia" },
      { label: "Poloha", value: "Detva — kalvária" },
    ],
    research: {
      focus:
        "Ako sa drevorezbárska tradícia Podpoľania udržiava medzi generáciami.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "folklor-detva.jpg",
      alt: "Prehliadka ľudovej kultúry v Detve",
      kind: "illustrative",
      note: "Ilustračná fotografia ľudovej kultúry v Detve, nie samotnej expozície krížov.",
    },
    sources: [
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
      {
        label: "OpenStreetMap — Detvianske kríže (way 243314650)",
        url: "https://www.openstreetmap.org/way/243314650",
      },
    ],
    verification: {
      status: "na overenie",
      items: [
        "Overiť rozsah expozície, jej správcu a počet krížov priamo v teréne.",
        "Overiť, ako expozícia súvisí s areálom kalvárie a kaplnkou Sedembolestnej Panny Márie.",
        "Overiť presné miesto vstupu do expozície.",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Served path of a photograph, e.g. "/images/polana-skliarovo.jpg". */
export function locationImagePath(slug: string): string {
  return `/images/${slug}`;
}

export function getLocation(id: string | undefined): Location | undefined {
  if (!id) return undefined;
  return locations.find((l) => l.id === id);
}

export function getLocationIndex(id: string | undefined): number {
  if (!id) return -1;
  return locations.findIndex((l) => l.id === id);
}

/** Previous / next location, wrapping around the list. */
export function getLocationNeighbours(id: string): {
  previous: Location;
  next: Location;
} | null {
  const index = getLocationIndex(id);
  if (index === -1) return null;
  const count = locations.length;
  return {
    previous: locations[(index - 1 + count) % count],
    next: locations[(index + 1) % count],
  };
}

/** Locations grouped by their primary category (used by map filters). */
export function locationsByCategory(category: LocationCategoryId): Location[] {
  return locations.filter((l) => l.categories.includes(category));
}
