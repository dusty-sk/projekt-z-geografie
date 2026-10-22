export type WorldAnchorId =
  | "tichy-pastier"
  | "bystry-had"
  | "skalny-vtak"
  | "machovy-chodec"
  | "dreveny-svedok";

export type WorldAnchor = {
  readonly id: WorldAnchorId;
  readonly name: string;
  readonly place: string;
  readonly region: string;
  readonly clue: string;
  readonly x: number;
  readonly y: number;
  readonly align: "left" | "right" | "above";
};

export type AtmosphereAnchorLayer = "sky" | "ridge" | "valley" | "forest";

export type AtmosphereAnchor = {
  readonly id: WorldAnchorId;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly layer: AtmosphereAnchorLayer;
};

export const worldAnchors: readonly WorldAnchor[] = [
  {
    id: "tichy-pastier",
    name: "Tichý pastier",
    place: "Horná lúka",
    region: "Poľana",
    clue: "Na hornej lúke stojí pastier, ktorý nepočíta ovce. Keď sa hmla zdvihne, jeho tieň je o krok bližšie.",
    x: 18,
    y: 52,
    align: "right",
  },
  {
    id: "bystry-had",
    name: "Bystrý had",
    place: "Skalná tiesňava",
    region: "Vodopád Bystrô",
    clue: "Vodopád padá do tichého jazierka. Niečo v ňom obracia prúd proti srsti — a čaká, kým sa započuješ.",
    x: 84,
    y: 58,
    align: "left",
  },
  {
    id: "skalny-vtak",
    name: "Skalný vták",
    place: "Kamenný výbežok",
    region: "Melichova skala",
    clue: "Na výbežku skaly sedí vták bez hniezda. Neodletí, kým si ho neuvidíš.",
    x: 62,
    y: 55,
    align: "above",
  },
  {
    id: "machovy-chodec",
    name: "Machový chodec",
    place: "Starý les",
    region: "Kaľamárka",
    clue: "Mach pokrýva pňa aj kameň. Medzi koreňmi je priechod, ktorý nie je na žiadnej mape.",
    x: 30,
    y: 67,
    align: "right",
  },
  {
    id: "dreveny-svedok",
    name: "Drevený svedok",
    place: "Hrebeň troch krížov",
    region: "Drevené kríže",
    clue: "Tri kríže strážia hrebeň. Keď sa pozrieš dlhšie, medzi nimi stojí štvrtý tieň.",
    x: 51,
    y: 45,
    align: "right",
  },
] as const;

export const atmosphereAnchors: readonly AtmosphereAnchor[] = [
  {
    id: "tichy-pastier",
    name: "Tichý pastier",
    x: 17,
    y: 69,
    layer: "ridge",
  },
  {
    id: "skalny-vtak",
    name: "Skalný vták",
    x: 63,
    y: 43,
    layer: "sky",
  },
  {
    id: "dreveny-svedok",
    name: "Drevený svedok",
    x: 50,
    y: 60,
    layer: "ridge",
  },
  {
    id: "bystry-had",
    name: "Bystrý had",
    x: 84,
    y: 78,
    layer: "valley",
  },
  {
    id: "machovy-chodec",
    name: "Machový chodec",
    x: 29,
    y: 87,
    layer: "forest",
  },
] as const;

export const worldAnchorIndex = ["I", "II", "III", "IV", "V"] as const;

export const worldAtlasCopy = {
  eyebrow: "Atlas ticha",
  title: "Päť miest, ktoré držia krajinu pokope.",
  lede: "Každé z nich má iné svetlo, inú stopu a iný dôvod, prečo sa tam zastaviť. Mená patria tichým postavám projektu, nie skutočným živočíchom.",
  disclaimer:
    "Tichý svet je fiktívna atmosférická vrstva projektu. Miesta vychádzajú z reálnych lokalít Podpoľania, príbehy sú vymyslené.",
} as const;
