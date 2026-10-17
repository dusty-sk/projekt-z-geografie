/**
 * Render smoke test — renders every route to HTML strings so that runtime
 * errors surface without needing a browser.
 * Loaded by scripts/smoke.mjs via Vite's ssrLoadModule.
 */
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";

const ROUTES: readonly { path: string; expect: string[] }[] = [
  { path: "/", expect: ["Detva. Objav ju inak.", "Preskúmať mapu", "Výsledky výskumu", "Interaktívna mapa"] },
  {
    path: "/mapa",
    expect: ["Mapa miest Podpoľania", "Všetko", "Načítavam mapové podklady", "mimo Detvy"],
  },
  {
    path: "/miesta",
    expect: ["Lokality, ktoré formujú Podpoľanie", "Námestie SNP v Detve", "Kostol sv. Františka z Assisi", "Melichova skala"],
  },
  {
    path: "/miesta/polana",
    expect: ["Poľana", "1 457,8", "O lokalite", "Zaradenie", "Stav overenia", "Zdroje a súradnice", "Späť na mapu"],
  },
  {
    path: "/miesta/kostol-sv-frantiska",
    expect: ["Kostol sv. Františka z Assisi", "Ilustračná fotografia", "1804"],
  },
  {
    path: "/miesta/vodopad-bystro",
    expect: ["Vodopád Bystrô", "Vodopád Bystrého potoka", "Hriňová", "Mimo mesta Detva"],
  },
  { path: "/miesta/neexistuje", expect: ["Táto lokalita tu nie je"] },
  { path: "/vyskum", expect: ["Výskum", "metodika", "žiadny číselný údaj"] },
  {
    path: "/prieskum",
    expect: [
      "Prieskum otvorených otázok",
      "Stará Detva",
      "Sídlisko",
      "Čo sa vám najviac páči na mieste, kde žijete?",
      "Pridať odpoveď",
      "Exportovať CSV",
    ],
  },
  {
    path: "/vysledky-prieskumu",
    expect: [
      "Výsledky otvoreného prieskumu",
      "Všetci respondenti",
      "Stará Detva",
      "Sídlisko",
      "Porovnanie oblastí",
    ],
  },
  { path: "/region", expect: ["Región", "Poľana", "1 457,8"] },
  {
    path: "/regionalny-vyskum",
    expect: [
      "Regionálny výskum Podpoľania",
      "Zaujímavé prírodné pamiatky",
      "Zaujímavé kultúrne pamiatky",
      "Najvýznamnejšie vodné toky",
      "Ľudové piesne Podpoľania",
      "Povesti a legendy regiónu",
    ],
  },
  { path: "/o-projekte", expect: ["O projekte", "Projekt"] },
];

export function runSmoke() {
  const results: { path: string; ok: boolean; missing: string[]; length: number }[] = [];

  for (const route of ROUTES) {
    let html = "";
    try {
      html = renderToString(
        createElement(MemoryRouter, { initialEntries: [route.path] }, createElement(App)),
      );
    } catch (err) {
      results.push({ path: route.path, ok: false, missing: [`THREW: ${(err as Error).message}`], length: 0 });
      continue;
    }
    const missing = route.expect.filter((needle) => !html.includes(needle));
    results.push({ path: route.path, ok: missing.length === 0, missing, length: html.length });
  }

  return results;
}
