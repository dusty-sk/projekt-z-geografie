// Real-browser verification using the installed Chrome (headless).
// Checks rendered content + link targets + map behaviour, and captures
// desktop/mobile screenshots. No browser download required.
// Usage: node scripts/verify-pages.mjs
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 4188;
const REPO_BASE = "/projekt-z-geografie";
const BASE = `http://localhost:${PORT}${REPO_BASE}`;
const OUT = "tmp/verify";
mkdirSync(OUT, { recursive: true });

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome/Edge found — skipping browser verification.");
  process.exit(0);
}

const server = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

function runChrome(args) {
  return new Promise((resolve) => {
    const child = spawn(chrome, [...args, "--no-first-run", "--no-default-browser-check"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("exit", () => resolve(out));
  });
}

function dumpDom(url, budget = 4000) {
  return runChrome(["--headless=new", "--disable-gpu", `--virtual-time-budget=${budget}`, "--dump-dom", url]);
}

const countOccurrences = (haystack, needle) => haystack.split(needle).length - 1;

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return true;
    } catch { /* not ready */ }
    await delay(400);
  }
  return false;
}

const checks = [];
const assert = (cond, msg) => checks.push({ ok: !!cond, msg });

try {
  if (!await waitForServer()) throw new Error("preview server did not start\n" + serverLog);

  // ---------------- Detail pages: content + link targets ----------------
  const pages = [
    { path: "/miesta/polana", must: ["Poľana", "1 457,8", "Zaradenie", "Stav overenia", "Zdroje a súradnice", "Späť na mapu"] },
    { path: "/miesta/vodopad-bystro", must: ["Vodopád Bystrô", "Vodopád Bystrého potoka", "Hriňová", "Mimo mesta Detva"] },
    { path: "/miesta/kostol-sv-frantiska", must: ["Kostol sv. Františka z Assisi", "1804", "Ilustračná fotografia"] },
  ];

  const dom = {};
  for (const page of pages) {
    dom[page.path] = await dumpDom(`${BASE}${page.path}`);
    for (const needle of page.must) assert(dom[page.path].includes(needle), `${page.path} contains "${needle}"`);
  }

  const polanaDom = dom["/miesta/polana"];
  assert(polanaDom.includes('href="/miesta/vodopad-bystro"'), "/miesta/polana previous -> vodopad-bystro");
  assert(polanaDom.includes('href="/miesta/drevene-krize"'), "/miesta/polana next -> drevene-krize");
  assert(polanaDom.includes('href="/mapa"'), "/miesta/polana has back-to-map link");

  // ---------------- Map ----------------   (budget raised: Leaflet is dynamic)
  const mapAll = await dumpDom(`${BASE}/mapa`, 6500);
  assert(mapAll.includes("Mapa miest Podpoľania"), "/mapa renders heading");
  assert(countOccurrences(mapAll, "map-marker map-marker--") === 10, "/mapa shows 10 markers");
  assert(mapAll.includes("map-chip") && mapAll.includes("is-active"), "/mapa has an active filter chip");

  const mapNature = await dumpDom(`${BASE}/mapa?kategoria=priroda`, 6500);
  assert(countOccurrences(mapNature, "map-marker map-marker--") === 4, "/mapa?kategoria=priroda shows 4 markers");
  assert(!mapNature.includes("Kostol sv. Františka z Assisi"), "priroda filter hides non-nature locations in the list");
  assert(mapNature.includes("Poľana") && mapNature.includes("Melichova skala"), "priroda filter keeps nature locations");

  const mapSelected = await dumpDom(`${BASE}/mapa?lokalita=polana`, 6500);
  assert(mapSelected.includes("is-selected"), "/mapa?lokalita=polana marks the selected marker");
  assert(mapSelected.includes("map-popup__title"), "/mapa?lokalita=polana opens a popup");
  assert(mapSelected.includes("Otvoriť profil"), "map popup links to the profile");

  // ---------------- Regional research ----------------
  const rrDom = await dumpDom(`${BASE}/regionalny-vyskum`, 3000);
  assert(rrDom.includes("Regionálny výskum Podpoľania"), "/regionalny-vyskum renders title");
  for (const needle of [
    "Zaujímavé prírodné pamiatky",
    "Zaujímavé kultúrne pamiatky",
    "Najvýznamnejšie vodné toky",
    "Ľudové piesne Podpoľania",
    "Povesti a legendy regiónu",
    "Overené",
    "Pripravujeme",
  ]) {
    assert(rrDom.includes(needle), `/regionalny-vyskum contains "${needle}"`);
  }
  assert(countOccurrences(rrDom, "rr-status--") >= 4, "/regionalny-vyskum shows verification badges");

  // ---------------- Screenshots ----------------
  const shots = [
    { path: "/mapa", size: "1440,1000", name: "mapa-desktop" },
    { path: "/mapa", size: "390,844", name: "mapa-mobile" },
    { path: "/miesta/polana", size: "1440,1000", name: "polana-desktop" },
    { path: "/miesta/polana", size: "390,844", name: "polana-mobile" },
    { path: "/miesta", size: "1440,1100", name: "miesta-desktop" },
    { path: "/miesta", size: "390,844", name: "miesta-mobile" },
    { path: "/regionalny-vyskum", size: "1440,1100", name: "regionalny-vyskum-desktop" },
    { path: "/regionalny-vyskum", size: "390,844", name: "regionalny-vyskum-mobile" },
  ];
  for (const shot of shots) {
    const file = path.resolve(OUT, `${shot.name}.png`);
    const log = await runChrome([
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      `--window-size=${shot.size}`, "--virtual-time-budget=6000", `--screenshot=${file}`, `${BASE}${shot.path}`,
    ]);
    const made = existsSync(file);
    assert(made, `screenshot ${shot.name}.png created`);
    if (!made) console.log(`   chrome output: ${log.replace(/\s+/g, " ").slice(0, 200)}`);
  }
} catch (err) {
  assert(false, `crashed: ${err.message}`);
} finally {
  server.kill();
  await once(server, "exit").catch(() => {});
}

let failed = 0;
for (const c of checks) {
  if (!c.ok) failed++;
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.msg}`);
}
console.log(`\n${checks.length - failed}/${checks.length} browser checks passed.`);
process.exit(failed ? 1 : 0);
