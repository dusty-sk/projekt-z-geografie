import { useEffect, useRef, useState } from "react";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";

let flashId = 0;

export function ConstellationStar({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const { constellationStep, advanceConstellation } = useEggs();
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const timers = useRef<Map<number, number>>(new Map());
  const lit = index <= constellationStep;

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers.values()) window.clearTimeout(timer);
      activeTimers.clear();
    };
  }, []);

  const onClick = () => {
    if (constellationStep >= 5 || lit) return;
    const result = advanceConstellation(index);
    if (result === "already") return;
    const id = ++flashId;
    setFlash(result === "reset" ? "bad" : "ok");
    const timer = window.setTimeout(() => {
      timers.current.delete(id);
      setFlash(null);
    }, 720);
    timers.current.set(id, timer);
  };

  return (
    <button
      type="button"
      className={`egg-star${lit ? " is-lit" : ""}${flash ? ` is-${flash}` : ""} ${className}`.trim()}
      data-egg-star={index}
      aria-label={`Svetlo ${index}`}
      aria-pressed={lit}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 1.6l1.8 7.1 7.1 1.8-7.1 1.8L12 19.4l-1.8-7.1-7.1-1.8 7.1-1.8z" />
      </svg>
    </button>
  );
}

const POINTS = [
  { x: 70, y: 250 },
  { x: 150, y: 132 },
  { x: 258, y: 196 },
  { x: 352, y: 92 },
  { x: 448, y: 206 },
];

export function ConstellationScreen() {
  const { closeEgg } = useEggs();

  return (
    <EggModal
      titleId="egg-constellation-title"
      label="THE CONSTELLATION · päť svetiel"
      className="egg-constellation-shell"
      onClose={closeEgg}
    >
      <div className="egg-constellation">
        <p className="egg-eyebrow">Súhvezdie nad Podpoľaním</p>
        <h2 id="egg-constellation-title" className="egg-title">
          THE CONSTELLATION
        </h2>
        <p className="egg-lede">
          Päť ornamentov sa rozsvietilo v správnom poradí. Body sa spojili do obrysu,
          ktorý krajina drží nad Detvou.
        </p>

        <svg
          className="egg-constellation__sky"
          viewBox="0 0 520 330"
          role="img"
          aria-label="Súhvezdie piatich svetiel nad siluetou Detvy"
        >
          <defs>
            <radialGradient id="egg-star-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bff7ee" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#63d3c4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#63d3c4" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path
            className="egg-constellation__ridge"
            d="M14 300 L74 300 L118 250 L164 272 L212 224 L260 248 L310 200 L348 234 L396 204 L432 242 L470 222 L508 256"
          />
          <path
            className="egg-constellation__tower"
            d="M258 248 L258 204 L266 190 L274 204 L274 248"
          />
          <polyline
            className="egg-constellation__link"
            points="70,250 150,132 258,196 352,92 448,206"
          />

          {POINTS.map((point, index) => (
            <g
              key={`${point.x}-${point.y}`}
              className="egg-constellation__star"
              style={{ animationDelay: `${0.35 + index * 0.24}s` }}
            >
              <circle cx={point.x} cy={point.y} r="22" fill="url(#egg-star-glow)" />
              <circle className="egg-constellation__point" cx={point.x} cy={point.y} r="4.4" />
              <path
                className="egg-constellation__rays"
                d={`M${point.x - 12} ${point.y}H${point.x + 12}M${point.x} ${point.y - 12}V${point.y + 12}`}
              />
            </g>
          ))}
        </svg>

        <p className="egg-constellation__whisper">
          „Keď sa svetlá spoja, mapa si spomenie, že bola krajinou.“
        </p>
        <p className="egg-note">
          Súhvezdie je fiktívny ornamentný záznam. Zostáva odomknuté v tomto prehliadači.
        </p>
      </div>
    </EggModal>
  );
}
