import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  BASE_EGG_IDS,
  EGG_IDS,
  NETWORK_NODE_IDS,
  readEggState,
  setEggModalOpen,
  writeEggState,
  type EggId,
  type EggState,
  type NetworkNodeId,
} from "./eggCore";

const GLITCH_MS = 2000;
const TRANCE_MS = 2600;
const COMPLETIONIST_DELAY_MS = 900;
const RANDOM_GLITCH_ROLL = "objav-detvu:glitch-roll";

type ConstellationOutcome = "next" | "reset" | "done" | "already";

type EggsContextValue = {
  active: EggId | null;
  unlocked: Partial<Record<EggId, number>>;
  unlockedCount: number;
  allBaseUnlocked: boolean;
  constellationStep: number;
  networkFound: NetworkNodeId[];
  observerSeen: number;
  glitching: boolean;
  trancing: boolean;
  midnight: boolean;
  openEgg: (id: EggId) => void;
  closeEgg: () => void;
  unlock: (id: EggId) => void;
  advanceConstellation: (star: number) => ConstellationOutcome;
  collectNetworkNode: (node: NetworkNodeId) => { added: boolean; complete: boolean };
  recordObserver: () => number;
  triggerGlitch: () => void;
  triggerTrance: () => void;
  activateMidnight: () => void;
};

const EggsContext = createContext<EggsContextValue | null>(null);

function stripParam(name: string) {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(name)) {
      url.searchParams.delete(name);
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  } catch {
    /* ignore */
  }
}

