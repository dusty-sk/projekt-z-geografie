/**
 * Survey data model — residents' satisfaction with Detva, rated 0–5.
 *
 * This module is intentionally SEPARATE from src/data/locations.ts: locations
 * describe ten places, while the survey records people's opinions. The two must
 * not be mixed.
 *
 * It contains pure logic only (no browser APIs), so the exact same functions
 * can drive the entry form, the on-screen summary and the results charts without
 * any manual duplication. Persistence lives in src/hooks/useSurveyResponses.ts.
 *
 * Data-integrity rule: the real dataset starts empty. Nothing in this file
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
// Questions & scale
// ---------------------------------------------------------------------------

export const RATING_MIN = 0;
export const RATING_MAX = 5;
export const RATING_VALUES = [0, 1, 2, 3, 4, 5] as const;

export const RATING_MIN_LABEL = "vôbec nie";
export const RATING_MAX_LABEL = "úplne spokojný";

export const SURVEY_QUESTION_IDS = ["q1", "q2", "q3", "q4"] as const;
export type SurveyQuestionId = (typeof SURVEY_QUESTION_IDS)[number];

export type SurveyQuestion = {
  id: SurveyQuestionId;
  order: number;
  /** The exact question wording shown in the field. */
  label: string;
  /** Short form used in the table header, CSV and charts. */
  short: string;
};

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] = [
  {
    id: "q1",
    order: 1,
    label: "Ako ste spokojný s pomerom ceny a kvality produktov v obchodoch?",
    short: "Cena a kvalita v obchodoch",
  },
  {
    id: "q2",
    order: 2,
    label: "Ako ste spokojný s čistotou mesta?",
    short: "Čistota mesta",
  },
  {
    id: "q3",
    order: 3,
    label: "Ako ste spokojný s množstvom a kvalitou služieb v meste?",
    short: "Služby v meste",
  },
  {
    id: "q4",
    order: 4,
    label: "Ako ste spokojný s možnosťami trávenia voľného času v meste?",
    short: "Voľný čas",
  },
];

export function questionById(id: SurveyQuestionId): SurveyQuestion {
  return SURVEY_QUESTIONS.find((q) => q.id === id) ?? SURVEY_QUESTIONS[0];
}

// ---------------------------------------------------------------------------
// Storage key (kept apart from any location data)
// ---------------------------------------------------------------------------

export const SURVEY_STORAGE_KEY = "objav-detvu:prieskum:v1";

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export type SurveyRatings = Record<SurveyQuestionId, number>;

export type SurveyResponse = {
  /** Unique id. */
  id: string;
  area: SurveyArea;
  ratings: SurveyRatings;
  /** Optional survey date, "YYYY-MM-DD". */
  date?: string;
  /** Optional anonymous respondent code (no names or contact details). */
  code?: string;
  /** System timestamp of entry, used for ordering. Never personal data. */
  createdAt: string;
};

/** Loosely-typed draft coming from the form (values may be missing). */
export type SurveyResponseInput = {
  area: SurveyArea | "";
  ratings: Partial<Record<SurveyQuestionId, number | null>>;
  date?: string;
  code?: string;
};

export type SurveyValidationErrors = {
  area?: string;
  ratings?: Partial<Record<SurveyQuestionId, string>>;
  date?: string;
  code?: string;
};

export type SurveyValidationResult =
  | {
      ok: true;
      value: {
        area: SurveyArea;
        ratings: SurveyRatings;
        date?: string;
        code?: string;
      };
    }
  | { ok: false; errors: SurveyValidationErrors };

/** Result of an add/update attempt through the store. */
export type SurveyWriteResult =
  | { ok: true; id: string }
  | { ok: false; errors: SurveyValidationErrors };

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= RATING_MIN &&
    value <= RATING_MAX
  );
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CODE_MAX = 40;

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * Validates a draft. Every rating must be present and an integer 0–5.
 * Returns normalized values on success.
 */
