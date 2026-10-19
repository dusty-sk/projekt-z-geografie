import { useEffect } from "react";
import { useEggs } from "./EggsContext";
import { isEggModalOpen } from "./eggCore";
import { HiddenTerminal } from "./HiddenTerminal";
import { LostArchive } from "./LostArchive";
import { ConstellationScreen } from "./Constellation";
import { NetworkScreen } from "./Network";
import { DeveloperMode, GlitchLayer } from "./Meta";
import { MidnightProtocol, SilentObserver } from "./Atmosphere";
import { CompletionistScreen, SecretLocation } from "./Finale";
import "./eggs.css";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

export function EggsLayer() {
  const { active, glitching, openEgg } = useEggs();

  useEffect(() => {
    let sequence: string[] = [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (active || isEggModalOpen()) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (!KONAMI.includes(event.key)) {
        sequence = [];
        return;
      }
      sequence = [...sequence, event.key].slice(-KONAMI.length);
      if (KONAMI.every((key, index) => sequence[index] === key)) {
        sequence = [];
        openEgg("developer");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, openEgg]);

  return (
    <>
      {active === "terminal" && <HiddenTerminal />}
      {active === "location11" && <SecretLocation />}
      {active === "constellation" && <ConstellationScreen />}
      {active === "developer" && <DeveloperMode />}
      {active === "midnight" && <MidnightProtocol />}
      {active === "archive" && <LostArchive />}
      {active === "network" && <NetworkScreen />}
      {active === "completionist" && <CompletionistScreen />}

      {glitching && <GlitchLayer />}
      <SilentObserver />
    </>
  );
}
