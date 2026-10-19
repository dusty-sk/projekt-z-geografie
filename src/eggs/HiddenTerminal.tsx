import { useEffect, useRef, useState } from "react";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";

const BOOT_LINES = [
  "DETVA_ARCHIVE // offline kópia · v0.9",
  "prepájanie vrstiev stránky…",
  "signál nájdený · 1 skrytá vrstva",
  "ACCESS GRANTED",
  "Napíš `help` a stlač Enter.",
];

export function HiddenTerminal() {
  const eggs = useEggs();
  const { closeEgg, openEgg, triggerGlitch, triggerTrance, activateMidnight } = eggs;

  const [typed, setTyped] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const screenRef = useRef<HTMLDivElement>(null);
  const typeTimer = useRef(0);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(BOOT_LINES);
      return;
    }

    let line = 0;
    let char = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled || line >= BOOT_LINES.length) return;
      char += 1;
      const text = BOOT_LINES[line].slice(0, char);
      setTyped((prev) => {
        const next = prev.slice();
        next[line] = text;
        return next;
      });
      if (char >= BOOT_LINES[line].length) {
        line += 1;
        char = 0;
        typeTimer.current = window.setTimeout(step, 330);
      } else {
        typeTimer.current = window.setTimeout(step, 14 + Math.round(Math.random() * 22));
      }
    };

    typeTimer.current = window.setTimeout(step, 180);
    return () => {
      cancelled = true;
      if (typeTimer.current) window.clearTimeout(typeTimer.current);
    };
  }, []);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [log]);

  const print = (...lines: string[]) => setLog((prev) => [...prev, ...lines]);

  const run = (raw: string) => {
    const command = raw
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (!command) return;
    print(`> ${command}`);

    switch (command) {
      case "help":
        print(
          "Dostupné príkazy:",
          "  help       — tento zoznam",
          "  status     — stav archívu",
          "  archive    — otvorí stratený archív",
          "  glitch     — spustí poruchu reality",
          "  polnoc     — nočný protokol",
          "  siet       — stav siete",
          "  suhvezdie  — stopa k piatim svetlám",
          "  detva      — špeciálna animácia stránky",
          "  finale     — záverečný záznam",
          "  exit       — zavrieť terminál",
        );
        break;

      case "status":
        print(
          `Záznamy: ${eggs.unlockedCount}/10 · súhvezdie: ${eggs.constellationStep}/5 · sieť: ${eggs.networkFound.length}/5`,
          "Ďalšie stopy drží archív v päte stránky.",
        );
        break;

      case "archive":
        print("Otváram stratený archív…");
        window.setTimeout(() => openEgg("archive"), 320);
        break;

      case "glitch":
        print("Porucha reality…");
        window.setTimeout(() => {
          closeEgg();
          triggerGlitch();
        }, 280);
        break;

      case "polnoc":
        print("Nočný protokol aktivovaný.");
        window.setTimeout(() => activateMidnight(), 320);
        break;

      case "siet":
        if (eggs.networkFound.length >= 5) {
          print("Sieť je úplná. Otváram prepojenia…");
          window.setTimeout(() => openEgg("network"), 300);
        } else {
          print(
            `Sieť: ${eggs.networkFound.length}/5 uzlov.`,
            "Sú roztrúsené v textoch piatich stránok — hľadaj tri body.",
          );
        }
        break;

      case "suhvezdie":
        if (eggs.constellationStep >= 5) {
          print("Súhvezdie je úplné. Otváram…");
          window.setTimeout(() => openEgg("constellation"), 300);
        } else {
          print(
            `Svetlá: ${eggs.constellationStep}/5.`,
            "Poradie vedie od domu k pätke: domov → mapa → výskum → o projekte → pätka.",
          );
        }
        break;

      case "detva":
        print("DETVA_ARCHIVE // SIGNAL BROADCAST", "Tri krát sa obloha pohne. Nič sa nepokazí.");
        window.setTimeout(() => {
          closeEgg();
          triggerTrance();
        }, 380);
        break;

      case "finale":
        if (eggs.unlocked.completionist) {
          print("Otváram záverečný záznam…");
          window.setTimeout(() => openEgg("completionist"), 300);
        } else {
          print("Brána je zatvorená. Chýba ešte zopár vrstiev.");
        }
        break;

      case "whoami":
        print("návštevník · bez mena · vítaný");
        break;

      case "polana":
        print("Poľana · 1 457,8 m · nad všetkým.");
        break;

      case "exit":
      case "close":
      case "quit":
        closeEgg();
        break;

      default:
        print(`Neznámy príkaz: ${command}. Napíš help.`);
    }
  };

  return (
    <EggModal
      titleId="egg-terminal-title"
      label="DETVA_ARCHIVE · terminál"
      className="egg-terminal-shell"
      onClose={closeEgg}
    >
      <h2 id="egg-terminal-title" className="egg-visually-hidden">
        Skrytý terminál
      </h2>
      <div className="egg-terminal">
        <div className="egg-terminal__screen" ref={screenRef} aria-live="polite">
          {typed.map((line, index) => (
            <p key={`boot-${index}`}>{line || "\u00a0"}</p>
          ))}
          {log.map((line, index) => (
            <p key={`log-${index}`}>{line || "\u00a0"}</p>
          ))}
        </div>
        <form
          className="egg-terminal__form"
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <label className="egg-terminal__prompt" htmlFor="egg-terminal-input">
            detva@archiv:~$
          </label>
          <input
            id="egg-terminal-input"
            data-egg-autofocus
            className="egg-terminal__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Príkaz terminálu"
          />
        </form>
        <p className="egg-terminal__hint">Esc zavrie · help vypíše príkazy</p>
      </div>
    </EggModal>
  );
}
