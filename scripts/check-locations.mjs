// Validates the central location dataset (src/data/locations.ts):
// unique ids, valid categories, coordinates inside the Podpoľanie bounding box,
// required content fields, administrative scope, sources, verification block,
// and that every referenced photo exists on disk.
// Usage: node scripts/check-locations.mjs
import { createServer } from "vite";
import { existsSync } from "node:fs";

// Roughly okres Detva + the Poľana massif.
const BBOX = { minLat: 48.4, maxLat: 48.78, minLon: 19.05, maxLon: 19.8 };
const CATEGORIES = new Set(["priroda", "kulturne", "historia", "rekreacia"]);
const PRECISION = new Set(["presná", "približná"]);
const KINDS = new Set(["actual", "illustrative"]);
const VERIFY = new Set(["overené", "čiastočne overené", "na overenie"]);

const server = await createServer({
  configFile: "vite.config.ts",
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const problems = [];
// Non-fatal notes (e.g. a location added before it is geolocated).
const warnings = [];
const check = (cond, msg) => {
  if (!cond) problems.push(msg);
};
const isText = (v) => typeof v === "string" && v.trim().length > 0;

try {
  const { locations } = await server.ssrLoadModule("/src/data/locations.ts");

  const seenIds = new Set();
  const seenPoints = new Map();

  for (const loc of locations) {
    const where = `[${loc.id}]`;

    check(typeof loc.id === "string" && /^[a-z0-9-]+$/.test(loc.id), `${where} id must be a url-safe slug`);
    check(!seenIds.has(loc.id), `${where} duplicate id`);
    seenIds.add(loc.id);

    check(isText(loc.name), `${where} missing name`);
    check(Array.isArray(loc.categories) && loc.categories.length > 0, `${where} needs at least one category`);
    for (const c of loc.categories ?? []) check(CATEGORIES.has(c), `${where} unknown category "${c}"`);

    // --- administrative scope (must not assume everything is in Detva) ---
    const scope = loc.scope;
    check(scope && isText(scope.municipality), `${where} missing scope.municipality`);
    check(scope && isText(scope.district), `${where} missing scope.district`);
    check(scope && isText(scope.region), `${where} missing scope.region`);
    check(scope && typeof scope.withinDetva === "boolean", `${where} scope.withinDetva must be boolean`);
    if (scope && scope.withinDetva === false) {
      check(isText(scope.note), `${where} location outside Detva must explain its scope in scope.note`);
    }

    // --- coordinates (optional, but strictly validated whenever present) ---
    if (loc.coords) {
      const { lat, lon } = loc.coords;
      check(Number.isFinite(lat), `${where} lat must be a number`);
      check(Number.isFinite(lon), `${where} lon must be a number`);
      check(lat >= BBOX.minLat && lat <= BBOX.maxLat, `${where} lat ${lat} outside Podpoľanie bbox`);
      check(lon >= BBOX.minLon && lon <= BBOX.maxLon, `${where} lon ${lon} outside Podpoľanie bbox`);
      const key = `${lat},${lon}`;
      check(!seenPoints.has(key), `${where} identical coordinates to ${seenPoints.get(key)}`);
      seenPoints.set(key, loc.id);
      check(PRECISION.has(loc.coordPrecision), `${where} invalid coordPrecision`);
      check(isText(loc.coordSource), `${where} missing coordSource`);
    } else {
      warnings.push(`${where} has no coordinates yet — it is omitted from the map`);
    }

    // --- content ---
    check(isText(loc.summary), `${where} missing summary`);
    check(Array.isArray(loc.description) && loc.description.length > 0, `${where} missing description`);
    check(Array.isArray(loc.geography) && loc.geography.length > 0, `${where} missing geography`);
    check(Array.isArray(loc.highlights) && loc.highlights.length > 0, `${where} missing highlights`);
    check(isText(loc.visitorAppeal), `${where} missing visitorAppeal`);

    // --- photos ---
    check(KINDS.has(loc.hero?.kind), `${where} hero.kind must be actual|illustrative`);
    const images = [loc.hero, ...(loc.gallery ?? [])];
    for (const img of images) {
      check(KINDS.has(img.kind), `${where} image "${img.slug}" invalid kind`);
      check(existsSync(`public/images/${img.slug}`), `${where} image missing on disk: ${img.slug}`);
      if (img.kind === "illustrative") {
        check(isText(img.note), `${where} illustrative image "${img.slug}" must have a note`);
      }
    }

    // --- sources ---
    check(Array.isArray(loc.sources) && loc.sources.length > 0, `${where} needs at least one source`);
    for (const source of loc.sources ?? []) {
      check(isText(source.label), `${where} source missing label`);
      check(/^https:\/\/\S+/.test(source.url ?? ""), `${where} source url must be https: ${source.url}`);
    }

    // --- verification ---
    check(VERIFY.has(loc.verification?.status), `${where} invalid verification.status`);
    check(
      Array.isArray(loc.verification?.items) && loc.verification.items.length > 0,
      `${where} verification.items must not be empty`,
    );
  }

  const outside = locations.filter((l) => !l.scope.withinDetva).map((l) => l.id);
  const illustrative = new Set(
    locations
      .flatMap((l) => [l.hero, ...(l.gallery ?? [])].map((i) => (i.kind === "illustrative" ? l.id : null)))
      .filter(Boolean),
  );

  const mappable = locations.filter((l) => l.coords).length;

  console.log(`Locations: ${locations.length}`);
  console.log(`Categories used: ${[...new Set(locations.flatMap((l) => l.categories))].sort().join(", ")}`);
  console.log(`Outside the town of Detva: ${outside.join(", ") || "(none)"}`);
  console.log(`Locations using an illustrative image: ${[...illustrative].length}`);
  console.log(`Locations with coordinates: ${mappable}/${locations.length}`);
} catch (err) {
  problems.push(`crashed: ${err instanceof Error ? err.message : String(err)}`);
} finally {
  await server.close();
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  - ${w}`);
}
console.log("\nLocation dataset OK.");