export function EggsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EggState>(readEggState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const [active, setActive] = useState<EggId | null>(null);
  const [glitching, setGlitching] = useState(false);
  const [trancing, setTrancing] = useState(false);
  const [midnight, setMidnight] = useState(false);

  const glitchTimer = useRef(0);
  const tranceTimer = useRef(0);
  const midnightChecked = useRef(false);
  const { pathname } = useLocation();

  const commit = useCallback((next: EggState) => {
    stateRef.current = next;
    writeEggState(next);
    setState(next);
  }, []);

  const unlock = useCallback(
    (id: EggId) => {
      const prev = stateRef.current;
      if (prev.unlocked[id]) return;
      commit({ ...prev, unlocked: { ...prev.unlocked, [id]: Date.now() } });
    },
    [commit],
  );

  const openEgg = useCallback(
    (id: EggId) => {
      if (id === "midnight") setMidnight(true);
      unlock(id);
      setActive(id);
    },
    [unlock],
  );

  const closeEgg = useCallback(() => setActive(null), []);

  const triggerGlitch = useCallback(() => {
    unlock("glitch");
    if (glitchTimer.current) window.clearTimeout(glitchTimer.current);
    setGlitching(true);
    glitchTimer.current = window.setTimeout(() => setGlitching(false), GLITCH_MS);
  }, [unlock]);

  const triggerTrance = useCallback(() => {
    if (tranceTimer.current) window.clearTimeout(tranceTimer.current);
    setTrancing(true);
    tranceTimer.current = window.setTimeout(() => setTrancing(false), TRANCE_MS);
  }, []);

  const activateMidnight = useCallback(() => {
    setMidnight(true);
    unlock("midnight");
    setActive("midnight");
  }, [unlock]);

  const advanceConstellation = useCallback(
    (star: number): ConstellationOutcome => {
      const prev = stateRef.current;
      if (prev.constellationStep >= 5 || star <= prev.constellationStep) return "already";
      if (star !== prev.constellationStep + 1) {
        commit({ ...prev, constellationStep: 0 });
        return "reset";
      }
      const step = prev.constellationStep + 1;
      commit({ ...prev, constellationStep: step });
      if (step >= 5) {
        unlock("constellation");
        setActive("constellation");
        return "done";
      }
      return "next";
    },
    [commit, unlock],
  );

  const collectNetworkNode = useCallback(
    (node: NetworkNodeId) => {
      const prev = stateRef.current;
      if (prev.networkFound.includes(node)) {
        return { added: false, complete: prev.networkFound.length >= NETWORK_NODE_IDS.length };
      }
      const networkFound = [...prev.networkFound, node];
      const complete = networkFound.length >= NETWORK_NODE_IDS.length;
      commit({ ...prev, networkFound });
      if (complete) {
        unlock("network");
        setActive("network");
      }
      return { added: true, complete };
    },
    [commit, unlock],
  );

  const recordObserver = useCallback(() => {
    const prev = stateRef.current;
    const observerSeen = prev.observerSeen + 1;
    commit({ ...prev, observerSeen });
    unlock("observer");
    return observerSeen;
  }, [commit, unlock]);

  // Close any open egg screen when the visitor moves to another page.
  useEffect(() => {
    setActive(null);
  }, [pathname]);

  useEffect(() => {
    setEggModalOpen(active !== null);
    if (!active) {
      return () => setEggModalOpen(false);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      setEggModalOpen(false);
    };
  }, [active]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("egg-glitch", glitching);
    return () => root.classList.remove("egg-glitch");
  }, [glitching]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("egg-trance", trancing);
    return () => root.classList.remove("egg-trance");
  }, [trancing]);

  useEffect(() => {
    const root = document.documentElement;
    if (midnight) root.setAttribute("data-egg-night", "1");
    else root.removeAttribute("data-egg-night");
    return () => root.removeAttribute("data-egg-night");
  }, [midnight]);

  // Rare, once-per-session glitch on a fresh load. User-initiated glitches from
  // the terminal or archive are always allowed; this roll only adds surprise.
  useEffect(() => {
    let timer = 0;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("prezentacia")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.sessionStorage.getItem(RANDOM_GLITCH_ROLL)) return;
      window.sessionStorage.setItem(RANDOM_GLITCH_ROLL, "1");
      if (Math.random() < 0.05) {
        timer = window.setTimeout(() => {
          if (!document.documentElement.hasAttribute("data-egg-night")) triggerGlitch();
        }, 2000);
      }
    } catch {
      /* storage or matchMedia unavailable */
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [triggerGlitch]);

  // ?polnoc=1 is a deep-link / QA hook for the midnight protocol.
  useEffect(() => {
    if (midnightChecked.current) return;
    midnightChecked.current = true;

    let flagged = false;
    try {
      flagged = new URLSearchParams(window.location.search).get("polnoc") === "1";
    } catch {
      /* ignore malformed URLs */
    }
    const now = new Date();
    if (flagged || (now.getHours() === 0 && now.getMinutes() === 0)) {
      activateMidnight();
      if (flagged) stripParam("polnoc");
    }
  }, [activateMidnight]);

  const allBaseUnlocked = BASE_EGG_IDS.every((id) => Boolean(state.unlocked[id]));
  const unlockedCount = EGG_IDS.reduce(
    (count, id) => count + (state.unlocked[id] ? 1 : 0),
    0,
  );

  useEffect(() => {
    if (!allBaseUnlocked || state.unlocked.completionist || active || glitching) return;
    const timer = window.setTimeout(() => {
      unlock("completionist");
      setActive("completionist");
    }, COMPLETIONIST_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [allBaseUnlocked, state.unlocked.completionist, active, glitching, unlock]);

  const value = useMemo<EggsContextValue>(
    () => ({
      active,
      unlocked: state.unlocked,
      unlockedCount,
      allBaseUnlocked,
      constellationStep: state.constellationStep,
      networkFound: state.networkFound,
      observerSeen: state.observerSeen,
      glitching,
      trancing,
      midnight,
      openEgg,
      closeEgg,
      unlock,
      advanceConstellation,
      collectNetworkNode,
      recordObserver,
      triggerGlitch,
      triggerTrance,
      activateMidnight,
    }),
    [
      active,
      state.unlocked,
      state.constellationStep,
      state.networkFound,
      state.observerSeen,
      unlockedCount,
      allBaseUnlocked,
      glitching,
      trancing,
      midnight,
      openEgg,
      closeEgg,
      unlock,
      advanceConstellation,
      collectNetworkNode,
      recordObserver,
      triggerGlitch,
      triggerTrance,
      activateMidnight,
    ],
  );

  return <EggsContext.Provider value={value}>{children}</EggsContext.Provider>;
}

export function useEggs(): EggsContextValue {
  const ctx = useContext(EggsContext);
  if (!ctx) {
    throw new Error("useEggs must be used within <EggsProvider>.");
  }
  return ctx;
}
