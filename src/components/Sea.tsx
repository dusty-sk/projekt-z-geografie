const LAYERS = ["back", "mid", "near", "front"] as const;

type SeaProps = {
  /** Extra classes for context-specific sizing/placement. */
  className?: string;
  /** How many of the four bands to render (fewer = calmer). Default 4. */
  layers?: 1 | 2 | 3 | 4;
};

/**
 * Decorative layered sea — a stack of seamlessly drifting swells, with foam
 * on the crests and a rising bubble field. Pure CSS (see styles/sea.css);
 * hidden from assistive tech and never interactive.
 */
export function Sea({ className, layers = 4 }: SeaProps) {
  return (
    <div className={className ? `sea ${className}` : "sea"} aria-hidden="true">
      {LAYERS.slice(0, layers).map((layer) => (
        <span key={layer} className={`sea__layer sea__layer--${layer}`} />
      ))}
      <span className="sea__layer sea__layer--bubbles" />
    </div>
  );
}
