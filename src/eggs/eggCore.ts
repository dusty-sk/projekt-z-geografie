export const EGG_IDS = [
  "terminal",
  "location11",
  "glitch",
  "constellation",
  "developer",
  "midnight",
  "archive",
  "observer",
  "network",
  "completionist",
] as const;

export type EggId = (typeof EGG_IDS)[number];

export const BASE_EGG_IDS = EGG_IDS.filter(
  (id): id is Exclude<EggId, "completionist"> => id !== "completionist",
);

export const NETWORK_NODE_IDS = ["domov", "mapa", "miesta", "region", "o-projekte"] as const;

export type NetworkNodeId = (typeof NETWORK_NODE_IDS)[number];

export type EggState = {
  v: 1;
  unlocked: Partial<Record<EggId, number>>;
  constellationStep: number;
  networkFound: NetworkNodeId[];
  observerSeen: number;
};

export const EGG_STORAGE_KEY = "objav-detvu:vajicka:v1";

export function createEggState(): EggState {
  return {
    v: 1,
    unlocked: {},
    constellationStep: 0,
    networkFound: [],
    observerSeen: 0,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function readEggState(): EggState {
  if (typeof window === "undefined") return createEggState();

  try {
    const raw = window.localStorage.getItem(EGG_STORAGE_KEY);
    if (!raw) return createEggState();
    const parsed = JSON.parse(raw) as Partial<EggState> | null;
    if (!parsed || typeof parsed !== "object") return createEggState();

    const unlocked: Partial<Record<EggId, number>> = {};
    if (parsed.unlocked && typeof parsed.unlocked === "object") {
      const source = parsed.unlocked as Record<string, unknown>;
      for (const id of EGG_IDS) {
        if (typeof source[id] === "number" && Number.isFinite(source[id])) {
          unlocked[id] = source[id];
        }
      }
    }

    const found = Array.isArray(parsed.networkFound)
      ? (parsed.networkFound as unknown[])
      : [];
    const networkFound = NETWORK_NODE_IDS.filter((id) =>
      found.includes(id),
    ) as NetworkNodeId[];

    return {
      v: 1,
      unlocked,
      constellationStep: clamp(Math.floor(Number(parsed.constellationStep) || 0), 0, 5),
      networkFound,
      observerSeen: Math.max(0, Math.floor(Number(parsed.observerSeen) || 0)),
    };
  } catch {
    return createEggState();
  }
}

export function writeEggState(state: EggState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EGG_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode / storage full — the eggs still work for this visit */
  }
}

let modalOpen = false;

export function setEggModalOpen(value: boolean): void {
  modalOpen = value;
}

export function isEggModalOpen(): boolean {
  return modalOpen;
}
