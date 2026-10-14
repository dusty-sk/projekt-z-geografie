// Boots the Vite server (preview of the build by default, or `dev` with --dev),
// fetches a few routes, then shuts down.
// Usage: node scripts/verify-server.mjs [--dev]
import { spawn } from "node:child_process";
import { once } from "node:events";

const DEV = process.argv.includes("--dev");
const PORT = DEV ? 5199 : 4199;
const ORIGIN = `http://localhost:${PORT}`;
const REPO_BASE = "/projekt-z-geografie";
const BASE = `${ORIGIN}${REPO_BASE}`;
const ROUTES = ["/", "/mapa", "/miesta", "/vyskum", "/region", "/o-projekte"];
const mode = DEV ? "dev" : "preview";

const child = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", mode, "--port", String(PORT), "--strictPort"],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let logs = "";
child.stdout.on("data", (d) => (logs += d));
child.stderr.on("data", (d) => (logs += d));

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

let failed = false;
try {
  const up = await waitForServer();
  if (!up) {
    failed = true;
    console.log("Server did not start in time.");
    console.log(logs);
  } else {
    console.log(`Preview server up on ${BASE}`);
    for (const route of ROUTES) {
      const res = await fetch(`${BASE}${route}`);
      const html = await res.text();
      const ok = res.ok && html.includes('id="root"') && html.includes("<title>");
      failed ||= !ok;
      console.log(`${ok ? "PASS" : "FAIL"}  GET ${route.padEnd(12)} ${res.status}  ${html.length} bytes`);
    }

    // Confirm the built JS/CSS assets are served.
    const indexHtml = await (await fetch(`${BASE}/`)).text();
    const asset = indexHtml.match(/src="([^"]+\.js)"/)?.[1];
    if (asset) {
      const assetUrl = new URL(asset, `${BASE}/`).toString();
      const res = await fetch(assetUrl);
      failed ||= !res.ok;
      console.log(`${res.ok ? "PASS" : "FAIL"}  asset ${asset} (${res.status})`);
    }
  }
} catch (err) {
  failed = true;
  console.error("verify-server failed:", err);
} finally {
  child.kill();
  await once(child, "exit").catch(() => {});
}

process.exit(failed ? 1 : 0);
