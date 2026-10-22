import type { SkyPhase } from "../world/useWorldClock";

export type AtmospherePreset = {
  readonly id: string;
  readonly label: string;
  readonly phase: SkyPhase;
};

export const atmospherePresets = [
  { id: "zlaty-svit", label: "Zlatý svit", phase: "dawn" },
  { id: "jasny-den", label: "Jasný deň", phase: "day" },
  { id: "medeny-sumrak", label: "Medený súmrak", phase: "dusk" },
  { id: "hviezdna-noc", label: "Hviezdna noc", phase: "night" },
  { id: "polarna-ziara", label: "Polárna žiara", phase: "night" },
  { id: "hmliste-rano", label: "Hmlisté ráno", phase: "dawn" },
  { id: "burkove-nebo", label: "Búrkové nebo", phase: "dusk" },
  { id: "krvavy-mesiac", label: "Krvavý mesiac", phase: "night" },
  { id: "perlovy-sumrak", label: "Perlový súmrak", phase: "dusk" },
  { id: "meteoricka-noc", label: "Meteorická noc", phase: "night" },
] as const satisfies readonly AtmospherePreset[];

export type AtmospherePresetId = (typeof atmospherePresets)[number]["id"];

const presetsById = new Map<string, AtmospherePreset>(
  atmospherePresets.map((preset) => [preset.id, preset]),
);

const assignments = new Map<string, AtmospherePreset>();
let bag: AtmospherePreset[] = [];
let lastAssigned: AtmospherePreset | null = null;

function randomIndex(length: number) {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function shuffle(items: readonly AtmospherePreset[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function refillBag() {
  bag = shuffle(atmospherePresets);
  if (lastAssigned && bag.length > 1 && bag[bag.length - 1] === lastAssigned) {
    [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  }
}

function drawPreset() {
  if (!bag.length) refillBag();
  const preset = bag.pop();
  if (!preset) return atmospherePresets[0];

  lastAssigned = preset;
  return preset;
}

export function sectionKeyForPath(pathname: string) {
  const [section] = pathname.split("/").filter(Boolean);
  return section ?? "domov";
}

export function getPresetForSection(sectionKey: string) {
  const assigned = assignments.get(sectionKey);
  if (assigned) return assigned;

  const preset = drawPreset();
  assignments.set(sectionKey, preset);
  return preset;
}

export function forcedPresetFromSearch(search: string) {
  const id = new URLSearchParams(search).get("bg");
  return id ? (presetsById.get(id) ?? null) : null;
}
