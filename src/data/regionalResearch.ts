/**
 * Regionálny výskum Podpoľania — five thematic, fully editable sections.
 *
 * Editorial rules (same spirit as src/data/locations.ts):
 *  - Only verifiable, sourced statements. No invented legends, songs, lyrics,
 *    authors, dates or geographical facts.
 *  - Every entry carries a `verification` block; uncertain points are listed
 *    instead of being asserted.
 *  - Where research is missing we publish an explicit `placeholder` entry
 *    rather than fabricating content.
 *
 * Editing this single file updates the whole /regionalny-vyskum page.
 */

export type ResearchSectionId = "prirodne" | "kulturne" | "vodne" | "piesne" | "povesti";

export type VerificationStatus =
  | "overené"
  | "čiastočne overené"
  | "na overenie"
  | "pripravujeme";

export type ResearchSource = { label: string; url?: string };

export type ResearchFact = { label: string; value: string };

export type ResearchImage = {
  slug: string;
  alt: string;
  /** "actual" = photo of this subject · "illustrative" = related/atmosphere shot. */
  kind: "actual" | "illustrative";
  note?: string;
};

export type ResearchEntry = {
  id: string;
  name: string;
  alsoKnownAs?: readonly string[];
  /** One-sentence lead shown under the title. */
  summary: string;
  description: readonly string[];
  /** Geographic context (where / how it forms the landscape). */
  geography?: readonly string[];
  /** Cultural or historical context. */
  culture?: readonly string[];
  facts?: readonly ResearchFact[];
  image?: ResearchImage;
  sources?: readonly ResearchSource[];
  verification: { status: VerificationStatus; items?: readonly string[] };
  /** True when this entry is an explicit to-do, not yet researched content. */
  placeholder?: boolean;
};

export type ResearchSection = {
  id: string;
  key: ResearchSectionId;
  eyebrow: string;
  title: string;
  lede: string;
  note?: string;
  entries: readonly ResearchEntry[];
};

export const researchIntro = {
  eyebrow: "Ako túto časť čítame",
  title: "Overené údaje, označené zdroje",
  body: [
    "Regionálny výskum zhromažďuje to, čo o Podpoľaní vieme doložiť zdrojom. Pri každej položke uvádzame, odkiaľ pochádza a nakoľko je overená.",
    "Kde overený údaj zatiaľ chýba, nechávame miesto otvorené a jasne označené. Radšej poctivé prázdne pole než vymyslený fakt, pieseň alebo povesť.",
  ],
} as const;

