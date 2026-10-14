// Downloads freely-licensed photographs of Detva / Podpoľanie from Wikimedia Commons.
// Run: node scripts/fetch-images.mjs
// Writes public/images/*.jpg plus public/images/credits.json (attribution metadata).
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/images");
const UA = "ObjavDetvu/1.0 (school geography field-research project; contact: student)";

/** local filename -> exact Wikimedia Commons file title */
const IMAGES = {
  "hero-polana.jpg": "Detva pod Poľanou - panoramio.jpg",
  "detva-kalamar.jpg": "Detva z Kaľamárky - panoramio.jpg",
  "detva-javorinka.jpg": "Detva od kamenného kompasu na Javorinke - panoramio.jpg",
  "javorinka.jpg": "Javorinka - panoramio (1).jpg",
  "polana-panorama.jpg": "Poľana panorama TN1.jpg",
  "low-tatras.jpg": "Nízké Tatry, Poľana, Z 01.jpg",
  "view-polana.jpg": "View from Poľana TN1.jpg",
  "polana-skliarovo.jpg": "Poľana a Skliarovo - panoramio.jpg",
  "detva-old-part.jpg": "Detva - panorama - old part - panoramio.jpg",
  "detva-stara-cast.jpg": "Detva - stará cast - panoramio.jpg",
  "detva-winter.jpg": "Detva, panoramo, vintro.jpg",
  "detvianska-huta.jpg": "Detvianska Huta - pohľad na obec-1.jpg",
  "vigliasky-zamok.jpg": "Vígľašský zámok a panoráma na okolie.jpg",
  "kriz-pod-pojdy.jpg": "Vyrezávaný kríž - Pod Pôjdy, Detva - panoramio.jpg",
  "folklor-detva.jpg": "Folklór Detva.jpg",
  "kroj.jpg": "Detva kroj.jpg",
  "detviansky-potok.jpg": "Detviansky potok.jpg",
  "podpolanie-1.jpg": "Palo Cepcek Slovakia 23.jpg",
  "podpolanie-2.jpg": "Palo Cepcek Slovakia 24.jpg",
  "podpolanie-3.jpg": "Palo Cepcek Slovakia 37.jpg",
};

const API = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(s = "") {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithRetry(url, { tries = 5, base = 800, kind = "api" } = {}) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429 || res.status >= 500) {
      const wait = base * 2 ** (attempt - 1);
      process.stdout.write(`  ~ ${kind} ${res.status}, retry ${attempt}/${tries} in ${wait}ms\n`);
      await sleep(wait);
      continue;
    }
    return res;
  }
  throw new Error(`${kind}: gave up after ${tries} tries`);
}

async function lookup(titles) {
  const params = new URLSearchParams({
    action: "query",
    titles: titles.map((t) => `File:${t}`).join("|"),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "2000",
    format: "json",
  });
  const res = await fetchWithRetry(`${API}?${params}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  const byFile = new Map();
  for (const page of Object.values(json.query?.pages ?? {})) {
    const ii = page.imageinfo?.[0];
    if (!ii) continue;
    byFile.set(page.title.replace(/^File:/, ""), {
      thumb: (ii.thumburl || ii.url).split("?")[0],
      width: ii.width,
      height: ii.height,
      license: ii.extmetadata?.LicenseShortName?.value ?? "unknown",
      artist: stripHtml(ii.extmetadata?.Artist?.value ?? ""),
      desc: stripHtml(ii.extmetadata?.ImageDescription?.value ?? ""),
      page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    });
  }
  return byFile;
}

async function download(url, dest) {
  const res = await fetchWithRetry(url, { kind: "file", base: 1500 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = Object.entries(IMAGES);
  const credits = {};
  let ok = 0;

  for (let i = 0; i < entries.length; i += 4) {
    const batch = entries.slice(i, i + 4);
    const map = await lookup(batch.map(([, t]) => t));
    await sleep(400);

    for (const [slug, title] of batch) {
      const meta = map.get(title);
      if (!meta) {
        console.log(`MISS ${slug.padEnd(24)} (not found: ${title})`);
        continue;
      }
      credits[slug] = { title, ...meta };
      const dest = path.join(OUT_DIR, slug);
      if (await stat(dest).catch(() => null)) {
        console.log(`SKIP ${slug.padEnd(24)} (already downloaded)`);
        continue;
      }
      try {
        const size = await download(meta.thumb, dest);
        credits[slug].bytes = size;
        ok++;
        console.log(
          `OK   ${slug.padEnd(24)} ${String((size / 1024) | 0).padStart(5)} KB  ` +
            `${meta.width}x${meta.height}  ${meta.license}  — ${meta.artist}`,
        );
      } catch (err) {
        console.log(`FAIL ${slug}: ${err.message}`);
      }
      await sleep(2500);
    }
  }

  await writeFile(path.join(OUT_DIR, "credits.json"), JSON.stringify(credits, null, 2), "utf8");
  console.log(`\n${ok} newly downloaded. ${Object.keys(credits).length} entries in credits.json`);
  if (ok === 0 && Object.keys(credits).length === 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
