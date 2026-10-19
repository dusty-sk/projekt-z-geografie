import { useEffect, useRef, useState, type CSSProperties } from "react";

const LAYERS = ["back", "mid", "near", "front"] as const;
type Band = (typeof LAYERS)[number];

/** Per band: tile width and period of the swell it owns, and which way it runs. */
const BANDS: Record<Band, { tile: number; period: number; dir: 1 | -1 }> = {
  back: { tile: 480, period: 34, dir: -1 },
  mid: { tile: 420, period: 23, dir: 1 },
  near: { tile: 360, period: 15, dir: -1 },
  front: { tile: 320, period: 10, dir: 1 },
};

/** A band's crest peak sits at 81.3/400 of its tile; hulls ride that peak. */
const PEAK = 81.3 / 400;

type Rig = "sloop" | "schooner";

type BoatSpec = {
  band: Band;
  /** Rig drawn before the randomiser runs, so the first paint stays predictable. */
  rig: Rig;
};

const FLEET: BoatSpec[] = [
  { band: "back", rig: "schooner" },
  { band: "mid", rig: "schooner" },
  { band: "near", rig: "sloop" },
  { band: "front", rig: "sloop" },
];

type Placed = BoatSpec & {
  rig: Rig;
  delay: number;
  from: number;
  to: number;
  duration: number;
};

type SeaProps = {
  /** Extra classes for context-specific sizing/placement. */
  className?: string;
  /** How many of the four bands to render (fewer = calmer). Default 4. */
  layers?: 1 | 2 | 3 | 4;
};

/** A line-art boat. Both rigs share the same hull line and waterline (y=78). */
function Boat({ rig }: { rig: Rig }) {
  return (
    <svg data-rig={rig} viewBox="0 0 120 78" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <g transform="translate(0,3)">
        {rig === "sloop" ? (
          <>
            {/* Jib and mainsail */}
            <path
              d="M57.5 9 C56.5 24 56.5 38 57.5 46 L28 46 Z"
              fill="rgba(228,255,252,0.16)"
              stroke="rgba(228,255,252,0.5)"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M62.5 9 C63.5 24 63.5 38 62.5 46 L94 46 Z"
              fill="rgba(228,255,252,0.22)"
              stroke="rgba(228,255,252,0.55)"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path d="M60 54 L60 4" stroke="rgba(228,255,252,0.65)" strokeWidth="1.5" strokeLinecap="round" />
            <path className="sea__boat-pennant" d="M60 4 L73 7.5 L60 11 Z" fill="rgba(105,219,202,0.5)" />
          </>
        ) : (
          <>
            {/* Schooner: mainsail and foresail aft, jib forward */}
            <path
              d="M45 10 C44 25 44 38 44.5 46 L20 46 Z"
              fill="rgba(228,255,252,0.16)"
              stroke="rgba(228,255,252,0.5)"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M80 19 C79 30 79 40 79.5 46 L58 46 Z"
              fill="rgba(228,255,252,0.18)"
              stroke="rgba(228,255,252,0.52)"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M82 21 C86 30 89 39 91 46 L82 46 Z"
              fill="rgba(228,255,252,0.13)"
              stroke="rgba(228,255,252,0.45)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path d="M44 54 L44 6" stroke="rgba(228,255,252,0.6)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M80 54 L80 16" stroke="rgba(228,255,252,0.6)" strokeWidth="1.4" strokeLinecap="round" />
            <path className="sea__boat-pennant" d="M44 6 L56 9.5 L44 13 Z" fill="rgba(105,219,202,0.5)" />
          </>
        )}
        {/* Hull + plank */}
        <path
          className="sea__boat-hull"
          d="M14 58 C30 76 90 76 106 58 Q60 51 14 58 Z"
          fill="rgba(120,240,235,0.22)"
          stroke="rgba(180,250,246,0.6)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M24 62.5 C42 69 78 69 96 62.5"
          stroke="rgba(180,250,246,0.3)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Waterline foam */}
        <path
          className="sea__boat-foam"
          d="M4 74 Q60 80 116 74"
          stroke="rgba(242,255,253,0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
      </g>
    </svg>
  );
}

/**
 * Decorative layered sea — a stack of seamlessly drifting swells, with foam on
 * the crests, a rising bubble field and four small sailboats, one per band, two
 * rigs between them. Every boat drifts at exactly the speed of the band it
 * rides, so it holds a crest instead of wandering across the swell; the hull
 * sits on that crest line, the journey starts and ends clear of the edges, and
 * each boat gets a random rig and a random head start of whole tiles, so the
 * fleet moves differently on every visit (see styles/sea.css).
 * Hidden from assistive tech and never interactive.
 */
export function Sea({ className, layers = 4 }: SeaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[] | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Rolled once per visit: a coin flip for the rig and a head start of whole
    // tiles. Landscape runs eight or so tiles wide, so a few tiles of head start
    // only decides where in the crossing each boat begins — it cannot break the
    // crest lock, because a whole tile is exactly one crest period.
    const rolls = FLEET.map(({ band }) => ({
      rig: (Math.random() < 0.5 ? "sloop" : "schooner") as Rig,
      delay: -Math.floor(Math.random() * 4) * BANDS[band].period,
    }));

    const place = () => {
      const viewport = document.documentElement.clientWidth || window.innerWidth;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(".sea__boat"));

      setPlaced(
        FLEET.map((spec, i) => {
          const { tile, period, dir } = BANDS[spec.band];
          const width = nodes[i]?.getBoundingClientRect().width || 40;
          // The left value whose hull centre lands on a crest peak, kept in [0, tile).
          const phase = (((PEAK * tile - width / 2) % tile) + tile) % tile;
          // Start off one edge, end off the other, both on tile boundaries, so the
          // wrap is never seen and the crest under the hull never changes.
          const from =
            dir === -1
              ? phase + tile * Math.ceil((viewport - phase) / tile)
              : phase - tile * Math.ceil((phase + width) / tile);
          const tiles =
            dir === -1 ? Math.ceil((from + width) / tile) : Math.ceil((viewport - from) / tile);

          return {
            band: spec.band,
            rig: rolls[i].rig,
            delay: rolls[i].delay,
            from,
            to: from + dir * tiles * tile,
            duration: tiles * period,
          };
        }),
      );
    };

    place();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef} className={className ? `sea ${className}` : "sea"} aria-hidden="true">
      {LAYERS.slice(0, layers).map((layer) => (
        <span key={layer} className={`sea__layer sea__layer--${layer}`} />
      ))}
      <span className="sea__layer sea__layer--bubbles" />
      {FLEET.filter((spec) => LAYERS.indexOf(spec.band) < layers).map((spec) => {
        const boat = placed?.find((entry) => entry.band === spec.band);
        const vars = boat
          ? ({
              "--boat-from": `${boat.from}px`,
              "--boat-to": `${boat.to}px`,
              "--boat-duration": `${boat.duration}s`,
              "--boat-delay": `${boat.delay}s`,
            } as CSSProperties)
          : undefined;

        return (
          <span
            key={spec.band}
            className={`sea__boat sea__boat--${spec.band}`}
            data-band={spec.band}
            data-rig={boat?.rig ?? spec.rig}
            style={vars}
          >
            <Boat rig="sloop" />
            <Boat rig="schooner" />
          </span>
        );
      })}
    </div>
  );
}
