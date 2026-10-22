import { useState } from "react";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";
import type { NetworkNodeId } from "./eggCore";
import { categoryById, locations, type LocationCategoryId } from "../data/locations";

const NODE_LABEL: Record<NetworkNodeId, string> = {
  domov: "Domov",
  mapa: "Mapa",
  miesta: "Miesta",
  region: "Región",
  "o-projekte": "O projekte",
};

export function NetworkNode({
  id,
  className = "",
}: {
  id: NetworkNodeId;
  className?: string;
}) {
  const { networkFound, collectNetworkNode } = useEggs();
  const found = networkFound.includes(id);

  return (
    <button
      type="button"
      className={`egg-net${found ? " is-found" : ""} ${className}`.trim()}
      data-egg-net={id}
      aria-label={`Uzol siete — ${NODE_LABEL[id]}`}
      aria-pressed={found}
      onClick={() => collectNetworkNode(id)}
    >
      <svg viewBox="0 0 28 28" aria-hidden="true" focusable="false">
        <path d="M8 9.5 20 7M8 9.5l3 12M20 7l-9 14.5" />
        <circle cx="7" cy="8.5" r="2.6" />
        <circle cx="21" cy="6" r="2.1" />
        <circle cx="12" cy="22.5" r="2.4" />
      </svg>
    </button>
  );
}

const POSITIONS: Record<string, { x: number; y: number; short: string }> = {
  polana: { x: 380, y: 64, short: "Poľana" },
  "vodopad-bystro": { x: 560, y: 128, short: "Vodopád Bystrô" },
  "melichova-skala": { x: 478, y: 222, short: "Melichova skala" },
  kalamarka: { x: 346, y: 156, short: "Kaľamárka" },
  "amfiteater-detva": { x: 374, y: 252, short: "Amfiteáter" },
  "vagacov-dom": { x: 214, y: 292, short: "Vagačov dom" },
  "namestie-snp": { x: 306, y: 344, short: "Námestie SNP" },
  "drevene-krize": { x: 438, y: 300, short: "Drevené kríže" },
  "podpolianske-muzeum": { x: 266, y: 398, short: "Múzeum" },
  "kostol-sv-frantiska": { x: 360, y: 406, short: "Kostol" },
};

const EDGES: readonly [string, string][] = [
  ["polana", "kalamarka"],
  ["polana", "vodopad-bystro"],
  ["polana", "melichova-skala"],
  ["kalamarka", "melichova-skala"],
  ["kalamarka", "amfiteater-detva"],
  ["melichova-skala", "vodopad-bystro"],
  ["namestie-snp", "kostol-sv-frantiska"],
  ["namestie-snp", "podpolianske-muzeum"],
  ["namestie-snp", "vagacov-dom"],
  ["namestie-snp", "amfiteater-detva"],
  ["namestie-snp", "drevene-krize"],
  ["podpolianske-muzeum", "vagacov-dom"],
  ["podpolianske-muzeum", "drevene-krize"],
  ["kostol-sv-frantiska", "drevene-krize"],
  ["amfiteater-detva", "drevene-krize"],
];

const TONE: Record<LocationCategoryId, string> = {
  priroda: "var(--aqua)",
  kulturne: "var(--paper)",
  historia: "var(--steel-300)",
  rekreacia: "var(--aqua-bright)",
};

export function NetworkScreen() {
  const { closeEgg } = useEggs();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const focusId = selected ?? hovered;
  const focused = locations.find((location) => location.id === focusId);
  const focusedPosition = focused ? POSITIONS[focused.id] : undefined;
  const degree = focusId
    ? EDGES.filter(([from, to]) => from === focusId || to === focusId).length
    : 0;

  return (
    <EggModal
      titleId="egg-network-title"
      label="THE SECRET NETWORK · 10 uzlov"
      className="egg-network-shell"
      onClose={closeEgg}
      wide
    >
      <div className="egg-network">
        <p className="egg-eyebrow">Päť symbolov · jedna sieť</p>
        <h2 id="egg-network-title" className="egg-title">
          THE SECRET NETWORK
        </h2>
        <p className="egg-lede">
          Prepojenia, ktoré v bežnom režime neexistujú. Vyber uzol a uvidíš jeho
          väzby; čiary sú ilustračné, nie geografická sieť.
        </p>

        <svg
          className="egg-network__map"
          viewBox="0 0 760 460"
          role="group"
          aria-label="Sieť prepojení medzi desiatimi lokalitami"
        >
          <g className="egg-network__grid" aria-hidden="true">
            {[110, 230, 350, 470, 590, 710].map((x) => (
              <line key={`v${x}`} x1={x} y1="20" x2={x} y2="440" />
            ))}
            {[70, 160, 250, 340, 430].map((y) => (
              <line key={`h${y}`} x1="20" y1={y} x2="740" y2={y} />
            ))}
          </g>

          <g>
            {EDGES.map(([from, to]) => {
              const a = POSITIONS[from];
              const b = POSITIONS[to];
              if (!a || !b) return null;
              const active = focusId === from || focusId === to;
              return (
                <line
                  key={`${from}-${to}`}
                  className={`egg-network__edge${active ? " is-active" : ""}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              );
            })}
          </g>

          {locations.map((location) => {
            const pos = POSITIONS[location.id];
            if (!pos) return null;
            const category = location.categories[0];
            const active = focusId === location.id;
            return (
              <g
                key={location.id}
                className={`egg-network__node${active ? " is-active" : ""}`}
                style={{ ["--node-tone" as string]: TONE[categoryById(category).id] }}
                role="button"
                tabIndex={0}
                aria-label={location.name}
                onClick={() => setSelected((current) => (current === location.id ? null : location.id))}
                onMouseEnter={() => setHovered(location.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(location.id)}
                onBlur={() => setHovered(null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected((current) => (current === location.id ? null : location.id));
                  }
                }}
              >
                <circle className="egg-network__halo" cx={pos.x} cy={pos.y} r="19" />
                <circle className="egg-network__dot" cx={pos.x} cy={pos.y} r="6" />
                <text x={pos.x} y={pos.y + 26} textAnchor="middle">
                  {pos.short}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="egg-network__info" aria-live="polite">
          {focused && focusedPosition ? (
            <>
              <p className="egg-network__info-title">{focused.name}</p>
              <p className="egg-network__info-meta">
                {categoryById(focused.categories[0]).label} · {degree} prepojení
              </p>
              <p className="egg-network__info-text">{focused.summary}</p>
            </>
          ) : (
            <p className="egg-network__info-meta">
              Vyber alebo prejdi na uzol. Sieť sa rozsvieti v jeho okolí.
            </p>
          )}
        </div>

        <p className="egg-note">
          Ilustračné prepojenia vytvorené pre hru — v bežnom režime webu sa nezobrazujú.
        </p>
      </div>
    </EggModal>
  );
}
