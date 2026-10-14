// Runs the SSR render smoke test for every route.
// Usage: node scripts/smoke.mjs
import { createServer } from "vite";

const server = await createServer({
  configFile: "vite.config.ts",
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

let failed = false;

try {
  const mod = await server.ssrLoadModule("/src/smoke.tsx");
  const results = mod.runSmoke();

  for (const r of results) {
    if (r.ok) {
      console.log(`PASS  ${r.path.padEnd(14)} (${r.length} chars)`);
    } else {
      failed = true;
      console.log(`FAIL  ${r.path.padEnd(14)} — missing: ${r.missing.join(" | ")}`);
    }
  }

  console.log(
    `\n${results.filter((r) => r.ok).length}/${results.length} routes rendered successfully.`,
  );
} catch (err) {
  failed = true;
  console.error("Smoke test crashed:", err);
} finally {
  await server.close();
}

process.exit(failed ? 1 : 0);
