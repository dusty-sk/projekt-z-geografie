// End-to-end interaction test for the survey admin UI, driven through the
// Chrome DevTools Protocol (no extra dependencies; uses Node's global fetch and
// WebSocket). Verifies: validation rejects incomplete input, adding a response,
// persistence across reload, editing, and delete-with-confirmation.
// Usage: node scripts/verify-survey.mjs
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 4189;
const CDP_PORT = 9333;
const BASE = `http://localhost:${PORT}`;
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
  console.error("No Chrome/Edge found — skipping survey interaction test.");
  process.exit(0);
}

const PROFILE = path.resolve("tmp/chrome-survey-profile");
rmSync(PROFILE, { recursive: true, force: true });

const checks = [];
const assert = (cond, msg) => checks.push({ ok: !!cond, msg });

const server = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--window-size=1440,1000",
    `${BASE}/prieskum`,
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);

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

async function findPageTarget(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page" && typeof t.webSocketDebuggerUrl === "string");
      if (page) return page;
    } catch { /* not ready */ }
    await delay(300);
  }
  return null;
}

let ws;
let idCounter = 0;
const pending = new Map();

function send(method, params = {}) {
  const id = ++idCounter;
  return new Promise((resolve, reject) => {
    pending.set(id, (msg) => {
      if (msg.error) reject(new Error(`${method}: ${JSON.stringify(msg.error)}`));
      else resolve(msg.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression, awaitPromise = false) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise,
  });
  if (res.exceptionDetails) {
    throw new Error(`eval failed: ${res.exceptionDetails.text} :: ${expression}`);
  }
  return res.result.value;
}

async function waitFor(expr, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if (await evaluate(`!!(${expr})`)) return true;
    } catch { /* navigating */ }
    await delay(120);
  }
  throw new Error(`timeout waiting for: ${expr}`);
}

const click = (selector) =>
  evaluate(`document.querySelector(${JSON.stringify(selector)}).click(), true`);

const totalText = () => evaluate(`document.querySelector('.survey-summary__total-value')?.textContent`);
const rowCount = () => evaluate(`document.querySelectorAll('.survey-table tbody tr').length`);
const rowCell = (i) =>
  evaluate(`document.querySelectorAll('.survey-table tbody tr')[0]?.children[${i}]?.textContent?.trim()`);

try {
  if (!await waitForServer()) throw new Error("preview server did not start\n" + serverLog);
  const target = await findPageTarget();
  if (!target) throw new Error("no Chrome page target found");

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await once(ws, "open");
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  await send("Runtime.enable");
  await send("Page.enable");

  // Fresh navigate to be sure we are on the survey page.
  await send("Page.navigate", { url: `${BASE}/prieskum` });
  await waitFor(`document.querySelector('.survey-form')`, 15000);

  // --- Integrity: dataset starts empty ---
  assert((await totalText()) === "0", "dataset starts at zero responses");
  assert(
    await evaluate(`document.querySelector('.survey-table__empty') !== null`),
    "empty-state shown before any data",
  );
  assert(
    await evaluate(`document.querySelector('.survey-page__tools .btn').disabled === true`),
    "CSV export disabled while empty",
  );

  // --- Validation: submitting an empty form is rejected ---
  await click(".survey-form button[type='submit']");
  await waitFor(`document.querySelector('.rating__error')`, 4000);
  assert(
    (await evaluate(`document.querySelectorAll('.rating__error').length`)) === 4,
    "all four missing ratings are flagged",
  );
  assert((await totalText()) === "0" && (await rowCount()) === 0, "invalid submission stores nothing");

  // --- Add a valid response ---
  await evaluate(`(() => {
    const sel = document.getElementById('survey-area');
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
    setter.call(sel, 'Sídlisko');
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  for (const [q, v] of [["q1", "4"], ["q2", "5"], ["q3", "3"], ["q4", "0"]]) {
    await click(`input[name='rating-${q}'][value='${v}']`);
  }
  await click(".survey-form button[type='submit']");
  await waitFor(`document.querySelector('.survey-summary__total-value')?.textContent === '1'`);
  assert((await rowCount()) === 1, "one response appears in the table");
  assert((await rowCell(1)) === "Sídlisko", "row carries the selected area");
  assert((await rowCell(2)) === "4", "row carries the q1 rating");
  assert(
    await evaluate(`document.querySelector('.survey-page__tools .btn').disabled === false`),
    "CSV export enabled once data exists",
  );

  // Screenshot with data present.
  try {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.resolve(OUT, "prieskum-with-response.png"), Buffer.from(shot.data, "base64"));
    assert(true, "captured prieskum-with-response.png");
  } catch (err) {
    assert(false, `screenshot failed: ${err.message}`);
  }

  // --- Persistence across reload ---
  await send("Page.reload", { ignoreCache: true });
  await waitFor(`document.querySelector('.survey-summary__total-value')`, 15000);
  await waitFor(`document.querySelector('.survey-summary__total-value')?.textContent === '1'`);
  assert((await rowCount()) === 1, "response persists after reload (localStorage)");

  // --- Edit ---
  await click(".survey-table tbody tr .survey-action");
  await waitFor(`document.querySelector('.survey-form__title')?.textContent === 'Upraviť odpoveď'`);
  await click(`input[name='rating-q1'][value='1']`);
  await click(".survey-form button[type='submit']");
  await waitFor(`document.querySelector('.survey-table tbody tr')?.children[2]?.textContent?.trim() === '1'`);
  assert((await rowCell(2)) === "1", "edited rating is saved");
  assert((await totalText()) === "1", "editing does not create a new response");

  // --- Delete with confirmation ---
  await evaluate(`document.querySelectorAll('.survey-table tbody tr .survey-action')[1].click(), true`);
  await waitFor(`document.querySelector('.survey-table__confirm')`);
  assert(true, "delete asks for confirmation first");
  await click(".survey-table__confirm .survey-action--danger");
  await waitFor(`document.querySelector('.survey-table__empty')`, 6000);
  assert((await totalText()) === "0", "confirmed delete removes the response");
} catch (err) {
  assert(false, `crashed: ${err.message}`);
} finally {
  try { ws?.close(); } catch { /* ignore */ }
  browser.kill();
  server.kill();
  await once(server, "exit").catch(() => {});
}

let failed = 0;
for (const c of checks) {
  if (!c.ok) failed++;
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.msg}`);
}
console.log(`\n${checks.length - failed}/${checks.length} survey interaction checks passed.`);
process.exit(failed ? 1 : 0);
