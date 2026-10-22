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
  title: "Údaje so zdrojom, nič navyše",
  body: [
    "V regionálnom výskume zhromažďujeme to, čo o Podpoľaní vieme doložiť zdrojom. Pri každej položke uvádzame, odkiaľ údaj pochádza a nakoľko je overený.",
    "Ak overený údaj chýba, miesto necháme otvorené a jasne označené. Radšej prázdne pole než vymyslený fakt, pieseň alebo povesť.",
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
    lede: "Chránené útvary a miesta, ktoré ukazujú vulkanický pôvod krajiny Podpoľania.",
    entries: [
      {
        id: "polana",
        name: "Poľana",
        summary:
          "Najvyšší vrch pohoria a veľký vyhasnutý stratovulkán, pod ktorým leží celé Podpoľanie.",
        description: [
          "Poľana (1 457,8 m n. m.) je najvyšší vrch rovnomenného pohoria v Slovenskom stredohorí a najvýraznejší masív regiónu. Z vrcholu je široký výhľad na okolité pohoria aj na Podpoľanie.",
          "Masív je silne erodovaný stratovulkán. Jeho kaldera má v priemere približne 6 km, a preto má celé pohorie kruhový pôdorys.",
        ],
        geography: [
          "Vrchol patrí do národnej prírodnej rezervácie Zadná Poľana. Rezervácia má rozlohu 855,4941 ha, novelizovaná bola v roku 1993 a zasahuje do katastrov obcí Očová a Valaská a mesta Hriňová.",
          "Chránenú krajinnú oblasť Poľana vyhlásili v roku 1981. Od roku 1990 je Poľana zapísaná medzi slovenské biosférické rezervácie UNESCO v programe Človek a biosféra.",
        ],
        culture: [
          "Poľana je symbolom regiónu. Podľa pohoria dostalo meno aj celé Podpoľanie.",
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
            "Tvrdenie „najvyššie sopečné pohorie na Slovensku / v Európe“ sa uvádza vo viacerých zdrojoch. Treba ho doložiť odborným prameňom.",
            "Rozsah národnej prírodnej rezervácie overiť podľa aktuálneho výnosu.",
          ],
        },
      },
      {
        id: "melichova-skala",
        name: "Melichova skala",
        summary:
          "Približne 30 m vysoká andezitová skalná ihla na južnom svahu Poľany, chránená ako prírodná pamiatka.",
        description: [
          "Melichova skala je približne 30 m vysoká skalná ihla. Vystupuje z lesnatého svahu nad Skliarovom, tvarom pripomína obelisk a je výrazná už z väčšej vzdialenosti.",
          "Má vedeckú aj estetickú hodnotu. Na skale je totiž vidno, ako selektívna erózia a zvetrávanie pretvárajú sopečné horniny.",
        ],
        geography: [
          "Je to prírodná pamiatka v katastrálnom území mesta Detva, v časti Skliarovo. Spravuje ju Štátna ochrana prírody.",
          "Skala vznikla odstránením menej odolných častí andezitového prúdu. Zostalo len jeho najtvrdšie jadro.",
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
          note: "Ilustračná fotografia oblasti Skliarovo pod Poľanou, nie samotnej skalnej ihly.",
        },
        sources: [{ label: "Wikipédia (sk): Melichova skala", url: "https://sk.wikipedia.org/wiki/Melichova_skala" }],
        verification: {
          status: "čiastočne overené",
          items: [
            "Overiť presnú polohu skaly a ako sa k nej dá dostať.",
            "Overiť aktuálne označenie chráneného územia a jeho hranice.",
          ],
        },
      },
      {
        id: "kalamarka",
        name: "Kaľamárka",
        alsoKnownAs: ["Kalamárka"],
        summary:
          "Nízky vrch nad Detvou so skalnou plošinou. Je to archeologická lokalita aj chránená prírodná pamiatka.",
        description: [
          "Kaľamárka je vrch s niekoľkými skalnatými pahorkami. Na vrchole má skalnú plošinu so strmými stenami a leží približne 4 km severne od centra Detvy.",
          "Má prírodnú aj historickú hodnotu. Časť vrcholu je chránenou prírodnou pamiatkou a plošina bola osídlená už v praveku a v ranom stredoveku.",
        ],
        geography: [
          "Chráni sa erózny zvyšok bočného andezitového prúdu. Prírodnú pamiatku vyhlásili v roku 1977 na rozlohe 1,28 ha.",
          "Vrch leží v pohorí Poľana, v povodí Slatiny. Prístup je značenou Rudnou magistrálou z Detvy.",
        ],
        culture: [
          "V ranom stredoveku stálo na vrchole veľkomoravské hradisko. Archeologické nálezy dokladajú osídlenie už v dobe bronzovej.",
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
            "Overiť, aká časť vrcholu patrí do chráneného územia.",
            "Overiť presnú trasu a značenie prístupu k vrcholu.",
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
    lede: "Stavby, múzeá a miesta, ktoré pripomínajú históriu Detvy a ľudovú kultúru Podpoľania.",
    entries: [
      {
        id: "kostol-sv-frantiska",
        name: "Kostol sv. Františka z Assisi",
        summary:
          "Rímskokatolícky kostol z prelomu 18. a 19. storočia a jedna z najvýraznejších stavieb Detvy.",
        description: [
          "Kostol sv. Františka z Assisi je jednoloďová klasicistická stavba. Má pravouhlo ukončené presbytérium a vežu.",
          "Je vyšší než okolitá zástavba, preto ho vidno z viacerých častí mesta a slúži ako orientačný bod.",
        ],
        culture: [
          "Kostol postavili v rokoch 1804 – 1805 na mieste staršej renesančnej stavby z rokov 1662 – 1664. V roku 1823 prešiel prestavbou.",
          "Kostol dodnes patrí k farskému a kultúrnemu životu mesta.",
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
          note: "Ilustračná fotografia historickej časti Detvy, nie samotného kostola.",
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
            "Overiť rok zápisu medzi pamiatky a zoznam pamiatkových objektov.",
            "Presné údaje o prestavbách doplniť podľa Pamiatkového úradu SR.",
          ],
        },
      },
      {
        id: "podpolianske-muzeum",
        name: "Podpolianske múzeum",
        summary:
          "Regionálne múzeum v centre Detvy, ktoré sa venuje histórii a ľudovej kultúre Podpoľania.",
        description: [
          "Podpolianske múzeum sídli v centre Detvy, neďaleko námestia SNP. Vo svojich zbierkach sa zameriava na históriu regiónu a ľudovú kultúru Podpoľania.",
          "Dozvieš sa tu viac o okolitých lokalitách — od bryndziarstva po drevorezbárstvo.",
        ],
        facts: [
          { label: "Okres", value: "Detva" },
          { label: "Zameranie", value: "regionálna história a etnografia" },
        ],
        image: {
          slug: "detva-javorinka.jpg",
          alt: "Pohľad na mesto Detva od Javorinky",
          kind: "illustrative",
          note: "Ilustračná fotografia mesta Detva, nie samotného múzea.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "na overenie",
          items: [
            "Rok založenia, zriaďovateľa a aktuálne expozície doplniť z oficiálneho zdroja múzea.",
            "Overiť otváracie hodiny a vstupné.",
          ],
        },
      },
      {
        id: "vagacov-dom",
        name: "Vagačov dom",
        summary:
          "Dom z roku 1908, ktorý je spojený s bryndziarskou tradíciou a rodinou Vagačovcov.",
        description: [
          "Vagačov dom stojí na Partizánskej ulici v historickej časti Detvy. Mesto ho považuje za jednu zo svojich dominánt.",
          "Dom pripomína rodinu Vagačovcov, ktorá v Detve začala bryndziarsku výrobu. K historickej zástavbe mesta patrí aj svojou architektúrou.",
        ],
        culture: [
          "V roku 1787 založil Ján Vagač, rodák zo Starej Turej, v Detve prvú bryndziareň na Slovensku. Výrobky odtiaľto preslávili Detvu doma aj v zahraničí.",
          "Samotný dom postavili až v roku 1908. Dnešná budova teda pochádza z neskoršieho obdobia než bryndziareň.",
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
          note: "Ilustračná fotografia detvianskeho kroja, nie budovy Vagačovho domu.",
        },
        sources: [
          { label: "Wikipédia (sk): Detva", url: "https://sk.wikipedia.org/wiki/Detva" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Objasniť vzťah medzi domom z roku 1908 a pôvodnou bryndziarňou z roku 1787.",
            "Overiť, ako budovu využívajú dnes a v akom je stavebnom stave.",
          ],
        },
      },
      {
        id: "amfiteater",
        name: "Detviansky amfiteáter",
        summary:
          "Prírodný amfiteáter na severnom okraji Detvy, kde sa konajú Folklórne slávnosti pod Poľanou.",
        description: [
          "Amfiteáter je prírodný areál s hľadiskom. Využíva sklon terénu na severnom okraji mesta. Podujatia sa preto môžu konať pod holým nebom.",
          "Je spojený s festivalom Folklórne slávnosti pod Poľanou. Na podujatí sa stretávajú folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
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
            "Rok vzniku areálu a kapacitu hľadiska doplniť z oficiálneho zdroja mesta.",
            "Overiť presný názov festivalu a jeho ročník v aktuálnom roku.",
          ],
        },
      },
      {
        id: "drevene-krize",
        name: "Expozícia detvianskych drevených krížov",
        summary:
          "Expozícia ľudového umenia, ktorá predstavuje detvianske drevorezbárstvo a tradíciu drevených krížov.",
        description: [
          "Expozícia ukazuje drevorezbársku tradíciu Podpoľania. Drevené kríže tradične stoja pri cestách, na lúkach a v obciach. Nesú stopy remesla, ktoré sa odovzdávalo z generácie na generáciu.",
          "Expozícia je súčasťou širšieho areálu kalvárie v Detve.",
        ],
        facts: [
          { label: "Typ", value: "expozícia ľudového umenia" },
          { label: "Poloha", value: "Detva — kalvária" },
        ],
        image: {
          slug: "folklor-detva.jpg",
          alt: "Ľudová kultúra v Detve",
          kind: "illustrative",
          note: "Ilustračná fotografia ľudovej kultúry v Detve, nie samotnej expozície.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "na overenie",
          items: [
            "Overiť rozsah expozície, jej správcu a počet krížov.",
            "Overiť presné miesto a prístup k expozícii.",
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
    lede: "Vodné toky, ktoré dávajú krajine a osídleniu Podpoľania tvar.",
    note: "Presné dĺžky tokov, čísla povodí a kvalitu vody uvádzame až po overení. Radšej prázdne pole než vymyslené číslo.",
    entries: [
      {
        id: "detviansky-potok",
        name: "Detviansky potok",
        summary:
          "Potok, v ktorého údolí leží Detva. Jeho tok určuje podobu historického jadra mesta.",
        description: [
          "Detva leží v údolí Detvianskeho potoka na južnom okraji Poľany. Potok je osou, okolo ktorej sa rozvinulo historické jadro aj novšia zástavba.",
          "Spoluvytvára miestnu krajinu a preteká aj Novou Detvou.",
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
            "Overiť dĺžku toku, jeho priebeh a sútok s ďalším tokom.",
            "Doplniť zaradenie do povodia a kvalitu vody podľa vodohospodárskych podkladov.",
          ],
        },
      },
      {
        id: "slatina",
        name: "Slatina",
        summary:
          "Rieka, ktorej údolie lemuje južný okraj Detvy a otvára krajinu smerom k pohoriu Javorie.",
        description: [
          "Južný okraj Detvy zasahuje do údolia Slatiny. Za ním sa otvára severné podhorie pohoria Javorie.",
          "Slatina je významný tok širšieho regiónu. Jej údolie tvorí južnú hranicu Detvianskej kotliny.",
        ],
        geography: [
          "Bystrá, na ktorej leží vodopád Bystrého potoka, je pravostranný prítok Slatiny. Povodie Slatiny preto zasahuje až do masívu Poľany.",
        ],
        facts: [{ label: "Významný prítok", value: "Bystrá (pravostranný)" }],
        image: {
          slug: "detva-old-part.jpg",
          alt: "Panoráma Detvy a jej okolia",
          kind: "illustrative",
          note: "Ilustračná panoráma Detvy a okolia, nie samotného toku.",
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
            "Doplniť dĺžku a povodie Slatiny z odbornej literatúry.",
            "Objasniť konkrétny vzťah Slatiny a Detvianskeho potoka.",
          ],
        },
      },
      {
        id: "bystry-potok",
        name: "Bystrý potok a Vodopád Bystrého potoka",
        summary:
          "Horský potok pod Poľanou s vodopádom, ktorý je chránený ako národná prírodná pamiatka.",
        description: [
          "Vodopád na Bystrom potoku patrí medzi najvýraznejšie prírodné útvary regiónu. Voda tu prekonáva stupeň vysoký približne 20 m.",
          "Lokalita leží v katastrálnom území mesta Hriňová, nie v Detve. Hovorovo sa nazýva aj vodopád Bystré alebo Bystrô.",
        ],
        geography: [
          "Bystrá pramení pod Poľanou a je pravostranný prítok Slatiny. Vodopád preto patrí do povodia Slatiny v pohorí Poľana.",
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
          note: "Ilustračná fotografia vodného toku (Detviansky potok), nie samotného vodopádu.",
        },
        sources: [
          {
            label: "Wikipédia (sk): Vodopád Bystrého potoka",
            url: "https://sk.wikipedia.org/wiki/Vodop%C3%A1d_Bystr%C3%A9ho_potoka",
          },
          { label: "Wikipédia (sk): Hriňová", url: "https://sk.wikipedia.org/wiki/Hri%C5%88ov%C3%A1" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Výška vodopádu sa v zdrojoch líši (napríklad približne 20 m a 23 m). Treba ju overiť v teréne.",
            "Overiť oficiálny prístup a značenie trasy k vodopádu.",
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
    lede: "Ľudová pieseň je súčasťou života v Podpoľaní. Konkrétne piesne doplníme až vtedy, keď k nim budeme mať zdroj.",
    note: "Konkrétne piesne a texty doplníme až s prameňom — z etnografickej zbierky, archívu alebo múzea.",
    entries: [
      {
        id: "ludova-piesen",
        name: "Ľudová pieseň v Podpoľaní",
        summary:
          "Pieseň ako súčasť kultúry Podpoľania — popri pastierstve, bryndziarstve a drevorezbárstve.",
        description: [
          "Kultúra Podpoľania stojí na pastierstve, bryndziarstve, drevorezbárstve a folklóre. Pieseň, hudba a tanec k nej patria.",
          "Ľudová pieseň sa kedysi odovzdávala ústne. Viaže sa na prácu, sviatky aj rodinné obrady. Dnes ju pripomínajú folklórne súbory a prehliadky.",
        ],
        culture: [
          "Tradíciu pripomína aj detviansky kroj. Nosí sa pri folklórnych príležitostiach a býva na fotografiách z podujatí.",
        ],
        image: {
          slug: "kroj.jpg",
          alt: "Detviansky kroj",
          kind: "illustrative",
          note: "Ilustračná fotografia detvianskeho kroja.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "čiastočne overené",
          items: [
            "Doplniť konkrétne piesne, texty a nahrávky z etnografických zbierok a archívov.",
            "Overiť údaje o zberateľoch ľudových piesní v odbornej literatúre.",
          ],
        },
      },
      {
        id: "folklorne-slavnosti",
        name: "Folklórne slávnosti pod Poľanou",
        summary:
          "Najznámejšia folklórna prehliadka regiónu. Pieseň a tanec sa tu dostávajú z archívov na javisko.",
        description: [
          "Folklórne slávnosti pod Poľanou sa konajú v detvianskom amfiteátri. Stretávajú sa tu folklórne súbory a ľudoví umelci z celého Slovenska aj zo zahraničia.",
          "Pre región je to jedno z najvýznamnejších podujatí svojho druhu. Zároveň je živým spôsobom, akým sa ľudová pieseň odovzdáva ďalej.",
        ],
        image: {
          slug: "folklor-detva.jpg",
          alt: "Folklórne slávnosti pod Poľanou v Detve",
          kind: "actual",
          note: "Fotografia z Folklórnych slávností pod Poľanou v Detve.",
        },
        sources: [
          { label: "Wikipédia (sk): Podpoľanie", url: "https://sk.wikipedia.org/wiki/Podpo%C4%BEanie" },
        ],
        verification: {
          status: "čiastočne overené",
          items: ["Overiť presný názov festivalu a jeho ročník v aktuálnom roku."],
        },
      },
      {
        id: "zbierka-piesni-todo",
        name: "Zbierka konkrétnych piesní",
        placeholder: true,
        summary: "Pripravujeme jednotlivé piesne s textom, notovým záznamom a uvedením zdroja.",
        description: [
          "Táto položka je zámerne prázdna. Konkrétne piesne, ich texty a pôvod zverejníme až po overení. Bez zdroja by sme ich mohli skresliť.",
          "Údaje doplníme z etnografických zbierok, zvukových archívov, odborných publikácií o ľudovej kultúre Podpoľania a z podkladov Podpolianskeho múzea.",
        ],
        verification: { status: "pripravujeme" },
      },
    ],
  },

  // =========================================================================
  // 5. Legends & folklore
  // =========================================================================
  {
    id: "povesti",
    key: "povesti",
    eyebrow: "05 — Povesti",
    title: "Povesti a legendy regiónu",
    lede: "Ľudové príbehy Podpoľania. Povesti zverejníme až s overeným prameňom. Zatiaľ tu preto nájdeš len rámec, ako ich budeme overovať.",
    note: "Povesti patria k ústnej tradícii a často sa viažu na konkrétne miesta. Aby sme nič nefabulovali, zatiaľ uverejňujeme len rámec a spôsob overovania.",
    entries: [
      {
        id: "povesti-todo",
        name: "Povesti a legendy regiónu",
        placeholder: true,
        summary: "Pripravujeme jednotlivé povesti regiónu s uvedením prameňa.",
        description: [
          "Povesti zverejníme len s overeným zdrojom. Bez prameňa by sa miestna tradícia mohla skresliť, preto túto časť zatiaľ nechávame otvorenú.",
          "Údaje doplníme z publikovaných zbierok povestí, regionálnej literatúry a tlače, miestnych archívov a podkladov Podpolianskeho múzea.",
        ],
        verification: { status: "pripravujeme" },
      },
    ],
  },
];
