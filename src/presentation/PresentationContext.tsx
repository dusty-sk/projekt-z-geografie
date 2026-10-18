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
  enter: () => void;
  exit: () => void;
  toggle: () => void;
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

/** Drops a stale ?prezentacia flag once the mode is off. */
function stripEntryFlag() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("prezentacia")) {
      url.searchParams.delete("prezentacia");
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
    if (!active) stripEntryFlag();
  }, [active]);

  const enter = useCallback(() => {
    setActive(true);
    requestFullscreen((ok) => {
      engagedFullscreen.current = ok;
    });
  }, []);

  const exit = useCallback(() => {
    setActive(false);
    leaveFullscreen();
    engagedFullscreen.current = false;
  }, []);

  const toggle = useCallback(() => {
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

  // Pressing the browser's own Escape while fullscreen exits the demonstration.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && engagedFullscreen.current) {
        engagedFullscreen.current = false;
        setActive(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const value = useMemo(
    () => ({ active, enter, exit, toggle }),
    [active, enter, exit, toggle],
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
