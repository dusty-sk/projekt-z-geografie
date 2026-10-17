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
    description: "Prírodné útvary, chránené územia a krajinné prvky.",
  },
  {
    id: "kulturne",
    label: "Kultúrne dedičstvo",
    description: "Stavby, múzeá a živá ľudová kultúra.",
  },
  {
    id: "historia",
    label: "História",
    description: "Miesta s historickým alebo archeologickým významom.",
  },
  {
    id: "rekreacia",
    label: "Rekreácia",
    description: "Ciele pre turistiku, oddych a voľný čas.",
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
      "Ústredný verejný priestor historickej časti Detvy a prirodzené ťažisko mestského života.",
    description: [
      "Námestie SNP je otvorená plocha lemovaná meštianskou a cirkevnou zástavbou historického jadra Detvy. V tesnej blízkosti sa nachádzajú rímskokatolícky kostol sv. Františka z Assisi, Podpolianske múzeum aj Vagačov dom, takže funguje ako prirodzený východiskový bod prehliadky mesta.",
      "Priestor prešiel dlhým vývojom — od poddanskej obce zo 17. storočia cez mestečko s výročnými trhmi až po dnešné okresné mesto. Popri každodennom živote slúži aj ako dejisko jarmokov, kultúrnych a spoločenských podujatí.",
    ],
    geography: [
      "Detva leží v údolí Detvianskeho potoka na južnom okraji masívu Poľana. Historické jadro s námestím zaberá dno doliny, kým novšia zástavba vystupuje na svahy.",
      "Poloha na križovatke miestnych ciest robí z námestia prirodzené centrum pešieho pohybu — začína aj končí tu väčšina prechádzok po meste.",
    ],
    history: [
      "Detva bola založená v roku 1638 ako poddanská obec vígľašského panstva. V roku 1811 bola kráľovskou listinou povýšená na mestečko s právom usporadúvať výročné trhy a jarmoky, čo posilnilo význam jej centra.",
      "Rozvoj priemyslu v 20. storočí — predovšetkým vznik Podpolianskych strojární (1955) — a následná urbanizácia zmenili mesto; v roku 1965 získala Detva štatút mesta.",
    ],
    highlights: [
      "Historické jadro s kostolom, múzeom a pamiatkovými domami v pešej dostupnosti.",
      "Kontinuita trhov a spoločenského života od začiatku 19. storočia.",
      "Prirodzené miesto pre orientáciu a oddych pri prehliadke mesta.",
    ],
    visitorAppeal:
      "Ako srdce mesta je prirodzeným štartom aj cieľom mestskej prechádzky a miestom, kde sa dá naplánovať návšteva ďalších lokalít. Má potenciál profilovať sa informačnými tabuľami, mobiliárom a podujatiami vrátane tradičných jarmokov.",
    facts: [
      { label: "Okres", value: "Detva" },
      { label: "Kraj", value: "Banskobystrický" },
    ],
    research: {
      focus:
        "Vnímanie verejného priestoru v centre Detvy — kadiaľ ľudia chodia, kde sa zastavujú a čo im na námestí chýba.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detva-old-part.jpg",
      alt: "Panoráma starej časti Detvy",
      kind: "illustrative",
      note: "Ilustračný záber starej časti Detvy, nie priamy záber námestia.",
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
        "Presné vymedzenie priestoru námestia a zoznam pamiatok, ktoré naň priamo zasahujú.",
        "Aktuálny stav mobiliáru a program podujatí (doplniť z mestského úradu).",
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
      "Rímskokatolícky kostol z prelomu 18. a 19. storočia a jedna z výrazných dominánt Detvy.",
    description: [
      "Kostol sv. Františka z Assisi je jednoloďová klasicistická stavba s pravouhle ukončeným presbytériom a s vežou, ktorá je súčasťou jej hmoty. Svojím situovaním v historickom jadre patrí k najvýraznejším stavbám mesta.",
      "Veža kostola je dobre čitateľná z viacerých častí Detvy aj z okolitých výhľadov, a preto slúži ako orientačný bod. Chrám je zároveň živým miestom farského a kultúrneho života.",
    ],
    geography: [
      "Kostol stojí v historickom jadre Detvy, v údolí Detvianskeho potoka na južnom okraji masívu Poľana.",
      "Jeho výšková poloha voči okolitej zástavbe z neho robí vizuálnu dominantu centra mesta.",
    ],
    history: [
      "Kostol pochádza z rokov 1804 – 1805. Stojí na mieste staršej renesančnej stavby z rokov 1662 – 1664 a prešiel prestavbou v roku 1823.",
    ],
    highlights: [
      "Ukážka klasicistickej sakrálnej architektúry z prelomu 18. a 19. storočia.",
      "Kontinuita posvätného miesta — najprv renesančná stavba, neskôr kostol v dnešnej podobe.",
      "Súčasť historického jadra v pešej dostupnosti od námestia.",
    ],
    visitorAppeal:
      "Patrí medzi kľúčové zastávky prehliadky mesta a je prirodzeným miestom kultúrnych a duchovných podujatí. Citlivá prezentácia stavby zvyšuje atraktivitu centra Detvy.",
    facts: [
      { label: "Vznik", value: "1804 – 1805" },
      { label: "Prestavba", value: "1823" },
      { label: "Smer", value: "Rímskokatolícky" },
    ],
    hero: {
      slug: "detva-stara-cast.jpg",
      alt: "Historická časť Detvy v okolí kostola",
      kind: "illustrative",
      note: "Ilustračný záber historickej časti Detvy, nie priamy záber kostola.",
    },
    sources: [
      { label: "Wikipédia (sk) — Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
      { label: "OpenStreetMap — kostol (way 61764130)", url: "https://www.openstreetmap.org/way/61764130" },
      { label: "Wikidata Q112090969", url: "https://www.wikidata.org/wiki/Q112090969" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Dátum poslednej väčšej opravy a rok zaradenia medzi pamiatky (Pamiatkový úrad SR).",
        "Autorstvo a zasvätenie vedľajších oltárov.",
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
      "Regionálne múzeum v historickom jadre Detvy, venované histórii a ľudovej kultúre Podpoľania.",
    description: [
      "Podpolianske múzeum sídli v centre Detvy, v tesnej blízkosti námestia SNP. Zbierkovo sa orientuje na regionálnu históriu a na ľudovú kultúru podhorskej oblasti Podpoľania.",
      "Ako kultúrna a vzdelávacia inštitúcia je prirodzeným miestom, kde sa dá získať kontext k okolitým lokalitám — od bryndziarskej tradície po drevorezbárstvo.",
    ],
    geography: [
      "Múzeum sa nachádza v historickom jadre Detvy, ktoré samo dokumentuje vývoj mesta v údolí Detvianskeho potoka na južnom okraji Poľany.",
      "Region, ktorý spravuje, je typický rozptýleným lazníckym osídlením; práve túto identitu múzeum spracúva.",
    ],
    history: [
      "Podpoľanie je tradičný región v centrálnej časti Banskobystrického samosprávneho kraja, ktorého administratívnym centrom je okresné mesto Detva. Jeho kultúra stojí na pastierstve, bryndziarstve, drevorezbárstve a folklóre.",
    ],
    highlights: [
      "Prehľad regionálnej histórie a ľudovej kultúry na jednom mieste.",
      "Vhodná úvodná zastávka pred návštevou terénnych lokalít regiónu.",
      "Blízkosť námestia a ďalších pamiatok historického jadra.",
    ],
    visitorAppeal:
      "Múzeum má potenciál ako kultúrne a vzdelávacie centrum regiónu — pre školské výpravy, tematické výstavy a prepojenie s terénnymi lokalitami Podpoľania.",
    facts: [
      { label: "Okres", value: "Detva" },
      { label: "Zameranie", value: "Regionálna história a etnografia" },
    ],
    research: {
      focus:
        "Ako múzeum pracuje s miestnou identitou Podpoľania a ktoré témy považuje pre región za kľúčové.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detva-javorinka.jpg",
      alt: "Pohľad na Detvu z Javorinky",
      kind: "illustrative",
      note: "Ilustračný pohľad na mesto Detva, nie priamy záber múzea.",
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
        "Rok založenia, zriaďovateľ a prehľad stálych expozícií (overiť u múzea).",
        "Oficiálna adresa, otváracie hodiny a vstupné — neuvádzame ich, kým nie sú overené.",
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
      "Prírodný amfiteáter na severnom okraji Detvy a dejisko najznámejšej folklórnej prehliadky regiónu.",
    description: [
      "Detviansky amfiteáter je prírodný areál s hľadiskom využívajúci prirodzený sklon terénu na severnom okraji mesta. Otvorený priestor umožňuje organizovať podujatia pod holým nebom pre veľké publikum.",
      "Mesto Detva amfiteáter prenajíma záujemcom o podujatia a zverejňuje kalendár jeho obsadenosti, takže v areáli sa popri festivaloch konajú aj ďalšie kultúrne a spoločenské akcie.",
    ],
    geography: [
      "Amfiteáter leží na severnom okraji Detvy, na prechode mesta do svahov Poľany — v prostredí, ktoré spája mestskú zástavbu s prírodou.",
      "Hľadisko je orientované do otvoreného priestoru tak, aby využilo terénny sklon.",
    ],
    history: [
      "Amfiteáter je spojený s festivalom Folklórne slávnosti pod Poľanou v Detve, kde sa stretávajú folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
    ],
    highlights: [
      "Živá ľudová kultúra — prehliadky spevu, tanca a hudby pod holým nebom.",
      "Jedno z najznámejších podujatí svojho druhu na Slovensku.",
      "Kombinácia kultúrneho zážitku a prírodného prostredia pod Poľanou.",
    ],
    visitorAppeal:
      "Silný kultúrno-turistický magnet regiónu. Má potenciál rozšíriť program mimo hlavnej festivalovej sezóny — koncerty, divadlo a komunitné podujatia.",
    facts: [
      { label: "Typ", value: "Prírodný amfiteáter" },
      { label: "Poloha", value: "Severný okraj Detvy" },
    ],
    research: {
      focus:
        "Význam folklórnych slávností pre kultúrnu identitu regiónu a pre miestnu ekonomiku.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "folklor-detva.jpg",
      alt: "Folklórne slávnosti pod Poľanou v Detve",
      kind: "actual",
      note: "Záber z folklórnych slávností, ktoré sa konajú v detvianskom amfiteátri.",
    },
    sources: [
      { label: "Mesto Detva — Amfiteáter", url: "https://www.detva.sk/amfiteater.html" },
      { label: "OpenStreetMap — amfiteáter (way 243291757)", url: "https://www.openstreetmap.org/way/243291757" },
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Kapacita hľadiska a rok výstavby amfiteátra (overiť u organizátora).",
        "Presný názov a periodicita festivalu v aktuálnom roku.",
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
      "Historický dom rodiny Vagačovcov, zakladateľov prvej bryndziarne na Slovensku, a dominanta Detvy.",
    description: [
      "Vagačov dom je pôvodne rodinný dom Vagačovcov, postavený v roku 1908, ktorý patrí k výrazným stavbám historickej časti Detvy na Partizánskej ulici. Mesto ho označuje za jednu zo svojich dominánt.",
      "Jeho význam nespočíva len v architektúre, ale predovšetkým v spojení s menom Vagačovcov, ktorí v Detve položili základy bryndziarskej výroby.",
    ],
    geography: [
      "Dom stojí v historickej časti Detvy, v údolí Detvianskeho potoka na južnom okraji Poľany.",
      "Poloha v centre mesta z neho robí jednu z výrazných stavieb historického jadra.",
    ],
    history: [
      "V roku 1787 založil Ján Vagač, rodák zo Starej Turej, v Detve prvú bryndziareň (manufaktúru na výrobu bryndze) na Slovensku. Výrobky z nej preslávili Detvu aj v zahraničí, najmä v Rakúsku a v Amerike.",
      "Samotný Vagačov dom, pôvodne rodinný dom Vagačovcov, bol postavený v roku 1908; jeho dnešná podoba tak patrí do neskoršieho obdobia než samotná bryndziareň.",
    ],
    highlights: [
      "Priama väzba na bryndziarsku tradíciu, ktorá preslávila Detvu.",
      "Architektúra historického domu v centre mesta.",
      "Príbeh rodiny, ktorá ovplyvnila hospodárstvo celého regiónu.",
    ],
    visitorAppeal:
      "Vhodný ako súčasť mestskej pamiatkovej trasy a ako miesto pre expozíciu o bryndziarstve. Prepojenie s gastronomickou tradíciou môže zvýšiť jeho atraktivitu.",
    facts: [
      { label: "Rok stavby domu", value: "1908" },
      { label: "Bryndziareň", value: "1787" },
      { label: "Ulica", value: "Partizánska" },
    ],
    research: {
      focus:
        "Bryndziarska tradícia a jej miesto v hospodárstve a identite Podpoľania.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "kroj.jpg",
      alt: "Historický detviansky kroj (okolo roku 1910)",
      kind: "illustrative",
      note: "Ilustračný záber detvianskeho kroja z obdobia okolo roku 1910, nie budova Vagačovho domu.",
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
        "Súčasné využitie budovy a jej stavebný stav.",
        "Vzťah medzi dnešnou podobou domu (1908) a pôvodnou bryndziarňou (1787) — objasniť v teréne.",
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
      "Nízky vrch nad Detvou so skalnou plošinou, ktorá je významnou archeologickou lokalitou a chránenou prírodnou pamiatkou.",
    description: [
      "Kaľamárka je vrch s niekoľkými skalnatými pahorkami a skalnou plošinou so strmými stenami na vrchole. Jej poloha nad mestom z nej robí dostupný cieľ kratších výstupov.",
      "Popri prírodnej hodnote je vrch aj výnimočnou archeologickou lokalitou — skalnatá plošina bola osídlená v praveku aj v ranom stredoveku.",
    ],
    geography: [
      "Kaľamárka (807,9 m n. m.) je vrch v pohorí Poľana, v geomorfologickom podcelku Detvianske predhorie. Leží približne 4 km severne od Detvy.",
      "Vrch tvorí nevýrazný hrebeň s niekoľkými skalnatými pahorkami; lokalita patrí do povodia Slatiny a do Chránenej krajinnej oblasti Poľana.",
    ],
    history: [
      "Skalná plošina na vrchole je významná archeologická lokalita z doby bronzovej a z veľkomoravského obdobia. V ranom stredoveku tu stálo veľkomoravské hradisko.",
      "Časť vrcholu je dnes chránenou prírodnou pamiatkou vyhlásenou v roku 1977 na rozlohe 1,28 ha; predmetom ochrany je erózny zvyšok bočného andezitového prúdu.",
    ],
    highlights: [
      "Archeologická lokalita z doby bronzovej a veľkomoravského obdobia.",
      "Obmedzený, ale pekný rozhľad na Detviansku kotlinu a okolité vrchy.",
      "Dostupnosť značenou Rudnou magistrálou z Detvy.",
    ],
    visitorAppeal:
      "Obľúbený cieľ kratších peších výletov z Detvy. Spojenie prírody, výhľadov a archeológie z neho robí vhodnú lokalitu pre náučný výstup a vzdelávacie trasy.",
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
      note: "Záber vyhotovený z Kaľamárky — výhľad na Detvu.",
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
        "Presný priebeh a aktuálny stav značenia prístupu k vrcholu.",
        "Rozsah chráneného územia vo vzťahu k samotnému vrcholu.",
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
      "Vysoká andezitová skalná ihla na južnom svahu Poľany, chránená ako prírodná pamiatka.",
    description: [
      "Melichova skala je približne 30 m vysoká skalná ihla, ktorá vystupuje z lesnatého svahu nad Skliarovom. Svojím tvarom pripomína obelisk a je výrazná už z väčšej vzdialenosti.",
      "Objekt je chránený ako prírodná pamiatka; jeho hodnota je vedecká aj estetická, pretože názorne ukazuje, ako erózia modeluje sopečné horniny.",
    ],
    geography: [
      "Melichova skala je prírodná pamiatka v správe Štátnej ochrany prírody Poľana, v katastrálnom území mesta Detva.",
      "Ide o skalnú ihlu na južnom, miernom svahu stratovulkánu Poľany. Vznikla pôsobením selektívnej erózie a denudácie, ktoré odstránili menej odolné časti andezitového prúdu a zachovali len jeho najtvrdšie jadro.",
    ],
    highlights: [
      "Ukážkový príklad vzniku skalných útvarov na vyhasnutej sopke.",
      "Výrazný prírodný objekt v lesnatom prostredí južných svahov Poľany.",
      "Prírodná pamiatka vyhlásená v roku 1964.",
    ],
    visitorAppeal:
      "Vhodný cieľ pre náučné trasy a geologicky zamerané vychádzky. Blízkosť ďalších andezitových útvarov vytvára potenciál pre spoločnú geologickú trasu regiónom.",
    facts: [
      { label: "Výška skaly", value: "≈ 30 m" },
      { label: "Vyhlásená", value: "1964" },
      { label: "Rozloha", value: "2,1060 ha" },
    ],
    research: {
      focus: "Geomorfológia andezitových útvarov Poľany a význam ich ochrany.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "polana-skliarovo.jpg",
      alt: "Poľana a Skliarovo pod ňou",
      kind: "illustrative",
      note: "Ilustračný záber oblasti Skliarovo pod Poľanou, kde sa lokalita nachádza — nie priamy záber skalnej ihly.",
    },
    sources: [
      { label: "Wikipédia (sk) — Melichova skala", url: "https://sk.wikipedia.org/wiki/Melichova_skala" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Presná poloha a prístupnosť skalného útvaru v teréne.",
        "Aktuálne označenie chráneného územia.",
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
      "Vodopád na Bystrom potoku v masíve Poľany, chránený ako národná prírodná pamiatka.",
    description: [
      "Vodopád vzniká na Bystrom potoku v hornej časti povodia pod sedlom Priehybina. Voda sa prepadáva cez približne 20 m vysokú stenu, ktorá patrí k najpôsobivejším vodným útvarom masívu Poľany.",
      "Na rozdiel od väčšiny ostatných lokalít v tejto databáze neleží v Detve — nachádza sa v katastrálnom území susedného mesta Hriňová, hoci stále v okrese Detva.",
    ],
    geography: [
      "Vodopád sa nachádza v hornej časti Bystrého potoka južne až juhovýchodne od vrchu Poľana, pod sedlom Priehybina vo výške približne 983 m n. m.",
      "Bystrá je pravostranným prítokom Slatiny a pramení pod Poľanou; vodopád tak patrí do povodia Slatiny v pohorí Poľana.",
    ],
    history: [
      "Lokalita je národnou prírodnou pamiatkou a chráneným krajinným výtvorom. Hovorovo sa nazýva aj vodopád Bystré alebo vodopád Bystrô.",
    ],
    highlights: [
      "Vodopád ako výrazný krajinný prvok vytvorený činnosťou vody na vulkanickom podloží.",
      "Chránené územie s pomerne bohatou montánnou scenériou Poľany.",
      "Prírodná zaujímavosť kraja uvádzaná medzi hlavnými atrakciami Podpoľania.",
    ],
    visitorAppeal:
      "Atraktívny cieľ turistických vychádzok, ktorý možno zapojiť do značených trás a náučných chodníkov regiónu. Patrí medzi najnavštevovanejšie prírodné body Podpoľania.",
    facts: [
      { label: "Výška vodopádu", value: "≈ 20 m (zdroje sa líšia)" },
      { label: "Nadmorská výška", value: "≈ 983 m n. m." },
      { label: "Ochrana", value: "Národná prírodná pamiatka" },
    ],
    research: {
      focus:
        "Turistická návštevnosť vodopádu, prístupové trasy a vplyv návštevnosti na chránené územie.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "detviansky-potok.jpg",
      alt: "Detviansky potok v Novej Detve",
      kind: "illustrative",
      note: "Ilustračný záber vodného toku (Detviansky potok), nie samotný vodopád Bystrého potoka.",
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
        "Uvedená výška vodopádu sa v zdrojoch líši (Wikipédia ≈ 20 m, OpenStreetMap 23 m) — overiť v teréne.",
        "Uvedenie „Bystrô“ je hovorové; oficiálny názov je Vodopád Bystrého potoka.",
        "Oficiálny prístup a značenie trasy k vodopádu.",
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
      "Najvyšší vrch rovnomenného pohoria a srdce chránenej krajinnej oblasti pod ochranou UNESCO.",
    description: [
      "Poľana je najvyšší vrch svojho pohoria a zároveň dominantný masív celého regiónu. Vrchol poskytuje rozľahlé výhľady na okolité pohoria aj na Podpoľanie.",
      "Masív je silne erodovaným stratovulkánom s kalderou, ktorá mu dáva charakteristický kruhový tvar. Vďaka zachovalým lesom a lúkam patrí k najhodnotnejším chráneným územiam na Slovensku.",
    ],
    geography: [
      "Poľana (1 457,8 m n. m.) je najvyšší vrch pohoria Poľana, krajinného celku Slovenského stredohoria. Leží približne 7 km severne od Hriňovej.",
      "Vrchol je súčasťou národnej prírodnej rezervácie Zadná Poľana, ktorá sa nachádza v katastrálnych územiach obcí Očová, Valaská a mesta Hriňová, v okresoch Zvolen, Detva a Brezno. Rezervácia má rozlohu 855,4941 ha (novelizovaná 1993).",
      "Poľana sa považuje za najvyššiu vyhasnutú sopku v Strednej Európe; jej kaldera má v priemere približne 6 km.",
    ],
    history: [
      "Chránená krajinná oblasť Poľana bola vyhlásená v roku 1981. Od roku 1990 je Poľana súčasťou slovenských biosférických rezervácií programu UNESCO Človek a biosféra.",
    ],
    highlights: [
      "Najvyšší vrch pohoria a jeden z najzaujímavejších vulkanických útvarov v Európe.",
      "Chránené územie s náučnými chodníkmi (dlhší okruh 17 km, kratší 8,5 km).",
      "Rozhľady na okolité pohoria a na Podpoľanie.",
    ],
    visitorAppeal:
      "Nosná lokalita turistiky regiónu s celoročným potenciálom — pešia turistika, náučné chodníky a vzdelávacie programy o vulkanizme a ochrane prírody.",
    facts: [
      { label: "Nadmorská výška", value: "1 457,8 m n. m." },
      { label: "Ochrana", value: "CHKO Poľana (1981)" },
      { label: "UNESCO", value: "Biosférická rezervácia (1990)" },
      { label: "NPR Zadná Poľana", value: "855,4941 ha (1953/1993)" },
    ],
    research: {
      focus:
        "Význam ochrany prírody a vzťah návštevníkov k chránenému územiu Poľany.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "polana-skliarovo.jpg",
      alt: "Masív Poľany a Skliarovo",
      kind: "actual",
      note: "Záber masívu Poľany nad Skliarovom (vrch Poľana, 1458 m).",
    },
    sources: [
      { label: "Wikipédia (sk) — Poľana (vrch)", url: "https://sk.wikipedia.org/wiki/Po%C4%BEana_(vrch)" },
      { label: "Wikipédia (sk) — Zadná Poľana", url: "https://sk.wikipedia.org/wiki/Zadn%C3%A1_Po%C4%BEana" },
      { label: "Wikipédia (sk) — Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
    ],
    verification: {
      status: "čiastočne overené",
      items: [
        "Superlatív „najvyššia vyhasnutá sopka v Strednej Európe“ je široko citovaný — overiť voči odbornej literatúre.",
        "Prístupové trasy a sezónne obmedzenia v chránenom území.",
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
      "Súbor vyrezávaných drevených krížov predstavujúci osobitú drevorezbársku tradíciu Podpoľania.",
    description: [
      "Expozícia približuje jednu z najcharakteristickejších podôb ľudového umenia regiónu — vyrezávané drevené kríže. Tie sa v Podpoľaní tradične stavali popri cestách, na cintorínoch aj v krajine.",
      "Lokalita je súčasťou širšieho areálu kalvárie v severovýchodnej časti Detvy, kde sa nachádza aj kaplnka Sedembolestnej Panny Márie.",
    ],
    geography: [
      "Expozícia sa nachádza v Detve, v priestore kalvárie na prechode mesta do okolitej krajiny.",
      "Prícestné a náhrobné drevené vyrezávané kríže s osobitou drevorezbou sú typickým prvkom krajiny v okolí masívu Poľany — nachádzajú sa popri cestách tunajších lazov aj na cintorínoch.",
    ],
    history: [
      "Drevorezbárstvo patrí k najvýraznejším prejavom ľudovej kultúry regiónu. Drevené kríže nesú stopy miestnej umeleckej tradície, ktorá sa uchovávala z generácie na generáciu.",
    ],
    highlights: [
      "Ukážka osobitého detvianskeho drevorezbárstva.",
      "Prepojenie remesla, viery a krajiny regiónu.",
      "Súčasť širšieho areálu kalvárie v Detve.",
    ],
    visitorAppeal:
      "Vhodné ako zastávka mestskej kultúrnej trasy. Má potenciál priblížiť remeselnú tradíciu širokej verejnosti aj prostredníctvom sprievodných materiálov a náučných tabúľ.",
    facts: [
      { label: "Typ", value: "Expozícia ľudového umenia" },
      { label: "Poloha", value: "Detva — kalvária" },
    ],
    research: {
      focus:
        "Drevorezbárska tradícia Podpoľania a spôsoby, ako sa udržiava medzi generáciami.",
      status: "plánovaný výskum",
    },
    hero: {
      slug: "folklor-detva.jpg",
      alt: "Prehliadka ľudovej kultúry v Detve",
      kind: "illustrative",
      note: "Ilustračný záber ľudovej kultúry v Detve, nie priamy záber expozície krížov.",
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
        "Presný rozsah a správa expozície (vlastník, počet krížov) — overiť lokálne.",
        "Súvislosť s areálom kalvárie a kaplnky Sedembolestnej Panny Márie.",
        "Presné umiestnenie vstupu do expozície.",
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
