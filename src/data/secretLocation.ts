/**
 * The eleventh point on the map. Deliberately outside the verified catalogue:
 * the story is fictional, the coordinates are only a stage for the hunt, and
 * nothing here is presented as a real, visitable place.
 */
export const secretLocation = {
  id: "bod-11",
  name: "Bod 11",
  coordinatesLabel: "48°32′44″ s. š. · 19°27′49″ v. d.",
  coords: { lat: 48.5455, lon: 19.4635 },
  story: [
    "Na juh od Detvy sa pole ohne do lesa a cesta sa na chvíľu stratí. Miesto nemá názov v katalógu a nie je na žiadnej z desiatich zastávok.",
    "Archív o ňom uchováva jedinú vetu: „Keď sa mapa spýta na jedenásť, krajina odpovie tichom.“ Kto sem príde, nemá čo overovať — len sa rozhliadnuť.",
  ],
  disclaimer:
    "Fiktívny archívny záznam. Bod 11 nepatrí medzi overené lokality projektu a neuvádzame ho v zozname ani vo výsledkoch.",
} as const;
