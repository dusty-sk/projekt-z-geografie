// Verifies that every image slug referenced in src/ exists in public/images.
// Usage: node scripts/check-images.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const credits = JSON.parse(readFileSync("public/images/credits.json", "utf8"));
const have = new Set(Object.keys(credits));
const used = new Set();

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry.name)) continue;
    const src = readFileSync(p, "utf8");
    for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) used.add(m[1]);
    for (const m of src.matchAll(/imageUrl\("([^"]+)"\)/g)) used.add(m[1]);
  }
}

walk("src");

const missing = [...used].filter((s) => !have.has(s));
const missingFiles = [...have].filter((s) => !existsSync(path.join("public/images", s)));

console.log(`Referenced slugs (${used.size}): ${[...used].sort().join(", ")}`);
console.log(`Missing metadata: ${missing.length ? missing.join(", ") : "none"}`);
console.log(`Credits without file: ${missingFiles.length ? missingFiles.join(", ") : "none"}`);

process.exit(missing.length || missingFiles.length ? 1 : 0);
