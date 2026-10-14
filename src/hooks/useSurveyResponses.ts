import { useCallback, useEffect, useState } from "react";
import {
  createSurveyResponse,
  isSurveyResponse,
  surveyCsvFilename,
  surveyToCsv,
  validateSurveyInput,
  SURVEY_STORAGE_KEY,
  type SurveyResponse,
  type SurveyResponseInput,
  type SurveyWriteResult,
} from "../data/survey";

export type WriteResult = SurveyWriteResult;

type StoredState = {
  responses: SurveyResponse[];
  /** False when localStorage is unavailable (e.g. private mode) or corrupt. */
  persistent: boolean;
};

function readStored(): StoredState {
  if (typeof window === "undefined") return { responses: [], persistent: false };
  try {
    const raw = window.localStorage.getItem(SURVEY_STORAGE_KEY);
    if (!raw) return { responses: [], persistent: true };
    const parsed: unknown = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? parsed
      : (parsed as { responses?: unknown })?.responses;
    const responses = Array.isArray(list) ? list.filter(isSurveyResponse) : [];
    return { responses, persistent: true };
  } catch {
    return { responses: [], persistent: false };
  }
}

function writeStored(responses: readonly SurveyResponse[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(responses));
    return true;
  } catch {
    return false;
  }
}

/**
 * Survey response store.
 *
 * Persistence: browser localStorage under SURVEY_STORAGE_KEY, which is separate
 * from all location data. Data therefore stays in THIS browser only and does NOT
 * sync across devices or even across different browsers on the same device.
 */
export function useSurveyResponses() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  // Load once, on the client.
  useEffect(() => {
    const stored = readStored();
    setResponses(stored.responses);
    setPersistent(stored.persistent);
    setReady(true);
  }, []);

  // Persist on change, but never before the initial load has run — otherwise the
  // very first render would overwrite stored data with an empty list.
  useEffect(() => {
    if (!ready) return;
    const ok = writeStored(responses);
    if (!ok) setPersistent(false);
  }, [responses, ready]);

  // Keep tabs in sync (same browser, same origin).
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SURVEY_STORAGE_KEY) return;
      setResponses(readStored().responses);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addResponse = useCallback((input: SurveyResponseInput): WriteResult => {
    const result = validateSurveyInput(input);
    if (!result.ok) return { ok: false, errors: result.errors };
    const created = createSurveyResponse(result.value);
    setResponses((prev) => [...prev, created]);
    return { ok: true, id: created.id };
  }, []);

  const updateResponse = useCallback(
    (id: string, input: SurveyResponseInput): WriteResult => {
      const result = validateSurveyInput(input);
      if (!result.ok) return { ok: false, errors: result.errors };
      setResponses((prev) =>
        prev.map((response) =>
          response.id === id
            ? {
                ...response,
                area: result.value.area,
                ratings: result.value.ratings,
                date: result.value.date,
                code: result.value.code,
              }
            : response,
        ),
      );
      return { ok: true, id };
    },
    [],
  );

  const deleteResponse = useCallback((id: string) => {
    setResponses((prev) => prev.filter((response) => response.id !== id));
  }, []);

  const clearAll = useCallback(() => setResponses(() => []), []);

  return {
    responses,
    ready,
    persistent,
    addResponse,
    updateResponse,
    deleteResponse,
    clearAll,
  };
}

/**
 * Triggers a CSV download in the browser. Semicolon-delimited with a UTF-8 BOM
 * so Slovak characters open correctly in Excel.
 */
export function downloadSurveyCsv(
  responses: readonly SurveyResponse[],
  filename: string = surveyCsvFilename(),
): void {
  if (typeof document === "undefined") return;
  const csv = surveyToCsv(responses);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