export function validateSurveyInput(raw: SurveyResponseInput): SurveyValidationResult {
  const errors: SurveyValidationErrors = {};

  if (!isSurveyArea(raw.area)) {
    errors.area = "Vyberte oblasť prieskumu.";
  }

  const ratings: Partial<SurveyRatings> = {};
  const ratingErrors: Partial<Record<SurveyQuestionId, string>> = {};
  for (const question of SURVEY_QUESTIONS) {
    const value = raw.ratings?.[question.id];
    if (value === null || value === undefined) {
      ratingErrors[question.id] = "Zadajte hodnotenie 0–5.";
    } else if (!isValidRating(value)) {
      ratingErrors[question.id] = "Hodnotenie musí byť celé číslo od 0 do 5.";
    } else {
      ratings[question.id] = value;
    }
  }
  if (Object.keys(ratingErrors).length > 0) errors.ratings = ratingErrors;

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
      ratings: ratings as SurveyRatings,
      date: date || undefined,
      code: code || undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Factories & runtime guard
// ---------------------------------------------------------------------------

function newId(): string {
  const crypto = globalThis.crypto;
  return crypto && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Builds a stored response from already-validated input. Throws when the input
 * is invalid so callers must validate first (see useSurveyResponses).
 */
export function createSurveyResponse(
  input: SurveyResponseInput,
  now: Date = new Date(),
): SurveyResponse {
  const validated = validateSurveyInput(input);
  if (!validated.ok) {
    throw new Error("Cannot create a survey response from invalid input.");
  }
  const { area, ratings, date, code } = validated.value;
  return {
    id: newId(),
    area,
    ratings,
    date,
    code,
    createdAt: now.toISOString(),
  };
}

/** Runtime guard used when loading persisted data (localStorage). */
export function isSurveyResponse(value: unknown): value is SurveyResponse {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<SurveyResponse>;
  if (typeof r.id !== "string" || r.id.length === 0) return false;
  if (!isSurveyArea(r.area)) return false;
  if (!r.ratings || typeof r.ratings !== "object") return false;
  for (const question of SURVEY_QUESTIONS) {
    if (!isValidRating(r.ratings[question.id])) return false;
  }
  if (r.date !== undefined && !isValidDate(r.date)) return false;
  if (r.code !== undefined && typeof r.code !== "string") return false;
  return typeof r.createdAt === "string";
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

/** Distribution of ratings for a single question. Index = rating value 0–5. */
export type QuestionStat = {
  questionId: SurveyQuestionId;
  label: string;
  short: string;
  /** Number of valid ratings for this question. */
  count: number;
  /** Arithmetic mean of valid ratings, or null when there are none. */
  mean: number | null;
  /** Count of responses per rating value; length 6 (indexes 0–5). */
  distribution: number[];
};

export type AreaStat = {
  area: SurveyArea;
  /** Number of responses recorded for the area. */
  count: number;
  /** Mean of the four question means, or null when there are no responses. */
  overallMean: number | null;
  questions: QuestionStat[];
};

export type SurveyStats = {
  total: number;
  areas: AreaStat[];
  overall: {
    count: number;
    overallMean: number | null;
    questions: QuestionStat[];
  };
};

function emptyDistribution(): number[] {
  return RATING_VALUES.map(() => 0);
}

/**
 * Aggregates a set of responses per question. Missing/invalid ratings are
 * ignored (never treated as zero) so the mean reflects valid answers only.
 */
function computeQuestionStats(responses: readonly SurveyResponse[]): QuestionStat[] {
  return SURVEY_QUESTIONS.map((question) => {
    const distribution = emptyDistribution();
    let sum = 0;
    let count = 0;
    for (const response of responses) {
      const value = response.ratings[question.id];
      if (isValidRating(value)) {
        distribution[value] += 1;
        sum += value;
        count += 1;
      }
    }
    return {
      questionId: question.id,
      label: question.label,
      short: question.short,
      count,
      mean: count > 0 ? sum / count : null,
      distribution,
    };
  });
}

/** Mean of the question means, skipping questions without valid answers. */
function meanOfMeans(questions: readonly QuestionStat[]): number | null {
  const means = questions.map((q) => q.mean).filter((m): m is number => m !== null);
  if (means.length === 0) return null;
  return means.reduce((acc, m) => acc + m, 0) / means.length;
}

/** Counts responses per area, always containing both areas (0 when empty). */
export function computeAreaCounts(
  responses: readonly SurveyResponse[],
): Record<SurveyArea, number> {
  const counts = Object.fromEntries(SURVEY_AREAS.map((area) => [area, 0])) as Record<
    SurveyArea,
    number
  >;
  for (const response of responses) counts[response.area] += 1;
  return counts;
}

/**
 * Picks the aggregate to display for a results filter ("all" or a single area).
 * Unknown areas fall back to the overall aggregate so the UI can never render
 * an undefined/empty view. Keeps the filter mapping in one place instead of
 * repeating area names across every chart component.
 */
export function statsForFilter(
  stats: SurveyStats,
  filter: "all" | SurveyArea,
): { count: number; overallMean: number | null; questions: QuestionStat[] } {
  if (filter === "all") return stats.overall;
  return stats.areas.find((area) => area.area === filter) ?? stats.overall;
}

/**
 * Full statistics bundle for the results section: per-area and overall
 * question breakdowns. Everything is derived from the responses passed in.
 */
export function computeSurveyStats(responses: readonly SurveyResponse[]): SurveyStats {
  const areas: AreaStat[] = SURVEY_AREAS.map((area) => {
    const subset = responses.filter((response) => response.area === area);
    const questions = computeQuestionStats(subset);
    return {
      area,
      count: subset.length,
      overallMean: meanOfMeans(questions),
      questions,
    };
  });

  const overallQuestions = computeQuestionStats(responses);
  return {
    total: responses.length,
    areas,
    overall: {
      count: responses.length,
      overallMean: meanOfMeans(overallQuestions),
      questions: overallQuestions,
    },
  };
}

/** Mean of a single response's four ratings (handy for the table). */
export function responseMean(response: SurveyResponse): number {
  const values = SURVEY_QUESTIONS.map((q) => response.ratings[q.id]);
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

export const SURVEY_CSV_DELIMITER = ";";

const CSV_COLUMNS = [
  "id",
  "oblast",
  "q1_cena_kvalita",
  "q2_cistota",
  "q3_sluzby",
  "q4_volny_cas",
  "priemer",
  "datum",
  "kod",
  "vytvorene",
] as const;

function csvCell(value: string): string {
  if (/[";\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function formatNumber(value: number): string {
  // Plain dot-decimal so spreadsheets parse it as a number.
  return value.toFixed(2);
}

/**
 * Serializes responses to CSV (semicolon-delimited, Excel/Sheets friendly).
 * Pure: returns a string; use downloadSurveyCsv() to save it.
 */
export function surveyToCsv(responses: readonly SurveyResponse[]): string {
  const rows: string[] = [CSV_COLUMNS.join(SURVEY_CSV_DELIMITER)];
  for (const response of responses) {
    rows.push(
      [
        response.id,
        response.area,
        String(response.ratings.q1),
        String(response.ratings.q2),
        String(response.ratings.q3),
        String(response.ratings.q4),
        formatNumber(responseMean(response)),
        response.date ?? "",
        response.code ?? "",
        response.createdAt,
      ]
        .map(csvCell)
        .join(SURVEY_CSV_DELIMITER),
    );
  }
  return rows.join("\r\n");
}

export function surveyCsvFilename(now: Date = new Date()): string {
  const stamp = now.toISOString().slice(0, 10);
  return `objav-detvu-prieskum-${stamp}.csv`;
}
