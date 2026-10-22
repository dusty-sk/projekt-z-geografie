import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";

function useFps() {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return fps;
}

export function DeveloperMode() {
  const { closeEgg, unlockedCount, constellationStep, networkFound } = useEggs();
  const { pathname } = useLocation();
  const fps = useFps();
  const [viewport, setViewport] = useState("—");

  useEffect(() => {
    const read = () =>
      setViewport(
        `${window.innerWidth}×${window.innerHeight} · DPR ${window.devicePixelRatio.toFixed(2)}`,
      );
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return (
    <EggModal
      titleId="egg-developer-title"
      label="DEVELOPER MODE · fiktívna diagnostika"
      className="egg-developer-shell"
      onClose={closeEgg}
      wide
    >
      <div className="egg-dev">
        <p className="egg-eyebrow">↑ ↑ ↓ ↓ ← → ← → · odomknuté</p>
        <h2 id="egg-developer-title" className="egg-title">
          DEVELOPER MODE
        </h2>
        <p className="egg-lede">
          Diagnostický panel beží len naoko. FPS sa meria naozaj; všetko ostatné, čo
          vyzerá ako štatistika, je súčasť hry.
        </p>

        <dl className="egg-dev__stats">
          <div>
            <dt>FPS</dt>
            <dd>{fps}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{pathname}</dd>
          </div>
          <div>
            <dt>Viewport</dt>
            <dd>{viewport}</dd>
          </div>
          <div>
            <dt>Vrstvy</dt>
            <dd>{unlockedCount}/10</dd>
          </div>
        </dl>

        <div className="egg-dev__columns">
          <div>
            <h3 className="egg-dev__heading">Moduly</h3>
            <ul className="egg-dev__modules">
              <li>
                <span>map/leaflet</span>
                <span>READY</span>
              </li>
              <li>
                <span>presentation</span>
                <span>{pathname === "/" ? "STANDBY" : "IDLE"}</span>
              </li>
              <li>
                <span>survey/storage</span>
                <span>READY</span>
              </li>
              <li>
                <span>constellation</span>
                <span>{constellationStep}/5</span>
              </li>
              <li>
                <span>network</span>
                <span>{networkFound.length}/5</span>
              </li>
              <li>
                <span>archive/socket</span>
                <span>SNOOPING</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="egg-dev__heading">Simulované údaje (hra)</h3>
            <ul className="egg-dev__fake">
              <li>
                <span>návštevy</span>
                <span>42 069</span>
              </li>
              <li>
                <span>záznamy</span>
                <span>7 / 7</span>
              </li>
              <li>
                <span>uptime</span>
                <span>1987 h</span>
              </li>
              <li>
                <span>rýchlosť siete</span>
                <span>0.011 kb/s</span>
              </li>
              <li>
                <span>sync</span>
                <span>NIKDY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="egg-dev__console" aria-hidden="true">
          <p>&gt; scan --layers</p>
          <p>[ok] 10 base eggs · {unlockedCount} discovered</p>
          <p>[..] listening on a channel that does not exist</p>
        </div>

        <p className="egg-note">
          FPS je jediné reálne meranie. Návštevy, uptime a rýchlosť siete sú fiktívne —
          web nemá backend ani analytiku.
        </p>
      </div>
    </EggModal>
  );
}

type Glyph = { id: number; x: number; y: number; ch: string };

const GLYPHS = ["0", "1", "#", "/", "×", "+", "·"];

export function GlitchLayer() {
  const [trail, setTrail] = useState<Glyph[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let last = 0;

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;

      const id = ++nextId.current;
      const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setTrail((prev) => [...prev.slice(-22), { id, x: event.clientX, y: event.clientY, ch }]);

      const timer = window.setTimeout(() => {
        setTrail((prev) => prev.filter((glyph) => glyph.id !== id));
      }, 620);
      timers.current.push(timer);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];
    };
  }, []);

  return (
    <div className="egg-glitch-layer" aria-hidden="true">
      <span className="egg-glitch-layer__scan" />
      <span className="egg-glitch-layer__band" />
      {trail.map((glyph) => (
        <span
          key={glyph.id}
          className="egg-glitch-layer__glyph"
          style={{ left: glyph.x, top: glyph.y }}
        >
          {glyph.ch}
        </span>
      ))}
    </div>
  );
}
