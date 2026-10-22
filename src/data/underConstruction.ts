import type { ComingItem } from "../components/ComingContent";

/**
 * Honest "in preparation" content for sections not yet built out.
 * Field-research results are intentionally NOT included anywhere.
 */

export const researchPage = {
  eyebrow: "Výskum",
  title: "Cieľ, otázky a metodika",
  lede: "Čo skúmame a ako. Výsledky zverejníme, až keď budú spracované a bude jasné, odkiaľ pochádzajú.",
  meta: [
    { label: "Typ", value: "Terénny geografický výskum" },
    { label: "Stav", value: "Dáta sa dopĺňajú" },
  ] as const,
  intro:
    "Projekt sa zameriava na vzťah ľudí a krajiny Podpoľania. V tejto časti vysvetľujeme, čo chceme zistiť, aké metódy používame a ako narábame s dátami.",
  items: [
    {
      title: "Výskumné otázky",
      description:
        "Zaujíma nás, ako poloha a krajina ovplyvňujú život v regióne, ako ľudia vnímajú svoje miesto a čo robí Podpoľanie výnimočným.",
      status: "hotovo",
    },
    {
      title: "Terénny záznam",
      description:
        "Pozorujeme lokality, meriame vybrané údaje a robíme fotografie počas terénnych dní.",
      status: "vprieskume",
    },
    {
      title: "Dotazník pre miestnych",
      description:
        "Otázky pre dotazník sú hotové. Odpovede budeme zbierať tak, aby sme nič nevymýšľali ani nedopĺňali.",
      status: "hotovo",
    },
    {
      title: "Výsledky a interpretácia",
      description:
        "Spracované zistenia aj s postupom. Zverejníme ich až po overení a s uvedením zdroja.",
      status: "pripravujeme",
    },
  ] as const satisfies readonly ComingItem[],
  note: "Zásada projektu: žiadny číselný údaj, citát ani zistenie nie je výsledkom výskumu, kým nemáme pôvodný záznam a zdroj.",
};

export const aboutPage = {
  eyebrow: "O projekte",
  title: "Školský projekt o Detve a Podpoľaní",
  lede: "Tento web vznikol pri školskom projekte z geografie. Poznávame Detvu a Podpoľanie v učebni aj v teréne.",
  meta: [
    { label: "Región", value: "Podpoľanie" },
    { label: "Miesto", value: "Detva" },
  ] as const,
  intro:
    "Web sme zostavili tak, aby sa dal čítať aj po skončení projektu — ako zdroj informácií o regióne, jeho krajine, miestach a ľuďoch.",
  items: [
    {
      title: "Prečo tento web",
      description:
        "Aby výsledky výskumu neostali len v zošite. Chceme, aby boli dostupné, prehľadné a prepojené s mapou.",
      status: "hotovo-čiastečne",
    },
    {
      title: "Ako web vzniká",
      description:
        "Dizajn a obsah pripravujeme sami. Vyberáme jednoduché technológie, ktoré sa dajú udržať bez zbytočných závislostí.",
      status: "hotovo-čiastečne",
    },
    {
      title: "Ako označujeme neoverené údaje",
      description:
        "Každá lokalita aj regionálna téma má stav overenia. Neisté body označujeme ako „na overenie“ a ilustračné fotografie ako „ilustračné“. Nič nedopĺňame naslepo.",
      status: "hotovo-čiastečne",
    },
    {
      title: "Čo ešte dopĺňame",
      description:
        "Spracované terénne zistenia a ich zverejnenie — až po overení a s uvedením zdroja.",
      status: "vprieskume",
    },
  ] as const satisfies readonly ComingItem[],
};