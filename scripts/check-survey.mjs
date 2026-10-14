// Unit checks for the survey model (src/data/survey.ts): validation rules,
// aggregation and CSV export. Uses a few in-memory objects ONLY to exercise the
// pure functions — nothing here is written to the real dataset or the browser.
// Usage: node scripts/check-survey.mjs
import { createServer } from "vite";

const server = await createServer({
  configFile: "vite.config.ts",
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const problems = [];
const check = (cond, msg) => {
  if (!cond) problems.push(msg);
};

try {
  const s = await server.ssrLoadModule("/src/data/survey.ts");

  // --- constants ---
  check(
    JSON.stringify(s.SURVEY_AREAS) === JSON.stringify(["Stará Detva", "Sídlisko"]),
    "survey areas must be exactly Stará Detva and Sídlisko",
  );
  check(s.SURVEY_QUESTIONS.length === 4, "there must be exactly four questions");
  const expectedQuestions = [
    "Ako ste spokojný s pomerom ceny a kvality produktov v obchodoch?",
    "Ako ste spokojný s čistotou mesta?",
    "Ako ste spokojný s množstvom a kvalitou služieb v meste?",
    "Ako ste spokojný s možnosťami trávenia voľného času v meste?",
  ];
  s.SURVEY_QUESTIONS.forEach((q, i) => {
    check(q.label === expectedQuestions[i], `question ${i + 1} wording must match exactly`);
    check(q.id === `q${i + 1}`, `question ${i + 1} id must be q${i + 1}`);
  });
  check(JSON.stringify(s.RATING_VALUES) === JSON.stringify([0, 1, 2, 3, 4, 5]), "scale must be 0–5");

  // --- rating validation ---
  for (const good of [0, 1, 2, 3, 4, 5]) check(s.isValidRating(good), `rating ${good} should be valid`);
  for (const bad of [-1, 6, 1.5, NaN, Infinity, "3", null, undefined, true])
    check(!s.isValidRating(bad), `rating ${String(bad)} should be invalid`);

  const validRatings = { q1: 4, q2: 5, q3: 3, q4: 0 };

  // --- validateSurveyInput: rejects missing/invalid ---
  let r = s.validateSurveyInput({ area: "", ratings: {} });
  check(r.ok === false && !!r.errors.area, "missing area must be rejected");
  check(!r.ok && r.errors.ratings && Object.keys(r.errors.ratings).length === 4, "all four ratings required");

  r = s.validateSurveyInput({ area: "Sídlisko", ratings: { ...validRatings, q3: 7 } });
  check(!r.ok && !!r.errors.ratings?.q3, "out-of-range rating must be rejected");

  r = s.validateSurveyInput({ area: "Sídlisko", ratings: { ...validRatings, q2: 2.5 } });
  check(!r.ok && !!r.errors.ratings?.q2, "non-integer rating must be rejected");

  r = s.validateSurveyInput({ area: "Iná oblasť", ratings: validRatings });
  check(!r.ok && !!r.errors.area, "unknown area must be rejected");

  // --- validateSurveyInput: accepts valid, optional fields ---
  r = s.validateSurveyInput({ area: "Stará Detva", ratings: validRatings });
  check(r.ok === true, "a complete valid input must be accepted");
  check(r.ok && r.value.area === "Stará Detva", "area must round-trip");
  check(r.ok && r.value.date === undefined && r.value.code === undefined, "optional fields stay empty");

  r = s.validateSurveyInput({ area: "Sídlisko", ratings: validRatings, date: "2026-02-31" });
  check(!r.ok && !!r.errors.date, "impossible date must be rejected");

  r = s.validateSurveyInput({ area: "Sídlisko", ratings: validRatings, date: "2026-02-27", code: "  A-01  " });
  check(r.ok && r.value.date === "2026-02-27" && r.value.code === "A-01", "date/code normalized (code trimmed)");

  r = s.validateSurveyInput({ area: "Sídlisko", ratings: validRatings, code: "x".repeat(41) });
  check(!r.ok && !!r.errors.code, "over-long code must be rejected");

  // --- create + runtime guard ---
  const made = s.createSurveyResponse({ area: "Stará Detva", ratings: validRatings });
  check(s.isSurveyResponse(made), "created response must pass the runtime guard");
  check(typeof made.id === "string" && made.id.length > 0, "created response needs a unique id");
  check(s.isSurveyResponse({ ...made, ratings: { ...validRatings, q1: 9 } }) === false, "guard must reject bad ratings");

  // --- aggregation (synthetic, in-memory only) ---
  const sample = [
    s.createSurveyResponse({ area: "Stará Detva", ratings: { q1: 5, q2: 5, q3: 5, q4: 5 } }),
    s.createSurveyResponse({ area: "Stará Detva", ratings: { q1: 3, q2: 3, q3: 3, q4: 3 } }),
    s.createSurveyResponse({ area: "Sídlisko", ratings: { q1: 0, q2: 0, q3: 0, q4: 0 } }),
  ];
  const stats = s.computeSurveyStats(sample);
  check(stats.total === 3, "stats.total must count every response");
  const stara = stats.areas.find((a) => a.area === "Stará Detva");
  const sidlisko = stats.areas.find((a) => a.area === "Sídlisko");
  check(stara?.count === 2, "Stará Detva count");
  check(sidlisko?.count === 1, "Sídlisko count");
  check(stara?.overallMean === 4, "Stará Detva mean of {5,3} = 4");
  check(stats.overall.questions[0].mean === (5 + 3 + 0) / 3, "overall q1 mean");
  const dist = stats.overall.questions[0].distribution;
  check(dist.length === 6 && dist[5] === 1 && dist[3] === 1 && dist[0] === 1, "distribution buckets");
  check(s.computeSurveyStats([]).total === 0, "empty dataset yields zero");
  check(s.computeSurveyStats([]).overall.overallMean === null, "empty dataset has null mean (no fake numbers)");

  const counts = s.computeAreaCounts(sample);
  check(counts["Stará Detva"] === 2 && counts.Sídlisko === 1, "per-area counts");

  // --- area filtering helper (single source used by the results UI) ---
  check(s.statsForFilter(stats, "all") === stats.overall, "filter=all returns the overall aggregate");
  check(s.statsForFilter(stats, "Stará Detva").count === 2, "filtering by Stará Detva count");
  check(s.statsForFilter(stats, "Sídlisko").count === 1, "filtering by Sídlisko count");
  check(s.statsForFilter(stats, "Neznáma oblasť").count === 3, "unknown filter falls back to overall");

  // --- CSV ---
  const csv = s.surveyToCsv(sample);
  const lines = csv.split("\r\n");
  check(lines.length === 4, "CSV must have a header + one row per response");
  check(lines[0].split(s.SURVEY_CSV_DELIMITER).length === 10, "CSV header column count");
  check(lines[0].startsWith("id;oblast;q1"), "CSV header names");
  check(csv.includes("Stará Detva"), "CSV carries the area");

  console.log(`Survey model: ${s.SURVEY_QUESTIONS.length} questions, ${s.SURVEY_AREAS.length} areas.`);
  console.log(`Sample stats (in-memory test only): total ${stats.total}, Stará Detva mean ${stara?.overallMean}.`);
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
console.log("\nSurvey model OK.");
