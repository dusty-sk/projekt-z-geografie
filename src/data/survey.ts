/**
 * Survey data model — open-ended questionnaire about the place residents live in.
 *
 * This module is intentionally SEPARATE from src/data/locations.ts: locations
 * describe ten places, while the survey records people's open answers. The two
 * must not be mixed.
 *
 * There is NO 0–5 rating scale anymore. Each respondent gives free-text answers
 * to four questions. The real dataset starts empty; nothing in this file
 * generates fictitious residents or results.
 */

// ---------------------------------------------------------------------------
// Areas
// ---------------------------------------------------------------------------

/** The two sampling areas where interviews are conducted. */
export const SURVEY_AREAS = ["Stará Detva", "Sídlisko"] as const;
export type SurveyArea = (typeof SURVEY_AREAS)[number];

export function isSurveyArea(value: unknown): value is SurveyArea {
  return typeof value === "string" && (SURVEY_AREAS as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export type SurveyQuestionId = "q1" | "q2" | "q3" | "q4";

export type SurveyQuestion = {
  id: SurveyQuestionId;
  order: number;
  /** The exact question wording shown in the field. */
  label: string;
  /** Short form used in table headers, CSV and charts. */
  short: string;
};

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] = [
  {
    id: "q1",
    order: 1,
    label: "Čo sa vám najviac páči na mieste, kde žijete?",
    short: "Čo sa páči",
  },
  {
    id: "q2",
    order: 2,
    label: "Ktoré miesto v našom okolí máte najradšej a prečo?",
    short: "Obľúbené miesto",
  },
  {
    id: "q3",
    order: 3,
    label: "Čo by ste zmenili alebo zlepšili v našej obci či meste?",
    short: "Návrhy na zmenu",
  },
  {
    id: "q4",
    order: 4,
    label: "Ktorú prírodnú alebo historickú pamiatku v okolí by ste odporučili navštíviť?",
    short: "Odporúčaná pamiatka",
  },
];

export function questionById(id: SurveyQuestionId): SurveyQuestion {
  return SURVEY_QUESTIONS.find((q) => q.id === id) ?? SURVEY_QUESTIONS[0];
}

// ---------------------------------------------------------------------------
// Storage key (kept apart from any location data)
// ---------------------------------------------------------------------------

export const SURVEY_STORAGE_KEY = "objav-detvu:prieskum:v2";

/** Delimiter used for CSV export. */
export const SURVEY_CSV_DELIMITER = ";";

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

/** Mapping of question IDs to the respondent's free-text answers. */
export type SurveyAnswers = Record<SurveyQuestionId, string>;

/** A single recorded survey response. */
export type SurveyResponse = {
  /** Unique id. */
  id: string;
  area: SurveyArea;
  answers: SurveyAnswers;
  /** Optional survey date, "YYYY-MM-DD". */
  date?: string;
  /** Optional anonymous respondent code (no names or contact details). */
  code?: string;
  /** System timestamp of entry, used for ordering. Never personal data. */
  createdAt: string;
};

/** Loosely-typed draft coming from the form (answers may be missing). */
export type SurveyResponseInput = {
  area: SurveyArea | "";
  answers: Partial<Record<SurveyQuestionId, string | null>>;
  date?: string;
  code?: string;
};

/** Normalized value produced by a successful validation. */
export type SurveyValidatedValue = {
  area: SurveyArea;
  answers: SurveyAnswers;
  date?: string;
  code?: string;
};

/** Field-level error messages shown next to the form controls. */
export type SurveyValidationErrors = {
  area?: string;
  answers?: Partial<Record<SurveyQuestionId, string>>;
  date?: string;
  code?: string;
};

/** Result of an add/update attempt through the store. */
export type SurveyWriteResult =
  | { ok: true; id: string }
  | { ok: false; errors: SurveyValidationErrors };

/** Result of validating a draft. */
export type SurveyValidationResult =
  | { ok: true; value: SurveyValidatedValue }
  | { ok: false; errors: SurveyValidationErrors };

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CODE_MAX = 40;
const ANSWER_MAX = 600;

/** True for a real calendar date in "YYYY-MM-DD" form. */
export function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * Validates a draft. The area and all four free-text answers are required.
 * Returns normalized values on success.
 */
export function validateSurveyInput(raw: SurveyResponseInput): SurveyValidationResult {
  const errors: SurveyValidationErrors = {};

  if (!isSurveyArea(raw.area)) {
    errors.area = "Vyberte oblasť prieskumu.";
  }

  const answers: Partial<SurveyAnswers> = {};
  const answerErrors: Partial<Record<SurveyQuestionId, string>> = {};
  for (const question of SURVEY_QUESTIONS) {
    const value = raw.answers?.[question.id];
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) {
      answerErrors[question.id] = "Zadajte odpoveď.";
    } else if (text.length > ANSWER_MAX) {
      answerErrors[question.id] = `Odpoveď môže mať najviac ${ANSWER_MAX} znakov.`;
    } else {
      answers[question.id] = text;
    }
  }
  if (Object.keys(answerErrors).length > 0) errors.answers = answerErrors;

  const date = raw.date?.trim() ?? "";
  if (date && !isValidDate(date)) {
    errors.date = "Zadajte platný dátum (alebo ho nechajte prázdny).";
  }

  const code = raw.code?.trim() ?? "";
  if (code.length > CODE_MAX) {
    errors.code = `Kód môže mať najviac ${CODE_MAX} znakov.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      area: raw.area as SurveyArea,
      answers: answers as SurveyAnswers,
      date: date || undefined,
      code: code || undefined,
    },
  };
}

function createId(): string {
  const globalCrypto = globalThis.crypto;
  if (globalCrypto && typeof globalCrypto.randomUUID === "function") {
    return globalCrypto.randomUUID();
  }
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Builds a full response from a validated value. */
export function createSurveyResponse(value: SurveyValidatedValue): SurveyResponse {
  return {
    id: createId(),
    area: value.area,
    answers: { ...value.answers },
    date: value.date,
    code: value.code,
    createdAt: new Date().toISOString(),
  };
}

/** Runtime guard used when loading persisted data (localStorage). */
export function isSurveyResponse(value: unknown): value is SurveyResponse {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<SurveyResponse>;
  if (typeof r.id !== "string" || r.id.length === 0) return false;
  if (!isSurveyArea(r.area)) return false;
  if (!r.answers || typeof r.answers !== "object") return false;
  const answers = r.answers as Record<string, unknown>;
  for (const question of SURVEY_QUESTIONS) {
    if (typeof answers[question.id] !== "string") return false;
  }
  if (r.date !== undefined && (typeof r.date !== "string" || !isValidDate(r.date))) return false;
  if (r.code !== undefined && typeof r.code !== "string") return false;
  return typeof r.createdAt === "string";
}

/** Average answer length in characters for a single response. */
export function responseMean(response: SurveyResponse): number {
  const lengths = SURVEY_QUESTIONS.map((q) => (response.answers[q.id] ?? "").length);
  if (lengths.length === 0) return 0;
  return lengths.reduce((acc, value) => acc + value, 0) / lengths.length;
}

// ---------------------------------------------------------------------------
// Aggregation (theme / frequency analysis for open-ended answers)
// ---------------------------------------------------------------------------

export type QuestionStat = {
  questionId: SurveyQuestionId;
  order: number;
  short: string;
  label: string;
  /** Most frequent answer text; "" when there are no answers. */
  topSnippet: string;
  /** How many times the top answer appears. */
  count: number;
  /** Average answer length in characters, or null when there are no answers. */
  mean: number | null;
};

export type AreaStats = {
  area: SurveyArea;
  count: number;
  questions: QuestionStat[];
  overallMean: number | null;
};

export type SurveyStats = {
  total: number;
  areas: AreaStats[];
  overall: {
    count: number;
    questions: QuestionStat[];
    overallMean: number | null;
  };
};

function topAnswer(values: readonly string[]): { topSnippet: string; count: number } {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  let topSnippet = "";
  let count = 0;
  for (const [value, freq] of counts) {
    if (freq > count) {
      topSnippet = value;
      count = freq;
    }
  }
  return { topSnippet, count };
}

function meanLength(values: readonly string[]): number | null {
  const lengths = values.map((v) => v.trim()).filter((v) => v.length > 0).map((v) => v.length);
  if (lengths.length === 0) return null;
  return lengths.reduce((acc, value) => acc + value, 0) / lengths.length;
}

function questionStats(responses: readonly SurveyResponse[]): QuestionStat[] {
  return SURVEY_QUESTIONS.map((question) => {
    const values = responses.map((r) => r.answers[question.id] ?? "");
    const { topSnippet, count } = topAnswer(values);
    return {
      questionId: question.id,
      order: question.order,
      short: question.short,
      label: question.label,
      topSnippet,
      count,
      mean: meanLength(values),
    };
  });
}

function overallMeanFromQuestions(questions: readonly QuestionStat[]): number | null {
  const means = questions.map((q) => q.mean).filter((m): m is number => m !== null);
  if (means.length === 0) return null;
  return means.reduce((acc, value) => acc + value, 0) / means.length;
}

/** Computes theme/frequency statistics from the real response set. */
export function computeSurveyStats(responses: readonly SurveyResponse[]): SurveyStats {
  const areas: AreaStats[] = SURVEY_AREAS.map((area) => {
    const subset = responses.filter((r) => r.area === area);
    const questions = questionStats(subset);
    return {
      area,
      count: subset.length,
      questions,
      overallMean: overallMeanFromQuestions(questions),
    };
  });

  const questions = questionStats(responses);
  return {
    total: responses.length,
    areas,
    overall: {
      count: responses.length,
      questions,
      overallMean: overallMeanFromQuestions(questions),
    },
  };
}

/** Per-area response counts (both areas always present). */
export function computeAreaCounts(
  responses: readonly SurveyResponse[],
): Record<SurveyArea, number> {
  const counts = {} as Record<SurveyArea, number>;
  for (const area of SURVEY_AREAS) counts[area] = 0;
  for (const response of responses) counts[response.area] += 1;
  return counts;
}

/**
 * Returns the aggregate for a filter. "all" returns the overall object itself;
 * an unknown area falls back to the overall aggregate.
 */
export function statsForFilter(
  stats: SurveyStats,
  filter: "all" | SurveyArea | string,
): { count: number; questions: QuestionStat[]; overallMean: number | null } {
  if (filter === "all") return stats.overall;
  return stats.areas.find((a) => a.area === filter) ?? stats.overall;
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

/** Semicolon-delimited filename with a date stamp. */
export function surveyCsvFilename(prefix = "prieskum-objav-detvu"): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return `${prefix}-${stamp}.csv`;
}

function csvCell(value: string): string {
  const needsQuotes = value.includes(SURVEY_CSV_DELIMITER) || /["\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

/** Serializes responses to CSV (header + one row per response). */
export function surveyToCsv(responses: readonly SurveyResponse[]): string {
  const header = ["id", "oblast", ...SURVEY_QUESTIONS.map((q) => q.id), "datum", "kod"];
  const lines = [header.join(SURVEY_CSV_DELIMITER)];
  for (const response of responses) {
    const cells = [
      response.id,
      response.area,
      ...SURVEY_QUESTIONS.map((q) => response.answers[q.id] ?? ""),
      response.date ?? "",
      response.code ?? "",
    ];
    lines.push(cells.map(csvCell).join(SURVEY_CSV_DELIMITER));
  }
  return lines.join("\r\n");
}