export const researchSections: readonly ResearchSection[] = [
  // =========================================================================
  // 1. Natural monuments
  // =========================================================================
  {
    id: "prirodne",
    key: "prirodne",
    eyebrow: "01 — Príroda",
    title: "Zaujímavé prírodné pamiatky",
    lede: "Chránené útvary a lokality, ktoré dokumentujú vulkanický pôvod krajiny Podpoľania.",
    entries: [
      {
        id: "polana",
        name: "Poľana",
        summary:
          "Najvyšší vrch pohoria a dominantný vyhasnutý stratovulkán, pod ktorým sa rozkladá celé Podpoľanie.",
        description: [
          "Poľana (1 457,8 m n. m.) je najvyšší vrch rovnomenného pohoria v Slovenskom stredohorí a najvýraznejšia dominanta regiónu. Z vrcholu sa otvárajú rozľahlé výhľady na okolité pohoria aj na Podpoľanie.",
          "Masív je silne erodovaným stratovulkánom s kráterovou kalderou s priemerom približne 6 km, ktorá mu dáva charakteristický kruhový pôdorys.",
        ],
        geography: [
          "Vrchol je súčasťou národnej prírodnej rezervácie Zadná Poľana (rozloha 855,4941 ha, novelizácia 1993), ktorá zasahuje do katastrov obcí Očová a Valaská a mesta Hriňová.",
          "Chránená krajinná oblasť Poľana bola vyhlásená v roku 1981; od roku 1990 je Poľana zapísaná medzi slovenské biosférické rezervácie UNESCO v rámci programu Človek a biosféra.",
        ],
        culture: [
          "Poľana je symbolom regiónu — podľa pohoria nesie meno celé Podpoľanie a jeho meno sa odráža v miestnych názvoch aj vo folklóre.",
        ],
        facts: [
          { label: "Nadmorská výška", value: "1 457,8 m n. m." },
          { label: "CHKO Poľana", value: "vyhlásená 1981" },
          { label: "UNESCO", value: "biosférická rezervácia od 1990" },
          { label: "NPR Zadná Poľana", value: "855,4941 ha" },
        ],
        image: {
          slug: "polana-skliarovo.jpg",
          alt: "Masív Poľany nad Skliarovom pri Detve",
          kind: "actual",
        },
        sources: [
          {
            label: "Wikipédia (sk): Poľana",
            url: "https://sk.wikipedia.org/wiki/Po%C4%BEana_(vrch)",
          },
          {
            label: "Wikipédia (sk): Chránená krajinná oblasť Poľana",
            url: "https://sk.wikipedia.org/wiki/Chr%C3%A1nen%C3%A1_krajinn%C3%A1_oblas%C5%A5_Po%C4%BEana",
          },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Tvrdenie „najvyššie sopečné pohorie na Slovensku / v Európe“ (uvádzané aj v iných zdrojoch) treba doložiť odborným prameňom.",
            "Rozsah národnej prírodnej rezervácie overiť podľa aktuálneho výnosu.",
          ],
        },
      },
      {
        id: "melichova-skala",
        name: "Melichova skala",
        summary:
          "Vysoká andezitová skalná ihla na južnom svahu Poľany, chránená ako prírodná pamiatka.",
        description: [
          "Melichova skala je približne 30 m vysoká skalná ihla, ktorá vystupuje z lesnatého svahu nad Skliarovom. Svojím tvarom pripomína obelisk a je výrazná už z väčšej vzdialenosti.",
          "Jej hodnota je vedecká aj estetická — názorne ukazuje, ako selektívna erózia a zvetrávanie modelujú sopečné horniny.",
        ],
        geography: [
          "Ide o prírodnú pamiatku v katastrálnom území mesta Detva (časť Skliarovo), v správe Štátnej ochrany prírody.",
          "Vznikla odstránením menej odolných častí andezitového prúdu; zachovalo sa len jeho najtvrdšie jadro.",
        ],
        facts: [
          { label: "Výška skaly", value: "≈ 30 m" },
          { label: "Vyhlásená", value: "1964" },
          { label: "Rozloha", value: "2,1060 ha" },
        ],
        image: {
          slug: "polana-skliarovo.jpg",
          alt: "Oblasť Skliarovo pod Poľanou pri Detve",
          kind: "illustrative",
          note: "Ilustračný záber oblasti Skliarovo pod Poľanou, nie priamy záber skalnej ihly.",
        },
        sources: [{ label: "Wikipédia (sk): Melichova skala", url: "https://sk.wikipedia.org/wiki/Melichova_skala" }],
        verification: {
          status: "čiastočne overené",
          items: [
            "Presná poloha a prístupnosť útvaru v teréne.",
            "Aktuálne označenie chráneného územia a hranice ochrany.",
          ],
        },
      },
      {
        id: "kalamarka",
        name: "Kaľamárka",
        alsoKnownAs: ["Kalamárka"],
        summary:
          "Nízky vrch nad Detvou so skalnou plošinou, ktorá je archeologickou lokalitou aj chránenou prírodnou pamiatkou.",
        description: [
          "Kaľamárka je vrch s niekoľkými skalnatými pahorkami a skalnou plošinou so strmými stenami na vrchole, približne 4 km severne od centra Detvy.",
          "Spája prírodnú a historickú hodnotu: časť vrcholu je chránenou prírodnou pamiatkou a plošina bola osídlená už v praveku a v ranom stredoveku.",
        ],
        geography: [
          "Predmetom ochrany je erózny zvyšok bočného andezitového prúdu; prírodná pamiatka bola vyhlásená v roku 1977 na rozlohe 1,28 ha.",
          "Vrch leží v pohorí Poľana, v povodí Slatiny; prístup je značenou Rudnou magistrálou z Detvy.",
        ],
        culture: [
          "Na vrchole stálo v ranom stredoveku veľkomoravské hradisko; archeologické nálezy dokladajú osídlenie už z doby bronzovej.",
        ],
        facts: [
          { label: "Prírodná pamiatka", value: "vyhlásená 1977" },
          { label: "Rozloha", value: "1,28 ha" },
          { label: "Vzdialenosť od centra", value: "≈ 4 km severne" },
        ],
        image: {
          slug: "detva-kalamar.jpg",
          alt: "Pohľad na Detvu z Kaľamárky",
          kind: "actual",
        },
        sources: [
          {
            label: "Wikipédia (sk): Kalamárka (vrch v Poľane)",
            url: "https://sk.wikipedia.org/wiki/Kalam%C3%A1rka_(vrch_v_Po%C4%BEane)",
          },
          {
            label: "Wikipédia (sk): Kalamárka (prírodná pamiatka)",
            url: "https://sk.wikipedia.org/wiki/Kalam%C3%A1rka_(pr%C3%ADrodn%C3%A1_pamiatka)",
          },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Rozsah chráneného územia vo vzťahu k samotnému vrcholu.",
            "Presný priebeh značenia prístupu k vrcholu.",
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 2. Cultural monuments
  // =========================================================================
  {
    id: "kulturne",
    key: "kulturne",
    eyebrow: "02 — Kultúra a história",
    title: "Zaujímavé kultúrne pamiatky",
    lede: "Stavby, inštitúcie a miesta, ktoré nesú pamäť Detvy a ľudovej kultúry Podpoľania.",
    entries: [
      {
        id: "kostol-sv-frantiska",
        name: "Kostol sv. Františka z Assisi",
        summary:
          "Rímskokatolícky kostol z prelomu 18. a 19. storočia a jedna z výrazných dominánt Detvy.",
        description: [
          "Kostol sv. Františka z Assisi je jednoloďová klasicistická stavba s pravouhle ukončeným presbytériom a s vežou, ktorá je súčasťou jej hmoty.",
          "Výškovo sa vymyká okolitej zástavbe, a preto je z viacerých častí mesta dobre čitateľný ako orientačný bod.",
        ],
        culture: [
          "Kostol pochádza z rokov 1804 – 1805 a stojí na mieste staršej renesančnej stavby z rokov 1662 – 1664; v roku 1823 prešiel prestavbou.",
          "Dodnes zostáva živým miestom farského a kultúrneho života mesta.",
        ],
        facts: [
          { label: "Vznik", value: "1804 – 1805" },
          { label: "Prestavba", value: "1823" },
          { label: "Cirkev", value: "rímskokatolícka" },
        ],
        image: {
          slug: "detva-stara-cast.jpg",
          alt: "Historická časť Detvy",
          kind: "illustrative",
          note: "Ilustračný záber historickej časti Detvy, nie priamy záber kostola.",
        },
        sources: [
          { label: "Wikipédia (sk): Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
          {
            label: "Wikiúdaje: Kostol sv. Františka z Assisi",
            url: "https://www.wikidata.org/wiki/Q112090969",
          },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Rok zápisu medzi pamiatky a zoznam pamiatkových objektov.",
            "Presné údaje o prestavbách (doplniť podľa Pamiatkového úradu SR).",
          ],
        },
      },
      {
        id: "podpolianske-muzeum",
        name: "Podpolianske múzeum",
        summary:
          "Regionálne múzeum v historickom jadre Detvy, venované histórii a ľudovej kultúre Podpoľania.",
        description: [
          "Podpolianske múzeum sídli v centre Detvy, v tesnej blízkosti námestia SNP. Zbierkovo sa orientuje na regionálnu históriu a na ľudovú kultúru podhorskej oblasti Podpoľania.",
          "Je prirodzeným miestom, kde možno získať kontext k okolitým lokalitám — od bryndziarskej tradície po drevorezbárstvo.",
        ],
        facts: [
          { label: "Okres", value: "Detva" },
          { label: "Zameranie", value: "regionálna história a etnografia" },
        ],
        image: {
          slug: "detva-javorinka.jpg",
          alt: "Pohľad na mesto Detva od Javorinky",
          kind: "illustrative",
          note: "Ilustračný pohľad na mesto Detva, nie priamy záber múzea.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "na overenie",
          items: [
            "Rok založenia, zriaďovateľ a aktuálne expozície (doplniť z oficiálneho zdroja múzea).",
            "Otváracie hodiny a vstupné.",
          ],
        },
      },
      {
        id: "vagacov-dom",
        name: "Vagačov dom",
        summary:
          "Historický dom z roku 1908, spojený s bryndziarskou tradíciou, ktorá preslávila Detvu.",
        description: [
          "Vagačov dom stojí na Partizánskej ulici v historickej časti Detvy a patrí k jej výrazným stavbám; mesto ho označuje za jednu zo svojich dominánt.",
          "Jeho význam nespočíva len v architektúre, ale predovšetkým v spojení s menom Vagačovcov, ktorí v Detve položili základy bryndziarskej výroby.",
        ],
        culture: [
          "V roku 1787 založil Ján Vagač, rodák zo Starej Turej, v Detve prvú bryndziareň na Slovensku. Výrobky odtiaľto preslávili Detvu doma aj v zahraničí.",
          "Samotný dom bol postavený v roku 1908 — jeho dnešná podoba teda patrí do neskoršieho obdobia než bryndziareň.",
        ],
        facts: [
          { label: "Rok stavby domu", value: "1908" },
          { label: "Bryndziareň", value: "1787" },
          { label: "Ulica", value: "Partizánska" },
        ],
        image: {
          slug: "kroj.jpg",
          alt: "Detviansky kroj",
          kind: "illustrative",
          note: "Ilustračný záber detvianskeho kroja, nie budova Vagačovho domu.",
        },
        sources: [
          { label: "Wikipédia (sk): Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Vzťah medzi dnešnou podobou domu (1908) a pôvodnou bryndziarňou (1787).",
            "Súčasné využitie budovy a jej stavebný stav.",
          ],
        },
      },
      {
        id: "amfiteater",
        name: "Detviansky amfiteáter",
        summary:
          "Prírodný amfiteáter na severnom okraji Detvy a dejisko Folklórnych slávností pod Poľanou.",
        description: [
          "Amfiteáter je prírodný areál s hľadiskom, ktorý využíva prirodzený sklon terénu na severnom okraji mesta. Otvorený priestor umožňuje organizovať podujatia pod holým nebom pre veľké publikum.",
          "Je spojený s festivalom Folklórne slávnosti pod Poľanou v Detve, kde sa stretávajú folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
        ],
        facts: [
          { label: "Typ", value: "prírodný amfiteáter" },
          { label: "Poloha", value: "severný okraj Detvy" },
        ],
        image: {
          slug: "folklor-detva.jpg",
          alt: "Folklórne slávnosti pod Poľanou v Detve",
          kind: "actual",
          note: "Záber z folklórnych slávností, ktoré sa konajú v detvianskom amfiteátri.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Rok vzniku areálu a kapacita hľadiska (doplniť z oficiálneho zdroja mesta).",
            "Presný názov a ročník festivalu v aktuálnom roku.",
          ],
        },
      },
      {
        id: "drevene-krize",
        name: "Expozícia detvianskych drevených krížov",
        summary:
          "Expozícia ľudového umenia približujúca detvianske drevorezbárstvo a tradíciu drevených krížov.",
        description: [
          "Expozícia predstavuje osobitú drevorezbársku tradíciu Podpoľania. Drevené kríže tradične zdobia krajinu regiónu — stoja pri cestách, na lúkach a v areáloch obcí — a nesú stopy remesla odovzdávaného z generácie na generáciu.",
          "Je súčasťou širšieho areálu kalvárie v Detve.",
        ],
        facts: [
          { label: "Typ", value: "expozícia ľudového umenia" },
          { label: "Poloha", value: "Detva — kalvária" },
        ],
        image: {
          slug: "folklor-detva.jpg",
          alt: "Ľudová kultúra v Detve",
          kind: "illustrative",
          note: "Ilustračný záber ľudovej kultúry v Detve, nie priamy záber expozície.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "na overenie",
          items: [
            "Rozsah a správca expozície (počet krížov, vlastník).",
            "Presné umiestnenie a prístup k expozícii.",
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 3. Watercourses
  // =========================================================================
  {
    id: "vodne",
    key: "vodne",
    eyebrow: "03 — Vodstvo",
    title: "Najvýznamnejšie vodné toky",
    lede: "Vodné toky, ktoré formujú krajinu a osídlenie Podpoľania.",
    note: "Presné dĺžky tokov, čísla povodí a kvalitu vody uvádzame len po ich overení. Radšej prázdne pole než vymyslené číslo.",
    entries: [
      {
        id: "detviansky-potok",
        name: "Detviansky potok",
        summary:
          "Potok, v ktorého údolí leží mesto Detva a ktorý je osou jeho historického jadra.",
        description: [
          "Detva leží v údolí Detvianskeho potoka na južnom okraji masívu Poľana. Tok je prirodzenou osou, okolo ktorej sa rozvinulo historické jadro aj novšia zástavba mesta.",
          "Potok spoluvytvára miestnu krajinu a pripomínajú ho aj názvy častí mesta, napríklad Nová Detva.",
        ],
        geography: [
          "Potok odvodňuje údolie, v ktorom sa Detva rozkladá, na južnom okraji pohoria Poľana.",
        ],
        image: {
          slug: "detviansky-potok.jpg",
          alt: "Detviansky potok v Novej Detve",
          kind: "actual",
        },
        sources: [
          { label: "Wikipédia (sk): Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
        ],
        verification: {
          status: "na overenie",
          items: [
            "Dĺžka toku, priebeh a sútok s ďalším tokom.",
            "Zaradenie do povodia a kvalita vody (podľa vodohospodárskych podkladov).",
          ],
        },
      },
      {
        id: "slatina",
        name: "Slatina",
        summary:
          "Rieka, ktorej údolie lemuje južný okraj Detvy a otvára krajinu smerom k pohorí Javorie.",
        description: [
          "Južný okraj mesta Detva zasahuje do údolia Slatiny, kde sa otvára severné podhorie pohoria Javorie.",
          "Slatina je významný tok širšieho regiónu; jej údolie vytvára prirodzenú južnú hranicu Detvianskej kotliny.",
        ],
        geography: [
          "Bystrá, na ktorej leží vodopád Bystrého potoka, je pravostranným prítokom Slatiny; povodie Slatiny tak zasahuje až do masívu Poľany.",
        ],
        facts: [{ label: "Významný prítok", value: "Bystrá (pravostranný)" }],
        image: {
          slug: "detva-old-part.jpg",
          alt: "Panoráma Detvy a jej okolia",
          kind: "illustrative",
          note: "Ilustračná panoráma Detvy a okolia, nie priamy záber toku.",
        },
        sources: [
          {
            label: "Wikipédia (sk): Vodopád Bystrého potoka",
            url: "https://sk.wikipedia.org/wiki/Vodop%C3%A1d_Bystr%C3%A9ho_potoka",
          },
          { label: "Wikipédia (sk): Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Dĺžka a povodie Slatiny (doplniť z odbornej literatúry).",
            "Konkrétny vzťah Slatiny a Detvianskeho potoka.",
          ],
        },
      },
      {
        id: "bystry-potok",
        name: "Bystrý potok a Vodopád Bystrého potoka",
        summary:
          "Horský potok pod Poľanou s rovnomenným vodopádom, chráneným ako národná prírodná pamiatka.",
        description: [
          "Vodopád na Bystrom potoku v masíve Poľany patrí medzi najvýraznejšie prírodné útvary regiónu; voda tu prekonáva stupeň vysoký približne 20 m.",
          "Lokalita leží v katastrálnom území mesta Hriňová (nie v Detve) a hovorovo sa označuje aj ako vodopád Bystré alebo Bystrô.",
        ],
        geography: [
          "Bystrá pramení pod Poľanou a je pravostranným prítokom Slatiny; vodopád tak patrí do povodia Slatiny v pohorí Poľana.",
        ],
        facts: [
          { label: "Výška vodopádu", value: "≈ 20 m (zdroje sa líšia)" },
          { label: "Ochrana", value: "národná prírodná pamiatka" },
          { label: "Poloha", value: "Hriňová (mimo Detvy)" },
        ],
        image: {
          slug: "detviansky-potok.jpg",
          alt: "Vodný tok pri Detve",
          kind: "illustrative",
          note: "Ilustračný záber vodného toku (Detviansky potok), nie samotný vodopád.",
        },
        sources: [
          {
            label: "Wikipédia (sk): Vodopád Bystrého potoka",
            url: "https://sk.wikipedia.org/wiki/Vodop%C3%A1d_Bystr%C3%A9ho_potoka",
          },
          { label: "Wikipédia (sk): Hriňová", url: "https://sk.wikipedia.org/wiki/Hri%C5%88ov%C3%A1" },
        ],
        verification: {
          status: "čiastočné overené" as VerificationStatus,
          items: [
            "Uvedená výška sa v zdrojoch líši (napr. ≈ 20 m vs. 23 m) — overiť v teréne.",
            "Oficiálny prístup a značenie trasy k vodopádu.",
          ],
        },
      },
    ],
  },

  // =========================================================================
  // 4. Folk songs
  // =========================================================================
  {
    id: "piesne",
    key: "piesne",
    eyebrow: "04 — Piesne",
    title: "Ľudové piesne Podpoľania",
    lede: "Ľudová pieseň ako živá súčasť identity Podpoľania — s dôrazom na overiteľné zdroje a bez vymyslených textov.",
    note: "Konkrétne piesne a texty doplníme len s prameňom: z etnografickej zbierky, archívu alebo múzea.",
    entries: [
      {
        id: "ludova-piesen",
        name: "Ľudová pieseň v Podpoľaní",
        summary:
          "Pieseň ako živá súčasť kultúry podhorskej oblasti — popri pastierstve, bryndziarstve a drevorezbárstve.",
        description: [
          "Kultúra Podpoľania stojí na pastierstve, bryndziarstve, drevorezbárstve a folklóre — pieseň, hudba a tanec sú jeho živou súčasťou.",
          "Ľudová pieseň sa tradične odovzdávala ústne a viazala sa na prácu, sviatky aj rodinné obrady. Dnes ju pripomínajú folklórne súbory a prehliadky.",
        ],
        culture: [
          "Nositeľom tejto tradície je aj detviansky kroj, ktorý sa nosí pri folklórnych príležitostiach a býva súčasťou ich fotodokumentácie.",
        ],
        image: {
          slug: "kroj.jpg",
          alt: "Detviansky kroj",
          kind: "illustrative",
          note: "Ilustračný záber detvianskeho kroja.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Konkrétne piesne, texty a nahrávky doplniť z etnografických zbierok a archívov.",
            "Údaje o zberateľoch ľudových piesní overiť v odbornej literatúre.",
          ],
        },
      },
      {
        id: "folklorne-slavnosti",
        name: "Folklórne slávnosti pod Poľanou",
        summary:
          "Najznámejšia folklórna prehliadka regiónu — pieseň a tanec tu vystupujú z archívov na javisko.",
        description: [
          "Folklórne slávnosti pod Poľanou sa konajú v detvianskom amfiteátri. Stretávajú sa tu folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
          "Pre región patria medzi najvýznamnejšie podujatia svojho druhu a sú živým spôsobom, akým sa ľudová pieseň odovzdáva ďalej.",
        ],
        image: {
          slug: "folklor-detva.jpg",
          alt: "Folklórne slávnosti pod Poľanou v Detve",
          kind: "actual",
          note: "Záber z Folklórnych slávností pod Poľanou v Detve.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "čiastočne overené",
          items: ["Presný názov a ročník festivalu v aktuálnom roku."],
        },
      },
      {
        id: "zbierka-piesni-todo",
        name: "Zbierka konkrétnych piesní",
        placeholder: true,
        summary: "Pripravované: jednotlivé piesne s textom, notovým záznamom a uvedením zdroja.",
        description: [
          "Táto položka je zámerne prázdna. Konkrétne piesne, ich texty a pôvod zverejníme až po overení — nechceme nič vymýšľať ani skresľovať.",
          "Doplniť z: etnografické zbierky, zvukové archívy, odborné publikácie o ľudovej kultúre Podpoľania a podklady Podpolianskeho múzea.",
        ],
        verification: { status: "pripravujeme" },
      },
    ],
  },

  // =========================================================================
  // 4. Legends & folklore
  // =========================================================================
  {
    id: "povesti",
    key: "povesti",
    eyebrow: "05 — Povesti",
    title: "Povesti a legendy regiónu",
    lede: "Ľudová slovesnosť Podpoľania. Povesti zverejňujeme až s overeným prameňom — doteraz ich neuvádzame, aby sme príbehy nevymýšľali.",
    note: "Povesti sú súčasťou ústnej tradície a často sa viažu na konkrétne miesta. Aby sme nič nefabulovali, uverejňujeme zatiaľ len rámec a spôsob overovania.",
    entries: [
      {
        id: "povesti-todo",
        name: "Povesti a legendy regiónu",
        placeholder: true,
        summary: "Pripravované: jednotlivé povesti regiónu s uvedením prameňa.",
        description: [
          "Povesti zverejníme len s overeným zdrojom. Bez prameňa by hrozilo, že miestnu tradíciu nechtiac skreslíme alebo si príbeh vymyslíme — preto túto časť zatiaľ nechávame otvorenú.",
          "Doplniť z: publikované zbierky povestí, regionálna literatúra a tlač, miestne archívy a podklady Podpolianskeho múzea.",
        ],
        verification: { status: "pripravujeme" },
      },
    ],
  },
];
