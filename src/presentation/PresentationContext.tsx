import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PresentationContextValue = {
  /** True while the immersive demonstration mode is active. */
  active: boolean;
  /** True while the stop overview (S) is open over the current page. */
  timelineOpen: boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
  toggleTimeline: () => void;
  closeTimeline: () => void;
};

const PresentationContext = createContext<PresentationContextValue | null>(null);

/** Remembers the mode across a full page load (e.g. a hard link or a reload). */
const STORAGE_KEY = "objav-detvu:prezentacia";

/** Reads the entry flag: ?prezentacia=1 (deep links / tests) or sessionStorage. */
function readInitialState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const flag = new URLSearchParams(window.location.search).get("prezentacia");
    if (flag === "1" || flag === "true") return true;
  } catch {
    /* ignore malformed URLs */
  }
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Reads the overview flag: ?prehlad=1 opens the stop timeline straight away. */
function readInitialTimeline(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const flag = new URLSearchParams(window.location.search).get("prehlad");
    return flag === "1" || flag === "true";
  } catch {
    return false;
  }
}

/** Drops a stale query flag once what it asked for is over. */
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

function requestFullscreen(onResult: (ok: boolean) => void) {
  const el = document.documentElement;
  if (!el.requestFullscreen) {
    onResult(false);
    return;
  }
  el.requestFullscreen({ navigationUI: "hide" } as FullscreenOptions).then(
    () => onResult(true),
    () => onResult(false),
  );
}

function leaveFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    void document.exitFullscreen().catch(() => {});
  }
}

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(readInitialState);
  const [timelineOpen, setTimelineOpen] = useState(readInitialTimeline);
  // Only react to the browser leaving fullscreen when it was ours to begin with,
  // so an unrelated fullscreen change never yanks the user out of the site.
  const engagedFullscreen = useRef(false);

  // Reflect the mode on <html> before paint so global styles apply without a
  // flash of unstyled chrome. This is the single switch every override keys on.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-presenting", active);
    return () => root.classList.remove("is-presenting");
  }, [active]);

  // Persist the mode so an accidental full page load never drops it, and clear
  // a leftover entry flag once we are back to normal browsing.
  useEffect(() => {
    try {
      if (active) window.sessionStorage.setItem(STORAGE_KEY, "1");
      else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — the mode still works for this page load */
    }
    if (!active) stripParam("prezentacia");
  }, [active]);

  const enter = useCallback(() => {
    setActive(true);
    requestFullscreen((ok) => {
      engagedFullscreen.current = ok;
    });
  }, []);

  const exit = useCallback(() => {
    setActive(false);
    setTimelineOpen(false);
    leaveFullscreen();
    engagedFullscreen.current = false;
  }, []);

  const toggle = useCallback(() => {
    setTimelineOpen(false);
    setActive((current) => {
      if (current) {
        leaveFullscreen();
        engagedFullscreen.current = false;
        return false;
      }
      requestFullscreen((ok) => {
        engagedFullscreen.current = ok;
      });
      return true;
    });
  }, []);

  const toggleTimeline = useCallback(() => {
    setTimelineOpen((open) => !open);
  }, []);

  const closeTimeline = useCallback(() => {
    setTimelineOpen(false);
    stripParam("prehlad");
  }, []);

  // Pressing the browser's own Escape while fullscreen exits the demonstration.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && engagedFullscreen.current) {
        engagedFullscreen.current = false;
        setActive(false);
        setTimelineOpen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const value = useMemo(
    () => ({ active, timelineOpen, enter, exit, toggle, toggleTimeline, closeTimeline }),
    [active, timelineOpen, enter, exit, toggle, toggleTimeline, closeTimeline],
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}

export function usePresentation(): PresentationContextValue {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("usePresentation must be used within <PresentationProvider>.");
  }
  return ctx;
}
