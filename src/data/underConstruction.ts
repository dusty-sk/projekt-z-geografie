import type { ComingItem } from "../components/ComingContent";

/**
 * Honest "in preparation" content for sections not yet built out.
 * Field-research results are intentionally NOT included anywhere.
 */

export const researchPage = {
  eyebrow: "Výskum",
  title: "Cieľ, otázky a metodika",
  lede: "Čo geograficky skúmame a ako. Výsledky zverejňujeme iba vtedy, keď sú skutočne spracované a označené zdrojom.",
  meta: [
    { label: "Typ", value: "Terénny geografický výskum" },
    { label: "Stav", value: "Dáta sa dopĺňajú" },
  ] as const,
  intro:
    "Projekt mapuje vzťah ľudí a krajiny Podpoľania. Táto časť dokumentuje návrh výskumu, použité metódy a to, ako s dátami narábame.",
  items: [
    {
      title: "Výskumné otázky",
      description:
        "Ako ovplyvňuje reliéf a poloha sídel život v regióne? Ako vnímajú obyvatelia svoje miesto? Čím je Podpoľanie špecifické?",
      status: "hotovo",
    },
    {
      title: "Terénny záznam",
      description:
        "Štruktúrované pozorovanie lokalít, geografické merania a fotodokumentácia počas terénnych dní.",
      status: "vprieskume",
    },
    {
      title: "Dotazník pre miestnych",
      description:
        "Návrh dotazníka o vzťahu k regiónu je hotový — otázky sú zostavené tak, aby sme nezverejňovali žiadne vyfabulované odpovede.",
      status: "hotovo",
    },
    {
      title: "Výsledky a interpretácia",
      description:
        "Spracované zistenia s metodickým postupom. Publikujeme až po overení a s uvedením zdroja.",
      status: "pripravujeme",
    },
  ] as const satisfies readonly ComingItem[],
  note: "Zásada projektu: žiadny číselný údaj, citát ani zistenie nemá v tomto výstupe charakter výskumného výsledku, pokiaľ chýba originálny záznam a zdroj.",
};

export const aboutPage = {
  eyebrow: "O projekte",
  title: "Školský geografický výskum, verejne",
  lede: "Tento web vznikol ako súčasť školského projektu z geografie — poznávame Detvu a Podpoľanie, učebne aj v teréne.",
  meta: [
    { label: "Región", value: "Podpoľanie" },
    { label: "Miesto", value: "Detva" },
  ] as const,
  intro:
    "Zostavujeme web tak, aby sa dal čítať aj po skončení projektu: ako zdroj informácií o regióne, jeho krajine, miestach a ľuďoch.",
  items: [
    {
      title: "Prečo tento web",
      description:
        "Aby výsledky výskumu neostali len v zošite — aby boli dostupné, prehľadné a prepojené s mapou.",
      status: "hotovo-čiastečne",
    },
    {
      title: "Ako web vzniká",
      description:
        "Dizajn a obsah spracúvame vlastnoručne; technológie volíme jednoduché, udržateľné a bez zbytočných závislostí.",
      status: "hotovo-čiastečne",
    },
    {
      title: "Ako označujeme neoverené údaje",
      description:
        "Každá lokalita aj regionálna téma nesie stav overenia. Neisté body označujeme ako „na overenie“ a ilustračné fotografie ako „ilustračné“ — nič nedopĺňame naslepo.",
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