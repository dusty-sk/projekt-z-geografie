import { useEffect, useState } from "react";

export type SkyPhase = "dawn" | "day" | "dusk" | "night";

const PHASE_LABELS: Record<SkyPhase, string> = {
  dawn: "Svitanie",
  day: "Deň",
  dusk: "Súmrak",
  night: "Noc",
};

const PHASES: readonly SkyPhase[] = ["dawn", "day", "dusk", "night"];

const timeFormatter = new Intl.DateTimeFormat("sk-SK", {
  hour: "2-digit",
  minute: "2-digit",
});

export function getSkyPhase(date: Date): SkyPhase {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 330 && minutes < 450) return "dawn";
  if (minutes >= 450 && minutes < 1050) return "day";
  if (minutes >= 1050 && minutes < 1200) return "dusk";
  return "night";
}

function readPhaseOverride(): SkyPhase | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("faza");
  return PHASES.includes(value as SkyPhase) ? (value as SkyPhase) : null;
}

export type WorldClock = {
  phase: SkyPhase;
  label: string;
  time: string;
  isNight: boolean;
};

export function useWorldClock(): WorldClock {
  const [now, setNow] = useState(() => new Date());
  const [override] = useState<SkyPhase | null>(readPhaseOverride);

  useEffect(() => {
    let timer = 0;

    const schedule = () => {
      const current = new Date();
      const elapsed = current.getSeconds() * 1000 + current.getMilliseconds();
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60_000 - elapsed + 150);
    };

    schedule();

    const onVisibility = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      setNow(new Date());
      schedule();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const phase = override ?? getSkyPhase(now);

  return {
    phase,
    label: PHASE_LABELS[phase],
    time: timeFormatter.format(now),
    isNight: phase === "night",
  };
}
